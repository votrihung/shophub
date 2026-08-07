FROM python:3.11-slim

WORKDIR /app

# Cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code backend
COPY . .

# Chạy ứng dụng
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}