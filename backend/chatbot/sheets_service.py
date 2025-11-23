import os
import logging
from datetime import datetime
from typing import Dict, List
import re

logger = logging.getLogger(__name__)

class SheetsService:
    def __init__(self):
        self.sheet_url = os.environ.get('GOOGLE_SHEET_URL', '')
        # Extract sheet ID from URL
        self.sheet_id = self._extract_sheet_id(self.sheet_url) if self.sheet_url else None
        logger.info(f"Sheets Service initialized with sheet_id: {self.sheet_id}")
    
    def _extract_sheet_id(self, url: str) -> str:
        """Extract sheet ID from Google Sheets URL"""
        match = re.search(r'/spreadsheets/d/([a-zA-Z0-9-_]+)', url)
        return match.group(1) if match else None
    
    def log_conversation(self, session_data: Dict) -> bool:
        """Log conversation to Google Sheets"""
        try:
            if not self.sheet_id:
                logger.warning("No Google Sheet configured, skipping log")
                return False
            
            # Prepare data row
            row_data = [
                datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
                session_data.get('name', 'N/A'),
                session_data.get('email', 'N/A'),
                session_data.get('phone', 'N/A'),
                ', '.join(session_data.get('query_topics', [])),
                ', '.join(session_data.get('answered_questions', [])),
                ', '.join(session_data.get('unanswered_questions', [])),
                str(len(session_data.get('messages', []))),
                session_data.get('session_id', '')
            ]
            
            # TODO: Implement actual Google Sheets API call
            # For now, just log the data
            logger.info(f"Would log to sheet: {row_data}")
            
            # In a full implementation, you would use google-api-python-client here
            # This requires OAuth setup which is complex for this MVP
            # For now, we'll store in MongoDB and provide export functionality
            
            return True
        except Exception as e:
            logger.error(f"Error logging to sheets: {e}")
            return False

# Global instance
sheets_service = SheetsService()
