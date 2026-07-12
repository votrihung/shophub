import os
import sys
sys.path.append(os.path.abspath("."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="ShopHub Product API với PostgreSQL", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from database import engine, Base
import models.product
import models.user

from routers import products, auth 

Base.metadata.create_all(bind=engine)

IMAGE_DIR = "data_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

app.include_router(products.router)  
app.include_router(auth.router)      

@app.get("/")
def read_root():
    return {"status": "success", "message": "Backend ShopHub chạy PostgreSQL ngon lành!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)