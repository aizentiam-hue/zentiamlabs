from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

router = APIRouter(prefix="/api")

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

class EmailTemplate(BaseModel):
    templateId: str
    name: str
    subject: str
    htmlContent: str
    variables: Optional[List[str]] = []
    isActive: bool = True
    lastUpdated: Optional[str] = None

class TestEmailRequest(BaseModel):
    templateId: str
    recipientEmail: str

@router.get("/email-templates")
async def get_all_templates():
    """Get all email templates"""
    try:
        templates = await db.email_templates.find({}, {"_id": 0}).to_list(100)
        
        # If no templates exist, create defaults
        if not templates:
            defaults = [
                {
                    "templateId": "consultation_confirmation",
                    "name": "Consultation Confirmation",
                    "subject": "Thank you for contacting Zentiam",
                    "htmlContent": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #9333ea;">Thank you for your consultation request!</h2>
    <p>Hi {{name}},</p>
    <p>We've received your consultation request and our team will get back to you within 24 hours.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Your Details:</p>
        <ul style="margin-top: 10px;">
            <li><strong>Service:</strong> {{service}}</li>
            <li><strong>Company:</strong> {{company}}</li>
            <li><strong>Email:</strong> {{email}}</li>
        </ul>
    </div>
    
    <p>In the meantime, feel free to explore our <a href="https://zentiam.com/services" style="color: #9333ea;">services</a> or check out our <a href="https://zentiam.com/products" style="color: #9333ea;">products</a>.</p>
    
    <p style="margin-top: 30px;">Best regards,<br>
    <strong>Zentiam Team</strong></p>
    
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
    <p style="font-size: 12px; color: #666;">
        This email was sent because you submitted a consultation request at Zentiam.com
    </p>
</div>
                    """,
                    "variables": ["name", "service", "company", "email"],
                    "isActive": True,
                    "lastUpdated": datetime.now().isoformat()
                },
                {
                    "templateId": "newsletter_welcome",
                    "name": "Newsletter Welcome",
                    "subject": "Welcome to Zentiam Newsletter",
                    "htmlContent": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #9333ea;">Welcome to Zentiam! 🎉</h2>
    <p>Thank you for subscribing to our newsletter.</p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0;">
        <h3 style="margin-top: 0;">What you'll receive:</h3>
        <ul style="line-height: 1.8;">
            <li>🤖 Latest AI trends and insights</li>
            <li>🚀 Zentiam product updates</li>
            <li>📊 Industry best practices</li>
            <li>🎁 Exclusive offers and events</li>
        </ul>
    </div>
    
    <p>Stay tuned for our next newsletter!</p>
    
    <p style="margin-top: 30px;">Best regards,<br>
    <strong>Zentiam Team</strong></p>
    
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
    <p style="font-size: 12px; color: #666;">
        You're receiving this because you subscribed to Zentiam newsletter.<br>
        <a href="{{unsubscribe_link}}" style="color: #9333ea;">Unsubscribe</a>
    </p>
</div>
                    """,
                    "variables": ["unsubscribe_link"],
                    "isActive": True,
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
            
            await db.email_templates.insert_many(defaults)
            templates = defaults
        
        return {"success": True, "templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/email-templates/{template_id}")
async def get_template(template_id: str):
    """Get specific email template"""
    try:
        template = await db.email_templates.find_one(
            {"templateId": template_id}, 
            {"_id": 0}
        )
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "template": template}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/email-templates")
async def save_template(template: EmailTemplate):
    """Save or update email template"""
    try:
        template_dict = template.dict()
        template_dict["lastUpdated"] = datetime.now().isoformat()
        
        result = await db.email_templates.update_one(
            {"templateId": template.templateId},
            {"$set": template_dict},
            upsert=True
        )
        
        return {
            "success": True,
            "message": "Template saved successfully",
            "updated": result.modified_count > 0 or result.upserted_id is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/email-templates/{template_id}")
async def delete_template(template_id: str):
    """Delete email template"""
    try:
        result = await db.email_templates.delete_one({"templateId": template_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Template deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/email-templates/test")
async def test_template(request: TestEmailRequest):
    """Send test email with template"""
    try:
        # Get template
        template = await db.email_templates.find_one(
            {"templateId": request.templateId},
            {"_id": 0}
        )
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Get email config
        settings = await db.settings.find_one({"type": "system"})
        if not settings or not settings.get("email_config"):
            raise HTTPException(status_code=400, detail="Email not configured")
        
        config = settings["email_config"]
        
        # Send test email
        import resend
        resend.api_key = config["apiKey"]
        
        # Replace variables with sample data
        html_content = template["htmlContent"]
        sample_data = {
            "name": "Test User",
            "service": "AI Strategy Consulting",
            "company": "Test Company Inc.",
            "email": request.recipientEmail,
            "unsubscribe_link": "https://zentiam.com/unsubscribe"
        }
        
        for key, value in sample_data.items():
            html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
        
        params = {
            "from": f"{config['fromName']} <{config['fromEmail']}>",
            "to": [request.recipientEmail],
            "subject": f"[TEST] {template['subject']}",
            "html": html_content
        }
        
        email = resend.Emails.send(params)
        
        return {
            "success": True,
            "message": f"Test email sent to {request.recipientEmail}",
            "emailId": email.get("id")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/email-templates/preview/{template_id}")
async def preview_template(template_id: str):
    """Get template preview with sample data"""
    try:
        template = await db.email_templates.find_one(
            {"templateId": template_id},
            {"_id": 0}
        )
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Replace variables with sample data for preview
        html_content = template["htmlContent"]
        sample_data = {
            "name": "John Doe",
            "service": "AI Strategy Consulting",
            "company": "Acme Corp",
            "email": "john@example.com",
            "phone": "+91 80889-83706",
            "unsubscribe_link": "https://zentiam.com/unsubscribe"
        }
        
        for key, value in sample_data.items():
            html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
        
        return {
            "success": True,
            "preview": {
                "subject": template["subject"],
                "htmlContent": html_content
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
