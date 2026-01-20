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
    - Warm, humane conversation style
    - Intent detection
    - Sentiment analysis
    - Context-aware responses
    - Conversation memory
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
            
            # Extract conversation memory (key points mentioned)
            conversation_memory = self._extract_conversation_memory(conversation_history)
            
            # Check for greeting - respond warmly
            if self._is_greeting(user_message) and len(conversation_history) == 0:
                return self._generate_greeting_response(user_info)
            
            # Check if user is expressing frustration
            if context_analysis['is_frustrated']:
                return await self._generate_empathy_response(
                    session_id, user_message, conversation_history, context_analysis
                )
            
            # Check if user is asking to speak to a human
            if self._wants_human(user_message):
                return self._generate_handoff_response(user_info)
            
            # IMPORTANT: ALWAYS help first, collect info later
            # The bot should provide value BEFORE asking for contact details
            
            # Check for explicit contact requests
            contact_request_phrases = ['contact me', 'call me', 'reach out', 'get in touch', 'send me info', 'get back to me']
            explicit_contact_request = any(phrase in user_message.lower() for phrase in contact_request_phrases)
            
            # Business/service related keywords - if ANY of these are present, answer first
            business_keywords = [
                'help', 'need', 'looking for', 'want', 'can you', 'how', 'what', 'why', 'when',
                'service', 'services', 'offering', 'offerings', 'product', 'products',
                'price', 'pricing', 'cost', 'consultation', 'consult',
                'ai', 'automation', 'solution', 'solutions', 'tell me', 'know more',
                'about', 'information', 'info', 'details', 'explain', 'describe',
                'do you', 'can i', 'could you', 'would you', 'interested',
                'demo', 'trial', 'learn', 'understand', 'provide', 'offer'
            ]
            
            message_lower = user_message.lower()
            
            # Check if this message contains a question or business request that needs answering
            is_business_query = (
                '?' in user_message or  # Direct question
                context_analysis['intent'] in ['specific_problem', 'ready_to_convert', 'exploring'] or
                any(kw in message_lower for kw in business_keywords)
            )
            
            # If it's a business query, ALWAYS answer first (unless explicit contact request)
            if is_business_query and not explicit_contact_request:
            if is_business_query and not explicit_contact_request:
                # Answer the query first
                context_results = knowledge_base.query(user_message)
                context = "\n".join(context_results) if context_results else ""
                
                response = await self._generate_contextual_response(
                    session_id,
                    user_message,
                    context,
                    conversation_history,
                    context_analysis,
                    conversation_memory,
                    user_info
                )
                
                # Only ask for info if we've had enough exchanges (at least 3)
                # and user seems engaged
                should_ask_info = (
                    context_analysis['conversation_depth'] >= 3 and
                    not user_info.get('name')
                )
                
                if should_ask_info:
                    needs_info, info_type = self._check_needs_info(user_info, user_message)
                    if needs_info:
                        info_prompt = self._get_info_collection_prompt(info_type, user_info, conversation_memory)
                        response = response + "\n\n" + info_prompt
                        return {
                            "response": response,
                            "needs_info": True,
                            "is_answered": True,
                            "info_complete": False,
                            "intent": context_analysis['intent']
                        }
                
                return {
                    "response": response,
                    "needs_info": False,
                    "is_answered": True,
                    "has_context": bool(context),
                    "info_complete": False,
                    "intent": context_analysis['intent'],
                    "sentiment": context_analysis['sentiment']
                }
            
            # If explicit contact request, ask for info
            if explicit_contact_request:
                needs_info, info_type = self._check_needs_info(user_info, user_message)
                if needs_info:
                    return {
                        "response": self._get_info_collection_prompt(info_type, user_info, conversation_memory),
                        "needs_info": True,
                        "is_answered": False,
                        "info_complete": False,
                        "intent": "info_collection"
                    }
            
            # DEFAULT BEHAVIOR: Always generate a helpful response
            # This is the catch-all - if we reach here, just be helpful
            context_results = knowledge_base.query(user_message)
            context = "\n".join(context_results) if context_results else ""
            
            response = await self._generate_contextual_response(
                session_id,
                user_message,
                context,
                conversation_history,
                context_analysis,
                conversation_memory,
                user_info
            )
            
            # Analyze if question was answered
            is_answered = self._is_question_answered(response, context)
            
            return {
                "response": response,
                "needs_info": False,
                "is_answered": is_answered,
                "has_context": bool(context),
                "info_complete": all([user_info.get('name'), user_info.get('email'), user_info.get('phone')]),
                "intent": context_analysis['intent'],
                "sentiment": context_analysis['sentiment']
            }
            
        except Exception as e:
            logger.error(f"Error in enhanced AI service: {e}")
            return {
                "response": "I apologize, I'm having a moment of difficulty here. Could you rephrase that, or would you prefer I connect you with our team directly? They're always happy to help!",
                "needs_info": False,
                "is_answered": False,
                "info_complete": False,
                "intent": "unknown"
            }
    
    def _is_greeting(self, message: str) -> bool:
        """Check if message is a greeting"""
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy']
        message_lower = message.lower().strip()
        # Check if it's primarily a greeting (short message)
        return any(message_lower.startswith(g) or message_lower == g for g in greetings) and len(message.split()) <= 5
    
    def _wants_human(self, message: str) -> bool:
        """Check if user wants to speak to a human"""
        human_phrases = [
            'speak to a human', 'talk to a person', 'real person', 'human agent',
            'speak to someone', 'talk to someone', 'customer service', 'representative',
            'speak with a human', 'talk with a person', 'actual person'
        ]
        return any(phrase in message.lower() for phrase in human_phrases)
    
    def _generate_greeting_response(self, user_info: Dict) -> Dict:
        """Generate a warm, friendly greeting"""
        name = user_info.get('name', '')
        
        if name:
            greeting = f"Hey {name}! Great to have you back. 😊 How can I help you today?"
        else:
            greeting = """Hey there! Welcome to Zentiam! 👋

I'm your AI assistant, and I'm here to help you explore how AI can transform your business. Whether you're curious about automation, looking to solve a specific challenge, or just exploring what's possible – I've got you covered.

What brings you here today?"""
        
        return {
            "response": greeting,
            "needs_info": False,
            "is_answered": True,
            "info_complete": False,
            "intent": "greeting"
        }
    
    def _generate_handoff_response(self, user_info: Dict) -> Dict:
        """Generate response for human handoff request"""
        name = user_info.get('name', '')
        
        response = f"""Absolutely{', ' + name if name else ''}! I completely understand wanting to speak with someone directly.

Here are your options:
📧 **Email us:** ai.zentiam@gmail.com
📞 **Call us:** +91 80889-83706
📝 **Or** leave your details and our team will reach out within 24 hours

What works best for you?"""
        
        return {
            "response": response,
            "needs_info": False,
            "is_answered": True,
            "info_complete": False,
            "intent": "handoff"
        }
    
    async def _generate_empathy_response(
        self,
        session_id: str,
        user_message: str,
        history: List[Dict],
        context_analysis: Dict
    ) -> Dict:
        """Generate an empathetic response when user is frustrated"""
        
        system_message = """You are a warm, empathetic AI assistant for Zentiam. The user seems frustrated or confused.

Your goal is to:
1. Acknowledge their frustration genuinely
2. Apologize if we haven't been helpful
3. Try a different approach or offer alternatives
4. Keep it brief and focused

Speak naturally, like a helpful friend. Use "we" and "our" as you're part of the Zentiam team.

DO NOT:
- Be defensive
- Repeat the same information
- Use corporate speak
- Be overly formal"""

        chat = self.create_chat(session_id + "_empathy", system_message)
        response = await chat.send_message(UserMessage(text=f"User says: {user_message}\n\nRespond with empathy and try to help differently."))
        
        return {
            "response": response,
            "needs_info": False,
            "is_answered": False,
            "info_complete": False,
            "intent": "empathy",
            "sentiment": "frustrated"
        }
    
    def _extract_conversation_memory(self, history: List[Dict]) -> Dict:
        """Extract key information mentioned in conversation"""
        memory = {
            "user_industry": None,
            "user_company_size": None,
            "user_challenges": [],
            "topics_discussed": [],
            "questions_asked": [],
            "user_interests": []
        }
        
        if not history:
            return memory
        
        for msg in history:
            if msg.get('sender') == 'user':
                text = msg.get('message', '').lower()
                
                # Detect industry mentions
                industries = {
                    'healthcare': ['healthcare', 'medical', 'hospital', 'clinic', 'patient'],
                    'finance': ['finance', 'banking', 'financial', 'investment', 'trading'],
                    'retail': ['retail', 'ecommerce', 'e-commerce', 'store', 'shopping'],
                    'manufacturing': ['manufacturing', 'factory', 'production', 'assembly'],
                    'logistics': ['logistics', 'shipping', 'supply chain', 'warehouse'],
                    'technology': ['tech', 'software', 'saas', 'startup', 'app']
                }
                for industry, keywords in industries.items():
                    if any(kw in text for kw in keywords):
                        memory['user_industry'] = industry
                        break
                
                # Detect challenges
                challenge_keywords = ['struggling', 'challenge', 'problem', 'issue', 'difficult', 'pain point', 'bottleneck']
                if any(kw in text for kw in challenge_keywords):
                    memory['user_challenges'].append(text[:100])
                
                # Detect topics of interest
                if 'pricing' in text or 'cost' in text:
                    memory['topics_discussed'].append('pricing')
                if 'automation' in text:
                    memory['topics_discussed'].append('automation')
                if 'chatbot' in text or 'chat bot' in text:
                    memory['topics_discussed'].append('chatbots')
                if 'data' in text and ('analysis' in text or 'analytics' in text):
                    memory['topics_discussed'].append('data analytics')
        
        # Remove duplicates
        memory['topics_discussed'] = list(set(memory['topics_discussed']))
        
        return memory
    
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
            'not what i asked', 'this doesn\'t help', 'you\'re not listening',
            'that\'s not right', 'wrong', 'useless', 'frustrating'
        ]
        is_frustrated = any(signal in message_lower for signal in frustrated_signals)
        
        # Determine if we should collect contact info
        needs_contact_collection = (
            is_frustrated and len(history) >= 2
        )
        
        return {
            'intent': intent,
            'sentiment': sentiment,
            'is_frustrated': is_frustrated,
            'needs_contact_collection': needs_contact_collection,
            'conversation_depth': len(history)
        }
    
    def _detect_intent(self, message: str, history: List[Dict]) -> str:
        """Detect user intent"""
        message_lower = message.lower()
        
        # Exploring signals
        exploring_keywords = ['what is', 'tell me about', 'how does', 'what are', 'explain', 'can you tell me']
        if any(kw in message_lower for kw in exploring_keywords) and len(history) < 3:
            return 'exploring'
        
        # Specific problem signals
        problem_keywords = [
            'we are struggling', 'we need', 'we have a problem', 'challenge',
            'difficult', 'manual', 'time-consuming', 'inefficient', 'help us with',
            'looking for a solution', 'need to automate', 'want to improve'
        ]
        if any(kw in message_lower for kw in problem_keywords):
            return 'specific_problem'
        
        # Ready to convert signals
        convert_keywords = [
            'pricing', 'cost', 'how much', 'timeline', 'when can',
            'get started', 'sign up', 'demo', 'trial', 'next steps',
            'schedule', 'book', 'consultation'
        ]
        if any(kw in message_lower for kw in convert_keywords):
            return 'ready_to_convert'
        
        # Default based on conversation depth
        if len(history) >= 4:
            return 'engaged'
        
        return 'exploring'
    
    def _detect_sentiment(self, message: str) -> str:
        """Detect sentiment"""
        message_lower = message.lower()
        
        # Positive signals
        positive_keywords = [
            'great', 'perfect', 'exactly', 'thank you', 'thanks',
            'helpful', 'that helps', 'good', 'excellent', 'awesome',
            'love it', 'sounds good', 'interesting', 'amazing'
        ]
        if any(kw in message_lower for kw in positive_keywords):
            return 'positive'
        
        # Negative signals
        negative_keywords = [
            'confused', 'not sure', 'don\'t understand', 'not helpful',
            'still don\'t', 'doesn\'t make sense', 'unclear', 'frustrated'
        ]
        if any(kw in message_lower for kw in negative_keywords):
            return 'negative'
        
        return 'neutral'
    
    async def _generate_contextual_response(
        self,
        session_id: str,
        user_message: str,
        context: str,
        history: List[Dict],
        context_analysis: Dict,
        conversation_memory: Dict,
        user_info: Dict
    ) -> str:
        """Generate response based on context and conversation state"""
        
        # Build personalization elements
        user_name = user_info.get('name', '')
        industry_context = ""
        if conversation_memory.get('user_industry'):
            industry_context = f"The user is in the {conversation_memory['user_industry']} industry."
        
        topics_context = ""
        if conversation_memory.get('topics_discussed'):
            topics_context = f"Previously discussed: {', '.join(conversation_memory['topics_discussed'])}"
        
        # Create enhanced system message
        system_message = f"""You are a friendly, knowledgeable AI assistant for Zentiam, an AI consulting company based in Bangalore, India.

**YOUR PERSONALITY:**
- Warm, approachable, and genuinely helpful
- Confident but not arrogant
- You speak naturally, like a smart friend who happens to know a lot about AI
- You use "we" and "our" because you're part of the Zentiam team
- You occasionally use emojis sparingly to add warmth (1-2 per message max)

**CONVERSATION CONTEXT:**
- User Name: {user_name if user_name else 'Not yet shared'}
- User Intent: {context_analysis['intent']}
- User Mood: {context_analysis['sentiment']}
- Conversation Depth: {context_analysis['conversation_depth']} messages
{industry_context}
{topics_context}

**KNOWLEDGE BASE INFO:**
{context if context else "No specific info found - use your general knowledge about AI consulting."}

**RESPONSE GUIDELINES:**

1. **Be Conversational:** Write like you're chatting, not lecturing. Use contractions (we're, you'll, it's).

2. **Show You're Listening:** Reference what they said. If they mentioned a challenge, acknowledge it specifically.

3. **Be Specific:** Instead of "AI can help with many things," say "AI can cut your invoice processing time by 70%."

4. **Ask Smart Questions:** End with a relevant follow-up question to keep the conversation flowing.

5. **Keep it Scannable:** Use short paragraphs. One idea per paragraph. Bullet points for lists.

6. **Match Their Energy:** 
   - If they're excited → be enthusiastic
   - If they're skeptical → be factual and measured
   - If they're confused → be patient and clear

**WHAT TO AVOID:**
- Long walls of text
- Corporate jargon
- Being pushy about sales
- Repeating the same information
- Generic responses that could apply to anyone

**EXAMPLE TONE:**

User: "Can AI help with customer support?"

Good Response:
"Definitely! 🎯 Customer support is actually one of the areas where we see the biggest wins.

A few things AI can do:
• Handle common questions instantly (think FAQs, order status, etc.)
• Route complex issues to the right team member
• Provide 24/7 coverage without burning out your team

One of our retail clients reduced their response time from 4 hours to under 5 minutes for 60% of tickets.

What's your current support setup like? Are you mainly dealing with high volume, or more complex technical queries?"

Remember: Be helpful first. Sales happen naturally when you genuinely help people."""

        chat = self.create_chat(session_id, system_message)
        response = await chat.send_message(UserMessage(text=user_message))
        
        return response
    
    def _generate_contact_request(self, context: Dict, user_info: Dict) -> Dict:
        """Generate smart contact collection request based on context"""
        if context['is_frustrated']:
            message = """I can see this is getting complex, and I want to make sure you get the help you need. 

Would it be okay if our team reached out to you directly? They can dive deeper into your specific situation. Just need your name and email, and someone will be in touch within 24 hours. 🤝"""
        elif context['intent'] == 'specific_problem':
            message = """This sounds like something our team should take a closer look at! We've solved similar challenges before and can probably give you some specific recommendations.

Mind sharing your name and email? One of our consultants can reach out with some tailored suggestions."""
        else:
            message = """I'd love to get you connected with our team for more detailed information. 

Could you share your name and email? They'll reach out within 24 hours with exactly what you need. 📧"""
        
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
        email = user_info.get('email', '')
        phone = user_info.get('phone', '')
        
        # Build contact method string
        contact_methods = []
        if email:
            contact_methods.append(f"**{email}**")
        if phone and phone != 'skipped':
            contact_methods.append(f"**{phone}**")
        
        contact_str = " or ".join(contact_methods) if contact_methods else "your provided contact"
        
        closure_message = f"""Awesome, {name}! ✨ I've got all your details.

**Here's what happens next:**
→ Our team will review your inquiry
→ You'll hear from us at {contact_str} within 24 hours
→ We'll come prepared with specific recommendations for you

**In the meantime:**
Feel free to keep chatting with me if you have more questions! I'm here to help.

Or if you'd like to explore on your own:
• Check out our [Services](/services) page
• Browse our [AI Products](/products)
• Read some [case studies](/about) on our About page

Thanks for reaching out – we're excited to help! 🚀"""
        
        return {
            "response": closure_message,
            "needs_info": False,
            "is_answered": True,
            "info_complete": True,
            "intent": "closure"
        }
    
    def _check_needs_info(self, user_info: Dict, message: str) -> Tuple[bool, Optional[str]]:
        """Check if we need to collect user information"""
        # If phone is marked as skipped, treat it as collected
        phone_collected = user_info.get('phone') and user_info.get('phone') != ""
        
        # If we have all info (including skipped phone), no need to collect
        if user_info.get('name') and user_info.get('email') and phone_collected:
            return False, None
        
        # Check if user is declining to provide info
        decline_phrases = [
            "don't want to", "dont want to", "no thanks", "skip", 
            "i'd rather not", "id rather not", "prefer not to",
            "not share", "not comfortable", "pass on that", "no phone",
            "rather not", "don't have", "dont have", "no number"
        ]
        message_lower = message.lower()
        is_declining = any(phrase in message_lower for phrase in decline_phrases)
        
        # Check if message naturally contains info
        has_email = '@' in message
        has_phone_pattern = re.search(r'\d{10,}', message.replace(' ', '').replace('-', ''))
        
        if not user_info.get('name') and not has_email and not has_phone_pattern and not is_declining:
            return True, "name"
        
        if not user_info.get('email') and not is_declining:
            return True, "email"
        
        # Phone is optional - if user declines, skip it completely
        if not phone_collected and not is_declining:
            return True, "phone"
        
        return False, None
    
    def _get_info_collection_prompt(self, info_type: str, user_info: Dict, memory: Dict) -> str:
        """Get natural prompt for collecting user info"""
        # Add personalization based on conversation memory
        industry = memory.get('user_industry', '')
        
        if info_type == "name":
            return "By the way, I'd love to know who I'm chatting with! What's your name? 😊"
        elif info_type == "email":
            name = user_info.get('name', '')
            if name:
                return f"Thanks, {name}! If you'd like our team to follow up with some personalized recommendations, what's the best email to reach you?"
            return "Great! What's the best email for our team to reach you with more details?"
        elif info_type == "phone":
            name = user_info.get('name', '')
            prefix = f"Perfect, {name}!" if name else "Great!"
            return f"{prefix} And if you'd prefer a quick call instead of email, what's your number? (Totally optional – just skip if you prefer email)"
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
