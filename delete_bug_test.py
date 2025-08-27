#!/usr/bin/env python3
"""
ConfesApp Backend API Testing Suite - CRITICAL DELETE BUG FIX
Tests the NestJS backend for Catholic confession booking system
Focus: Testing critical delete bug fix for ConfessionBand deletion with foreign key constraints
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://confess-booking.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ConfesAppDeleteBugTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        # Test users from review request
        self.priest_token = None
        self.faithful_token = None
        self.priest_user = None
        self.faithful_user = None
        # Test data for delete bug testing
        self.test_band_id = None
        self.test_confession_ids = []
        self.existing_bands = []
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
                response = requests.get(url, headers=headers, timeout=15)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=15)
            elif method == "PATCH":
                response = requests.patch(url, headers=headers, json=data, timeout=15)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=15)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {e}", "ERROR")
            return None

    # ===== CRITICAL DELETE BUG FIX TESTING SEQUENCE =====

    def test_1_priest_login(self):
        """Test 1: LOGIN AS PRIEST"""
        self.log("🔐 Test 1: LOGIN AS PRIEST (padre.parroco@sanmiguel.es)")
        
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
                
                if self.priest_user.get("role") == "priest":
                    self.log("✅ Priest login successful")
                    self.test_results.append(("Priest Login", True, "Login successful"))
                    return True
                else:
                    self.log(f"❌ Wrong role: {self.priest_user.get('role')}", "ERROR")
                    self.test_results.append(("Priest Login", False, f"Wrong role: {self.priest_user.get('role')}"))
                    return False
            else:
                self.log("❌ Missing token or user data", "ERROR")
                self.test_results.append(("Priest Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest login failed: {error_msg}", "ERROR")
            self.test_results.append(("Priest Login", False, str(error_msg)))
            return False

    def test_2_faithful_login(self):
        """Test 2: LOGIN AS FAITHFUL"""
        self.log("🔐 Test 2: LOGIN AS FAITHFUL (fiel1@ejemplo.com)")
        
        login_data = {
            "email": "fiel1@ejemplo.com",
            "password": "Pass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.faithful_token = data["access_token"]
                self.faithful_user = data["user"]
                
                if self.faithful_user.get("role") == "faithful":
                    self.log("✅ Faithful login successful")
                    self.test_results.append(("Faithful Login", True, "Login successful"))
                    return True
                else:
                    self.log(f"❌ Wrong role: {self.faithful_user.get('role')}", "ERROR")
                    self.test_results.append(("Faithful Login", False, f"Wrong role: {self.faithful_user.get('role')}"))
                    return False
            else:
                self.log("❌ Missing token or user data", "ERROR")
                self.test_results.append(("Faithful Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful login failed: {error_msg}", "ERROR")
            self.test_results.append(("Faithful Login", False, str(error_msg)))
            return False

    def test_3_get_existing_bands(self):
        """Test 3: GET EXISTING CONFESSION BANDS"""
        if not self.priest_token:
            self.log("❌ Cannot get bands: No priest token", "ERROR")
            self.test_results.append(("Get Existing Bands", False, "No priest token"))
            return False
            
        self.log("📋 Test 3: GET EXISTING CONFESSION BANDS")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.existing_bands = data
                self.log(f"✅ Found {len(data)} existing bands")
                self.test_results.append(("Get Existing Bands", True, f"Found {len(data)} existing bands"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Get Existing Bands", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Failed to get bands: {error_msg}", "ERROR")
            self.test_results.append(("Get Existing Bands", False, str(error_msg)))
            return False

    def test_4_create_band_for_testing(self):
        """Test 4: CREATE NEW BAND FOR DELETE TESTING"""
        if not self.priest_token:
            self.log("❌ Cannot create band: No priest token", "ERROR")
            self.test_results.append(("Create Test Band", False, "No priest token"))
            return False
            
        self.log("📅 Test 4: CREATE NEW BAND FOR DELETE TESTING")
        
        # Create band for tomorrow (future date)
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=16, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Confesionario Principal",
            "maxCapacity": 3,
            "notes": "Band for delete bug testing",
            "isRecurrent": False
        }
        
        response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_band_id = data["id"]
                self.log(f"✅ Test band created successfully: {self.test_band_id}")
                self.test_results.append(("Create Test Band", True, f"Band created with ID: {self.test_band_id}"))
                return True
            else:
                self.log("❌ Band creation failed: No ID returned", "ERROR")
                self.test_results.append(("Create Test Band", False, "No ID returned"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band creation failed: {error_msg}", "ERROR")
            self.test_results.append(("Create Test Band", False, str(error_msg)))
            return False

    def test_5_create_multiple_confessions(self):
        """Test 5: CREATE MULTIPLE CONFESSIONS ON THE BAND"""
        if not self.faithful_token or not self.test_band_id:
            self.log("❌ Cannot create confessions: Missing token or band ID", "ERROR")
            self.test_results.append(("Create Multiple Confessions", False, "Missing token or band ID"))
            return False
            
        self.log("📝 Test 5: CREATE MULTIPLE CONFESSIONS ON THE BAND")
        
        # Create multiple confessions (both active and to be cancelled)
        confession_count = 0
        
        for i in range(3):  # Create 3 confessions (up to maxCapacity)
            booking_data = {
                "confessionBandId": self.test_band_id
            }
            
            response = self.make_request("POST", "/confessions", booking_data, self.faithful_token)
            
            if response and response.status_code == 201:
                data = response.json()
                if data.get("id"):
                    self.test_confession_ids.append(data["id"])
                    confession_count += 1
                    self.log(f"✅ Confession {i+1} created: {data['id']}")
                else:
                    self.log(f"❌ Confession {i+1} failed: No ID returned", "ERROR")
            else:
                error_msg = response.json() if response else "No response"
                self.log(f"❌ Confession {i+1} failed: {error_msg}", "ERROR")
        
        if confession_count >= 2:
            self.log(f"✅ Created {confession_count} confessions for testing")
            self.test_results.append(("Create Multiple Confessions", True, f"Created {confession_count} confessions"))
            return True
        else:
            self.log(f"❌ Only created {confession_count} confessions", "ERROR")
            self.test_results.append(("Create Multiple Confessions", False, f"Only created {confession_count} confessions"))
            return False

    def test_6_cancel_some_confessions(self):
        """Test 6: CANCEL SOME CONFESSIONS (to test mixed status handling)"""
        if not self.faithful_token or len(self.test_confession_ids) < 2:
            self.log("❌ Cannot cancel confessions: Missing token or insufficient confessions", "ERROR")
            self.test_results.append(("Cancel Some Confessions", False, "Missing token or insufficient confessions"))
            return False
            
        self.log("❌ Test 6: CANCEL SOME CONFESSIONS (mixed status testing)")
        
        # Cancel the first confession to create a mixed status scenario
        confession_to_cancel = self.test_confession_ids[0]
        
        response = self.make_request("PATCH", f"/confessions/{confession_to_cancel}/cancel", {}, self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "cancelled":
                self.log(f"✅ Confession {confession_to_cancel} cancelled successfully")
                self.test_results.append(("Cancel Some Confessions", True, "Confession cancelled successfully"))
                return True
            else:
                self.log(f"❌ Cancellation failed: Status not updated, got {data.get('status')}", "ERROR")
                self.test_results.append(("Cancel Some Confessions", False, f"Status not updated, got {data.get('status')}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Cancellation failed: {error_msg}", "ERROR")
            self.test_results.append(("Cancel Some Confessions", False, str(error_msg)))
            return False

    def test_7_delete_band_with_associated_confessions(self):
        """Test 7: CRITICAL DELETE TEST - Delete band with associated confessions"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test delete: Missing token or band ID", "ERROR")
            self.test_results.append(("Delete Band with Confessions", False, "Missing token or band ID"))
            return False
            
        self.log("🚨 Test 7: CRITICAL DELETE TEST - Delete band with associated confessions")
        self.log(f"Attempting to delete band {self.test_band_id} with {len(self.test_confession_ids)} associated confessions")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{self.test_band_id}", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message"):
                self.log("✅ CRITICAL FIX VERIFIED: Band deleted successfully without foreign key constraint error!")
                self.log(f"Response: {data.get('message')}")
                self.test_results.append(("Delete Band with Confessions", True, "CRITICAL FIX WORKING: Band deleted successfully"))
                return True
            else:
                self.log("❌ Delete succeeded but no message returned", "ERROR")
                self.test_results.append(("Delete Band with Confessions", False, "No message returned"))
                return False
        elif response and response.status_code == 500:
            # This would indicate the bug still exists
            error_data = response.json() if response else {}
            if "FOREIGN KEY constraint failed" in str(error_data) or "constraint" in str(error_data).lower():
                self.log("❌ CRITICAL BUG STILL EXISTS: Foreign key constraint error on delete", "ERROR")
                self.test_results.append(("Delete Band with Confessions", False, "CRITICAL BUG: Foreign key constraint error still occurs"))
                return False
            else:
                self.log(f"❌ Delete failed with 500: {error_data}", "ERROR")
                self.test_results.append(("Delete Band with Confessions", False, f"500 error: {error_data}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Delete failed: {error_msg}", "ERROR")
            self.test_results.append(("Delete Band with Confessions", False, str(error_msg)))
            return False

    def test_8_verify_confessions_handled_correctly(self):
        """Test 8: VERIFY CONFESSIONS WERE HANDLED CORRECTLY"""
        if not self.faithful_token:
            self.log("❌ Cannot verify confessions: No faithful token", "ERROR")
            self.test_results.append(("Verify Confessions Handled", False, "No faithful token"))
            return False
            
        self.log("🔍 Test 8: VERIFY CONFESSIONS WERE HANDLED CORRECTLY")
        
        response = self.make_request("GET", "/confessions", token=self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our test confessions still exist and have proper status
                test_confessions = [c for c in data if c.get("id") in self.test_confession_ids]
                
                active_cancelled = 0
                already_cancelled = 0
                nullified_band_refs = 0
                
                for confession in test_confessions:
                    if confession.get("confessionBandId") is None:
                        nullified_band_refs += 1
                    
                    if confession.get("status") == "cancelled":
                        if confession.get("id") == self.test_confession_ids[0]:
                            already_cancelled += 1  # This was cancelled before delete
                        else:
                            active_cancelled += 1  # This was active and should be cancelled by delete
                
                self.log(f"Found {len(test_confessions)} test confessions after delete")
                self.log(f"Confessions with nullified band references: {nullified_band_refs}")
                self.log(f"Active confessions cancelled by delete: {active_cancelled}")
                self.log(f"Previously cancelled confessions: {already_cancelled}")
                
                # Verify the fix worked correctly
                if nullified_band_refs == len(test_confessions):
                    self.log("✅ CRITICAL FIX VERIFIED: All confessions have confessionBandId set to null")
                    self.test_results.append(("Verify Confessions Handled", True, f"All {len(test_confessions)} confessions properly handled - confessionBandId nullified"))
                    return True
                else:
                    self.log(f"❌ Some confessions still have band references: {len(test_confessions) - nullified_band_refs}", "ERROR")
                    self.test_results.append(("Verify Confessions Handled", False, f"Some confessions still have band references"))
                    return False
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Verify Confessions Handled", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Failed to get confessions: {error_msg}", "ERROR")
            self.test_results.append(("Verify Confessions Handled", False, str(error_msg)))
            return False

    def test_9_delete_existing_band_with_confessions(self):
        """Test 9: DELETE EXISTING BAND WITH CONFESSIONS (if any exist)"""
        if not self.priest_token or len(self.existing_bands) == 0:
            self.log("⚠️ Skipping existing band delete test: No priest token or no existing bands")
            self.test_results.append(("Delete Existing Band", True, "Skipped - no existing bands with confessions"))
            return True
            
        self.log("🔄 Test 9: DELETE EXISTING BAND WITH CONFESSIONS")
        
        # Find a band that has confessions
        band_with_confessions = None
        for band in self.existing_bands:
            if band.get("currentBookings", 0) > 0 or (band.get("confessions") and len(band.get("confessions", [])) > 0):
                band_with_confessions = band
                break
        
        if not band_with_confessions:
            self.log("⚠️ No existing bands with confessions found")
            self.test_results.append(("Delete Existing Band", True, "No existing bands with confessions found"))
            return True
        
        band_id = band_with_confessions.get("id")
        confession_count = len(band_with_confessions.get("confessions", []))
        
        self.log(f"Attempting to delete existing band {band_id} with {confession_count} confessions")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{band_id}", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            self.log("✅ CRITICAL FIX VERIFIED: Existing band with confessions deleted successfully!")
            self.log(f"Response: {data.get('message', 'No message')}")
            self.test_results.append(("Delete Existing Band", True, f"Existing band with {confession_count} confessions deleted successfully"))
            return True
        elif response and response.status_code == 500:
            error_data = response.json() if response else {}
            if "FOREIGN KEY constraint failed" in str(error_data):
                self.log("❌ CRITICAL BUG STILL EXISTS: Foreign key constraint error on existing band delete", "ERROR")
                self.test_results.append(("Delete Existing Band", False, "CRITICAL BUG: Foreign key constraint error on existing band"))
                return False
            else:
                self.log(f"❌ Delete failed with 500: {error_data}", "ERROR")
                self.test_results.append(("Delete Existing Band", False, f"500 error: {error_data}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Delete failed: {error_msg}", "ERROR")
            self.test_results.append(("Delete Existing Band", False, str(error_msg)))
            return False

    def run_delete_bug_fix_testing(self):
        """Run the complete delete bug fix testing sequence"""
        self.log("🚀 STARTING CRITICAL DELETE BUG FIX TESTING")
        self.log("=" * 80)
        self.log("FOCUS: Testing ConfessionBand deletion with foreign key constraints")
        self.log("=" * 80)
        
        # Testing sequence focused on delete bug fix
        tests = [
            ("1. Priest Login", self.test_1_priest_login),
            ("2. Faithful Login", self.test_2_faithful_login),
            ("3. Get Existing Bands", self.test_3_get_existing_bands),
            ("4. Create Test Band", self.test_4_create_band_for_testing),
            ("5. Create Multiple Confessions", self.test_5_create_multiple_confessions),
            ("6. Cancel Some Confessions", self.test_6_cancel_some_confessions),
            ("7. DELETE BAND WITH CONFESSIONS (CRITICAL)", self.test_7_delete_band_with_associated_confessions),
            ("8. Verify Confessions Handled", self.test_8_verify_confessions_handled_correctly),
            ("9. Delete Existing Band", self.test_9_delete_existing_band_with_confessions),
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
                
        self.log("\n" + "=" * 80)
        self.log("🏁 CRITICAL DELETE BUG FIX TESTING COMPLETED!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        self.log("\n📋 DETAILED RESULTS:")
        for test_name, success, details in self.test_results:
            status = "✅" if success else "❌"
            self.log(f"{status} {test_name}: {details}")
        
        # Critical success criteria check
        critical_tests = [
            "DELETE BAND WITH CONFESSIONS (CRITICAL)",
            "Verify Confessions Handled"
        ]
        
        critical_passed = sum(1 for name, success, _ in self.test_results 
                            if any(ct in name for ct in critical_tests) and success)
        
        self.log(f"\n🚨 CRITICAL SUCCESS CRITERIA: {critical_passed}/{len(critical_tests)} critical tests passed")
        
        if critical_passed == len(critical_tests):
            self.log("✅ CRITICAL DELETE BUG FIX VERIFIED SUCCESSFULLY!")
        else:
            self.log("❌ CRITICAL DELETE BUG FIX VERIFICATION FAILED!")
        
        return passed, failed

if __name__ == "__main__":
    tester = ConfesAppDeleteBugTester()
    passed, failed = tester.run_delete_bug_fix_testing()
    
    # Exit with error code if any critical tests failed
    exit(0 if failed == 0 else 1)