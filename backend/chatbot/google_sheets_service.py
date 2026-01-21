import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)

class GoogleSheetsService:
    """Service for logging chat sessions to Google Sheets"""
    
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    
    def __init__(self):
        self.credentials = None
        self.service = None
        self.spreadsheet_id = None
        self.is_configured = False
        self._load_config()
    
    def _load_config(self):
        """Load configuration from environment or config file"""
        try:
            # Try to load from environment variable (base64 encoded JSON)
            creds_json = os.environ.get('GOOGLE_SHEETS_CREDENTIALS_JSON')
            self.spreadsheet_id = os.environ.get('GOOGLE_SHEETS_SPREADSHEET_ID')
            
            if creds_json and self.spreadsheet_id:
                import base64
                creds_dict = json.loads(base64.b64decode(creds_json).decode('utf-8'))
                self.credentials = service_account.Credentials.from_service_account_info(
                    creds_dict, scopes=self.SCOPES
                )
                self.service = build('sheets', 'v4', credentials=self.credentials)
                self.is_configured = True
                logger.info("Google Sheets service configured successfully")
            else:
                logger.info("Google Sheets not configured - missing credentials or spreadsheet ID")
        except Exception as e:
            logger.error(f"Error loading Google Sheets config: {e}")
            self.is_configured = False
    
    def configure(self, credentials_json: str, spreadsheet_id: str) -> bool:
        """Configure the service with credentials and spreadsheet ID"""
        try:
            creds_dict = json.loads(credentials_json) if isinstance(credentials_json, str) else credentials_json
            self.credentials = service_account.Credentials.from_service_account_info(
                creds_dict, scopes=self.SCOPES
            )
            self.service = build('sheets', 'v4', credentials=self.credentials)
            self.spreadsheet_id = spreadsheet_id
            self.is_configured = True
            
            # Initialize the sheet with headers if empty
            self._initialize_sheet()
            
            logger.info("Google Sheets service configured successfully")
            return True
        except Exception as e:
            logger.error(f"Error configuring Google Sheets: {e}")
            self.is_configured = False
            return False
    
    def _initialize_sheet(self):
        """Initialize sheet with headers if it's empty"""
        try:
            # Check if headers exist
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range='A1:L1'
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                # Add headers - Business-focused columns
                headers = [
                    ['Date', 'Time', 'Lead Name', 'Email', 'Phone', 
                     'Query Type', 'Services Interested', 'Industry', 
                     'Key Requirements', 'Lead Status', 'Follow-up Priority', 'Conversation Summary']
                ]
                
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range='A1:L1',
                    valueInputOption='RAW',
                    body={'values': headers}
                ).execute()
                
                # Format headers (bold with blue background)
                requests = [{
                    'repeatCell': {
                        'range': {
                            'sheetId': 0,
                            'startRowIndex': 0,
                            'endRowIndex': 1
                        },
                        'cell': {
                            'userEnteredFormat': {
                                'textFormat': {'bold': True},
                                'backgroundColor': {'red': 0.2, 'green': 0.4, 'blue': 0.8}
                            }
                        },
                        'fields': 'userEnteredFormat(textFormat,backgroundColor)'
                    }
                }]
                
                self.service.spreadsheets().batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body={'requests': requests}
                ).execute()
                
                logger.info("Sheet initialized with business-focused headers")
        except Exception as e:
            logger.error(f"Error initializing sheet: {e}")
    
    def log_chat_session(self, session_data: Dict) -> bool:
        """Log a chat session to the spreadsheet with business-relevant data"""
        if not self.is_configured:
            logger.warning("Google Sheets not configured, skipping log")
            return False
        
        try:
            # Parse session data
            messages = session_data.get('messages', [])
            user_messages = [m for m in messages if m.get('sender') == 'user']
            
            # Get user contact information
            user_name = session_data.get('user_name', '')
            user_email = session_data.get('user_email', '')
            user_phone = session_data.get('user_phone', '')
            
            # Skip if no contact info collected (likely abandoned chat)
            if not user_name and not user_email:
                logger.info("Skipping session - no contact info collected")
                return True  # Return True to mark as processed
            
            # Extract business intelligence from conversation
            all_user_text = ' '.join([m.get('message', '') for m in user_messages]).lower()
            
            # Determine Query Type
            query_type = self._determine_query_type(all_user_text)
            
            # Determine Services Interested
            services_interested = self._extract_services_interested(all_user_text)
            
            # Detect Industry
            industry = self._detect_industry(all_user_text)
            
            # Extract Key Requirements
            key_requirements = self._extract_requirements(user_messages)
            
            # Determine Lead Status
            lead_status = self._determine_lead_status(session_data, all_user_text)
            
            # Determine Follow-up Priority
            follow_up_priority = self._determine_priority(lead_status, services_interested, user_email)
            
            # Create conversation summary
            summary = self._create_business_summary(user_messages, services_interested, query_type)
            
            # Get timestamp
            now = datetime.utcnow()
            
            # Prepare row data - Business focused
            row = [
                now.strftime('%Y-%m-%d'),           # Date
                now.strftime('%H:%M'),               # Time
                user_name or 'Not provided',         # Lead Name
                user_email or 'Not provided',        # Email
                user_phone if user_phone and user_phone != 'skipped' else 'Not provided',  # Phone
                query_type,                          # Query Type
                ', '.join(services_interested) if services_interested else 'General Inquiry',  # Services Interested
                industry or 'Not specified',         # Industry
                key_requirements[:300] if key_requirements else 'Not specified',  # Key Requirements
                lead_status,                         # Lead Status
                follow_up_priority,                  # Follow-up Priority
                summary[:400] if summary else ''     # Conversation Summary
            ]
            
            # Append to sheet
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range='A:L',
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': [row]}
            ).execute()
            
            logger.info(f"Logged lead {user_name or user_email} to Google Sheets")
            return True
            
        except HttpError as e:
            logger.error(f"Google Sheets API error: {e}")
            return False
        except Exception as e:
            logger.error(f"Error logging to Google Sheets: {e}")
            return False
    
    def _determine_query_type(self, text: str) -> str:
        """Determine the type of query"""
        if any(w in text for w in ['price', 'pricing', 'cost', 'quote', 'budget', 'how much']):
            return 'Pricing Inquiry'
        elif any(w in text for w in ['demo', 'demonstration', 'trial', 'see it', 'show me']):
            return 'Demo Request'
        elif any(w in text for w in ['problem', 'issue', 'struggling', 'challenge', 'help with', 'need help']):
            return 'Problem/Solution'
        elif any(w in text for w in ['consult', 'advice', 'guidance', 'recommend']):
            return 'Consultation Request'
        elif any(w in text for w in ['partner', 'collaborate', 'work together']):
            return 'Partnership Inquiry'
        elif any(w in text for w in ['job', 'career', 'hiring', 'position', 'work for']):
            return 'Career Inquiry'
        else:
            return 'General Inquiry'
    
    def _extract_services_interested(self, text: str) -> List[str]:
        """Extract services the user is interested in"""
        services = []
        service_keywords = {
            'AI Consulting': ['ai consulting', 'consulting', 'strategy', 'roadmap'],
            'Chatbot Development': ['chatbot', 'chat bot', 'conversational ai', 'virtual assistant'],
            'Process Automation': ['automation', 'automate', 'workflow', 'rpa', 'process'],
            'Machine Learning': ['machine learning', 'ml', 'predictive', 'prediction', 'model'],
            'Data Analytics': ['data analytics', 'analytics', 'data analysis', 'insights', 'dashboard'],
            'NLP Solutions': ['nlp', 'natural language', 'text analysis', 'sentiment'],
            'Computer Vision': ['computer vision', 'image recognition', 'ocr', 'visual'],
            'AI Integration': ['integration', 'integrate', 'api', 'connect'],
            'AI Training': ['training', 'workshop', 'learn', 'upskill'],
        }
        
        for service, keywords in service_keywords.items():
            if any(kw in text for kw in keywords):
                services.append(service)
        
        return services if services else ['General Services']
    
    def _detect_industry(self, text: str) -> str:
        """Detect the user's industry"""
        industries = {
            'Healthcare': ['healthcare', 'medical', 'hospital', 'clinic', 'patient', 'doctor', 'pharma'],
            'Finance/Banking': ['finance', 'banking', 'bank', 'financial', 'investment', 'insurance', 'fintech'],
            'Retail/E-commerce': ['retail', 'ecommerce', 'e-commerce', 'store', 'shopping', 'shop', 'product'],
            'Manufacturing': ['manufacturing', 'factory', 'production', 'assembly', 'industrial'],
            'Logistics/Supply Chain': ['logistics', 'shipping', 'supply chain', 'warehouse', 'delivery', 'transport'],
            'Technology/SaaS': ['tech', 'software', 'saas', 'startup', 'app', 'platform'],
            'Education': ['education', 'school', 'university', 'learning', 'student', 'training'],
            'Real Estate': ['real estate', 'property', 'housing', 'construction'],
            'Hospitality': ['hotel', 'restaurant', 'hospitality', 'travel', 'tourism'],
            'Media/Entertainment': ['media', 'entertainment', 'content', 'video', 'streaming'],
        }
        
        for industry, keywords in industries.items():
            if any(kw in text for kw in keywords):
                return industry
        
        return ''
    
    def _extract_requirements(self, user_messages: List[Dict]) -> str:
        """Extract key requirements from user messages"""
        requirements = []
        
        # Look for specific requirement patterns
        requirement_phrases = [
            'we need', 'we want', 'looking for', 'require', 'must have',
            'important to', 'essential', 'goal is', 'objective is', 
            'challenge is', 'problem is', 'struggling with'
        ]
        
        for msg in user_messages:
            text = msg.get('message', '').lower()
            for phrase in requirement_phrases:
                if phrase in text:
                    # Extract the sentence containing the requirement
                    sentences = msg.get('message', '').split('.')
                    for sentence in sentences:
                        if phrase in sentence.lower():
                            clean_sentence = sentence.strip()
                            if len(clean_sentence) > 10 and clean_sentence not in requirements:
                                requirements.append(clean_sentence)
                                break
        
        return '; '.join(requirements[:3]) if requirements else ''
    
    def _determine_lead_status(self, session_data: Dict, text: str) -> str:
        """Determine the lead status based on conversation"""
        has_email = bool(session_data.get('user_email'))
        has_phone = session_data.get('user_phone') and session_data.get('user_phone') != 'skipped'
        info_complete = session_data.get('info_collected', False)
        
        # High intent signals
        high_intent = any(w in text for w in ['demo', 'pricing', 'start', 'begin', 'sign up', 'get started', 'next steps'])
        
        if has_email and has_phone and high_intent:
            return 'Hot Lead'
        elif has_email and high_intent:
            return 'Warm Lead'
        elif has_email:
            return 'Qualified Lead'
        elif info_complete:
            return 'Contact Captured'
        else:
            return 'Inquiry'
    
    def _determine_priority(self, lead_status: str, services: List[str], email: str) -> str:
        """Determine follow-up priority"""
        if lead_status == 'Hot Lead':
            return '🔴 High - Contact within 24hrs'
        elif lead_status == 'Warm Lead':
            return '🟠 Medium - Contact within 48hrs'
        elif len(services) > 2 or lead_status == 'Qualified Lead':
            return '🟡 Normal - Contact within 3 days'
        else:
            return '🟢 Low - Add to nurture list'
    
    def _create_business_summary(self, user_messages: List[Dict], services: List[str], query_type: str) -> str:
        """Create a business-focused summary"""
        if not user_messages:
            return "No conversation recorded"
        
        # Get first substantive message (skip greetings)
        first_query = ""
        for msg in user_messages:
            text = msg.get('message', '')
            if len(text) > 20 and not text.lower().startswith(('hi', 'hello', 'hey')):
                first_query = text[:150]
                break
        
        if not first_query and user_messages:
            first_query = user_messages[0].get('message', '')[:150]
        
        summary_parts = []
        summary_parts.append(f"Query: {query_type}")
        if services and services != ['General Services']:
            summary_parts.append(f"Interest: {', '.join(services[:3])}")
        summary_parts.append(f"Initial ask: {first_query}")
        
        return ' | '.join(summary_parts)
        }
        
        for msg in user_messages:
            text = msg.get('message', '').lower()
            for topic, keywords in topic_keywords.items():
                if any(kw in text for kw in keywords):
                    topics.add(topic)
        
        return list(topics)
    
    def _create_summary(self, messages: List[Dict]) -> str:
        """Create a brief summary of the conversation"""
        if not messages:
            return "No messages"
        
        user_msgs = [m.get('message', '') for m in messages if m.get('sender') == 'user']
        if not user_msgs:
            return "Bot-only conversation"
        
        # Take first and last user messages for summary
        first_query = user_msgs[0][:100] if user_msgs else ''
        last_query = user_msgs[-1][:100] if len(user_msgs) > 1 else ''
        
        if last_query and last_query != first_query:
            return f"Started: {first_query}... | Ended: {last_query}..."
        return f"Query: {first_query}..."
    
    def test_connection(self) -> Dict:
        """Test the connection to Google Sheets"""
        if not self.is_configured:
            return {"success": False, "error": "Not configured"}
        
        try:
            # Try to read the sheet
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range='A1:A1'
            ).execute()
            
            return {
                "success": True,
                "message": "Connection successful",
                "spreadsheet_id": self.spreadsheet_id
            }
        except HttpError as e:
            return {"success": False, "error": str(e)}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_recent_logs(self, limit: int = 10) -> List[Dict]:
        """Get recent log entries from the sheet"""
        if not self.is_configured:
            return []
        
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range='A:L'
            ).execute()
            
            values = result.get('values', [])
            if len(values) <= 1:  # Only headers or empty
                return []
            
            headers = values[0]
            rows = values[1:][-limit:]  # Get last 'limit' rows
            
            logs = []
            for row in reversed(rows):  # Most recent first
                log_entry = {}
                for i, header in enumerate(headers):
                    log_entry[header] = row[i] if i < len(row) else ''
                logs.append(log_entry)
            
            return logs
        except Exception as e:
            logger.error(f"Error getting recent logs: {e}")
            return []

# Global instance
google_sheets_service = GoogleSheetsService()
