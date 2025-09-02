#!/usr/bin/env python3
"""
ConfesApp Backend Diagnostic Testing - CRITICAL ISSUE DIAGNOSIS
Focus: Testing DELETE franjas and CANCEL confessions functionality
Based on user report: "Botón eliminar franjas (sacerdote) no funciona" and "Botón cancelar confesiones (fiel) no funciona"
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://confes-scheduler.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class DiagnosticTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.priest_token = None
        self.faithful_token = None
        self.priest_user = None
        self.faithful_user = None
        self.existing_bands = []
        self.existing_confessions = []
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

    def test_priest_login(self):
        """Test priest login with seed data"""
        self.log("🔐 TESTING PRIEST LOGIN")
        
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
                self.log("✅ Priest login successful")
                self.test_results.append(("Priest Login", True, "Login successful"))
                return True
            else:
                self.log("❌ Priest login failed: Missing token or user data", "ERROR")
                self.test_results.append(("Priest Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Priest login failed: {error_msg}", "ERROR")
            self.test_results.append(("Priest Login", False, str(error_msg)))
            return False

    def test_faithful_login(self):
        """Test faithful login with seed data"""
        self.log("🔐 TESTING FAITHFUL LOGIN")
        
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
                self.log("✅ Faithful login successful")
                self.test_results.append(("Faithful Login", True, "Login successful"))
                return True
            else:
                self.log("❌ Faithful login failed: Missing token or user data", "ERROR")
                self.test_results.append(("Faithful Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful login failed: {error_msg}", "ERROR")
            self.test_results.append(("Faithful Login", False, str(error_msg)))
            return False

    def test_get_priest_bands(self):
        """Test GET /api/confession-bands/my-bands to get existing bands"""
        if not self.priest_token:
            self.log("❌ Cannot get priest bands: No priest token", "ERROR")
            return False
            
        self.log("📋 TESTING GET PRIEST BANDS")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.existing_bands = data
                self.log(f"✅ Retrieved {len(data)} existing bands")
                self.test_results.append(("Get Priest Bands", True, f"Retrieved {len(data)} bands"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Get Priest Bands", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Get bands failed: {error_msg}", "ERROR")
            self.test_results.append(("Get Priest Bands", False, str(error_msg)))
            return False

    def test_delete_band_functionality(self):
        """Test DELETE /api/confession-bands/my-bands/:id - CRITICAL TEST"""
        if not self.priest_token:
            self.log("❌ Cannot test band deletion: No priest token", "ERROR")
            return False
            
        if not self.existing_bands:
            self.log("❌ Cannot test band deletion: No existing bands", "ERROR")
            return False
            
        self.log("🗑️ TESTING DELETE BAND FUNCTIONALITY - CRITICAL TEST")
        
        # Use the first existing band for deletion test
        band_to_delete = self.existing_bands[0]
        band_id = band_to_delete.get("id")
        
        if not band_id:
            self.log("❌ No band ID found in existing bands", "ERROR")
            self.test_results.append(("Delete Band", False, "No band ID found"))
            return False
        
        self.log(f"🎯 Attempting to delete band: {band_id}")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{band_id}", token=self.priest_token)
        
        if response and response.status_code == 200:
            self.log("✅ BAND DELETION SUCCESSFUL - Backend working correctly!")
            self.test_results.append(("Delete Band", True, f"Successfully deleted band {band_id}"))
            return True
        elif response and response.status_code == 404:
            self.log("❌ Band deletion failed: Band not found (404)", "ERROR")
            self.test_results.append(("Delete Band", False, f"Band {band_id} not found (404)"))
            return False
        elif response and response.status_code == 403:
            self.log("❌ Band deletion failed: Permission denied (403)", "ERROR")
            self.test_results.append(("Delete Band", False, f"Permission denied for band {band_id} (403)"))
            return False
        elif response and response.status_code == 405:
            self.log("❌ Band deletion failed: Method not allowed (405) - Endpoint may not exist", "ERROR")
            self.test_results.append(("Delete Band", False, f"DELETE method not allowed (405) - endpoint may not exist"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            status = response.status_code if response else "No response"
            self.log(f"❌ Band deletion failed with status {status}: {error_msg}", "ERROR")
            self.test_results.append(("Delete Band", False, f"Status {status}: {error_msg}"))
            return False

    def test_get_faithful_confessions(self):
        """Test GET /api/confessions to get existing confessions"""
        if not self.faithful_token:
            self.log("❌ Cannot get faithful confessions: No faithful token", "ERROR")
            return False
            
        self.log("📋 TESTING GET FAITHFUL CONFESSIONS")
        
        response = self.make_request("GET", "/confessions", token=self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.existing_confessions = data
                self.log(f"✅ Retrieved {len(data)} existing confessions")
                self.test_results.append(("Get Faithful Confessions", True, f"Retrieved {len(data)} confessions"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Get Faithful Confessions", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Get confessions failed: {error_msg}", "ERROR")
            self.test_results.append(("Get Faithful Confessions", False, str(error_msg)))
            return False

    def test_cancel_confession_functionality(self):
        """Test PATCH /api/confessions/:id/cancel - CRITICAL TEST"""
        if not self.faithful_token:
            self.log("❌ Cannot test confession cancellation: No faithful token", "ERROR")
            return False
            
        if not self.existing_confessions:
            self.log("❌ Cannot test confession cancellation: No existing confessions", "ERROR")
            return False
            
        self.log("❌ TESTING CANCEL CONFESSION FUNCTIONALITY - CRITICAL TEST")
        
        # Find a confession that can be cancelled (status = 'booked')
        confession_to_cancel = None
        for confession in self.existing_confessions:
            if confession.get("status") == "booked":
                confession_to_cancel = confession
                break
        
        if not confession_to_cancel:
            self.log("❌ No bookable confessions found to cancel", "ERROR")
            self.test_results.append(("Cancel Confession", False, "No bookable confessions found"))
            return False
        
        confession_id = confession_to_cancel.get("id")
        if not confession_id:
            self.log("❌ No confession ID found", "ERROR")
            self.test_results.append(("Cancel Confession", False, "No confession ID found"))
            return False
        
        self.log(f"🎯 Attempting to cancel confession: {confession_id}")
        
        response = self.make_request("PATCH", f"/confessions/{confession_id}/cancel", {}, self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "cancelled":
                self.log("✅ CONFESSION CANCELLATION SUCCESSFUL - Backend working correctly!")
                self.test_results.append(("Cancel Confession", True, f"Successfully cancelled confession {confession_id}"))
                return True
            else:
                self.log(f"❌ Cancellation failed: Status not updated to cancelled, got {data.get('status')}", "ERROR")
                self.test_results.append(("Cancel Confession", False, f"Status not updated, got {data.get('status')}"))
                return False
        elif response and response.status_code == 404:
            self.log("❌ Confession cancellation failed: Confession not found (404)", "ERROR")
            self.test_results.append(("Cancel Confession", False, f"Confession {confession_id} not found (404)"))
            return False
        elif response and response.status_code == 403:
            self.log("❌ Confession cancellation failed: Permission denied (403)", "ERROR")
            self.test_results.append(("Cancel Confession", False, f"Permission denied for confession {confession_id} (403)"))
            return False
        elif response and response.status_code == 405:
            self.log("❌ Confession cancellation failed: Method not allowed (405) - Endpoint may not exist", "ERROR")
            self.test_results.append(("Cancel Confession", False, f"PATCH method not allowed (405) - endpoint may not exist"))
            return False
        elif response and response.status_code == 400:
            error_data = response.json() if response else {}
            self.log(f"❌ Confession cancellation failed: Bad request (400) - {error_data}", "ERROR")
            self.test_results.append(("Cancel Confession", False, f"Bad request (400): {error_data}"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            status = response.status_code if response else "No response"
            self.log(f"❌ Confession cancellation failed with status {status}: {error_msg}", "ERROR")
            self.test_results.append(("Cancel Confession", False, f"Status {status}: {error_msg}"))
            return False

    def test_create_test_data_if_needed(self):
        """Create test data if no existing data found"""
        self.log("🔧 CREATING TEST DATA IF NEEDED")
        
        # Create a test band if no bands exist
        if not self.existing_bands and self.priest_token:
            self.log("Creating test band for deletion testing...")
            tomorrow = datetime.now() + timedelta(days=1)
            start_time = tomorrow.replace(hour=16, minute=0, second=0, microsecond=0)
            end_time = start_time + timedelta(hours=1)
            
            band_data = {
                "startTime": start_time.isoformat() + "Z",
                "endTime": end_time.isoformat() + "Z",
                "location": "Confesionario Principal",
                "maxCapacity": 2,
                "notes": "Test band for deletion",
                "isRecurrent": False
            }
            
            response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
            
            if response and response.status_code == 201:
                data = response.json()
                if data.get("id"):
                    self.existing_bands.append(data)
                    self.log(f"✅ Created test band: {data['id']}")
                    
                    # Now create a confession for cancellation testing
                    if self.faithful_token:
                        booking_data = {"confessionBandId": data["id"]}
                        conf_response = self.make_request("POST", "/confessions", booking_data, self.faithful_token)
                        
                        if conf_response and conf_response.status_code == 201:
                            conf_data = conf_response.json()
                            if conf_data.get("id"):
                                self.existing_confessions.append(conf_data)
                                self.log(f"✅ Created test confession: {conf_data['id']}")
                        else:
                            self.log("⚠️ Could not create test confession", "WARN")
                else:
                    self.log("❌ Failed to create test band: No ID returned", "ERROR")
            else:
                error_msg = response.json() if response else "No response"
                self.log(f"❌ Failed to create test band: {error_msg}", "ERROR")

    def run_diagnostic_tests(self):
        """Run the complete diagnostic testing sequence"""
        self.log("🚀 INICIANDO DIAGNÓSTICO CRÍTICO - BOTONES ELIMINAR/CANCELAR")
        self.log("=" * 80)
        
        # Testing sequence focusing on reported issues
        tests = [
            ("1. PRIEST LOGIN", self.test_priest_login),
            ("2. FAITHFUL LOGIN", self.test_faithful_login),
            ("3. GET PRIEST BANDS", self.test_get_priest_bands),
            ("4. GET FAITHFUL CONFESSIONS", self.test_get_faithful_confessions),
            ("5. CREATE TEST DATA IF NEEDED", self.test_create_test_data_if_needed),
            ("6. DELETE BAND (CRITICAL)", self.test_delete_band_functionality),
            ("7. CANCEL CONFESSION (CRITICAL)", self.test_cancel_confession_functionality),
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
        self.log("🏁 DIAGNÓSTICO CRÍTICO FINALIZADO!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        self.log("\n📋 DETAILED DIAGNOSTIC RESULTS:")
        for test_name, success, details in self.test_results:
            status = "✅" if success else "❌"
            self.log(f"{status} {test_name}: {details}")
        
        # Critical analysis
        self.log("\n🔍 CRITICAL ANALYSIS:")
        delete_test = next((r for r in self.test_results if "Delete Band" in r[0]), None)
        cancel_test = next((r for r in self.test_results if "Cancel Confession" in r[0]), None)
        
        if delete_test and delete_test[1]:
            self.log("✅ DELETE FRANJAS: Backend API working correctly")
        elif delete_test:
            self.log(f"❌ DELETE FRANJAS: Backend issue - {delete_test[2]}")
        else:
            self.log("⚠️ DELETE FRANJAS: Test not completed")
            
        if cancel_test and cancel_test[1]:
            self.log("✅ CANCEL CONFESSIONS: Backend API working correctly")
        elif cancel_test:
            self.log(f"❌ CANCEL CONFESSIONS: Backend issue - {cancel_test[2]}")
        else:
            self.log("⚠️ CANCEL CONFESSIONS: Test not completed")
        
        return passed, failed

if __name__ == "__main__":
    tester = DiagnosticTester()
    passed, failed = tester.run_diagnostic_tests()
    
    # Exit with error code if any critical tests failed
    exit(0 if failed == 0 else 1)