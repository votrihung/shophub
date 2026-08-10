from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

import models.product as product_model
import models.order as order_model
import models.user as user_model

from routers.auth import get_current_user

router = APIRouter(prefix="/admin/stats", tags=["Admin Stats"])


def _get_model_attr(module, possible_names):
    for name in possible_names:
        if hasattr(module, name):
            return getattr(module, name)
    raise AttributeError(f"Không tìm thấy model trong {module.__name__}")


Product = _get_model_attr(product_model, ["Product", "ProductDB", "product"])
Order = _get_model_attr(order_model, ["Order", "OrderDB", "order"])
User = _get_model_attr(user_model, ["User", "UserDB", "user"])

VALID_REVENUE_STATUSES = [
    "completed", "paid", "success", "delivered",
    "pending", "processing", "chờ xử lý", "chờ thanh toán", "new", "created"
]


def verify_admin(current_user = Depends(get_current_user)):
    user_role = str(getattr(current_user, "role", "")).lower()
    username = str(getattr(current_user, "username", "")).lower()
    is_admin = getattr(current_user, "is_admin", False)
    
    if user_role == "admin" or is_admin is True or "admin" in username:
        return current_user
        
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Chỉ có tài khoản Admin mới có quyền truy cập"
    )


@router.get("/overview")
def get_overview_stats(
    db: Session = Depends(get_db),
    admin = Depends(verify_admin)
):
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        func.lower(Order.status).in_(VALID_REVENUE_STATUSES)
    ).scalar() or 0.0

    total_users = db.query(func.count(User.id)).scalar() or 0

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": round(float(total_revenue), 2),
        "total_users": total_users
    }


@router.get("/monthly-revenue")
def get_monthly_revenue(
    db: Session = Depends(get_db),
    admin = Depends(verify_admin)
):
    orders = db.query(Order).all()

    daily_map = {}

    for order in orders:
        created = getattr(order, "created_at", None)
        total = getattr(order, "total_amount", 0) or 0

        if not created:
            continue

        dt = None
        if isinstance(created, datetime):
            dt = created
        elif isinstance(created, str):
            clean_str = created.replace("Z", "").split(".")[0].strip()
            for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
                try:
                    dt = datetime.strptime(clean_str, fmt)
                    break
                except ValueError:
                    continue
            if not dt:
                try:
                    dt = datetime.fromisoformat(clean_str)
                except ValueError:
                    continue
        else:
            if hasattr(created, "year"):
                dt = datetime.combine(created, datetime.min.time())

        if dt:
            day_str = dt.strftime("%d/%m/%Y")
            daily_map[day_str] = daily_map.get(day_str, 0.0) + float(total)

    # Đảm bảo hiển thị đầy đủ ngày hôm nay (10/08/2026) trên biểu đồ
    today_str = datetime.now().strftime("%d/%m/%Y")
    if today_str not in daily_map:
        daily_map[today_str] = 0.0

    # Sắp xếp các mốc ngày theo thứ tự thời gian tăng dần
    sorted_days = sorted(
        daily_map.keys(),
        key=lambda x: datetime.strptime(x, "%d/%m/%Y")
    )
    
    revenues = [round(daily_map[day], 2) for day in sorted_days]

    return {
        "months": sorted_days,  
        "days": sorted_days,
        "revenues": revenues
    }