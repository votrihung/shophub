import os
import json
import uuid
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# --- 1. BIẾN TOÀN CỤC & THƯ MỤC CƠ SỞ ---
IMAGE_DIR = "data_images"
DATA_FILE = "data/products.json"

os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)


# --- 2. KHỞI TẠO APP & CẤU HÌNH CORS ---
app = FastAPI(title="ShopHub Product API", version="1.1.0")

# Cấu hình Static Files để đọc ảnh tĩnh qua URL
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 3. PYDANTIC SCHEMAS ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    stock: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    costPrice: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None

class ProductPublic(ProductBase):
    id: int
    imageUrl: Optional[str] = None

class ProductListResponse(BaseModel):
    total: int
    page: int
    size: int
    products: List[ProductPublic]


# --- 4. HÀM BỔ TRỢ ---
def load_products() -> list:
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_products(products: list):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=4)


# --- 5. ROUTES API CHỨC NĂNG ---

@app.get("/")
def read_root():
    return {"status": "success", "message": "Backend ShopHub chạy ngon lành!"}


# 🟢 GET ALL PRODUCTS
@app.get("/products", response_model=ProductListResponse)
def get_all_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    products = load_products()
    if search:
        products = [p for p in products if search.lower() in p.get("name", "").lower()]
    if category:
        products = [p for p in products if p.get("category", "").lower() == category.lower()]
        
    total_items = len(products)
    start_idx = (page - 1) * size
    end_idx = start_idx + size
    
    return {
        "total": total_items,
        "page": page,
        "size": size,
        "products": products[start_idx:end_idx]
    }


# 🟢 GET DETAILS
@app.get("/products/{product_id}", response_model=ProductPublic)
def get_product_detail(product_id: int):
    products = load_products()
    for p in products:
        if p.get("id") == product_id:
            return p
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")


# 🟢 POST (THÊM SẢN PHẨM + UPLOAD ẢNH CHUẨN FORM-DATA SWAGGER)
@app.post("/products", response_model=ProductPublic, status_code=201)
async def create_product(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    costPrice: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...)
):
    if price <= 0 or costPrice <= 0:
        raise HTTPException(status_code=400, detail="Giá phải lớn hơn 0!")

    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(IMAGE_DIR, unique_filename)
    
    contents = await image.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    products = load_products()
    new_id = max([p["id"] for p in products]) + 1 if products else 1
    image_url = f"http://localhost:8000/images/{unique_filename}"
    
    new_product = {
        "id": new_id,
        "name": name,
        "description": description,
        "price": price,
        "costPrice": costPrice,
        "category": category,
        "stock": stock,
        "imageUrl": image_url
    }
    
    products.append(new_product)
    save_products(products)
    return new_product


# 🟢 PUT (SỬA THÔNG TIN)
@app.put("/products/{product_id}", response_model=ProductPublic)
def update_product(product_id: int, updated_data: ProductUpdate):
    products = load_products()
    for p in products:
        if p.get("id") == product_id:
            update_dict = updated_data.model_dump(exclude_unset=True)
            p.update(update_dict)
            save_products(products)
            return p
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")


# 🟢 DELETE (XÓA SẢN PHẨM)
@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    products = load_products()
    for idx, p in enumerate(products):
        if p.get("id") == product_id:
            deleted_item = products.pop(idx)
            if "imageUrl" in deleted_item and deleted_item["imageUrl"]:
                filename = deleted_item["imageUrl"].split("/images/")[-1]
                image_path = os.path.join(IMAGE_DIR, filename)
                if os.path.exists(image_path):
                    os.remove(image_path)
            save_products(products)
            return {"status": "success", "message": "Đã xóa sản phẩm!"}
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")