from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel, Field

from database import get_db
from models.order import OrderDB, OrderItemDB
from models.product import ProductDB
from routers.auth import get_current_user
from schemas.order import CheckoutRequest, OrderRead, OrderSummary
from services.ghn_service import create_ghn_order, calculate_shipping_fee
from vnpay import create_vnpay_url

router = APIRouter(prefix="/orders", tags=["Orders"])


class CalculateFeeRequest(BaseModel):
    to_district_id: int
    to_ward_code: str
    weight: Optional[int] = 1000


class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    image_url: Optional[str] = None


class ShipperStatusUpdate(BaseModel):
    status: str


@router.post("/calculate-fee")
@router.post("/calculate-fee/")
async def get_ghn_fee(payload: CalculateFeeRequest):
    if not payload.to_district_id or not payload.to_ward_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thiếu thông tin ID Quận/Huyện hoặc Mã Phường/Xã",
        )

    try:
        fee = await calculate_shipping_fee(
            payload.to_district_id,
            str(payload.to_ward_code),
            payload.weight,
        )
        return {"shipping_fee": fee}
    except Exception as e:
        return {"shipping_fee": 35000, "warning": f"Lỗi gọi GHN: {str(e)}"}


@router.get("/shipper/pending")
def get_shipper_pending_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if str(current_user.role).upper() not in ["SHIPPER", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ Shipper mới có quyền truy cập danh sách này.",
        )

    orders = (
        db.query(OrderDB)
        .filter(
            OrderDB.shipping_provider == "IN_HOUSE",
            OrderDB.status.in_(["PROCESSING", "SHIPPING"]),
        )
        .order_by(OrderDB.id.desc())
        .all()
    )
    return orders


@router.put("/{order_id}/shipper-status")
def update_shipper_order_status(
    order_id: int,
    payload: ShipperStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if str(current_user.role).upper() not in ["SHIPPER", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện thao tác này.",
        )

    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng.",
        )

    valid_statuses = ["SHIPPING", "DELIVERED", "FAILED"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trạng thái không hợp lệ. Phải thuộc: {valid_statuses}",
        )

    order.status = payload.status
    if not order.shipper_id:
        order.shipper_id = current_user.id

    db.commit()
    db.refresh(order)
    return {"message": "Cập nhật trạng thái giao hàng thành công", "order": order}


@router.get("/admin/all", response_model=List[OrderRead])
def get_all_orders_admin(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Cập nhật cho phép cả ADMIN và SHIPPER truy cập
    if str(current_user.role).upper() not in ["ADMIN", "SHIPPER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập trang này.",
        )

    orders = db.query(OrderDB).order_by(OrderDB.id.desc()).all()

    for order in orders:
        for item in order.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if product:
                item.image_url = (
                    getattr(product, "image_url", None)
                    or getattr(product, "image", None)
                    or getattr(product, "image_path", None)
                )
            else:
                item.image_url = None

    return orders


@router.get("/history")
def get_order_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    orders = (
        db.query(OrderDB)
        .filter(OrderDB.user_id == current_user.id)
        .order_by(OrderDB.id.desc())
        .all()
    )

    result = []
    for order in orders:
        items_data = []
        for item in order.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            img_url = None
            if product:
                img_url = (
                    getattr(product, "image_url", None)
                    or getattr(product, "image", None)
                    or getattr(product, "image_path", None)
                )

            items_data.append(
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "product_price": float(item.product_price),
                    "line_total": float(item.line_total),
                    "image_url": img_url,
                }
            )

        result.append(
            {
                "id": order.id,
                "user_id": order.user_id,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "customer_name": order.customer_name,
                "phone": order.phone,
                "shipping_address": order.shipping_address,
                "shipping_provider": order.shipping_provider,
                "tracking_code": order.tracking_code,
                "shipping_fee": float(order.shipping_fee or 0.0),
                "items": items_data,
            }
        )
    return result


@router.get("/vnpay-return")
def vnpay_return(request: Request, db: Session = Depends(get_db)):
    params = dict(request.query_params)
    vnp_response_code = params.get("vnp_ResponseCode")
    vnp_txn_ref = params.get("vnp_TxnRef")

    if not vnp_txn_ref:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Thiếu thông tin mã giao dịch"
        )

    try:
        order_id = int(vnp_txn_ref.split("_")[0])
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Mã giao dịch không hợp lệ"
        )

    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy đơn hàng"
        )

    if vnp_response_code == "00":
        order.status = "PAID"
        db.commit()
        db.refresh(order)
        return {
            "status": "success",
            "message": "Thanh toán thành công!",
            "order_id": order_id,
        }
    else:
        order.status = "FAILED"
        db.commit()
        return {
            "status": "error",
            "message": f"Thanh toán thất bại. Mã lỗi: {vnp_response_code}",
            "order_id": order_id,
        }


@router.post("/checkout", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def checkout(
    payload: CheckoutRequest,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng trống rỗng!"
        )

    try:
        total_amount = 0
        order_items_to_create = []

        cust_name = payload.customer_name or getattr(
            current_user,
            "full_name",
            getattr(current_user, "username", "Khách lẻ"),
        )
        cust_phone = payload.phone or getattr(current_user, "phone", "---")
        cust_address = payload.shipping_address or getattr(
            current_user, "address", "Chưa cung cấp"
        )

        tracking_code = None

        if payload.shipping_provider == "GHN":
            if not payload.to_district_id or not payload.to_ward_code:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vui lòng cung cấp Quận/Huyện và Phường/Xã để gửi GHN.",
                )

            ghn_payload = {
                "payment_type_id": 2,
                "note": "Don hang ShopHub",
                "required_note": "KHONGCHOXEMHANG",
                "to_name": cust_name,
                "to_phone": cust_phone,
                "to_address": cust_address,
                "to_district_id": payload.to_district_id,
                "to_ward_code": str(payload.to_ward_code),
                "weight": 1000,
                "items": [
                    {
                        "name": item.name,
                        "quantity": item.quantity,
                        "price": int(item.price),
                    }
                    for item in payload.items
                ],
            }
            try:
                tracking_code = await create_ghn_order(ghn_payload)
            except Exception as ghn_err:
                print(f"Bỏ qua lỗi tạo mã GHN: {ghn_err}")
                tracking_code = None

        # 1. Tạo đơn hàng tạm
        new_order = OrderDB(
            user_id=current_user.id,
            status="PROCESSING",
            total_amount=0,
            customer_name=cust_name,
            phone=cust_phone,
            shipping_address=cust_address,
            shipping_provider=payload.shipping_provider,
            shipping_fee=payload.shipping_fee or 0.0,
            tracking_code=tracking_code,
        )

        db.add(new_order)
        db.flush()  # Lấy new_order.id ngay lập tức

        # 2. Xử lý gán tracking code nếu GHN API chưa trả về hoặc bị lỗi
        if payload.shipping_provider == "GHN":
            if not new_order.tracking_code or new_order.tracking_code == "GHN_PENDING":
                new_order.tracking_code = f"GHN{new_order.id:06d}"

        for item in payload.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Sản phẩm với ID {item.product_id} không tồn tại trên hệ thống.",
                )

            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sản phẩm '{product.name}' chỉ còn {product.stock} cái trong kho.",
                )

            product.stock -= item.quantity
            line_total = item.price * item.quantity
            total_amount += line_total

            new_item = OrderItemDB(
                order_id=new_order.id,
                product_id=item.product_id,
                product_name=item.name,
                product_price=item.price,
                quantity=item.quantity,
                line_total=line_total,
            )
            order_items_to_create.append(new_item)
            db.add(new_item)

        new_order.total_amount = total_amount + (payload.shipping_fee or 0.0)

        db.commit()
        db.refresh(new_order)

        payment_method = getattr(payload, "payment_method", "COD")
        if payment_method == "VNPAY":
            x_forwarded_for = http_request.headers.get("X-Forwarded-For")
            client_ip = (
                x_forwarded_for.split(",")[0]
                if x_forwarded_for
                else (http_request.client.host if http_request.client else "127.0.0.1")
            )

            setattr(
                new_order,
                "payment_url",
                create_vnpay_url(new_order.id, new_order.total_amount, client_ip),
            )

        for created_item in new_order.items:
            prod = db.query(ProductDB).filter(ProductDB.id == created_item.product_id).first()
            if prod:
                created_item.image_url = (
                    getattr(prod, "image_url", None)
                    or getattr(prod, "image", None)
                    or getattr(prod, "image_path", None)
                )
            else:
                created_item.image_url = None

        return new_order

    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Có lỗi xảy ra khi xử lý đặt hàng: {str(e)}",
        )


@router.get("/{order_id}", response_model=OrderRead)
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng.",
        )

    if str(current_user.role).upper() != "ADMIN" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này.",
        )

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = (
                getattr(product, "image_url", None)
                or getattr(product, "image", None)
                or getattr(product, "image_path", None)
            )
        else:
            item.image_url = None

    return order


@router.put("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if str(current_user.role).upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này.",
        )

    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng.",
        )

    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trạng thái không hợp lệ.",
        )

    order.status = new_status
    db.commit()
    db.refresh(order)

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = (
                getattr(product, "image_url", None)
                or getattr(product, "image", None)
                or getattr(product, "image_path", None)
            )
        else:
            item.image_url = None

    return order


@router.post("/{order_id}/cancel", response_model=OrderRead)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng.",
        )

    if str(current_user.role).upper() != "ADMIN" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này.",
        )

    if order.status not in ["PLACED", "PENDING", "PROCESSING"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đơn hàng chỉ có thể hủy khi chưa đi giao.",
        )

    order.status = "CANCELED"

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            product.stock += item.quantity

    db.commit()
    db.refresh(order)

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = (
                getattr(product, "image_url", None)
                or getattr(product, "image", None)
                or getattr(product, "image_path", None)
            )
        else:
            item.image_url = None

    return order


@router.post("/review")
def create_product_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        purchase_count_result = (
            db.execute(
                text("""
                SELECT COUNT(*) 
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                WHERE o.user_id = :user_id 
                  AND oi.product_id = :product_id 
                  AND LOWER(o.status) IN ('completed', 'paid', 'delivered')
            """),
                {
                    "user_id": current_user.id,
                    "product_id": payload.product_id,
                },
            ).scalar()
            or 0
        )

        if purchase_count_result == 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn cần mua và nhận hàng thành công mới được đánh giá sản phẩm này!",
            )

        user_review_count = (
            db.execute(
                text("""
                SELECT COUNT(*) 
                FROM reviews 
                WHERE user_id = :user_id 
                  AND product_id = :product_id
            """),
                {
                    "user_id": current_user.id,
                    "product_id": payload.product_id,
                },
            ).scalar()
            or 0
        )

        if user_review_count >= purchase_count_result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bạn đã hoàn thành đánh giá cho toàn bộ các lượt mua sản phẩm này.",
            )

        db.execute(
            text("""
                INSERT INTO reviews (user_id, product_id, rating, comment, image_url)
                VALUES (:user_id, :product_id, :rating, :comment, :image_url)
            """),
            {
                "user_id": current_user.id,
                "product_id": payload.product_id,
                "rating": payload.rating,
                "comment": payload.comment,
                "image_url": payload.image_url,
            },
        )
        db.commit()

        return {"status": "success", "message": "Gửi đánh giá sản phẩm thành công!"}

    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi lưu đánh giá: {str(e)}",
        )


@router.get("/product/{product_id}/reviews")
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    try:
        reviews = db.execute(
            text("""
                SELECT r.id, r.user_id, r.rating, r.comment, r.image_url, r.created_at,
                       COALESCE(u.email, 'Khách hàng') as user_name
                FROM reviews r
                LEFT JOIN users u ON r.user_id = u.id
                WHERE r.product_id = :product_id
                ORDER BY r.created_at DESC
            """),
            {"product_id": product_id},
        ).fetchall()

        result = []
        for r in reviews:
            result.append(
                {
                    "id": r.id,
                    "user_id": r.user_id,
                    "user_name": r.user_name,
                    "rating": r.rating,
                    "comment": r.comment,
                    "image_url": r.image_url,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
            )

        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lấy danh sách đánh giá: {str(e)}",
        )