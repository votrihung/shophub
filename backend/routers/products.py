import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query, Form
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models.product import ProductDB
from schemas.product import ProductUpdate, ProductRead

from .auth import require_admin

router = APIRouter(prefix="/products", tags=["products"])

IMAGE_DIR = "data_images"

os.makedirs(IMAGE_DIR, exist_ok=True)

@router.get("")
def get_all_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ProductDB)
    
    if search:
        query = query.filter(ProductDB.name.ilike(f"%{search}%"))
        
    if category:
        query = query.filter(ProductDB.category.ilike(f"%{category}%"))
        
    total_items = query.count()
    start_idx = (page - 1) * size
    products = query.offset(start_idx).limit(size).all()
    
    return {
        "total": total_items,
        "page": page,
        "size": size,
        "products": [
            ProductRead(
                id=p.id, 
                name=p.name, 
                description=p.description,
                price=p.price,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          category=p.category, 
                stock=p.stock, 
                imageUrl=p.image_path
            ) for p in products
        ]
    }

@router.get("/{product_id}", response_model=ProductRead)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")
    return ProductRead(
        id=product.id, name=product.name, description=product.description,
        price=product.price, category=product.category, stock=product.stock, imageUrl=product.image_path
    )

@router.post(
    "", 
    status_code=201
)
async def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    costPrice: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if price <= 0 or costPrice <= 0:
        raise HTTPException(status_code=400, detail="Giá phải lớn hơn 0!")

    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(IMAGE_DIR, unique_filename)
    
    contents = await image.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    image_url = f"http://localhost:8000/images/{unique_filename}"
    
    new_product = ProductDB(
        name=name, description=description, price=price,
        cost_price=costPrice, category=category, stock=stock, image_path=image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return ProductRead(
        id=new_product.id, name=new_product.name, description=new_product.description,
        price=new_product.price, category=new_product.category, stock=new_product.stock, imageUrl=new_product.image_path
    )

@router.put("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, updated_data: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")
        
    update_dict = updated_data.model_dump(exclude_unset=True)
    
    if "costPrice" in update_dict:
        product.cost_price = update_dict.pop("costPrice")
        
    if "imageUrl" in update_dict:
        product.image_path = update_dict.pop("imageUrl")
        
    # Cập nhật an toàn các trường còn lại vào database
    for key, value in update_dict.items():
        setattr(product, key, value)
        
    db.commit()
    db.refresh(product)
    return ProductRead(
        id=product.id, name=product.name, description=product.description,
        price=product.price, category=product.category, stock=product.stock, imageUrl=product.image_path
    )

@router.delete(
    "/{product_id}",
    dependencies=[Depends(require_admin)]
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")
        
    if product.image_path:
        filename = product.image_path.split("/images/")[-1]
        image_path = os.path.join(IMAGE_DIR, filename)
        if os.path.exists(image_path):
            os.remove(image_path)
            
    db.delete(product)
    db.commit()
    return {"status": "success", "message": "Đã xóa sản phẩm thành công khỏi PostgreSQL!"}