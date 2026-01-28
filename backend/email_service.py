import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import resend

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

class EmailService:
    @staticmethod
    async def get_config():
        """Get email configuration from database"""
        try:
            settings = await db.settings.find_one({"type": "system"})
            if settings and settings.get("email_config"):
                return settings["email_config"]
            return None
        except Exception as e:
            logger.error(f"Error getting email config: {e}")
            return None
    
    @staticmethod
    async def send_consultation_confirmation(consultation):
        """Send consultation confirmation email"""
        try:
            config = await EmailService.get_config()
            if not config or not config.get("apiKey"):
                logger.warning("Email not configured, skipping notification")
                return False
            
            # Get template from database
            template = await db.email_templates.find_one(
                {"templateId": "consultation_confirmation", "isActive": True},
                {"_id": 0}
            )
            
            if not template:
                logger.warning("Consultation email template not found")
                return False
            
            if config["provider"] == "resend":
                resend.api_key = config["apiKey"]
                
                # Replace template variables
                html_content = template["htmlContent"]
                variables = {
                    "name": consultation.get("name", ""),
                    "service": consultation.get("service", ""),
                    "company": consultation.get("company", "N/A"),
                    "email": consultation.get("email", "")
                }
                
                for key, value in variables.items():
                    html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
                
                params = {
                    "from": f"{config['fromName']} <{config['fromEmail']}>",
                    "to": [consultation["email"]],
                    "subject": template["subject"],
                    "html": html_content
                }
                
                email = resend.Emails.send(params)
                logger.info(f"Consultation confirmation sent to {consultation['email']}")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Error sending consultation email: {e}")
            return False
    
    @staticmethod
    async def send_newsletter_welcome(email_address):
        """Send newsletter welcome email"""
        try:
            config = await EmailService.get_config()
            if not config or not config.get("apiKey"):
                logger.warning("Email not configured, skipping notification")
                return False
            
            # Get template from database
            template = await db.email_templates.find_one(
                {"templateId": "newsletter_welcome", "isActive": True},
                {"_id": 0}
            )
            
            if not template:
                logger.warning("Newsletter email template not found")
                return False
            
            if config["provider"] == "resend":
                resend.api_key = config["apiKey"]
                
                # Replace template variables - use environment variable for base URL
                html_content = template["htmlContent"]
                base_url = os.environ.get('APP_BASE_URL', 'https://zentiam.com')
                variables = {
                    "unsubscribe_link": f"{base_url}/unsubscribe"
                }
                
                for key, value in variables.items():
                    html_content = html_content.replace(f"{{{{{key}}}}}", str(value))
                
                params = {
                    "from": f"{config['fromName']} <{config['fromEmail']}>",
                    "to": [email_address],
                    "subject": template["subject"],
                    "html": html_content
                }
                
                email = resend.Emails.send(params)
                logger.info(f"Newsletter welcome sent to {email_address}")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Error sending newsletter email: {e}")
            return False

email_service = EmailService()
