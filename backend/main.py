import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

sys.path.append(os.path.abspath("."))

from database import engine, Base
import models.product
import models.user
import models.order

# 1. Thêm 'chat' vào import
from routers import products, auth, orders, admin_stats, chat 
from routers.payments import router as payments_router

app = FastAPI(title="ShopHub Product API với PostgreSQL", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

Base.metadata.create_all(bind=engine)

IMAGE_DIR = "data_images"
os.makedirs(IMAGE_DIR, exist_ok=True)
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

app.include_router(products.router)  
app.include_router(auth.router)      
app.include_router(orders.router)
app.include_router(payments_router)
app.include_router(admin_stats.router)
app.include_router(chat.router) # 2. Đăng ký router chat vào FastAPI

@app.get("/")
def read_root():
    return {"status": "success", "message": "Backend ShopHub chạy PostgreSQL ngon lành!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)