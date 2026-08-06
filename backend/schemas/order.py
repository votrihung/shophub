from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class OrderItemCreate(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int = Field(..., gt=0)


class CheckoutRequest(BaseModel):
    items: List[OrderItemCreate]
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = "COD"


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    line_total: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class OrderRead(BaseModel):
    id: int
    status: str
    total_amount: float
    created_at: datetime
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    admin_note: Optional[str] = None
    payment_url: Optional[str] = None
    items: List[OrderItemRead]

    class Config:
        from_attributes = True


class OrderSummary(BaseModel):
    id: int
    status: str
    total_amount: float
    created_at: datetime
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None

    class Config:
        from_attributes = True


ALLOWED_STATUSES = [
    "PLACED",
    "PAID",
    "FAILED",
    "PROCESSING",
    "SHIPPED",
    "COMPLETED",
    "CANCELED",
]


class OrderStatusUpdate(BaseModel):
    status: str
    admin_note: Optional[str] = None
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ALLOWED_STATUSES:
            raise ValueError(
                f"Trạng thái không hợp lệ. Phải thuộc: {ALLOWED_STATUSES}"
            )
        return v


class OrderItemQuantityUpdate(BaseModel):
    item_id: int
    quantity: int = Field(..., gt=0)