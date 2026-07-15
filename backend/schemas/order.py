from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime  # 🚀 Bổ sung import datetime để xử lý đồng bộ kiểu dữ liệu


class OrderItemCreate(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int = Field(..., gt=0)

class CheckoutRequest(BaseModel):
    items: List[OrderItemCreate]

class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    quantity: int
    line_total: float

    class Config:
        from_attributes = True

class OrderRead(BaseModel):
    id: int
    status: str
    total_amount: float
    created_at: datetime  # 🚀 Đã sửa từ str -> datetime để parse chuẩn xác kiểu dữ liệu từ DB
    items: List[OrderItemRead]

    class Config:
        from_attributes = True

class OrderSummary(BaseModel):
    id: int
    status: str
    total_amount: float
    created_at: datetime  # 🚀 Đã sửa từ str -> datetime để tránh lỗi trên các API danh sách/tổng quan

    class Config:
        from_attributes = True


ALLOWED_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELED"]

class OrderStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ALLOWED_STATUSES:
            raise ValueError(f"Trạng thái không hợp lệ. Phải thuộc: {ALLOWED_STATUSES}")
        return v

class OrderItemQuantityUpdate(BaseModel):
    item_id: int
    quantity: int = Field(..., gt=0)