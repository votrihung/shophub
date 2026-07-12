from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    # 🚀 BỔ SUNG 2 CỘT NÀY ĐỂ KHỚP VỚI LOGIC ĐĂNG KÝ VÀ PHÂN QUYỀN
    role = Column(String, default="user", nullable=False)  # Mặc định tài khoản mới tạo là quyền 'user'
    full_name = Column(String, nullable=True)             # Lưu họ và tên từ Frontend gửi lên