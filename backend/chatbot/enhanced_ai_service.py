from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import logging
from typing import Dict, List, Optional, Tuple
from .knowledge_base import knowledge_base
import re

logger = logging.getLogger(__name__)

class EnhancedAIService:
    """
    Enhanced AI service with:
    - Intent detection
    - Sentiment analysis
    - Context-aware responses
    - Smart closure logic
    """
    
    def __init__(self):
        self.api_key = None
        logger.info("Enhanced AI Service initialized")
    
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
        api_key = self._get_api_key()
        chat = LlmChat(
            api_key=api_key,
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
        conversation_history: List[Dict],
        show_closure: bool = False
    ) -> Dict:
        """Generate intelligent AI response with context awareness"""
        try:
            # If closure requested, show it
            if show_closure:
                return self._generate_closure_message(user_info)
            
            # Analyze conversation context
            context_analysis = self._analyze_conversation_context(
                user_message, 
                conversation_history,
                user_info
            )
            
            # Check if we need to collect info based on context
            if context_analysis['needs_contact_collection']:
                return self._generate_contact_request(context_analysis, user_info)
            
            # If we need basic info collection (name/email/phone progression)
            needs_info, info_type = self._check_needs_info(user_info, user_message)
            if needs_info:
                return {
                    "response": self._get_info_collection_prompt(info_type, user_info),
                    "needs_info": True,
                    "is_answered": False,
                    "info_complete": False,
                    "intent": "info_collection"
                }
            
            # Search knowledge base
            context_results = knowledge_base.query(user_message)
            context = "\n".join(context_results) if context_results else ""
            
            # Generate contextual response
            response = await self._generate_contextual_response(
                session_id,
                user_message,
                context,
                conversation_history,
                context_analysis
            )
            
            # Analyze if question was answered
            is_answered = self._is_question_answered(response, context)
            
            # Check if we should ask for satisfaction
            should_check_satisfaction = (
                len(conversation_history) >= 4 and 
                is_answered and 
                not user_info.get('satisfaction_checked')
            )
            
            return {
                "response": response,
                "needs_info": False,
                "is_answered": is_answered,
                "has_context": bool(context),
                "info_complete": all([user_info.get('name'), user_info.get('email'), user_info.get('phone')]),
                "intent": context_analysis['intent'],
                "sentiment": context_analysis['sentiment'],
                "should_check_satisfaction": should_check_satisfaction
            }
            
        except Exception as e:
            logger.error(f"Error in enhanced AI service: {e}")
            # Fallback to basic response
            return {
                "response": "I apologize, but I'm having trouble processing your request right now. Could you rephrase your question, or would you like me to connect you with our team directly?",
                "needs_info": False,
                "is_answered": False,
                "info_complete": False,
                "intent": "unknown"
            }
    
    def _analyze_conversation_context(
        self, 
        current_message: str, 
        history: List[Dict],
        user_info: Dict
    ) -> Dict:
        """Analyze conversation to determine intent, sentiment, and needs"""
        message_lower = current_message.lower()
        
        # Detect intent
        intent = self._detect_intent(current_message, history)
        
        # Detect sentiment
        sentiment = self._detect_sentiment(current_message)
        
        # Check if user seems frustrated or lost
        frustrated_signals = [
            'i don\'t understand', 'confused', 'not helpful', 
            'not what i asked', 'this doesn\'t help'
        ]
        is_frustrated = any(signal in message_lower for signal in frustrated_signals)
        
        # Check if user indicates they can't find answer
        cant_find_answer = any(phrase in message_lower for phrase in [
            'can\'t find', 'don\'t see', 'where is', 'how do i find',
            'i need help', 'struggling with'
        ])
        
        # Determine if we should collect contact info
        needs_contact_collection = (
            is_frustrated or 
            cant_find_answer or
            intent == 'specific_problem' and len(history) >= 3
        )
        
        return {
            'intent': intent,
            'sentiment': sentiment,
            'is_frustrated': is_frustrated,
            'needs_contact_collection': needs_contact_collection,
            'conversation_depth': len(history)
        }
    
    def _detect_intent(self, message: str, history: List[Dict]) -> str:
        """
        Detect user intent:
        - exploring: Just browsing, asking general questions
        - specific_problem: Has a specific problem to solve
        - ready_to_convert: Ready to engage, wants details
        """
        message_lower = message.lower()
        
        # Exploring signals
        exploring_keywords = ['what is', 'tell me about', 'how does', 'what are', 'explain']
        if any(kw in message_lower for kw in exploring_keywords) and len(history) < 3:
            return 'exploring'
        
        # Specific problem signals
        problem_keywords = [
            'we are struggling', 'we need', 'we have a problem', 'challenge',
            'difficult', 'manual', 'time-consuming', 'inefficient'
        ]
        if any(kw in message_lower for kw in problem_keywords):
            return 'specific_problem'
        
        # Ready to convert signals
        convert_keywords = [
            'pricing', 'cost', 'how much', 'timeline', 'when can',
            'get started', 'sign up', 'demo', 'trial'
        ]
        if any(kw in message_lower for kw in convert_keywords):
            return 'ready_to_convert'
        
        # Default based on conversation depth
        if len(history) >= 4:
            return 'ready_to_convert'
        
        return 'exploring'
    
    def _detect_sentiment(self, message: str) -> str:
        """
        Detect sentiment:
        - satisfied: User is happy with responses
        - neutral: No clear emotional signals
        - frustrated: User is confused or unhappy
        """
        message_lower = message.lower()
        
        # Satisfied signals
        satisfied_keywords = [
            'great', 'perfect', 'exactly', 'thank you', 'thanks',
            'helpful', 'that helps', 'good', 'excellent'
        ]
        if any(kw in message_lower for kw in satisfied_keywords):
            return 'satisfied'
        
        # Frustrated signals
        frustrated_keywords = [
            'confused', 'not sure', 'don\'t understand', 'not helpful',
            'still don\'t', 'i give up'
        ]
        if any(kw in message_lower for kw in frustrated_keywords):
            return 'frustrated'
        
        return 'neutral'
    
    async def _generate_contextual_response(
        self,
        session_id: str,
        user_message: str,
        context: str,
        history: List[Dict],
        context_analysis: Dict
    ) -> str:
        """Generate response based on context and conversation state"""
        
        # Build conversation summary for context
        recent_topics = self._extract_recent_topics(history)
        
        # Create enhanced system message
        system_message = f"""You are an intelligent AI assistant representing Zentiam, an AI consulting company. 

**Your Role:** Help visitors understand how we can solve their problems with AI solutions.

**Speaking Style:**
- Speak as "we" and "our" (you ARE part of Zentiam team)
- Be conversational, warm, and helpful
- Show understanding of their problem
- Ask clarifying questions when needed
- Be specific with examples and numbers when available

**Conversation Context:**
- User Intent: {context_analysis['intent']}
- User Sentiment: {context_analysis['sentiment']}
- Recent Topics: {recent_topics}
- Conversation Depth: {context_analysis['conversation_depth']} exchanges

**Knowledge Base Context:**
{context if context else "No specific context found - use general knowledge about AI consulting"}

**Guidelines:**
1. If user has a specific problem: Show empathy, relate it to similar cases we've solved
2. If user is exploring: Provide helpful overview, ask what interests them most
3. If user is ready to convert: Share concrete details, suggest next steps
4. Always relate answers to BUSINESS VALUE (ROI, time savings, efficiency)
5. Cite specific numbers when available (3.7x ROI, 40% productivity, etc.)
6. If unsure about something, admit it and offer to connect with our team

**Example Responses:**

User: "Can AI help with data entry?"
Good: "Absolutely! We've helped clients automate 70-80% of their data entry work using AI. For example, we recently helped a logistics company reduce their invoice processing time from 2 hours to 15 minutes per batch. This typically involves OCR, intelligent extraction, and validation. What type of data entry are you dealing with?"

User: "We're struggling with customer support volume"
Good: "I hear you - high support volume is challenging. We've helped several companies scale their support using AI chatbots and smart routing. One e-commerce client reduced response time by 60% while handling 3x more tickets. The key is combining AI automation for common queries with smart escalation to humans for complex issues. What's your current support setup like?"

Remember: Your goal is to be genuinely helpful first, and naturally guide towards engagement when it makes sense."""

        chat = self.create_chat(session_id, system_message)
        response = await chat.send_message(UserMessage(text=user_message))
        
        # Add satisfaction check if needed
        if context_analysis['conversation_depth'] >= 4 and context_analysis['sentiment'] != 'frustrated':
            response += "\n\nIs this helpful? Or would you like me to explore a different angle?"
        
        return response
    
    def _extract_recent_topics(self, history: List[Dict]) -> str:
        """Extract main topics from recent conversation"""
        if not history:
            return "New conversation"
        
        # Get last 4 messages
        recent = history[-4:] if len(history) >= 4 else history
        topics = [msg.get('message', '')[:50] for msg in recent if msg.get('role') == 'user']
        return ", ".join(topics) if topics else "General inquiry"
    
    def _generate_contact_request(self, context: Dict, user_info: Dict) -> Dict:
        """Generate smart contact collection request based on context"""
        if context['is_frustrated']:
            message = "I sense this might be getting complex. Let me connect you with our team who can give you personalized guidance. Could you share your name and email so they can reach out within 24 hours?"
        elif context['intent'] == 'specific_problem':
            message = "This sounds like something our team should review directly with you. They can provide a tailored solution for your specific situation. May I get your name and email so they can prepare a custom assessment?"
        else:
            message = "To give you the most accurate information for your situation, our team should discuss this with you directly. Could you share your name and email? They'll reach out within 24 hours."
        
        return {
            "response": message,
            "needs_info": True,
            "is_answered": False,
            "info_complete": False,
            "intent": context['intent']
        }
    
    def _generate_closure_message(self, user_info: Dict) -> Dict:
        """Generate comprehensive closure message with options"""
        name = user_info.get('name', 'there')
        email = user_info.get('email', 'your email')
        phone = user_info.get('phone', 'your phone')
        
        closure_message = f"""Perfect! Thank you, {name}. I've noted down your details.

**What happens next:**
✓ Our team will review your inquiry
✓ You'll hear from us at {email} or {phone} within 24 hours
✓ We'll prepare specific recommendations for your situation

**Or, you can take immediate action:**
→ Submit a detailed request via our [contact form](/contact)
→ Book a 30-minute consultation directly
→ Take our AI Assessment to get instant insights

Feel free to ask me anything else in the meantime! I'm here to help."""
        
        return {
            "response": closure_message,
            "needs_info": False,
            "is_answered": True,
            "info_complete": True,
            "intent": "closure"
        }
    
    def _check_needs_info(self, user_info: Dict, message: str) -> Tuple[bool, Optional[str]]:
        """Check if we need to collect user information"""
        # If we have all info, no need to collect
        if user_info.get('name') and user_info.get('email') and user_info.get('phone'):
            return False, None
        
        # Check if message naturally contains info
        has_email = '@' in message
        has_phone_pattern = re.search(r'\d{10,}', message.replace(' ', '').replace('-', ''))
        
        if not user_info.get('name') and not has_email and not has_phone_pattern:
            return True, "name"
        
        if not user_info.get('email'):
            return True, "email"
        
        if not user_info.get('phone'):
            return True, "phone"
        
        return False, None
    
    def _get_info_collection_prompt(self, info_type: str, user_info: Dict) -> str:
        """Get natural prompt for collecting user info"""
        if info_type == "name":
            return "I'd love to help you better! May I know your name?"
        elif info_type == "email":
            return "Thanks! If you'd like our team to follow up with detailed information, could you share your email address?"
        elif info_type == "phone":
            return "Great! And if you'd like a quick call from our team, what's the best number to reach you? (Optional - you can skip this if you prefer email)"
        return ""
    
    def _is_question_answered(self, response: str, context: str) -> bool:
        """Determine if question was adequately answered"""
        if context and len(response) > 100:
            uncertain_phrases = [
                "i don't have", "i'm not sure", "i don't know", 
                "not certain", "unable to", "can't find"
            ]
            response_lower = response.lower()
            return not any(phrase in response_lower for phrase in uncertain_phrases)
        return len(response) > 80

# Global instance
enhanced_ai_service = EnhancedAIService()
