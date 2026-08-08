from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


# Schema yêu cầu tính phí vận chuyển từ GHN
class ShippingFeeRequest(BaseModel):
    to_district_id: int
    to_ward_code: str
    weight: Optional[int] = 1000


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
    
    shipping_provider: str = "IN_HOUSE" 
    shipping_fee: float = 0.0
    to_district_id: Optional[int] = None
    to_ward_code: Optional[str] = None


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
    
    shipping_provider: Optional[str] = "IN_HOUSE"
    tracking_code: Optional[str] = None
    shipping_fee: Optional[float] = 0.0
    shipper_id: Optional[int] = None
    
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
    
    # Bổ sung thông tin giao hàng
    shipping_provider: Optional[str] = "IN_HOUSE"
    tracking_code: Optional[str] = None
    shipping_fee: Optional[float] = 0.0

    class Config:
        from_attributes = True


ALLOWED_STATUSES = [
    "PENDING",
    "PROCESSING",
    "SHIPPING",
    "DELIVERED",
    "CANCELED",
    "FAILED",
    "PLACED",
    "PAID",
    "SHIPPED",
    "COMPLETED",
]


class OrderStatusUpdate(BaseModel):
    status: str
    admin_note: Optional[str] = None
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[str] = None
    shipper_id: Optional[int] = None

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