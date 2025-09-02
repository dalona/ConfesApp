#!/usr/bin/env python3
"""
Focused test for Priest Registration System in ConfesApp
Tests the two main priest registration workflows:
1. Bishop Invitation System
2. Direct Priest Application System
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://faith-connect-34.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class PriestRegistrationTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.bishop_token = None
        self.bishop_user = None
        self.diocese_id = "a81d2bd3-c2e2-42ac-b4e7-66b44e4ad358"  # From seed data
        self.seed_invite_token = "ebe0d53471a55634e1e8b0652f19ac1f1a69eac876285928b1ba54d3873f83da"  # From seed data
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def make_request(self, method, endpoint, data=None, token=None):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        headers = self.headers.copy()
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=10)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=10)
            elif method == "PATCH":
                response = requests.patch(url, headers=headers, json=data, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {e}", "ERROR")
            return None

    def test_bishop_login(self):
        """Test bishop login with seed data"""
        self.log("Testing bishop login...")
        
        login_data = {
            "email": "obispo@diocesis.com",
            "password": "Pass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.bishop_token = data["access_token"]
                self.bishop_user = data["user"]
                self.log(f"✅ Bishop login successful: {self.bishop_user['email']}")
                return True
            else:
                self.log(f"❌ Bishop login failed: Missing token or user data", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Bishop login failed: {error_msg}", "ERROR")
            return False

    def test_bishop_create_invitation(self):
        """Test bishop creating priest invitation"""
        if not self.bishop_token:
            self.log("❌ Cannot test invitation creation: No bishop token", "ERROR")
            return False
            
        self.log("Testing bishop creating priest invitation...")
        
        invite_data = {
            "email": f"nuevo.sacerdote.{int(time.time())}@parroquia.com",
            "role": "priest",
            "dioceseId": self.diocese_id,
            "message": "Te invitamos a unirte como sacerdote a nuestra diócesis"
        }
        
        response = self.make_request("POST", "/invites", invite_data, self.bishop_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id") and data.get("token"):
                self.log(f"✅ Invitation created successfully: {data['email']}")
                self.log(f"   Token: {data['token'][:20]}...")
                return True
            else:
                self.log(f"❌ Invitation creation failed: Missing ID or token", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Invitation creation failed: {error_msg}", "ERROR")
            return False

    def test_validate_invitation_token(self):
        """Test validating invitation token"""
        self.log("Testing invitation token validation...")
        
        response = self.make_request("GET", f"/invites/by-token/{self.seed_invite_token}")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("email") and data.get("role"):
                self.log(f"✅ Invitation token validated: {data['email']} as {data['role']}")
                return True
            else:
                self.log(f"❌ Token validation failed: Missing email or role", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Token validation failed: {error_msg}", "ERROR")
            return False

    def test_register_from_invitation(self):
        """Test priest registration from invitation"""
        self.log("Testing priest registration from invitation...")
        
        register_data = {
            "password": "SacerdoteInvitado123",
            "firstName": "Padre Invitado",
            "lastName": "González",
            "phone": "+34 666 777 888",
            "bio": "Sacerdote con 10 años de experiencia",
            "specialties": "Confesión, Matrimonios",
            "languages": "Español, Inglés"
        }
        
        response = self.make_request("POST", f"/auth/register-from-invite/{self.seed_invite_token}", register_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.log(f"✅ Priest registered from invitation: {data['user']['email']}")
                self.log(f"   User is active: {data['user']['isActive']}")
                return True
            else:
                self.log(f"❌ Registration from invite failed: Missing token or user", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Registration from invite failed: {error_msg}", "ERROR")
            return False

    def test_direct_priest_application(self):
        """Test direct priest application"""
        self.log("Testing direct priest application...")
        
        priest_data = {
            "email": f"padre.directo.{int(time.time())}@ejemplo.com",
            "password": "PadreDirecto123",
            "firstName": "Padre Directo",
            "lastName": "Martínez",
            "phone": "+34 555 666 777",
            "dioceseId": self.diocese_id,
            "bio": "Sacerdote recién ordenado buscando parroquia",
            "specialties": "Juventud, Catequesis",
            "languages": "Español"
        }
        
        response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("success") and data.get("user"):
                self.log(f"✅ Direct priest application successful: {data['user']['email']}")
                self.log(f"   User is active: {data['user']['isActive']} (should be false)")
                self.log(f"   Can confess: {data['user'].get('canConfess', 'N/A')} (should be false)")
                return data["user"]
            else:
                self.log(f"❌ Direct priest application failed: Missing success or user", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Direct priest application failed: {error_msg}", "ERROR")
            return False

    def test_bishop_approve_priest(self, priest_user):
        """Test bishop approving pending priest"""
        if not self.bishop_token:
            self.log("❌ Cannot test priest approval: No bishop token", "ERROR")
            return False
            
        if not priest_user:
            self.log("❌ Cannot test priest approval: No priest user", "ERROR")
            return False
            
        self.log("Testing bishop approving pending priest...")
        
        approval_data = {
            "approved": True
        }
        
        response = self.make_request("PATCH", f"/auth/approve-priest/{priest_user['id']}", approval_data, self.bishop_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log("✅ Priest approval successful")
                return True
            else:
                self.log(f"❌ Priest approval failed: No success flag", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest approval failed: {error_msg}", "ERROR")
            return False

    def test_bishop_reject_priest(self):
        """Test bishop rejecting pending priest"""
        if not self.bishop_token:
            self.log("❌ Cannot test priest rejection: No bishop token", "ERROR")
            return False
            
        self.log("Testing bishop rejecting pending priest...")
        
        # Create another direct application for rejection test
        priest_data = {
            "email": f"padre.rechazo.{int(time.time())}@ejemplo.com",
            "password": "PadreRechazo123",
            "firstName": "Padre Rechazo",
            "lastName": "Test",
            "phone": "+34 999 888 777",
            "dioceseId": self.diocese_id,
        }
        
        # Create the priest application
        reg_response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if not reg_response or reg_response.status_code != 201:
            self.log("❌ Cannot create priest for rejection test", "ERROR")
            return False
            
        reject_user = reg_response.json().get("user")
        if not reject_user:
            self.log("❌ No user data for rejection test", "ERROR")
            return False
        
        # Now reject the priest
        rejection_data = {
            "approved": False
        }
        
        response = self.make_request("PATCH", f"/auth/approve-priest/{reject_user['id']}", rejection_data, self.bishop_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log("✅ Priest rejection successful")
                return True
            else:
                self.log(f"❌ Priest rejection failed: No success flag", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest rejection failed: {error_msg}", "ERROR")
            return False

    def test_email_uniqueness_validation(self):
        """Test email uniqueness validation"""
        self.log("Testing email uniqueness validation...")
        
        # Try to register with an existing email
        existing_email = "obispo@diocesis.com"  # Bishop's email from seed
        
        priest_data = {
            "email": existing_email,
            "password": "TestPassword123",
            "firstName": "Test",
            "lastName": "User",
            "phone": "+34 123 123 123",
            "dioceseId": self.diocese_id,
        }
        
        response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if response and response.status_code == 401:  # Unauthorized for existing user
            self.log("✅ Email uniqueness validation working")
            return True
        else:
            status = response.status_code if response else "No response"
            self.log(f"❌ Email uniqueness validation failed: Expected 401, got {status}", "ERROR")
            return False

    def run_priest_registration_tests(self):
        """Run all priest registration tests"""
        self.log("🚀 Starting Priest Registration System Tests")
        self.log("=" * 60)
        
        tests = [
            ("Bishop Login", self.test_bishop_login),
            ("Bishop Create Invitation", self.test_bishop_create_invitation),
            ("Validate Invitation Token", self.test_validate_invitation_token),
            ("Register from Invitation", self.test_register_from_invitation),
            ("Direct Priest Application", self.test_direct_priest_application),
            ("Email Uniqueness Validation", self.test_email_uniqueness_validation),
            ("Bishop Reject Priest", self.test_bishop_reject_priest),
        ]
        
        passed = 0
        failed = 0
        pending_priest = None
        
        for test_name, test_func in tests:
            self.log(f"\n--- Running: {test_name} ---")
            try:
                if test_name == "Direct Priest Application":
                    result = test_func()
                    if result:
                        pending_priest = result
                        passed += 1
                    else:
                        failed += 1
                else:
                    if test_func():
                        passed += 1
                    else:
                        failed += 1
            except Exception as e:
                self.log(f"❌ {test_name} failed with exception: {e}", "ERROR")
                failed += 1
        
        # Test bishop approval with the pending priest
        if pending_priest:
            self.log(f"\n--- Running: Bishop Approve Priest ---")
            try:
                if self.test_bishop_approve_priest(pending_priest):
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log(f"❌ Bishop Approve Priest failed with exception: {e}", "ERROR")
                failed += 1
        else:
            self.log(f"\n--- Skipping: Bishop Approve Priest (no pending priest) ---")
            failed += 1
                
        self.log("\n" + "=" * 60)
        self.log(f"🏁 Priest Registration Testing Complete!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        return passed, failed

if __name__ == "__main__":
    tester = PriestRegistrationTester()
    passed, failed = tester.run_priest_registration_tests()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)