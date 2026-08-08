from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["Admin Chat"])

# Crisp Credentials (Production Keys)
CRISP_WEBSITE_ID = "f133bcac-d0c5-477a-984a-acb342565136"
CRISP_TOKEN_ID = "7c7265f8-2671-44d2-8171-d0c2969304fe"
CRISP_TOKEN_KEY = "f9aa5a5b49747c3036f7e0f2e0daa5cdf46a14b03660c76c5776e546718fdc92"

CRISP_AUTH = (CRISP_TOKEN_ID, CRISP_TOKEN_KEY)
CRISP_HEADERS = {
    "X-Crisp-Tier": "plugin",
    "Content-Type": "application/json"
}

class MessagePayload(BaseModel):
    content: str


# 1. Lấy danh sách cuộc hội thoại (Trang 1)
@router.get("/conversations")
async def get_conversations():
    url = f"https://api.crisp.chat/v1/website/{CRISP_WEBSITE_ID}/conversations/1"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, auth=CRISP_AUTH, headers=CRISP_HEADERS)
    
    if response.status_code != 200:
        try:
            detail = response.json()
        except Exception:
            detail = response.text
        print("Lỗi Crisp API:", response.status_code, detail)
        raise HTTPException(status_code=response.status_code, detail=detail)
        
    return response.json()


# 2. Lấy tin nhắn của 1 cuộc hội thoại
@router.get("/conversations/{session_id}/messages")
async def get_messages(session_id: str):
    url = f"https://api.crisp.chat/v1/website/{CRISP_WEBSITE_ID}/conversation/{session_id}/messages"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, auth=CRISP_AUTH, headers=CRISP_HEADERS)
    
    if response.status_code != 200:
        try:
            detail = response.json()
        except Exception:
            detail = response.text
        raise HTTPException(status_code=response.status_code, detail=detail)
        
    return response.json()


# 3. Admin gửi tin nhắn trả lời
@router.post("/conversations/{session_id}/messages")
async def send_message(session_id: str, payload: MessagePayload):
    url = f"https://api.crisp.chat/v1/website/{CRISP_WEBSITE_ID}/conversation/{session_id}/message"
    data = {
        "type": "text",
        "content": payload.content,
        "from": "operator",
        "origin": "chat"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, auth=CRISP_AUTH, headers=CRISP_HEADERS)
    
    if response.status_code != 200:
        try:
            detail = response.json()
        except Exception:
            detail = response.text
        raise HTTPException(status_code=response.status_code, detail=detail)
        
    return response.json()