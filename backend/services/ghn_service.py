import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GHN_API_URL = os.getenv("GHN_API_URL")
GHN_API_TOKEN = os.getenv("GHN_API_TOKEN")
GHN_SHOP_ID = os.getenv("GHN_SHOP_ID")

HEADERS = {
    "Token": GHN_API_TOKEN,
    "ShopId": str(GHN_SHOP_ID),
    "Content-Type": "application/json"
}

async def calculate_shipping_fee(to_district_id: int, to_ward_code: str, weight: int = 1000):
    url = f"{GHN_API_URL}/v2/shipping-order/fee"
    payload = {
        "service_type_id": 2,
        "to_district_id": to_district_id,
        "to_ward_code": str(to_ward_code),
        "weight": weight,
        "insurance_value": 0
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=HEADERS)
        data = response.json()
        if data.get("code") == 200:
            return data["data"]["total"]
        raise Exception(f"Lỗi tính phí GHN: {data.get('message')}")

async def create_ghn_order(order_data: dict):
    url = f"{GHN_API_URL}/v2/shipping-order/create"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=order_data, headers=HEADERS)
        data = response.json()
        if data.get("code") == 200:
            return data["data"]["order_code"]
        raise Exception(f"Lỗi tạo đơn GHN: {data.get('message')}")