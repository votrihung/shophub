import os
import sys
# Ép Python phải tìm các file trong thư mục backend hiện tại
sys.path.append(os.path.abspath("."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# 1. KHỞI TẠO APP FASTAPI ĐẦU TIÊN
app = FastAPI(title="ShopHub Product API với PostgreSQL", version="2.0.0")

# 2. CẤU HÌNH CORS (Mở toàn bộ cổng để chấp nhận mọi nguồn gọi từ FrontEnd)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Mở bung lụa dấu sao để mọi địa chỉ đều được thông qua
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Import cấu hình DB hệ thống ---
from database import engine, Base
import models.product
import models.user

# Nhúng router sản phẩm cũ VÀ bổ sung router xác thực (auth) mới cài đặt
from routers import products, auth 

# Kích hoạt tạo tất cả các bảng tự động qua Base tổng
Base.metadata.create_all(bind=engine)

IMAGE_DIR = "data_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

# Cấu hình đọc ảnh tĩnh của bác
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

# --- KẾT NỐI CÁC ĐẦU LINK API VÀO APP ---
app.include_router(products.router)  
app.include_router(auth.router)      

@app.get("/")
def read_root():
    return {"status": "success", "message": "Backend ShopHub chạy PostgreSQL ngon lành!"}

if __name__ == "__main__":
    import uvicorn
    # Ép uvicorn mở cổng trên mọi card mạng máy tính
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)