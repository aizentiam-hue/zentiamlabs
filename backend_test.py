#!/usr/bin/env python3
"""
Backend API Testing for Zentiam Website
Tests all backend endpoints for functionality and data persistence
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from environment
BACKEND_URL = "https://chat-name-extract.preview.emergentagent.com/api"

def test_consultation_form():
    """Test POST /api/contact/consultation endpoint"""
    print("\n=== Testing Consultation Form Submission ===")
    
    # Test data
    test_data = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@techcorp.com",
        "company": "TechCorp Solutions",
        "phone": "+1-555-0123",
        "service": "AI Strategy Consulting",
        "message": "We are looking to implement AI solutions in our customer service department. We need guidance on the best approach and technologies to use for our specific use case."
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/contact/consultation", json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("submission_id"):
                print("✅ Consultation form submission: SUCCESS")
                print(f"   - Success: {data['success']}")
                print(f"   - Submission ID: {data['submission_id']}")
                print(f"   - Message: {data['message']}")
                return True, data['submission_id']
            else:
                print("❌ Consultation form submission: FAILED - Missing required fields in response")
                return False, None
        else:
            print(f"❌ Consultation form submission: FAILED - HTTP {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Consultation form submission: ERROR - {str(e)}")
        return False, None

def test_newsletter_subscription():
    """Test POST /api/newsletter/subscribe endpoint"""
    print("\n=== Testing Newsletter Subscription ===")
    
    # Test with unique email
    unique_email = f"test.user.{uuid.uuid4().hex[:8]}@example.com"
    test_data = {
        "email": unique_email
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/newsletter/subscribe", json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print("✅ Newsletter subscription: SUCCESS")
                print(f"   - Success: {data['success']}")
                print(f"   - Message: {data['message']}")
                
                # Test duplicate subscription
                print("\n--- Testing Duplicate Email Handling ---")
                response2 = requests.post(f"{BACKEND_URL}/newsletter/subscribe", json=test_data)
                if response2.status_code == 200:
                    data2 = response2.json()
                    if data2.get("success"):
                        print("✅ Duplicate email handling: SUCCESS")
                        print(f"   - Message: {data2['message']}")
                        return True
                    else:
                        print("❌ Duplicate email handling: FAILED - Success not true")
                        return False
                else:
                    print(f"❌ Duplicate email handling: FAILED - HTTP {response2.status_code}")
                    return False
            else:
                print("❌ Newsletter subscription: FAILED - Success not true")
                return False
        else:
            print(f"❌ Newsletter subscription: FAILED - HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Newsletter subscription: ERROR - {str(e)}")
        return False

def test_admin_dashboard():
    """Test GET /api/admin/dashboard endpoint"""
    print("\n=== Testing Admin Dashboard ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/admin/dashboard")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["total_consultations", "total_subscribers", "total_chat_sessions"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if not missing_fields:
                print("✅ Admin dashboard: SUCCESS")
                print(f"   - Total Consultations: {data['total_consultations']}")
                print(f"   - Total Subscribers: {data['total_subscribers']}")
                print(f"   - Total Chat Sessions: {data['total_chat_sessions']}")
                if "recent_activity" in data:
                    print(f"   - Recent Activity: {data['recent_activity']}")
                return True
            else:
                print(f"❌ Admin dashboard: FAILED - Missing fields: {missing_fields}")
                return False
        else:
            print(f"❌ Admin dashboard: FAILED - HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin dashboard: ERROR - {str(e)}")
        return False

def test_get_consultations():
    """Test GET /api/contact/consultations endpoint"""
    print("\n=== Testing Get Consultations (Admin) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact/consultations")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if "consultations" in data and "count" in data:
                print("✅ Get consultations: SUCCESS")
                print(f"   - Count: {data['count']}")
                print(f"   - Consultations returned: {len(data['consultations'])}")
                if data['consultations']:
                    print(f"   - Sample consultation fields: {list(data['consultations'][0].keys())}")
                return True
            else:
                print("❌ Get consultations: FAILED - Missing consultations or count field")
                return False
        else:
            print(f"❌ Get consultations: FAILED - HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get consultations: ERROR - {str(e)}")
        return False

def test_get_newsletter_subscribers():
    """Test GET /api/contact/newsletter/subscribers endpoint"""
    print("\n=== Testing Get Newsletter Subscribers (Admin) ===")
    
    try:
        response = requests.get(f"{BACKEND_URL}/contact/newsletter/subscribers")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if "subscribers" in data and "count" in data:
                print("✅ Get newsletter subscribers: SUCCESS")
                print(f"   - Count: {data['count']}")
                print(f"   - Subscribers returned: {len(data['subscribers'])}")
                if data['subscribers']:
                    print(f"   - Sample subscriber fields: {list(data['subscribers'][0].keys())}")
                return True
            else:
                print("❌ Get newsletter subscribers: FAILED - Missing subscribers or count field")
                return False
        else:
            print(f"❌ Get newsletter subscribers: FAILED - HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get newsletter subscribers: ERROR - {str(e)}")
        return False

def test_chatbot_name_extraction():
    """Test chatbot name extraction functionality with specific scenarios"""
    print("\n=== Testing Chatbot Name Extraction Fix ===")
    
    results = []
    
    # Test 1: Negative Cases (should NOT extract a name)
    print("\n--- Testing Negative Cases (should NOT extract name) ---")
    negative_cases = [
        "I need help",
        "Hello, looking for information about AI services",
        "Can you help me with pricing?",
        "What services do you offer?",
        "I am looking for assistance"
    ]
    
    for message in negative_cases:
        success = test_single_message_name_extraction(message, expected_name=None)
        results.append((f"Negative: '{message}'", success))
    
    # Test 2: Explicit Name Patterns (should extract name)
    print("\n--- Testing Explicit Name Patterns (should extract name) ---")
    explicit_cases = [
        ("My name is Sarah and I need help", "Sarah"),
        ("I'm John Smith", "John Smith"),
        ("This is Michael", "Michael"),
        ("Call me Emily", "Emily")
    ]
    
    for message, expected_name in explicit_cases:
        success = test_single_message_name_extraction(message, expected_name=expected_name)
        results.append((f"Explicit: '{message}'", success))
    
    # Test 3: Bot-Prompted Flow (most important)
    print("\n--- Testing Bot-Prompted Flow ---")
    success = test_bot_prompted_flow()
    results.append(("Bot-Prompted Flow", success))
    
    # Test 4: Full Conversation Flow
    print("\n--- Testing Full Conversation Flow ---")
    success = test_full_conversation_flow()
    results.append(("Full Conversation Flow", success))
    
    # Summary for chatbot tests
    print("\n" + "=" * 50)
    print("📊 CHATBOT NAME EXTRACTION TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\nChatbot Results: {passed}/{total} tests passed")
    return passed == total

def test_single_message_name_extraction(message, expected_name=None):
    """Test name extraction for a single message"""
    try:
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Send message
        chat_data = {
            "session_id": session_id,
            "message": message
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Chat failed for '{message}': {chat_response.status_code}")
            return False
        
        # Get session to check extracted name
        session_details = requests.get(f"{BACKEND_URL}/chatbot/session/{session_id}")
        if session_details.status_code != 200:
            print(f"❌ Failed to get session details: {session_details.status_code}")
            return False
        
        session_data = session_details.json()
        extracted_name = session_data.get("user_name")
        
        if expected_name is None:
            # Should NOT extract a name
            if extracted_name is None:
                print(f"✅ Correctly did NOT extract name from: '{message}'")
                return True
            else:
                print(f"❌ Incorrectly extracted name '{extracted_name}' from: '{message}'")
                return False
        else:
            # Should extract the expected name
            if extracted_name == expected_name:
                print(f"✅ Correctly extracted name '{extracted_name}' from: '{message}'")
                return True
            else:
                print(f"❌ Expected '{expected_name}' but got '{extracted_name}' from: '{message}'")
                return False
                
    except Exception as e:
        print(f"❌ Error testing message '{message}': {str(e)}")
        return False

def test_bot_prompted_flow():
    """Test the bot-prompted flow where bot asks for name"""
    try:
        print("Testing bot-prompted flow...")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Step 1: Start with generic message
        chat_data = {
            "session_id": session_id,
            "message": "Hello, I need help"
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Initial chat failed: {chat_response.status_code}")
            return False
        
        bot_response = chat_response.json()["response"]
        print(f"Bot response to 'Hello, I need help': {bot_response}")
        
        # Check if bot asks for name
        name_ask_indicators = ["name", "may i know", "what is your name", "who am i speaking"]
        bot_asked_for_name = any(indicator in bot_response.lower() for indicator in name_ask_indicators)
        
        if not bot_asked_for_name:
            print(f"❌ Bot did not ask for name. Response: {bot_response}")
            return False
        
        print("✅ Bot correctly asked for name")
        
        # Step 2: Respond with just a name
        chat_data = {
            "session_id": session_id,
            "message": "Alex Johnson"
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Name response chat failed: {chat_response.status_code}")
            return False
        
        # Check if name was extracted
        session_details = requests.get(f"{BACKEND_URL}/chatbot/session/{session_id}")
        if session_details.status_code != 200:
            print(f"❌ Failed to get session details: {session_details.status_code}")
            return False
        
        session_data = session_details.json()
        extracted_name = session_data.get("user_name")
        
        if extracted_name == "Alex Johnson":
            print("✅ Bot-prompted flow: Name correctly extracted as 'Alex Johnson'")
            
            # Check if bot now asks for email
            bot_response = chat_response.json()["response"]
            email_ask_indicators = ["email", "email address", "contact"]
            bot_asked_for_email = any(indicator in bot_response.lower() for indicator in email_ask_indicators)
            
            if bot_asked_for_email:
                print("✅ Bot correctly asked for email after getting name")
                return True
            else:
                print(f"❌ Bot did not ask for email. Response: {bot_response}")
                return False
        else:
            print(f"❌ Expected 'Alex Johnson' but got '{extracted_name}'")
            return False
            
    except Exception as e:
        print(f"❌ Error in bot-prompted flow test: {str(e)}")
        return False

def test_full_conversation_flow():
    """Test complete conversation flow: greeting → name → email → phone → closure"""
    try:
        print("Testing full conversation flow...")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Step 1: Greeting
        messages = [
            ("Hello, I need help with AI consulting", None),
            ("Sarah Martinez", "Sarah Martinez"),
            ("sarah.martinez@example.com", "sarah.martinez@example.com"),
            ("555-123-4567", "555-123-4567")
        ]
        
        for i, (message, expected_value) in enumerate(messages):
            chat_data = {
                "session_id": session_id,
                "message": message
            }
            
            chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
            if chat_response.status_code != 200:
                print(f"❌ Chat failed at step {i+1}: {chat_response.status_code}")
                return False
            
            bot_response = chat_response.json()["response"]
            print(f"Step {i+1} - User: '{message}' → Bot: '{bot_response[:100]}...'")
            
            # For the last message (phone), check if we get closure message
            if i == 3:  # Phone number step
                closure_indicators = ["thank you", "noted", "reach out", "24 hours", "sarah martinez"]
                has_closure = any(indicator in bot_response.lower() for indicator in closure_indicators)
                
                if has_closure:
                    print("✅ Full conversation flow: Closure message correctly mentions user's name")
                    return True
                else:
                    print(f"❌ Closure message doesn't contain expected elements: {bot_response}")
                    return False
        
        return False
        
    except Exception as e:
        print(f"❌ Error in full conversation flow test: {str(e)}")
        return False

def test_admin_portal_verification():
    """Test admin portal to verify chat sessions appear with correct names"""
    print("\n=== Testing Admin Portal Chat Sessions ===")
    
    try:
        # Get chat sessions from admin endpoint
        response = requests.get(f"{BACKEND_URL}/chatbot/sessions")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            sessions = data.get("sessions", [])
            
            print(f"Found {len(sessions)} chat sessions")
            
            # Look for sessions with names captured
            sessions_with_names = [s for s in sessions if s.get("user_name")]
            
            if sessions_with_names:
                print("✅ Admin portal verification: Sessions with names found")
                for session in sessions_with_names[:3]:  # Show first 3
                    name = session.get("user_name", "No name")
                    email = session.get("user_email", "No email")
                    message_count = len(session.get("messages", []))
                    print(f"   - Name: {name}, Email: {email}, Messages: {message_count}")
                return True
            else:
                print("❌ No sessions with captured names found")
                return False
        else:
            print(f"❌ Admin portal verification failed: HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin portal verification error: {str(e)}")
        return False

def test_phone_number_decline_fix():
    """Test phone number decline fix - specific test for the review request"""
    print("\n=== Testing Phone Number Decline Fix ===")
    
    decline_phrases = [
        "I dont want to share that",
        "skip", 
        "no thanks",
        "I prefer not to"
    ]
    
    results = []
    
    for phrase in decline_phrases:
        print(f"\n--- Testing decline phrase: '{phrase}' ---")
        success = test_single_phone_decline_scenario(phrase)
        results.append((f"Decline with '{phrase}'", success))
    
    # Summary for phone decline tests
    print("\n" + "=" * 50)
    print("📊 PHONE NUMBER DECLINE TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\nPhone Decline Results: {passed}/{total} tests passed")
    return passed == total

def test_single_phone_decline_scenario(decline_phrase):
    """Test a single phone number decline scenario"""
    try:
        print(f"Testing phone decline with phrase: '{decline_phrase}'")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        print(f"Created session: {session_id}")
        
        # Step 1: Start conversation
        messages = [
            "Hello",
            "Test User",  # Name
            "test@example.com",  # Email
            decline_phrase  # Decline phone
        ]
        
        bot_responses = []
        
        for i, message in enumerate(messages):
            chat_data = {
                "session_id": session_id,
                "message": message
            }
            
            chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
            if chat_response.status_code != 200:
                print(f"❌ Chat failed at step {i+1}: {chat_response.status_code}")
                print(f"Response: {chat_response.text}")
                return False
            
            bot_response = chat_response.json()["response"]
            bot_responses.append(bot_response)
            print(f"Step {i+1} - User: '{message}' → Bot: '{bot_response[:100]}...'")
            
            # After declining phone (step 4), check for immediate closure
            if i == 3:  # Phone decline step
                # Check if bot provides closure message
                closure_indicators = [
                    "perfect", "thank you", "noted", "details", "test user",
                    "reach out", "24 hours", "contact", "team"
                ]
                
                has_closure = any(indicator in bot_response.lower() for indicator in closure_indicators)
                
                if not has_closure:
                    print(f"❌ No closure message after declining phone. Bot response: {bot_response}")
                    return False
                
                # Check that bot mentions the user's name
                if "test user" not in bot_response.lower():
                    print(f"❌ Closure message doesn't mention user's name. Response: {bot_response}")
                    return False
                
                print("✅ Bot provided proper closure message with user's name")
        
        # Verify session state
        session_details = requests.get(f"{BACKEND_URL}/chatbot/session/{session_id}")
        if session_details.status_code != 200:
            print(f"❌ Failed to get session details: {session_details.status_code}")
            return False
        
        session_data = session_details.json()
        
        # Check session state
        expected_name = "Test User"
        expected_email = "test@example.com"
        expected_phone = "skipped"
        expected_info_collected = True
        
        actual_name = session_data.get("user_name")
        actual_email = session_data.get("user_email")
        actual_phone = session_data.get("user_phone")
        actual_info_collected = session_data.get("info_collected")
        
        print(f"Session state - Name: {actual_name}, Email: {actual_email}, Phone: {actual_phone}, Info Collected: {actual_info_collected}")
        
        # Verify all expected values
        if actual_name != expected_name:
            print(f"❌ Expected name '{expected_name}' but got '{actual_name}'")
            return False
        
        if actual_email != expected_email:
            print(f"❌ Expected email '{expected_email}' but got '{actual_email}'")
            return False
        
        if actual_phone != expected_phone:
            print(f"❌ Expected phone '{expected_phone}' but got '{actual_phone}'")
            return False
        
        if actual_info_collected != expected_info_collected:
            print(f"❌ Expected info_collected '{expected_info_collected}' but got '{actual_info_collected}'")
            return False
        
        # Test that bot doesn't ask for phone again
        print("\n--- Testing that bot doesn't ask for phone again ---")
        follow_up_data = {
            "session_id": session_id,
            "message": "What services do you offer?"
        }
        
        follow_up_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=follow_up_data)
        if follow_up_response.status_code != 200:
            print(f"❌ Follow-up chat failed: {follow_up_response.status_code}")
            return False
        
        follow_up_bot_response = follow_up_response.json()["response"]
        print(f"Follow-up - User: 'What services do you offer?' → Bot: '{follow_up_bot_response[:100]}...'")
        
        # Check that bot doesn't ask for phone again
        phone_ask_indicators = ["phone", "number", "contact number", "phone number"]
        asks_for_phone_again = any(indicator in follow_up_bot_response.lower() for indicator in phone_ask_indicators)
        
        if asks_for_phone_again:
            print(f"❌ Bot asked for phone again after decline: {follow_up_bot_response}")
            return False
        
        print("✅ Bot correctly did NOT ask for phone number again")
        print(f"✅ Phone decline scenario with '{decline_phrase}' PASSED")
        return True
        
    except Exception as e:
        print(f"❌ Error testing phone decline with '{decline_phrase}': {str(e)}")
        return False

def test_chatbot_conversational_quality():
    """Test improved chatbot conversational quality as per review request"""
    print("\n=== Testing Chatbot Conversational Quality Improvements ===")
    
    results = []
    
    # Test 1: Greeting Test
    print("\n--- Test 1: Greeting Test ---")
    success = test_greeting_response()
    results.append(("Greeting Test", success))
    
    # Test 2: Question Answering (Help First)
    print("\n--- Test 2: Question Answering (Help First) ---")
    success = test_question_answering_help_first()
    results.append(("Question Answering (Help First)", success))
    
    # Test 3: Industry Context
    print("\n--- Test 3: Industry Context ---")
    success = test_industry_context_response()
    results.append(("Industry Context", success))
    
    # Test 4: Pricing Query
    print("\n--- Test 4: Pricing Query ---")
    success = test_pricing_query_response()
    results.append(("Pricing Query", success))
    
    # Test 5: Full Flow Test
    print("\n--- Test 5: Full Flow Test ---")
    success = test_full_conversational_flow()
    results.append(("Full Flow Test", success))
    
    # Summary for conversational quality tests
    print("\n" + "=" * 50)
    print("📊 CHATBOT CONVERSATIONAL QUALITY TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\nConversational Quality Results: {passed}/{total} tests passed")
    return passed == total

def test_greeting_response():
    """Test greeting with 'Hello' or 'Hi' - should get warm, friendly greeting with emoji"""
    try:
        greetings = ["Hello", "Hi"]
        
        for greeting in greetings:
            print(f"Testing greeting: '{greeting}'")
            
            # Create session
            session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
            if session_response.status_code != 200:
                print(f"❌ Failed to create session: {session_response.status_code}")
                return False
            
            session_id = session_response.json()["session_id"]
            
            # Send greeting
            chat_data = {
                "session_id": session_id,
                "message": greeting
            }
            
            chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
            if chat_response.status_code != 200:
                print(f"❌ Chat failed for '{greeting}': {chat_response.status_code}")
                return False
            
            bot_response = chat_response.json()["response"]
            print(f"Bot response to '{greeting}': {bot_response}")
            
            # Check for warm, friendly greeting indicators
            friendly_indicators = [
                "hi", "hello", "welcome", "great", "wonderful", "help", "assist"
            ]
            
            # Check for emoji presence (basic check for common emojis)
            emoji_indicators = ["👋", "😊", "🤖", "✨", "💡", "🚀", "!"]
            
            # Check for inviting question
            question_indicators = ["?", "how can", "what can", "help you", "assist you"]
            
            has_friendly_tone = any(indicator in bot_response.lower() for indicator in friendly_indicators)
            has_emoji_or_enthusiasm = any(indicator in bot_response for indicator in emoji_indicators)
            has_inviting_question = any(indicator in bot_response.lower() for indicator in question_indicators)
            
            print(f"   - Friendly tone: {has_friendly_tone}")
            print(f"   - Emoji/enthusiasm: {has_emoji_or_enthusiasm}")
            print(f"   - Inviting question: {has_inviting_question}")
            
            if not (has_friendly_tone and has_emoji_or_enthusiasm and has_inviting_question):
                print(f"❌ Greeting response lacks warmth or invitation for '{greeting}'")
                return False
            
            print(f"✅ Greeting response is warm and inviting for '{greeting}'")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing greeting response: {str(e)}")
        return False

def test_question_answering_help_first():
    """Test that bot answers questions first, doesn't ask for name immediately"""
    try:
        question = "Can AI help with inventory management?"
        print(f"Testing question: '{question}'")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Send question
        chat_data = {
            "session_id": session_id,
            "message": question
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Chat failed for question: {chat_response.status_code}")
            return False
        
        bot_response = chat_response.json()["response"]
        print(f"Bot response to question: {bot_response}")
        
        # Check that bot ANSWERS the question (mentions AI, inventory, management, solutions)
        answer_indicators = [
            "ai", "artificial intelligence", "inventory", "management", "solution", 
            "help", "assist", "optimize", "automation", "system", "we offer", "our"
        ]
        
        # Check that bot does NOT immediately ask for name
        name_ask_indicators = [
            "what is your name", "may i know your name", "what's your name", 
            "could you tell me your name", "name please"
        ]
        
        provides_answer = any(indicator in bot_response.lower() for indicator in answer_indicators)
        asks_for_name_immediately = any(indicator in bot_response.lower() for indicator in name_ask_indicators)
        
        print(f"   - Provides answer about AI/inventory: {provides_answer}")
        print(f"   - Asks for name immediately: {asks_for_name_immediately}")
        
        if not provides_answer:
            print("❌ Bot did not answer the question about AI and inventory management")
            return False
        
        if asks_for_name_immediately:
            print("❌ Bot asked for name immediately instead of answering question first")
            return False
        
        print("✅ Bot correctly answered question first without asking for name immediately")
        return True
        
    except Exception as e:
        print(f"❌ Error testing question answering: {str(e)}")
        return False

def test_industry_context_response():
    """Test industry-specific response for logistics company"""
    try:
        industry_question = "We're a logistics company struggling with route optimization. Can you help?"
        print(f"Testing industry question: '{industry_question}'")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Send industry question
        chat_data = {
            "session_id": session_id,
            "message": industry_question
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Chat failed for industry question: {chat_response.status_code}")
            return False
        
        bot_response = chat_response.json()["response"]
        print(f"Bot response to industry question: {bot_response}")
        
        # Check for specific, relevant response about logistics/AI
        logistics_indicators = [
            "logistics", "route", "optimization", "delivery", "transportation", 
            "supply chain", "fleet", "efficiency", "cost", "time"
        ]
        
        # Check for conversational tone (first person)
        conversational_indicators = ["we", "our", "us", "i can", "we can", "we offer"]
        
        # Check for AI solution mentions
        ai_solution_indicators = [
            "ai", "artificial intelligence", "machine learning", "algorithm", 
            "optimization", "solution", "technology", "automation"
        ]
        
        mentions_logistics = any(indicator in bot_response.lower() for indicator in logistics_indicators)
        uses_conversational_tone = any(indicator in bot_response.lower() for indicator in conversational_indicators)
        mentions_ai_solutions = any(indicator in bot_response.lower() for indicator in ai_solution_indicators)
        
        print(f"   - Mentions logistics/route optimization: {mentions_logistics}")
        print(f"   - Uses conversational tone (we/our): {uses_conversational_tone}")
        print(f"   - Mentions AI solutions: {mentions_ai_solutions}")
        
        if not mentions_logistics:
            print("❌ Bot response doesn't address logistics/route optimization specifically")
            return False
        
        if not uses_conversational_tone:
            print("❌ Bot response doesn't use conversational first-person tone")
            return False
        
        if not mentions_ai_solutions:
            print("❌ Bot response doesn't mention AI solutions")
            return False
        
        print("✅ Bot provided specific, relevant response about logistics with conversational tone")
        return True
        
    except Exception as e:
        print(f"❌ Error testing industry context response: {str(e)}")
        return False

def test_pricing_query_response():
    """Test pricing query - should be helpful, not evasive"""
    try:
        pricing_question = "What's your pricing?"
        print(f"Testing pricing question: '{pricing_question}'")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Send pricing question
        chat_data = {
            "session_id": session_id,
            "message": pricing_question
        }
        
        chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
        if chat_response.status_code != 200:
            print(f"❌ Chat failed for pricing question: {chat_response.status_code}")
            return False
        
        bot_response = chat_response.json()["response"]
        print(f"Bot response to pricing question: {bot_response}")
        
        # Check for helpful response about pricing (not evasive)
        helpful_indicators = [
            "pricing", "cost", "price", "consultation", "discuss", "depends", 
            "project", "requirements", "custom", "contact", "call", "meeting"
        ]
        
        # Check for evasive responses (should NOT contain these)
        evasive_indicators = [
            "i don't know", "i can't help", "not sure", "unable to", "sorry"
        ]
        
        # Check for follow-up questions or next steps
        followup_indicators = [
            "?", "would you like", "can we", "shall we", "let's", "how about"
        ]
        
        is_helpful = any(indicator in bot_response.lower() for indicator in helpful_indicators)
        is_evasive = any(indicator in bot_response.lower() for indicator in evasive_indicators)
        has_followup = any(indicator in bot_response.lower() for indicator in followup_indicators)
        
        print(f"   - Provides helpful pricing information: {is_helpful}")
        print(f"   - Is evasive: {is_evasive}")
        print(f"   - Has follow-up question: {has_followup}")
        
        if not is_helpful:
            print("❌ Bot response is not helpful about pricing")
            return False
        
        if is_evasive:
            print("❌ Bot response is evasive about pricing")
            return False
        
        print("✅ Bot provided helpful response about pricing")
        return True
        
    except Exception as e:
        print(f"❌ Error testing pricing query response: {str(e)}")
        return False

def test_full_conversational_flow():
    """Test complete conversational flow as specified in review request"""
    try:
        print("Testing full conversational flow...")
        
        # Create session
        session_response = requests.post(f"{BACKEND_URL}/chatbot/session")
        if session_response.status_code != 200:
            print(f"❌ Failed to create session: {session_response.status_code}")
            return False
        
        session_id = session_response.json()["session_id"]
        
        # Step 1: Start with greeting
        messages_and_checks = [
            {
                "message": "Hello",
                "check": "greeting_warmth",
                "description": "Warm greeting with emoji"
            },
            {
                "message": "We need help with AI automation for our business",
                "check": "business_answer",
                "description": "Answer business question first"
            },
            {
                "message": "What's your pricing for AI consulting?",
                "check": "pricing_helpful",
                "description": "Helpful pricing response"
            },
            {
                "message": "My name is Alex Thompson",
                "check": "name_acknowledgment",
                "description": "Acknowledge name and ask for email"
            },
            {
                "message": "alex.thompson@company.com",
                "check": "email_acknowledgment",
                "description": "Acknowledge email and ask for phone"
            },
            {
                "message": "skip",
                "check": "closure_message",
                "description": "Provide closure message with name"
            }
        ]
        
        for i, step in enumerate(messages_and_checks):
            print(f"\nStep {i+1}: {step['description']}")
            print(f"User message: '{step['message']}'")
            
            chat_data = {
                "session_id": session_id,
                "message": step["message"]
            }
            
            chat_response = requests.post(f"{BACKEND_URL}/chatbot/chat", json=chat_data)
            if chat_response.status_code != 200:
                print(f"❌ Chat failed at step {i+1}: {chat_response.status_code}")
                return False
            
            bot_response = chat_response.json()["response"]
            print(f"Bot response: {bot_response[:150]}...")
            
            # Check specific requirements for each step
            if step["check"] == "greeting_warmth":
                if not any(indicator in bot_response.lower() for indicator in ["hi", "hello", "welcome"]):
                    print("❌ Greeting lacks warmth")
                    return False
                if not any(indicator in bot_response for indicator in ["👋", "😊", "!", "?"]):
                    print("❌ Greeting lacks emoji or enthusiasm")
                    return False
                    
            elif step["check"] == "business_answer":
                if not any(indicator in bot_response.lower() for indicator in ["ai", "automation", "help", "assist", "we"]):
                    print("❌ Doesn't answer business question")
                    return False
                    
            elif step["check"] == "pricing_helpful":
                if not any(indicator in bot_response.lower() for indicator in ["pricing", "cost", "consultation", "discuss"]):
                    print("❌ Pricing response not helpful")
                    return False
                    
            elif step["check"] == "name_acknowledgment":
                if "alex" not in bot_response.lower():
                    print("❌ Doesn't acknowledge name")
                    return False
                if not any(indicator in bot_response.lower() for indicator in ["email", "contact"]):
                    print("❌ Doesn't ask for email after name")
                    return False
                    
            elif step["check"] == "email_acknowledgment":
                if not any(indicator in bot_response.lower() for indicator in ["phone", "number"]):
                    print("❌ Doesn't ask for phone after email")
                    return False
                    
            elif step["check"] == "closure_message":
                if "alex" not in bot_response.lower():
                    print("❌ Closure doesn't mention user's name")
                    return False
                if not any(indicator in bot_response.lower() for indicator in ["thank", "noted", "reach out", "24 hours"]):
                    print("❌ Closure message incomplete")
                    return False
            
            print(f"✅ Step {i+1} passed: {step['description']}")
        
        print("✅ Full conversational flow completed successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error testing full conversational flow: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Zentiam Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    results = []
    
    # Test 1: Consultation Form
    success, submission_id = test_consultation_form()
    results.append(("Consultation Form Submission", success))
    
    # Test 2: Newsletter Subscription
    success = test_newsletter_subscription()
    results.append(("Newsletter Subscription", success))
    
    # Test 3: Admin Dashboard
    success = test_admin_dashboard()
    results.append(("Admin Dashboard", success))
    
    # Test 4: Get Consultations
    success = test_get_consultations()
    results.append(("Get Consultations (Admin)", success))
    
    # Test 5: Get Newsletter Subscribers
    success = test_get_newsletter_subscribers()
    results.append(("Get Newsletter Subscribers (Admin)", success))
    
    # Test 6: Chatbot Name Extraction (NEW)
    success = test_chatbot_name_extraction()
    results.append(("Chatbot Name Extraction Fix", success))
    
    # Test 7: Admin Portal Verification (NEW)
    success = test_admin_portal_verification()
    results.append(("Admin Portal Chat Sessions", success))
    
    # Test 8: Phone Number Decline Fix (SPECIFIC TEST FOR REVIEW REQUEST)
    success = test_phone_number_decline_fix()
    results.append(("Phone Number Decline Fix", success))
    
    # Test 9: Chatbot Conversational Quality (NEW - MAIN FOCUS OF REVIEW REQUEST)
    success = test_chatbot_conversational_quality()
    results.append(("Chatbot Conversational Quality", success))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())