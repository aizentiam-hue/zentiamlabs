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
BACKEND_URL = "https://zentiam-rebrand-1.preview.emergentagent.com/api"

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