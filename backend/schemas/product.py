from pydantic import BaseModel, Field
from typing import Optional

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    costPrice: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None

class ProductRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    category: str
    stock: int
    imageUrl: Optional[str] = None

    class Config:
        from_attributes = True