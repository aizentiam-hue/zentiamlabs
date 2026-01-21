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
        """Log a chat session to the spreadsheet"""
        if not self.is_configured:
            logger.warning("Google Sheets not configured, skipping log")
            return False
        
        try:
            # Parse session data
            messages = session_data.get('messages', [])
            user_messages = [m for m in messages if m.get('sender') == 'user']
            bot_messages = [m for m in messages if m.get('sender') == 'bot']
            
            # Calculate duration
            if messages:
                first_msg_time = messages[0].get('timestamp')
                last_msg_time = messages[-1].get('timestamp')
                if first_msg_time and last_msg_time:
                    if isinstance(first_msg_time, str):
                        first_msg_time = datetime.fromisoformat(first_msg_time.replace('Z', '+00:00'))
                    if isinstance(last_msg_time, str):
                        last_msg_time = datetime.fromisoformat(last_msg_time.replace('Z', '+00:00'))
                    duration = (last_msg_time - first_msg_time).total_seconds() / 60
                else:
                    duration = 0
            else:
                duration = 0
            
            # Extract topics (simple keyword extraction)
            topics = self._extract_topics(user_messages)
            
            # Create summary
            summary = self._create_summary(messages)
            
            # Prepare row data
            row = [
                datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
                session_data.get('session_id', ''),
                session_data.get('user_name', 'Anonymous'),
                session_data.get('user_email', ''),
                session_data.get('user_phone', ''),
                ', '.join(topics) if topics else 'General inquiry',
                len(messages),
                round(duration, 1),
                len(bot_messages),
                0,  # Unanswered - would need more analysis
                session_data.get('satisfaction', 'Not rated'),
                summary[:500] if summary else ''  # Limit summary length
            ]
            
            # Append to sheet
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range='A:L',
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': [row]}
            ).execute()
            
            logger.info(f"Logged session {session_data.get('session_id')} to Google Sheets")
            return True
            
        except HttpError as e:
            logger.error(f"Google Sheets API error: {e}")
            return False
        except Exception as e:
            logger.error(f"Error logging to Google Sheets: {e}")
            return False
    
    def _extract_topics(self, user_messages: List[Dict]) -> List[str]:
        """Extract topics from user messages"""
        topics = set()
        topic_keywords = {
            'pricing': ['price', 'pricing', 'cost', 'quote', 'budget', 'expensive', 'cheap'],
            'services': ['service', 'services', 'offering', 'provide', 'offer'],
            'automation': ['automat', 'workflow', 'process'],
            'chatbot': ['chatbot', 'chat bot', 'conversational'],
            'data': ['data', 'analytics', 'analysis', 'insights'],
            'machine learning': ['machine learning', 'ml', 'model', 'prediction'],
            'consulting': ['consult', 'advice', 'guidance', 'help'],
            'demo': ['demo', 'demonstration', 'trial', 'test'],
            'integration': ['integrat', 'connect', 'api'],
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
