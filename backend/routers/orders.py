from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db 
from routers.auth import get_current_user 

from models.order import OrderDB, OrderItemDB
from models.product import ProductDB
from schemas.order import CheckoutRequest, OrderRead, OrderSummary

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.get("/admin/all", response_model=List[OrderRead])
def get_all_orders_admin(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền truy cập trang này."
        )
    
    orders = db.query(OrderDB).order_by(OrderDB.id.desc()).all()
    
    for order in orders:
        for item in order.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if product:
                item.image_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)
            else:
                item.image_url = None

    return orders

@router.get("/history")
def get_order_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    orders = db.query(OrderDB).filter(OrderDB.user_id == current_user.id).order_by(OrderDB.id.desc()).all()
    
    result = []
    for order in orders:
        items_data = []
        for item in order.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            img_url = None
            if product:
                img_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)

            items_data.append({
                "id": item.id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "product_price": float(item.product_price),
                "line_total": float(item.line_total),
                "image_url": img_url
            })

        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "customer_name": order.customer_name,
            "phone": order.phone,
            "shipping_address": order.shipping_address,
            "items": items_data
        })
    return result

@router.get("/{order_id}", response_model=OrderRead)
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng."
        )
    
    if current_user.role != "ADMIN" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này."
        )
    
    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)
        else:
            item.image_url = None

    return order

@router.put("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này."
        )
    
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng."
        )
    
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trạng thái không hợp lệ."
        )
        
    order.status = new_status
    db.commit()
    db.refresh(order)

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)
        else:
            item.image_url = None

    return order

@router.post("/{order_id}/cancel", response_model=OrderRead)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng."
        )

    if current_user.role != "ADMIN" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này."
        )

    if order.status != "PLACED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đơn hàng chỉ có thể hủy khi ở trạng thái 'Chờ xác nhận' (PLACED)."
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
            item.image_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)
        else:
            item.image_url = None

    return order

@router.patch("/{order_id}/info", response_model=OrderRead)
def update_order_customer_info(
    order_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này."
        )

    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng."
        )

    if "customer_name" in payload:
        order.customer_name = payload["customer_name"]
    if "phone" in payload:
        order.phone = payload["phone"]
    if "shipping_address" in payload:
        order.shipping_address = payload["shipping_address"]

    db.commit()
    db.refresh(order)

    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            item.image_url = getattr(product, "image_url", None) or getattr(product, "image", None) or getattr(product, "image_path", None)
        else:
            item.image_url = None

    return order

@router.patch("/{order_id}/items/quantity", response_model=OrderRead)
def admin_update_order_item_quantity(
    order_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thực hiện hành động này."
        )

    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đơn hàng."
        )

    if order.status in ["COMPLETED", "CANCELED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể điều chỉnh số lượng sản phẩm của đơn hàng đã Hoàn thành hoặc đã Hủy."
        )

    item_id = payload.get("item_id")
    new_qty = payload.get("quantity")

    if not item_id or new_qty is None or new_qty <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dữ liệu đầu vào không hợp lệ."
        )

    item = db.query(OrderItemDB).filter(
        OrderItemDB.id == item_id,
        OrderItemDB.order_id == order_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm này trong đơn hàng."
        )

    product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sản phẩm tương ứng không tồn tại trong hệ thống."
        )

    difference = new_qty - item.quantity

    if difference > 0:
        if product.stock < difference:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sản phẩm '{product.name}' không đủ số lượng trong kho. Chỉ còn lại {product.stock} sản phẩm."
            )
        product.stock -= difference
    elif difference < 0:
        product.stock += abs(difference)

    item.quantity = new_qty
    item.line_total = item.quantity * item.product_price

    db.flush()

    order.total_amount = sum(oi.line_total for oi in order.items)

    db.commit()
    db.refresh(order)

    for order_item in order.items:
        prod = db.query(ProductDB).filter(ProductDB.id == order_item.product_id).first()
        if prod:
            order_item.image_url = getattr(prod, "image_url", None) or getattr(prod, "image", None) or getattr(prod, "image_path", None)
        else:
            order_item.image_url = None

    return order

@router.post("/checkout", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def checkout(
    request: CheckoutRequest, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    if not request.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống rỗng!")

    try:
        total_amount = 0
        order_items_to_create = []

        cust_name = request.customer_name or getattr(current_user, 'full_name', getattr(current_user, 'username', 'Khách lẻ'))
        cust_phone = request.phone or getattr(current_user, 'phone', '---')
        cust_address = request.shipping_address or getattr(current_user, 'address', 'Chưa cung cấp')

        new_order = OrderDB(
            user_id=current_user.id,
            status="PLACED",
            total_amount=0,
            customer_name=cust_name,
            phone=cust_phone,
            shipping_address=cust_address
        )

        db.add(new_order)
        db.flush() 

        for item in request.items:
            product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Sản phẩm với ID {item.product_id} không tồn tại trên hệ thống."
                )

            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sản phẩm '{product.name}' chỉ còn {product.stock} cái trong kho, không đủ đáp ứng số lượng đặt mua ({item.quantity} cái)."
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
                line_total=line_total
            )
            order_items_to_create.append(new_item)
            db.add(new_item)

        new_order.total_amount = total_amount
        
        db.commit()
        db.refresh(new_order)

        for created_item in new_order.items:
            prod = db.query(ProductDB).filter(ProductDB.id == created_item.product_id).first()
            if prod:
                created_item.image_url = getattr(prod, "image_url", None) or getattr(prod, "image", None) or getattr(prod, "image_path", None)
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
            detail=f"Có lỗi xảy ra khi xử lý đặt hàng: {str(e)}"
        )