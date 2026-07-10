import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Đường dẫn kết nối đến PostgreSQL (Giữ nguyên mật khẩu '1' và DB 'shophub' của bác)
DATABASE_URL = "postgresql://postgres:1@localhost:5432/shophub"

# 2. Khởi tạo Engine kết nối (Bổ sung pool_pre_ping để chống nghẽn cổng 500)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# 3. Khởi tạo Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Khởi tạo Base model
Base = declarative_base()

# 5. Hàm cấp phát kết nối DB cho các API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()