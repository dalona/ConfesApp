#!/usr/bin/env python3
"""
ConfesApp Backend Diagnostic Test - DIAGNÓSTICO DE PROBLEMAS CRÍTICOS
Tests specific issues reported by user in frontend integration
Focus: Franjas de confesión, validaciones, eliminación, datos existentes
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://confess-booking.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ConfesAppDiagnosticTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        # Test users from review request
        self.priest_token = None
        self.faithful_token = None
        self.priest_user = None
        self.faithful_user = None
        # Test data
        self.test_band_id = None
        self.existing_bands = []
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

    def test_1_priest_login(self):
        """Test 1: LOGIN COMO SACERDOTE SEED"""
        self.log("🔐 Test 1: LOGIN COMO SACERDOTE SEED")
        
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
                    self.test_results.append(("Priest Login", True, f"Login successful: {self.priest_user.get('firstName')} {self.priest_user.get('lastName')}"))
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
        """Test 2: LOGIN COMO FIEL SEED"""
        self.log("🔐 Test 2: LOGIN COMO FIEL SEED")
        
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
                    self.test_results.append(("Faithful Login", True, f"Login successful: {self.faithful_user.get('firstName')} {self.faithful_user.get('lastName')}"))
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

    def test_3_verify_existing_priest_bands(self):
        """Test 3: VERIFICAR DATOS EXISTENTES - GET /api/confession-bands/my-bands"""
        if not self.priest_token:
            self.log("❌ Cannot test: No priest token", "ERROR")
            self.test_results.append(("Verify Existing Priest Bands", False, "No priest token"))
            return False
            
        self.log("📋 Test 3: VERIFICAR DATOS EXISTENTES - GET /api/confession-bands/my-bands")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.existing_bands = data
                self.log(f"✅ Found {len(data)} existing bands created by priest")
                
                # Log details of existing bands
                for i, band in enumerate(data[:3]):  # Show first 3 bands
                    self.log(f"   Band {i+1}: {band.get('location', 'No location')} - {band.get('startTime', 'No time')} - Status: {band.get('status', 'No status')}")
                
                self.test_results.append(("Verify Existing Priest Bands", True, f"Found {len(data)} existing bands"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Verify Existing Priest Bands", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Failed to get priest bands: {error_msg}", "ERROR")
            self.test_results.append(("Verify Existing Priest Bands", False, str(error_msg)))
            return False

    def test_4_verify_available_slots(self):
        """Test 4: VERIFICAR SLOTS DISPONIBLES - GET /api/confession-slots/available"""
        self.log("🕐 Test 4: VERIFICAR SLOTS DISPONIBLES - GET /api/confession-slots/available")
        
        response = self.make_request("GET", "/confession-slots/available")
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Found {len(data)} available confession slots")
                
                # Log details of available slots
                for i, slot in enumerate(data[:3]):  # Show first 3 slots
                    self.log(f"   Slot {i+1}: {slot.get('location', 'No location')} - {slot.get('startTime', 'No time')} - Status: {slot.get('status', 'No status')}")
                
                self.test_results.append(("Verify Available Slots", True, f"Found {len(data)} available slots"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Verify Available Slots", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Failed to get available slots: {error_msg}", "ERROR")
            self.test_results.append(("Verify Available Slots", False, str(error_msg)))
            return False

    def test_5_create_confession_band(self):
        """Test 5: PROBAR CREACIÓN DE FRANJA - POST /api/confession-bands"""
        if not self.priest_token:
            self.log("❌ Cannot test: No priest token", "ERROR")
            self.test_results.append(("Create Confession Band", False, "No priest token"))
            return False
            
        self.log("📅 Test 5: PROBAR CREACIÓN DE FRANJA - POST /api/confession-bands")
        
        # Create band for tomorrow (future date)
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Confesionario Principal",
            "maxCapacity": 5,
            "notes": "Franja de diagnóstico",
            "isRecurrent": False
        }
        
        self.log(f"   Creating band: {band_data['startTime']} to {band_data['endTime']}")
        
        response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_band_id = data["id"]
                self.log(f"✅ Confession band created successfully: {self.test_band_id}")
                self.test_results.append(("Create Confession Band", True, f"Band created with ID: {self.test_band_id}"))
                return True
            else:
                self.log("❌ No ID returned", "ERROR")
                self.test_results.append(("Create Confession Band", False, "No ID returned"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band creation failed: {error_msg}", "ERROR")
            self.test_results.append(("Create Confession Band", False, str(error_msg)))
            return False

    def test_6_validate_past_date(self):
        """Test 6: PROBAR VALIDACIÓN DE FECHA PASADA"""
        if not self.priest_token:
            self.log("❌ Cannot test: No priest token", "ERROR")
            self.test_results.append(("Validate Past Date", False, "No priest token"))
            return False
            
        self.log("⚠️ Test 6: PROBAR VALIDACIÓN DE FECHA PASADA")
        
        # Try to create band with past date
        past_date = datetime.now() - timedelta(days=1)
        start_time = past_date.replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Test",
            "maxCapacity": 5,
            "isRecurrent": False
        }
        
        self.log(f"   Trying past date: {band_data['startTime']}")
        
        response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
        
        if response and response.status_code == 400:
            error_data = response.json()
            self.log("✅ Past date validation working - got 400 error as expected")
            self.test_results.append(("Validate Past Date", True, f"Validation working: {error_data}"))
            return True
        elif response and response.status_code == 201:
            self.log("❌ Past date validation NOT working - band created with past date!", "ERROR")
            self.test_results.append(("Validate Past Date", False, "Validation not working - past date accepted"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Unexpected response: {error_msg}", "ERROR")
            self.test_results.append(("Validate Past Date", False, f"Unexpected response: {error_msg}"))
            return False

    def test_7_verify_faithful_confessions(self):
        """Test 7: VERIFICAR CONFESIONES EXISTENTES - GET /api/confessions"""
        if not self.faithful_token:
            self.log("❌ Cannot test: No faithful token", "ERROR")
            self.test_results.append(("Verify Faithful Confessions", False, "No faithful token"))
            return False
            
        self.log("📝 Test 7: VERIFICAR CONFESIONES EXISTENTES - GET /api/confessions")
        
        response = self.make_request("GET", "/confessions", token=self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Found {len(data)} existing confessions for faithful user")
                
                # Log details of existing confessions
                for i, confession in enumerate(data[:3]):  # Show first 3 confessions
                    slot_id = confession.get('confessionSlotId', 'None')
                    band_id = confession.get('confessionBandId', 'None')
                    status = confession.get('status', 'No status')
                    scheduled = confession.get('scheduledTime', 'No time')
                    self.log(f"   Confession {i+1}: Status={status}, SlotId={slot_id}, BandId={band_id}, Time={scheduled}")
                
                self.test_results.append(("Verify Faithful Confessions", True, f"Found {len(data)} existing confessions"))
                return True
            else:
                self.log(f"❌ Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("Verify Faithful Confessions", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Failed to get confessions: {error_msg}", "ERROR")
            self.test_results.append(("Verify Faithful Confessions", False, str(error_msg)))
            return False

    def test_8_delete_confession_band(self):
        """Test 8: PROBAR ELIMINACIÓN DE FRANJA - DELETE /api/confession-bands/my-bands/[bandId]"""
        if not self.priest_token:
            self.log("❌ Cannot test: No priest token", "ERROR")
            self.test_results.append(("Delete Confession Band", False, "No priest token"))
            return False
            
        # Use the band we created in test 5, or use an existing band
        band_id_to_delete = self.test_band_id
        if not band_id_to_delete and self.existing_bands:
            band_id_to_delete = self.existing_bands[0].get('id')
            
        if not band_id_to_delete:
            self.log("❌ No band ID available for deletion test", "ERROR")
            self.test_results.append(("Delete Confession Band", False, "No band ID available"))
            return False
            
        self.log(f"🗑️ Test 8: PROBAR ELIMINACIÓN DE FRANJA - DELETE /api/confession-bands/my-bands/{band_id_to_delete}")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{band_id_to_delete}", token=self.priest_token)
        
        if response and response.status_code == 200:
            self.log("✅ Band deletion successful")
            self.test_results.append(("Delete Confession Band", True, f"Band {band_id_to_delete} deleted successfully"))
            return True
        elif response and response.status_code == 404:
            self.log("❌ Band not found for deletion", "ERROR")
            self.test_results.append(("Delete Confession Band", False, "Band not found"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band deletion failed: {error_msg}", "ERROR")
            self.test_results.append(("Delete Confession Band", False, str(error_msg)))
            return False

    def test_9_book_confession_from_band(self):
        """Test 9: PROBAR RESERVA DESDE FRANJA (CRITICAL TEST)"""
        if not self.faithful_token:
            self.log("❌ Cannot test: No faithful token", "ERROR")
            self.test_results.append(("Book Confession from Band", False, "No faithful token"))
            return False
            
        # Use an existing band for booking
        if not self.existing_bands:
            self.log("❌ No existing bands available for booking test", "ERROR")
            self.test_results.append(("Book Confession from Band", False, "No existing bands"))
            return False
            
        band_to_book = self.existing_bands[0]
        band_id = band_to_book.get('id')
        
        self.log(f"📝 Test 9: PROBAR RESERVA DESDE FRANJA - POST /api/confessions with bandId={band_id}")
        
        booking_data = {
            "confessionBandId": band_id
        }
        
        response = self.make_request("POST", "/confessions", booking_data, self.faithful_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                confession_id = data["id"]
                self.log(f"✅ CRITICAL SUCCESS: Confession booked from band: {confession_id}")
                self.test_results.append(("Book Confession from Band", True, f"CRITICAL SUCCESS: Confession booked with ID: {confession_id}"))
                return True
            else:
                self.log("❌ No confession ID returned", "ERROR")
                self.test_results.append(("Book Confession from Band", False, "No confession ID returned"))
                return False
        elif response and response.status_code == 500:
            error_data = response.json() if response else {}
            if "confessionSlotId" in str(error_data) and "NOT NULL" in str(error_data):
                self.log("❌ CRITICAL BUG: Database schema issue - confessionSlotId NOT NULL constraint", "ERROR")
                self.test_results.append(("Book Confession from Band", False, "CRITICAL BUG: Database schema issue with confessionSlotId NOT NULL constraint"))
                return False
            else:
                self.log(f"❌ 500 error: {error_data}", "ERROR")
                self.test_results.append(("Book Confession from Band", False, f"500 error: {error_data}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Booking failed: {error_msg}", "ERROR")
            self.test_results.append(("Book Confession from Band", False, str(error_msg)))
            return False

    def run_diagnostic_sequence(self):
        """Run the complete diagnostic testing sequence"""
        self.log("🚀 INICIANDO DIAGNÓSTICO DE PROBLEMAS CRÍTICOS EN CONFESAPP")
        self.log("=" * 80)
        
        # Wait for backend to be ready
        time.sleep(3)
        
        # Testing sequence as specified in review request
        tests = [
            ("1. LOGIN COMO SACERDOTE SEED", self.test_1_priest_login),
            ("2. LOGIN COMO FIEL SEED", self.test_2_faithful_login),
            ("3. VERIFICAR DATOS EXISTENTES (FRANJAS SACERDOTE)", self.test_3_verify_existing_priest_bands),
            ("4. VERIFICAR SLOTS DISPONIBLES", self.test_4_verify_available_slots),
            ("5. PROBAR CREACIÓN DE FRANJA", self.test_5_create_confession_band),
            ("6. PROBAR VALIDACIÓN DE FECHA PASADA", self.test_6_validate_past_date),
            ("7. VERIFICAR CONFESIONES EXISTENTES (FIEL)", self.test_7_verify_faithful_confessions),
            ("8. PROBAR ELIMINACIÓN DE FRANJA", self.test_8_delete_confession_band),
            ("9. PROBAR RESERVA DESDE FRANJA (CRÍTICO)", self.test_9_book_confession_from_band),
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
        self.log("🏁 DIAGNÓSTICO DE PROBLEMAS CRÍTICOS FINALIZADO!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        self.log("\n📋 DETAILED DIAGNOSTIC RESULTS:")
        for test_name, success, details in self.test_results:
            status = "✅" if success else "❌"
            self.log(f"{status} {test_name}: {details}")
        
        # Summary of critical findings
        self.log("\n🔍 CRITICAL FINDINGS SUMMARY:")
        critical_issues = []
        working_features = []
        
        for test_name, success, details in self.test_results:
            if success:
                working_features.append(test_name)
            else:
                critical_issues.append(f"{test_name}: {details}")
        
        if working_features:
            self.log("✅ WORKING FEATURES:")
            for feature in working_features:
                self.log(f"   - {feature}")
        
        if critical_issues:
            self.log("❌ CRITICAL ISSUES:")
            for issue in critical_issues:
                self.log(f"   - {issue}")
        else:
            self.log("✅ NO CRITICAL ISSUES FOUND!")
        
        return passed, failed

if __name__ == "__main__":
    tester = ConfesAppDiagnosticTester()
    passed, failed = tester.run_diagnostic_sequence()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)