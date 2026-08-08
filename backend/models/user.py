import enum
from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    SHIPPER = "shipper"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    
    role = Column(String, default=UserRole.USER, nullable=False)  
    full_name = Column(String, nullable=True)