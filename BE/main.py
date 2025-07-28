
# ==== Thư viện hệ thống & bên thứ 3 ====
from datetime import datetime
import tempfile, os
import speech_recognition as sr  # type: ignore # Thư viện nhận diện giọng nói

from fastapi import FastAPI, Request, Depends, HTTPException, File, UploadFile, Form # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.responses import StreamingResponse # type: ignore
from fastapi.security import OAuth2PasswordRequestForm # type: ignore
from pydantic import BaseModel # type: ignore

import httpx  # type: ignore # Dùng để gọi API của Ollama
import logging
from typing import List, AsyncGenerator

from sqlalchemy.orm import Session # type: ignore
from databases import SessionLocal  # Kết nối DB
from models import User
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    oauth2_scheme,
    decode_token,
)

# ==== Logging ====
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==== Khởi tạo FastAPI ====
app = FastAPI(title="Chat API", description="FastAPI proxy for Ollama chat")

# ==== Cấu hình CORS ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== Định nghĩa model cho chat ====
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

# ==== Cấu hình API của Ollama ====
OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "mistral:7b-instruct"

# ==== Hàm dùng chung để truy cập database ====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==== Hàm nhận diện giọng nói từ audio ====
def recognize_speech_from_audio(audio_data, language="vi-VN"):
    recognizer = sr.Recognizer()
    try:
        text = recognizer.recognize_google(audio_data, language=language)
        return {
            "success": True,
            "text": text,
            "confidence": 0.9,
            "language": language,
            "timestamp": datetime.now().isoformat()
        }
    except sr.UnknownValueError:
        return {"success": False, "error": "Không thể nhận diện giọng nói"}
    except sr.RequestError as e:
        try:
            text = recognizer.recognize_sphinx(audio_data)
            return {
                "success": True,
                "text": text,
                "confidence": 0.7,
                "language": "en-US",
                "timestamp": datetime.now().isoformat()
            }
        except:
            return {"success": False, "error": f"Lỗi dịch vụ nhận diện: {e}"}
    except Exception as e:
        return {"success": False, "error": f"Lỗi không xác định: {e}"}

# ==== ROOT ====
@app.get("/")
async def root():
    return {"message": "Chat API is running", "status": "healthy"}

# ==== Lấy danh sách model từ Ollama ====
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

# ==== Chat với Ollama (stream hoặc thường) ====
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
        # Nếu stream: trả về dữ liệu theo dạng dòng (text/event-stream)
        if stream:
            async def stream_generator() -> AsyncGenerator[str, None]:
                async with httpx.AsyncClient(timeout=None) as client:
                    async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/chat", json=payload) as response:
                        if response.status_code != 200:
                            raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {response.text}")
                        async for chunk in response.aiter_text():
                            if chunk.strip():
                                yield chunk
            return StreamingResponse(stream_generator(), media_type="text/event-stream")
        else:
            # Nếu không stream: chờ phản hồi 1 lần rồi trả về
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail=f"Ollama API error: {response.text}")
                response_data = response.json()
                return ChatResponse(response=response_data["message"]["content"], model=chat_request.model)

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail="Ollama service unavailable")
    except KeyError as e:
        raise HTTPException(status_code=500, detail="Invalid response from AI service")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# ==== Middleware log các request ====
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# ==== API ghi âm từ server (microphone máy chủ) ====
@app.post("/voice/record")
def record_voice(duration: int = 5, language: str = "vi-VN"):
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)
            print(f"🎙️ Đang ghi âm trong {duration} giây...")
            audio_data = recognizer.listen(source, timeout=1, phrase_time_limit=duration)
        result = recognize_speech_from_audio(audio_data, language)
        return result
    except sr.WaitTimeoutError:
        return {"success": False, "error": "Không nghe thấy âm thanh"}
    except Exception as e:
        return {"success": False, "error": f"Lỗi ghi âm: {e}"}

# ==== API upload file âm thanh (.wav) để nhận diện ====
@app.post("/voice/upload")
async def upload_voice(audio: UploadFile = File(...), language: str = Form("vi-VN")):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name

        recognizer = sr.Recognizer()
        with sr.AudioFile(tmp_path) as source:
            audio_data = recognizer.record(source)
            result = recognize_speech_from_audio(audio_data, language)

        os.unlink(tmp_path)
        return result
    except Exception as e:
        return {"success": False, "error": f"Lỗi xử lý file: {e}"}

# ==== Đăng ký người dùng ====
@app.post("/register")
def register(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=form.username, hashed_password=hash_password(form.password))
    db.add(new_user)
    db.commit()
    return {"msg": "User created"}

# ==== Đăng nhập, trả về access token ====
@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# ==== Truy vấn thông tin người dùng hiện tại ====
@app.get("/me")
def read_user(token: str = Depends(oauth2_scheme)):
    username = decode_token(token)
    return {"username": username}

# ==== Khởi động FastAPI server (dev mode) ====
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, workers=1) # type: ignore