from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import uvicorn
import re

from chatbot import ContextAwareChatbot

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for chat request
class ChatRequest(BaseModel):
    message: str
    api_key: Optional[str] = None

# Initialize chatbot
groq_api_key = os.environ.get("GROQ_API_KEY", "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")
chatbot = None

try:
    chatbot = ContextAwareChatbot(
        groq_api_key=groq_api_key,
        chroma_db_path='./chroma_storage',
        collection_name='technical_docs'
    )
except Exception as e:
    print(f"Warning: Chatbot initialization error: {e}")
    # We'll initialize it later when needed

def format_response(response: str) -> str:
    """Format the response to ensure it's in a point-to-point style"""
    
    # If response doesn't have bullet points or numbered lists, add them
    if not (re.search(r'^\s*[-•*]\s', response, re.MULTILINE) or 
            re.search(r'^\s*\d+[.)\]]\s', response, re.MULTILINE)):
        
        # Split by sentences or newlines
        sentences = re.split(r'(?<=[.!?])\s+|\n+', response)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # If there are multiple sentences, format as bullet points
        if len(sentences) > 1:
            return '\n'.join([f"• {s}" for s in sentences])
    
    return response

@app.get("/")
def read_root():
    return {"status": "API is running"}

@app.post("/chat")
def chat(request: ChatRequest):
    global chatbot, groq_api_key
    
    # Use provided API key if available
    if request.api_key:
        if groq_api_key != request.api_key or chatbot is None:
            try:
                groq_api_key = request.api_key
                chatbot = ContextAwareChatbot(
                    groq_api_key=groq_api_key,
                    chroma_db_path='./chroma_storage',
                    collection_name='technical_docs'
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Chatbot initialization error: {str(e)}")
    
    # Ensure chatbot is initialized
    if chatbot is None:
        try:
            chatbot = ContextAwareChatbot(
                groq_api_key=groq_api_key,
                chroma_db_path='./chroma_storage',
                collection_name='technical_docs'
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Chatbot initialization error: {str(e)}")
    
    # Process the chat message
    try:
        response = chatbot.chat(request.message)
        
        # Format response to ensure it's point-to-point
        formatted_response = format_response(response)
        
        return {"response": formatted_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during chat: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 