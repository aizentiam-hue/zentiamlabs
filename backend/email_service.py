import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import resend

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
            
            if config["provider"] == "resend":
                resend.api_key = config["apiKey"]
                
                params = {
                    "from": f"{config['fromName']} <{config['fromEmail']}>",
                    "to": [consultation["email"]],
                    "subject": "Thank you for contacting Zentiam",
                    "html": f"""
                    <h2>Thank you for your consultation request!</h2>
                    <p>Hi {consultation['name']},</p>
                    <p>We've received your consultation request and our team will get back to you within 24 hours.</p>
                    <p><strong>Your Details:</strong></p>
                    <ul>
                        <li>Service: {consultation['service']}</li>
                        <li>Company: {consultation.get('company', 'N/A')}</li>
                    </ul>
                    <p>Best regards,<br>Zentiam Team</p>
                    """
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
            
            if config["provider"] == "resend":
                resend.api_key = config["apiKey"]
                
                params = {
                    "from": f"{config['fromName']} <{config['fromEmail']}>",
                    "to": [email_address],
                    "subject": "Welcome to Zentiam Newsletter",
                    "html": """
                    <h2>Welcome to Zentiam!</h2>
                    <p>Thank you for subscribing to our newsletter.</p>
                    <p>You'll receive updates about:</p>
                    <ul>
                        <li>Latest AI trends and insights</li>
                        <li>Zentiam product updates</li>
                        <li>Industry best practices</li>
                        <li>Exclusive offers and events</li>
                    </ul>
                    <p>Best regards,<br>Zentiam Team</p>
                    """
                }
                
                email = resend.Emails.send(params)
                logger.info(f"Newsletter welcome sent to {email_address}")
                return True
            
            return False
        except Exception as e:
            logger.error(f"Error sending newsletter email: {e}")
            return False

email_service = EmailService()
