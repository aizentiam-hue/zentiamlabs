from fastapi import APIRouter, HTTPException
from typing import List, Dict
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin")

# Define project documents
PROJECT_DOCS = [
    {
        "id": "chatbot-plan",
        "title": "Chatbot Enhancement Plan",
        "description": "Comprehensive plan for conversational quality, Google Sheets integration, and self-learning mechanism",
        "filename": "CHATBOT_ENHANCEMENT_PLAN.md",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "admin-credentials",
        "title": "Admin Credentials",
        "description": "Login credentials for the admin portal",
        "filename": "ADMIN_CREDENTIALS.md",
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "seo-guide",
        "title": "SEO Implementation Guide",
        "description": "Guide for SEO management features",
        "filename": "SEO_IMPLEMENTATION_GUIDE.md",
        "created_at": datetime.utcnow().isoformat()
    }
]

@router.get("/project-docs")
async def get_project_docs():
    """Get list of project documentation files"""
    try:
        # Filter to only include docs that exist
        existing_docs = []
        for doc in PROJECT_DOCS:
            filepath = f"/app/{doc['filename']}"
            if os.path.exists(filepath):
                existing_docs.append(doc)
        
        return {"documents": existing_docs}
    except Exception as e:
        logger.error(f"Error getting project docs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/project-docs/{filename}")
async def get_project_doc_content(filename: str):
    """Get content of a specific project document"""
    try:
        # Security check - only allow specific files
        allowed_files = [doc["filename"] for doc in PROJECT_DOCS]
        if filename not in allowed_files:
            raise HTTPException(status_code=404, detail="Document not found")
        
        filepath = f"/app/{filename}"
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Document not found")
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        return {"content": content, "filename": filename}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reading document {filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
