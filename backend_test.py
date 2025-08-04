#!/usr/bin/env python3
"""
ConfesApp Backend API Testing Suite
Tests the NestJS backend for Catholic confession booking system
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://d98cf1e5-6d97-43a9-8e67-9bb17d31c003.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ConfesAppTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.priest_token = None
        self.faithful_token = None
        self.priest_user = None
        self.faithful_user = None
        self.test_slot_id = None
        self.test_confession_id = None
        
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
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method == "PATCH":
                response = requests.patch(url, headers=headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {e}", "ERROR")
            return None
            
    def test_health_check(self):
        """Test basic health endpoint"""
        self.log("Testing health check endpoint...")
        response = self.make_request("GET", "/health")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok":
                self.log("✅ Health check passed")
                return True
            else:
                self.log(f"❌ Health check failed: {data}", "ERROR")
                return False
        else:
            self.log(f"❌ Health check failed with status: {response.status_code if response else 'No response'}", "ERROR")
            return False
            
    def test_priest_registration(self):
        """Test priest user registration"""
        self.log("Testing priest registration...")
        
        priest_data = {
            "email": f"padre.miguel.{int(time.time())}@parroquia.com",
            "password": "MigracionDivina123",
            "firstName": "Padre Miguel",
            "lastName": "González",
            "role": "priest",
            "phone": "+34612345678"
        }
        
        response = self.make_request("POST", "/auth/register", priest_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.priest_token = data["access_token"]
                self.priest_user = data["user"]
                self.log(f"✅ Priest registration successful: {self.priest_user['email']}")
                return True
            else:
                self.log(f"❌ Priest registration failed: Missing token or user data", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest registration failed: {error_msg}", "ERROR")
            return False
            
    def test_faithful_registration(self):
        """Test faithful user registration"""
        self.log("Testing faithful registration...")
        
        faithful_data = {
            "email": f"maria.santos.{int(time.time())}@gmail.com",
            "password": "AveMaria123",
            "firstName": "María",
            "lastName": "Santos",
            "role": "faithful",
            "phone": "+34687654321"
        }
        
        response = self.make_request("POST", "/auth/register", faithful_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.faithful_token = data["access_token"]
                self.faithful_user = data["user"]
                self.log(f"✅ Faithful registration successful: {self.faithful_user['email']}")
                return True
            else:
                self.log(f"❌ Faithful registration failed: Missing token or user data", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful registration failed: {error_msg}", "ERROR")
            return False
            
    def test_priest_login(self):
        """Test priest login"""
        if not self.priest_user:
            self.log("❌ Cannot test priest login: No priest user registered", "ERROR")
            return False
            
        self.log("Testing priest login...")
        
        login_data = {
            "email": self.priest_user["email"],
            "password": "MigracionDivina123"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token"):
                self.log("✅ Priest login successful")
                return True
            else:
                self.log(f"❌ Priest login failed: No access token", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest login failed: {error_msg}", "ERROR")
            return False
            
    def test_faithful_login(self):
        """Test faithful login"""
        if not self.faithful_user:
            self.log("❌ Cannot test faithful login: No faithful user registered", "ERROR")
            return False
            
        self.log("Testing faithful login...")
        
        login_data = {
            "email": self.faithful_user["email"],
            "password": "AveMaria123"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token"):
                self.log("✅ Faithful login successful")
                return True
            else:
                self.log(f"❌ Faithful login failed: No access token", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful login failed: {error_msg}", "ERROR")
            return False
            
    def test_create_confession_slot(self):
        """Test priest creating confession slots"""
        if not self.priest_token:
            self.log("❌ Cannot test slot creation: No priest token", "ERROR")
            return False
            
        self.log("Testing confession slot creation...")
        
        # Create slot for tomorrow
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=16, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        slot_data = {
            "startTime": start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "location": "Confesionario Principal",
            "notes": "Confesión en español",
            "maxBookings": 1
        }
        
        response = self.make_request("POST", "/confession-slots", slot_data, self.priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_slot_id = data["id"]
                self.log(f"✅ Confession slot created successfully: {self.test_slot_id}")
                return True
            else:
                self.log(f"❌ Slot creation failed: No ID returned", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Slot creation failed: {error_msg}", "ERROR")
            return False
            
    def test_get_available_slots(self):
        """Test getting available confession slots (public endpoint)"""
        self.log("Testing available slots retrieval...")
        
        response = self.make_request("GET", "/confession-slots/available")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Available slots retrieved: {len(data)} slots found")
                return True
            else:
                self.log(f"❌ Available slots failed: Expected array, got {type(data)}", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Available slots failed: {error_msg}", "ERROR")
            return False
            
    def test_priest_get_own_slots(self):
        """Test priest getting their own slots"""
        if not self.priest_token:
            self.log("❌ Cannot test priest slots: No priest token", "ERROR")
            return False
            
        self.log("Testing priest getting own slots...")
        
        response = self.make_request("GET", "/confession-slots/my-slots", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Priest slots retrieved: {len(data)} slots found")
                return True
            else:
                self.log(f"❌ Priest slots failed: Expected array, got {type(data)}", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest slots failed: {error_msg}", "ERROR")
            return False
            
    def test_book_confession(self):
        """Test faithful booking a confession"""
        if not self.faithful_token or not self.test_slot_id:
            self.log("❌ Cannot test booking: Missing faithful token or slot ID", "ERROR")
            return False
            
        self.log("Testing confession booking...")
        
        booking_data = {
            "confessionSlotId": self.test_slot_id,
            "notes": "Primera confesión en mucho tiempo",
            "preparationNotes": "He estado preparándome con oración"
        }
        
        response = self.make_request("POST", "/confessions", booking_data, self.faithful_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_confession_id = data["id"]
                self.log(f"✅ Confession booked successfully: {self.test_confession_id}")
                return True
            else:
                self.log(f"❌ Booking failed: No ID returned", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Booking failed: {error_msg}", "ERROR")
            return False
            
    def test_faithful_get_confessions(self):
        """Test faithful getting their confessions"""
        if not self.faithful_token:
            self.log("❌ Cannot test faithful confessions: No faithful token", "ERROR")
            return False
            
        self.log("Testing faithful getting confessions...")
        
        response = self.make_request("GET", "/confessions", token=self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Faithful confessions retrieved: {len(data)} confessions found")
                return True
            else:
                self.log(f"❌ Faithful confessions failed: Expected array, got {type(data)}", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful confessions failed: {error_msg}", "ERROR")
            return False
            
    def test_priest_complete_confession(self):
        """Test priest completing a confession"""
        if not self.priest_token or not self.test_confession_id:
            self.log("❌ Cannot test completion: Missing priest token or confession ID", "ERROR")
            return False
            
        self.log("Testing confession completion...")
        
        response = self.make_request("PATCH", f"/confessions/{self.test_confession_id}/complete", {}, self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "completed":
                self.log("✅ Confession completed successfully")
                return True
            else:
                self.log(f"❌ Completion failed: Status not updated to completed", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Completion failed: {error_msg}", "ERROR")
            return False
            
    def test_role_based_access(self):
        """Test role-based access control"""
        self.log("Testing role-based access control...")
        
        # Test faithful trying to create slot (should fail)
        if self.faithful_token:
            tomorrow = datetime.now() + timedelta(days=1)
            start_time = tomorrow.replace(hour=18, minute=0, second=0, microsecond=0)
            end_time = start_time + timedelta(hours=1)
            
            slot_data = {
                "startTime": start_time.isoformat(),
                "endTime": end_time.isoformat(),
                "location": "Test Location"
            }
            
            response = self.make_request("POST", "/confession-slots", slot_data, self.faithful_token)
            
            if response and response.status_code == 403:
                self.log("✅ Role-based access working: Faithful cannot create slots")
                return True
            else:
                status = response.status_code if response else "No response"
                self.log(f"❌ Role-based access failed: Expected 403, got {status}", "ERROR")
                return False
        else:
            self.log("❌ Cannot test role access: No faithful token", "ERROR")
            return False
            
    def test_cancel_confession(self):
        """Test canceling a confession"""
        # First create a new confession to cancel
        if not self.faithful_token or not self.test_slot_id:
            self.log("❌ Cannot test cancellation: Missing tokens or slot", "ERROR")
            return False
            
        self.log("Testing confession cancellation...")
        
        # Create another slot first
        tomorrow = datetime.now() + timedelta(days=2)
        start_time = tomorrow.replace(hour=17, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        slot_data = {
            "startTime": start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "location": "Confesionario Secundario"
        }
        
        slot_response = self.make_request("POST", "/confession-slots", slot_data, self.priest_token)
        
        if not slot_response or slot_response.status_code != 201:
            self.log("❌ Cannot create slot for cancellation test", "ERROR")
            return False
            
        new_slot_id = slot_response.json()["id"]
        
        # Book the confession
        booking_data = {
            "confessionSlotId": new_slot_id,
            "notes": "Test booking for cancellation"
        }
        
        booking_response = self.make_request("POST", "/confessions", booking_data, self.faithful_token)
        
        if not booking_response or booking_response.status_code != 201:
            self.log("❌ Cannot book confession for cancellation test", "ERROR")
            return False
            
        confession_id = booking_response.json()["id"]
        
        # Now cancel it
        cancel_response = self.make_request("PATCH", f"/confessions/{confession_id}/cancel", {}, self.faithful_token)
        
        if cancel_response and cancel_response.status_code == 200:
            data = cancel_response.json()
            if data.get("status") == "cancelled":
                self.log("✅ Confession cancelled successfully")
                return True
            else:
                self.log(f"❌ Cancellation failed: Status not updated to cancelled", "ERROR")
                return False
        else:
            error_msg = cancel_response.json() if cancel_response else "No response"
            self.log(f"❌ Cancellation failed: {error_msg}", "ERROR")
            return False
            
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting ConfesApp Backend Testing Suite")
        self.log("=" * 60)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Priest Registration", self.test_priest_registration),
            ("Faithful Registration", self.test_faithful_registration),
            ("Priest Login", self.test_priest_login),
            ("Faithful Login", self.test_faithful_login),
            ("Create Confession Slot", self.test_create_confession_slot),
            ("Get Available Slots", self.test_get_available_slots),
            ("Priest Get Own Slots", self.test_priest_get_own_slots),
            ("Book Confession", self.test_book_confession),
            ("Faithful Get Confessions", self.test_faithful_get_confessions),
            ("Complete Confession", self.test_priest_complete_confession),
            ("Role-based Access Control", self.test_role_based_access),
            ("Cancel Confession", self.test_cancel_confession),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            self.log(f"\n--- Running: {test_name} ---")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log(f"❌ {test_name} failed with exception: {e}", "ERROR")
                failed += 1
                
        self.log("\n" + "=" * 60)
        self.log(f"🏁 Testing Complete!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        return passed, failed

if __name__ == "__main__":
    tester = ConfesAppTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)