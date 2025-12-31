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