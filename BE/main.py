from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import logging
from typing import List, AsyncGenerator
from sqlalchemy.orm import Session
from databases import SessionLocal
from models import User
from auth import hash_password, verify_password, create_access_token, oauth2_scheme, decode_token
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Chat API", description="FastAPI proxy for Ollama chat")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Configure CORS
    allow_origins=["http://localhost:5173", 
                   "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    messages: List[ChatMessage] = []
    model: str = "mistral:7b-instruct"

class ChatResponse(BaseModel):
    response: str
    model: str
    status: str = "success"

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "mistral:7b-instruct"

@app.get("/")
async def root():
    return {"message": "Chat API is running", "status": "healthy"}

@app.get("/models")
async def list_models():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=500, detail="Failed to fetch models")
    except httpx.RequestError as e:
        logger.error(f"Error connecting to Ollama: {e}")
        raise HTTPException(status_code=503, detail="Ollama service unavailable")


@app.post("/chat/stream", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, stream: bool = False):
    messages = [
        {"role": "system", "content": "Bạn là trợ lý AI nói tiếng Việt!"},
        *[msg.dict() for msg in chat_request.messages],
        {"role": "user", "content": chat_request.message}
    ]

    payload = {
        "model": chat_request.model,
        "messages": messages,
        "stream": stream
    }

    logger.info(f"Gửi yêu cầu tới Ollama (stream={stream}) - model: {chat_request.model}")

    try:
        if stream:
            async def stream_generator() -> AsyncGenerator[str, None]:
                async with httpx.AsyncClient(timeout=None) as client:
                    async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/chat", json=payload) as response:
                        if response.status_code != 200:
                            logger.error(f"Lỗi Ollama (stream): {response.status_code} - {response.text}")
                            raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {response.text}")
                        async for chunk in response.aiter_text():
                            if chunk.strip():
                                yield chunk
            return StreamingResponse(stream_generator(), media_type="text/event-stream")
        else:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
                if response.status_code != 200:
                    logger.error(f"Lỗi Ollama: {response.status_code} - {response.text}")
                    raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {response.text}")
                response_data = response.json()
                return ChatResponse(response=response_data["message"]["content"], model=chat_request.model)

    except httpx.TimeoutException:
        logger.error("Timeout khi kết nối Ollama")
        raise HTTPException(status_code=504, detail="Request timed out")
    except httpx.RequestError as e:
        logger.error(f"Lỗi kết nối Ollama: {e}")
        raise HTTPException(status_code=503, detail="Ollama service unavailable")
    except KeyError as e:
        logger.error(f"Phản hồi không hợp lệ từ Ollama: {e}")
        raise HTTPException(status_code=500, detail="Invalid response from AI service")
    except Exception as e:
        logger.error(f"Lỗi không xác định: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response
# Auth
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=form.username, hashed_password=hash_password(form.password))
    db.add(new_user)
    db.commit()
    return {"msg": "User created"}

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me")
def read_user(token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    return {"username": username}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, workers=1)
