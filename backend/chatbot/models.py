from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class ChatMessage(BaseModel):
    session_id: str
    message: str
    sender: str = "user"  # user or bot
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    messages: List[Dict[str, Any]] = []
    query_topics: List[str] = []
    answered_questions: List[str] = []
    unanswered_questions: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    info_collected: bool = False

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    needs_info: bool = False
    info_type: Optional[str] = None  # "name", "email", "phone"

class DocumentUpload(BaseModel):
    filename: str
    file_type: str
    content: str
