from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

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
        func.lower(Order.status) == "completed"
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
    
    results = db.query(
        extract('year', Order.created_at).label('year'),
        extract('month', Order.created_at).label('month'),
        extract('day', Order.created_at).label('day'),
        func.sum(Order.total_amount).label('revenue')
    ).filter(
        func.lower(Order.status) == "completed"
    ).group_by('year', 'month', 'day').order_by('year', 'month', 'day').all()

    days = []
    revenues = []

    for r in results:
        year = int(r.year)
        month = int(r.month)
        day = int(r.day)

        days.append(f"{day:02d}/{month:02d}/{year}")
        revenues.append(round(float(r.revenue or 0), 2))

    return {
        "months": days,  
        "days": days,
        "revenues": revenues
    }