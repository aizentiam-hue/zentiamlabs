from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

router = APIRouter(prefix="/api")

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

class SEOData(BaseModel):
    page: str
    title: str
    description: str
    keywords: str
    ogImage: Optional[str] = None
    canonical: Optional[str] = None
    structuredData: Optional[Dict] = None
    lastUpdated: Optional[str] = None

class SitemapEntry(BaseModel):
    url: str
    priority: float
    changefreq: str

@router.get("/seo/pages")
async def get_all_seo():
    """Get SEO data for all pages"""
    try:
        seo_data = await db.seo_settings.find({}, {"_id": 0}).to_list(100)
        return {"success": True, "data": seo_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seo/page/{page_name}")
async def get_page_seo(page_name: str):
    """Get SEO data for a specific page"""
    try:
        seo_data = await db.seo_settings.find_one({"page": page_name}, {"_id": 0})
        if not seo_data:
            return {"success": False, "message": "Page not found"}
        return {"success": True, "data": seo_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seo/page")
async def save_page_seo(seo: SEOData):
    """Save or update SEO data for a page"""
    try:
        seo_dict = seo.dict()
        seo_dict["lastUpdated"] = datetime.now().isoformat()
        
        result = await db.seo_settings.update_one(
            {"page": seo.page},
            {"$set": seo_dict},
            upsert=True
        )
        
        return {
            "success": True,
            "message": "SEO settings saved successfully",
            "updated": result.modified_count > 0 or result.upserted_id is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/seo/page/{page_name}")
async def delete_page_seo(page_name: str):
    """Delete SEO data for a page"""
    try:
        result = await db.seo_settings.delete_one({"page": page_name})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Page not found")
        return {"success": True, "message": "SEO settings deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seo/sitemap")
async def generate_sitemap():
    """Generate sitemap.xml content"""
    try:
        # Get all pages with SEO data
        pages = await db.seo_settings.find({}, {"_id": 0, "page": 1, "canonical": 1}).to_list(100)
        
        # Default pages if none configured
        if not pages:
            pages = [
                {"page": "home", "canonical": "/"},
                {"page": "about", "canonical": "/about"},
                {"page": "services", "canonical": "/services"},
                {"page": "products", "canonical": "/products"},
                {"page": "contact", "canonical": "/contact"}
            ]
        
        sitemap_entries = []
        for page in pages:
            url = page.get("canonical", f"/{page['page']}")
            priority = 1.0 if page["page"] == "home" else 0.8
            sitemap_entries.append({
                "url": url,
                "priority": priority,
                "changefreq": "weekly"
            })
        
        return {"success": True, "entries": sitemap_entries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/seo/analytics")
async def get_seo_analytics():
    """Get SEO analytics and scores"""
    try:
        pages = await db.seo_settings.find({}, {"_id": 0}).to_list(100)
        
        analytics = {
            "totalPages": len(pages),
            "pagesWithSEO": len(pages),
            "averageScore": 0,
            "issues": []
        }
        
        total_score = 0
        for page in pages:
            score = calculate_seo_score(page)
            total_score += score
            
            # Check for issues
            if len(page.get("description", "")) < 120:
                analytics["issues"].append({
                    "page": page["page"],
                    "type": "warning",
                    "message": "Meta description is too short (should be 120-160 characters)"
                })
            
            if len(page.get("title", "")) > 60:
                analytics["issues"].append({
                    "page": page["page"],
                    "type": "warning",
                    "message": "Title is too long (should be under 60 characters)"
                })
        
        if len(pages) > 0:
            analytics["averageScore"] = round(total_score / len(pages), 1)
        
        return {"success": True, "analytics": analytics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_seo_score(page_data):
    """Calculate SEO score for a page"""
    score = 0
    
    # Title (25 points)
    title = page_data.get("title", "")
    if title:
        score += 15
        if 30 <= len(title) <= 60:
            score += 10
    
    # Description (25 points)
    description = page_data.get("description", "")
    if description:
        score += 15
        if 120 <= len(description) <= 160:
            score += 10
    
    # Keywords (15 points)
    keywords = page_data.get("keywords", "")
    if keywords and len(keywords.split(",")) >= 3:
        score += 15
    
    # OG Image (15 points)
    if page_data.get("ogImage"):
        score += 15
    
    # Canonical URL (10 points)
    if page_data.get("canonical"):
        score += 10
    
    # Structured Data (10 points)
    if page_data.get("structuredData"):
        score += 10
    
    return min(score, 100)
