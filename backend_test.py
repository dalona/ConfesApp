#!/usr/bin/env python3
"""
ConfesApp Backend API Testing Suite - NAVIGATION FEATURES INTEGRATION
Tests the NestJS backend for Catholic confession booking system
Focus: Bishop Dashboard endpoints, Confession history, Role-based access control, and Navigation features
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://confes-scheduler.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ConfesAppTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        # Test users from review request
        self.bishop_token = None
        self.priest_token = None
        self.faithful_token = None
        self.bishop_user = None
        self.priest_user = None
        self.faithful_user = None
        # Test data for navigation features
        self.test_band_id = None
        self.created_band_ids = []
        self.test_confession_id = None
        self.diocese_id = None
        self.parish_ids = []
        # Results tracking
        self.test_results = []
        
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
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {e}", "ERROR")
            return None

    # ===== AUTHENTICATION TESTS FOR ALL ROLES =====

    def test_1_bishop_login(self):
        """Test 1: LOGIN AS BISHOP - obispo@diocesis.com"""
        self.log("👑 Test 1: LOGIN AS BISHOP - obispo@diocesis.com")
        
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
                
                # Verify role is 'bishop'
                if self.bishop_user.get("role") == "bishop":
                    self.log("✅ Bishop login successful with correct role")
                    self.test_results.append(("Bishop Login", True, "Login successful with role: bishop"))
                    return True
                else:
                    self.log(f"❌ Bishop login failed: Wrong role {self.bishop_user.get('role')}", "ERROR")
                    self.test_results.append(("Bishop Login", False, f"Wrong role: {self.bishop_user.get('role')}"))
                    return False
            else:
                self.log("❌ Bishop login failed: Missing token or user data", "ERROR")
                self.test_results.append(("Bishop Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Bishop login failed: {error_msg}", "ERROR")
            self.test_results.append(("Bishop Login", False, str(error_msg)))
            return False

    def test_2_priest_login(self):
        """Test 1: LOGIN AS PRIEST - padre.parroco@sanmiguel.es"""
        self.log("🔐 Test 1: LOGIN AS PRIEST - padre.parroco@sanmiguel.es")
        
        login_data = {
            "email": "padre.parroco@sanmiguel.es",
            "password": "Pass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.priest_token = data["access_token"]
                self.priest_user = data["user"]
                
                # Verify role is 'priest'
                if self.priest_user.get("role") == "priest":
                    self.log("✅ Priest login successful with correct role")
                    self.test_results.append(("Priest Login", True, "Login successful with role: priest"))
                    return True
                else:
                    self.log(f"❌ Priest login failed: Wrong role {self.priest_user.get('role')}", "ERROR")
                    self.test_results.append(("Priest Login", False, f"Wrong role: {self.priest_user.get('role')}"))
                    return False
            else:
                self.log("❌ Priest login failed: Missing token or user data", "ERROR")
                self.test_results.append(("Priest Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest login failed: {error_msg}", "ERROR")
            self.test_results.append(("Priest Login", False, str(error_msg)))
            return False

    def test_2_get_priest_bands(self):
        """Test 2: GET PRIEST BANDS - /api/confession-bands/my-bands"""
        if not self.priest_token:
            self.log("❌ Cannot test get bands: No priest token", "ERROR")
            self.test_results.append(("GET Priest Bands", False, "No priest token"))
            return False
            
        self.log("📋 Test 2: GET PRIEST BANDS - /api/confession-bands/my-bands")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Priest bands retrieved successfully: {len(data)} bands found")
                self.test_results.append(("GET Priest Bands", True, f"{len(data)} bands found"))
                return True
            else:
                self.log(f"❌ Get bands failed: Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("GET Priest Bands", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Get bands failed: {error_msg}", "ERROR")
            self.test_results.append(("GET Priest Bands", False, str(error_msg)))
            return False

    def test_3_create_new_band(self):
        """Test 3: CREATE NEW BAND - POST /api/confession-bands"""
        if not self.priest_token:
            self.log("❌ Cannot test band creation: No priest token", "ERROR")
            self.test_results.append(("CREATE New Band", False, "No priest token"))
            return False
            
        self.log("📅 Test 3: CREATE NEW BAND - POST /api/confession-bands")
        
        # Create band for September 3rd, 2025 as specified in review request
        band_data = {
            "startTime": "2025-09-03T10:00:00.000Z",
            "endTime": "2025-09-03T11:00:00.000Z", 
            "location": "Confesionario Principal",
            "maxCapacity": 5,
            "notes": "Franja de prueba para testing",
            "isRecurrent": False
        }
        
        response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_band_id = data["id"]
                self.created_band_ids.append(self.test_band_id)
                self.log(f"✅ New band created successfully: {self.test_band_id}")
                self.test_results.append(("CREATE New Band", True, f"Band created with ID: {self.test_band_id}"))
                return True
            else:
                self.log("❌ Band creation failed: No ID returned", "ERROR")
                self.test_results.append(("CREATE New Band", False, "No ID returned"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band creation failed: {error_msg}", "ERROR")
            self.test_results.append(("CREATE New Band", False, str(error_msg)))
            return False

    def test_4_verify_band_creation(self):
        """Test 4: VERIFY BAND CREATION - GET /api/confession-bands/my-bands"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot verify band creation: Missing token or band ID", "ERROR")
            self.test_results.append(("VERIFY Band Creation", False, "Missing token or band ID"))
            return False
            
        self.log("🔍 Test 4: VERIFY BAND CREATION - GET /api/confession-bands/my-bands")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Look for our created band
                created_band = next((band for band in data if band.get("id") == self.test_band_id), None)
                if created_band:
                    self.log(f"✅ Created band verified in list: {created_band.get('location')} at {created_band.get('startTime')}")
                    self.test_results.append(("VERIFY Band Creation", True, f"Band found with correct data: {created_band.get('location')}"))
                    return True
                else:
                    self.log(f"❌ Created band not found in list", "ERROR")
                    self.test_results.append(("VERIFY Band Creation", False, "Created band not found in list"))
                    return False
            else:
                self.log(f"❌ Verification failed: Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("VERIFY Band Creation", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Verification failed: {error_msg}", "ERROR")
            self.test_results.append(("VERIFY Band Creation", False, str(error_msg)))
            return False

    def test_5_update_existing_band(self):
        """Test 5: UPDATE EXISTING BAND - PUT /api/confession-bands/my-bands/:id"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test band update: Missing token or band ID", "ERROR")
            self.test_results.append(("UPDATE Existing Band", False, "Missing token or band ID"))
            return False
            
        self.log("✏️ Test 5: UPDATE EXISTING BAND - PUT /api/confession-bands/my-bands/:id")
        
        # Update band data
        update_data = {
            "location": "Confesionario Secundario",
            "maxCapacity": 3,
            "notes": "Franja actualizada para testing - capacidad reducida"
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}", update_data, self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("id") == self.test_band_id:
                # Verify the updates were applied
                if (data.get("location") == update_data["location"] and 
                    data.get("maxCapacity") == update_data["maxCapacity"]):
                    self.log(f"✅ Band updated successfully: {data.get('location')}, capacity: {data.get('maxCapacity')}")
                    self.test_results.append(("UPDATE Existing Band", True, f"Band updated: {data.get('location')}, capacity: {data.get('maxCapacity')}"))
                    return True
                else:
                    self.log("❌ Band update failed: Changes not reflected", "ERROR")
                    self.test_results.append(("UPDATE Existing Band", False, "Changes not reflected in response"))
                    return False
            else:
                self.log("❌ Band update failed: Wrong band ID returned", "ERROR")
                self.test_results.append(("UPDATE Existing Band", False, "Wrong band ID returned"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band update failed: {error_msg}", "ERROR")
            self.test_results.append(("UPDATE Existing Band", False, str(error_msg)))
            return False

    def test_6_change_band_status_to_cancelled(self):
        """Test 6: CHANGE BAND STATUS TO CANCELLED - PATCH /api/confession-bands/my-bands/:id/status"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test status change: Missing token or band ID", "ERROR")
            self.test_results.append(("CHANGE Status to Cancelled", False, "Missing token or band ID"))
            return False
            
        self.log("🚫 Test 6: CHANGE BAND STATUS TO CANCELLED - PATCH /api/confession-bands/my-bands/:id/status")
        
        status_data = {
            "status": "cancelled"
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}/status", status_data, self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "cancelled":
                self.log("✅ Band status changed to cancelled successfully")
                self.test_results.append(("CHANGE Status to Cancelled", True, "Status changed to cancelled"))
                return True
            else:
                self.log(f"❌ Status change failed: Expected 'cancelled', got '{data.get('status')}'", "ERROR")
                self.test_results.append(("CHANGE Status to Cancelled", False, f"Expected 'cancelled', got '{data.get('status')}'"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Status change failed: {error_msg}", "ERROR")
            self.test_results.append(("CHANGE Status to Cancelled", False, str(error_msg)))
            return False

    def test_7_change_band_status_to_available(self):
        """Test 7: CHANGE BAND STATUS TO AVAILABLE - PATCH /api/confession-bands/my-bands/:id/status"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test status change: Missing token or band ID", "ERROR")
            self.test_results.append(("CHANGE Status to Available", False, "Missing token or band ID"))
            return False
            
        self.log("✅ Test 7: CHANGE BAND STATUS TO AVAILABLE - PATCH /api/confession-bands/my-bands/:id/status")
        
        status_data = {
            "status": "available"
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}/status", status_data, self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "available":
                self.log("✅ Band status changed to available successfully")
                self.test_results.append(("CHANGE Status to Available", True, "Status changed to available"))
                return True
            else:
                self.log(f"❌ Status change failed: Expected 'available', got '{data.get('status')}'", "ERROR")
                self.test_results.append(("CHANGE Status to Available", False, f"Expected 'available', got '{data.get('status')}'"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Status change failed: {error_msg}", "ERROR")
            self.test_results.append(("CHANGE Status to Available", False, str(error_msg)))
            return False

    def test_8_delete_band_with_foreign_key_fix(self):
        """Test 8: DELETE BAND - DELETE /api/confession-bands/my-bands/:id (FOREIGN KEY FIX)"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test band deletion: Missing token or band ID", "ERROR")
            self.test_results.append(("DELETE Band (Foreign Key Fix)", False, "Missing token or band ID"))
            return False
            
        self.log("🗑️ Test 8: DELETE BAND - DELETE /api/confession-bands/my-bands/:id (FOREIGN KEY FIX)")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{self.test_band_id}", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message"):
                self.log(f"✅ Band deleted successfully: {data.get('message')}")
                self.test_results.append(("DELETE Band (Foreign Key Fix)", True, f"Band deleted: {data.get('message')}"))
                # Remove from our tracking list
                if self.test_band_id in self.created_band_ids:
                    self.created_band_ids.remove(self.test_band_id)
                return True
            else:
                self.log("❌ Band deletion failed: No success message", "ERROR")
                self.test_results.append(("DELETE Band (Foreign Key Fix)", False, "No success message"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band deletion failed: {error_msg}", "ERROR")
            self.test_results.append(("DELETE Band (Foreign Key Fix)", False, str(error_msg)))
            return False

    def test_9_create_band_with_validation_errors(self):
        """Test 9: CREATE BAND WITH VALIDATION ERRORS - Test proper validation"""
        if not self.priest_token:
            self.log("❌ Cannot test validation: No priest token", "ERROR")
            self.test_results.append(("CREATE Band Validation", False, "No priest token"))
            return False
            
        self.log("⚠️ Test 9: CREATE BAND WITH VALIDATION ERRORS - Test proper validation")
        
        # Try to create band with past date (should fail)
        yesterday = datetime.now() - timedelta(days=1)
        invalid_band_data = {
            "startTime": yesterday.isoformat() + "Z",
            "endTime": (yesterday + timedelta(hours=1)).isoformat() + "Z",
            "location": "Test Location",
            "maxCapacity": 1,
            "notes": "This should fail - past date",
            "isRecurrent": False
        }
        
        response = self.make_request("POST", "/confession-bands", invalid_band_data, self.priest_token)
        
        if response and response.status_code == 400:
            error_data = response.json()
            if "futuro" in str(error_data).lower() or "future" in str(error_data).lower():
                self.log("✅ Validation working: Past date rejected correctly")
                self.test_results.append(("CREATE Band Validation", True, "Past date validation working"))
                return True
            else:
                self.log(f"❌ Validation failed: Wrong error message: {error_data}", "ERROR")
                self.test_results.append(("CREATE Band Validation", False, f"Wrong error message: {error_data}"))
                return False
        elif response and response.status_code == 201:
            # This shouldn't happen - past dates should be rejected
            self.log("❌ Validation failed: Past date was accepted", "ERROR")
            self.test_results.append(("CREATE Band Validation", False, "Past date was accepted"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Validation test failed: {error_msg}", "ERROR")
            self.test_results.append(("CREATE Band Validation", False, str(error_msg)))
            return False

    def cleanup_created_bands(self):
        """Cleanup any remaining test bands"""
        if not self.priest_token or not self.created_band_ids:
            return
            
        self.log("🧹 Cleaning up remaining test bands...")
        
        for band_id in self.created_band_ids.copy():
            try:
                response = self.make_request("DELETE", f"/confession-bands/my-bands/{band_id}", token=self.priest_token)
                if response and response.status_code == 200:
                    self.log(f"✅ Cleaned up band: {band_id}")
                    self.created_band_ids.remove(band_id)
                else:
                    self.log(f"⚠️ Could not clean up band: {band_id}")
            except Exception as e:
                self.log(f"⚠️ Error cleaning up band {band_id}: {e}")

    def run_priest_dashboard_workflow_testing(self):
        """Run the complete priest dashboard band management workflow testing"""
        self.log("🚀 INICIANDO PRIEST DASHBOARD BAND MANAGEMENT WORKFLOW TESTING")
        self.log("=" * 80)
        
        # Testing sequence as specified in review request
        tests = [
            ("1. PRIEST LOGIN", self.test_1_priest_login),
            ("2. GET PRIEST BANDS", self.test_2_get_priest_bands),
            ("3. CREATE NEW BAND", self.test_3_create_new_band),
            ("4. VERIFY BAND CREATION", self.test_4_verify_band_creation),
            ("5. UPDATE EXISTING BAND", self.test_5_update_existing_band),
            ("6. CHANGE STATUS TO CANCELLED", self.test_6_change_band_status_to_cancelled),
            ("7. CHANGE STATUS TO AVAILABLE", self.test_7_change_band_status_to_available),
            ("8. DELETE BAND (FOREIGN KEY FIX)", self.test_8_delete_band_with_foreign_key_fix),
            ("9. CREATE BAND VALIDATION", self.test_9_create_band_with_validation_errors),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            self.log(f"\n--- {test_name} ---")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                self.log(f"❌ {test_name} failed with exception: {e}", "ERROR")
                failed += 1
                self.test_results.append((test_name, False, f"Exception: {e}"))
        
        # Cleanup
        self.cleanup_created_bands()
                
        self.log("\n" + "=" * 80)
        self.log("🏁 PRIEST DASHBOARD BAND MANAGEMENT WORKFLOW TESTING COMPLETE!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        self.log("\n📋 DETAILED RESULTS:")
        for test_name, success, details in self.test_results:
            status = "✅" if success else "❌"
            self.log(f"{status} {test_name}: {details}")
        
        return passed, failed

if __name__ == "__main__":
    tester = ConfesAppTester()
    passed, failed = tester.run_priest_dashboard_workflow_testing()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)