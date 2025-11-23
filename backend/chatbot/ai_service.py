from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import logging
from typing import Dict, List, Optional
from .knowledge_base import knowledge_base
import re

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = None
        logger.info("AI Service initialized")
    
    def _get_api_key(self):
        if not self.api_key:
            from dotenv import load_dotenv
            load_dotenv()
            self.api_key = os.environ.get('EMERGENT_LLM_KEY')
            if not self.api_key:
                raise ValueError("EMERGENT_LLM_KEY not found in environment")
        return self.api_key
    
    def create_chat(self, session_id: str, system_message: str) -> LlmChat:
        """Create a new chat instance"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        )
        chat.with_model("openai", "gpt-4o")
        return chat
    
    async def generate_response(
        self,
        session_id: str,
        user_message: str,
        user_info: Dict,
        conversation_history: List[Dict]
    ) -> Dict:
        """Generate AI response with RAG"""
        try:
            # Check if we need to collect user info
            needs_info, info_type = self._check_needs_info(user_info, user_message)
            
            if needs_info:
                return {
                    "response": self._get_info_collection_prompt(info_type, user_info),
                    "needs_info": True,
                    "info_type": info_type
                }
            
            # Query knowledge base for relevant context
            relevant_docs = knowledge_base.query(user_message, n_results=3)
            context = "\n\n".join(relevant_docs) if relevant_docs else ""
            
            # Build system message with context
            system_message = f"""You are Zentiam's AI assistant, helping visitors learn about our AI consulting and automation services.

IMPORTANT CONTEXT FROM ZENTIAM WEBSITE:
{context}

Your role:
1. Answer questions about Zentiam's services, products, and AI consulting expertise
2. Be helpful, professional, and conversational
3. If asked about something not in the context, politely say you don't have that specific information but offer to connect them with the team
4. Keep responses concise and engaging
5. Use the context provided to give accurate, specific answers

User Information:
Name: {user_info.get('name', 'Not provided')}
Email: {user_info.get('email', 'Not provided')}
Phone: {user_info.get('phone', 'Not provided')}
"""
            
            # Create chat instance
            chat = self.create_chat(session_id, system_message)
            
            # Send message
            user_msg = UserMessage(text=user_message)
            response = await chat.send_message(user_msg)
            
            # Classify if question was answered
            is_answered = self._is_question_answered(response, context)
            
            return {
                "response": response,
                "needs_info": False,
                "is_answered": is_answered,
                "has_context": bool(context)
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {
                "response": "I apologize, but I'm having trouble processing your request right now. Please try again or contact us directly at contact@zentiam.com.",
                "needs_info": False,
                "is_answered": False
            }
    
    def _check_needs_info(self, user_info: Dict, message: str) -> tuple:
        """Check if we need to collect user information"""
        # If we have all info, no need to collect
        if user_info.get('name') and user_info.get('email') and user_info.get('phone'):
            return False, None
        
        # Check message for natural info sharing
        name_pattern = r"(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)"
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        phone_pattern = r"\+?\d[\d\s\-\(\)]{8,}\d"
        
        if not user_info.get('name'):
            name_match = re.search(name_pattern, message, re.IGNORECASE)
            if not name_match and len(message.split()) < 10:
                # After 2-3 messages, naturally ask for name
                return True, "name"
        
        if not user_info.get('email'):
            email_match = re.search(email_pattern, message)
            if not email_match and user_info.get('name'):
                return True, "email"
        
        if not user_info.get('phone'):
            phone_match = re.search(phone_pattern, message)
            if not phone_match and user_info.get('email'):
                return True, "phone"
        
        return False, None
    
    def _get_info_collection_prompt(self, info_type: str, user_info: Dict) -> str:
        """Get natural prompt for collecting user info"""
        if info_type == "name":
            return "I'd love to help you! By the way, may I know your name so I can assist you better?"
        elif info_type == "email":
            return f"Thanks for chatting with me! If you'd like me to send you more information or have our team follow up, could you share your email address?"
        elif info_type == "phone":
            return "Great! And if you'd like a quick call from our team, what's the best number to reach you?"
        return ""
    
    def _is_question_answered(self, response: str, context: str) -> bool:
        """Determine if the question was adequately answered"""
        # Simple heuristic: if we had context and response is substantial, likely answered
        if context and len(response) > 50:
            uncertain_phrases = ["i don't have", "i'm not sure", "i don't know", "not certain"]
            response_lower = response.lower()
            return not any(phrase in response_lower for phrase in uncertain_phrases)
        return False

# Global instance
ai_service = AIService()
