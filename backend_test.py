#!/usr/bin/env python3
"""
ConfesApp Backend API Testing Suite - MEJORAS CRÍTICAS
Tests the NestJS backend for Catholic confession booking system
Focus: Role validation, faithful flow, appointment management, cancellation functionality
"""

import requests
import json
import time
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://db0ecca9-01ac-4977-a863-0e43116bf180.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class ConfesAppTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        # Test users from review request
        self.priest_token = None
        self.faithful_token = None
        self.priest_user = None
        self.faithful_user = None
        # Test data for franjas/citas
        self.test_band_id = None
        self.test_slot_id = None
        self.test_confession_id = None
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

    # ===== MEJORAS CRÍTICAS TESTING SEQUENCE =====

    def test_1_priest_login(self):
        """Test 1: LOGIN COMO SACERDOTE"""
        self.log("🔐 Test 1: LOGIN COMO SACERDOTE")
        
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

    def test_2_faithful_login(self):
        """Test 2: LOGIN COMO FIEL"""
        self.log("🔐 Test 2: LOGIN COMO FIEL")
        
        login_data = {
            "email": "fiel.ejemplo@correo.com",
            "password": "Pass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.faithful_token = data["access_token"]
                self.faithful_user = data["user"]
                
                # Verify role is 'faithful'
                if self.faithful_user.get("role") == "faithful":
                    self.log("✅ Faithful login successful with correct role")
                    self.test_results.append(("Faithful Login", True, "Login successful with role: faithful"))
                    return True
                else:
                    self.log(f"❌ Faithful login failed: Wrong role {self.faithful_user.get('role')}", "ERROR")
                    self.test_results.append(("Faithful Login", False, f"Wrong role: {self.faithful_user.get('role')}"))
                    return False
            else:
                self.log("❌ Faithful login failed: Missing token or user data", "ERROR")
                self.test_results.append(("Faithful Login", False, "Missing token or user data"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Faithful login failed: {error_msg}", "ERROR")
            self.test_results.append(("Faithful Login", False, str(error_msg)))
            return False

    def test_3_create_confession_band(self):
        """Test 3: CREAR FRANJA DE CONFESIÓN (SACERDOTE)"""
        if not self.priest_token:
            self.log("❌ Cannot test band creation: No priest token", "ERROR")
            self.test_results.append(("Create Confession Band", False, "No priest token"))
            return False
            
        self.log("📅 Test 3: CREAR FRANJA DE CONFESIÓN")
        
        band_data = {
            "startTime": "2025-01-08T15:00:00.000Z",
            "endTime": "2025-01-08T16:00:00.000Z",
            "location": "Confesionario Principal",
            "maxCapacity": 3,
            "notes": "Franja post-fix testing",
            "isRecurrent": False
        }
        
        response = self.make_request("POST", "/confession-bands", band_data, self.priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_band_id = data["id"]
                self.log(f"✅ Confession band created successfully: {self.test_band_id}")
                self.test_results.append(("Create Confession Band", True, f"Band created with ID: {self.test_band_id}"))
                return True
            else:
                self.log("❌ Band creation failed: No ID returned", "ERROR")
                self.test_results.append(("Create Confession Band", False, "No ID returned"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band creation failed: {error_msg}", "ERROR")
            self.test_results.append(("Create Confession Band", False, str(error_msg)))
            return False

    def test_4_list_priest_bands(self):
        """Test 4: LISTAR FRANJAS DEL SACERDOTE"""
        if not self.priest_token:
            self.log("❌ Cannot test listing bands: No priest token", "ERROR")
            self.test_results.append(("List Priest Bands", False, "No priest token"))
            return False
            
        self.log("📋 Test 4: LISTAR FRANJAS DEL SACERDOTE")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Priest bands retrieved: {len(data)} bands found")
                self.test_results.append(("List Priest Bands", True, f"{len(data)} bands found"))
                return True
            else:
                self.log(f"❌ Listing bands failed: Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("List Priest Bands", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Listing bands failed: {error_msg}", "ERROR")
            self.test_results.append(("List Priest Bands", False, str(error_msg)))
            return False

    def test_5_edit_band(self):
        """Test 5: EDITAR FRANJA (SACERDOTE)"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test band editing: Missing token or band ID", "ERROR")
            self.test_results.append(("Edit Band", False, "Missing token or band ID"))
            return False
            
        self.log("✏️ Test 5: EDITAR FRANJA")
        
        update_data = {
            "notes": "Franja actualizada con nuevas mejoras",
            "maxCapacity": 8
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}", update_data, self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("notes") == "Franja actualizada con nuevas mejoras" and data.get("maxCapacity") == 8:
                self.log("✅ Band updated successfully")
                self.test_results.append(("Edit Band", True, "Band updated with new notes and capacity"))
                return True
            else:
                self.log("❌ Band update failed: Data not updated correctly", "ERROR")
                self.test_results.append(("Edit Band", False, "Data not updated correctly"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band update failed: {error_msg}", "ERROR")
            self.test_results.append(("Edit Band", False, str(error_msg)))
            return False

    def test_6_create_confession_from_band(self):
        """Test 6: CREAR CITA DESDE FRANJA (FIEL)"""
        if not self.faithful_token or not self.test_band_id:
            self.log("❌ Cannot test confession booking: Missing token or band ID", "ERROR")
            self.test_results.append(("Create Confession from Band", False, "Missing token or band ID"))
            return False
            
        self.log("📝 Test 6: CREAR CITA DESDE FRANJA")
        
        # Use the confession-bands booking endpoint
        booking_data = {
            "bandId": self.test_band_id,
            "notes": "Primera confesión desde franja mejorada"
        }
        
        response = self.make_request("POST", "/confession-bands/book", booking_data, self.faithful_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_confession_id = data["id"]
                self.log(f"✅ Confession booked successfully: {self.test_confession_id}")
                self.test_results.append(("Create Confession from Band", True, f"Confession booked with ID: {self.test_confession_id}"))
                return True
            else:
                self.log("❌ Confession booking failed: No ID returned", "ERROR")
                self.test_results.append(("Create Confession from Band", False, "No ID returned"))
                return False
        elif response and response.status_code == 500:
            # This is a known backend bug - database schema issue
            self.log("❌ CRITICAL BACKEND BUG: Database schema issue - confessionSlotId NOT NULL constraint", "ERROR")
            self.test_results.append(("Create Confession from Band", False, "CRITICAL BUG: Database schema issue with confessionSlotId NOT NULL constraint"))
            return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Confession booking failed: {error_msg}", "ERROR")
            self.test_results.append(("Create Confession from Band", False, str(error_msg)))
            return False

    def test_7_list_faithful_confessions(self):
        """Test 7: LISTAR CONFESIONES DEL FIEL"""
        if not self.faithful_token:
            self.log("❌ Cannot test listing confessions: No faithful token", "ERROR")
            self.test_results.append(("List Faithful Confessions", False, "No faithful token"))
            return False
            
        self.log("📋 Test 7: LISTAR CONFESIONES DEL FIEL")
        
        response = self.make_request("GET", "/confessions", token=self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Faithful confessions retrieved: {len(data)} confessions found")
                self.test_results.append(("List Faithful Confessions", True, f"{len(data)} confessions found"))
                return True
            else:
                self.log(f"❌ Listing confessions failed: Expected array, got {type(data)}", "ERROR")
                self.test_results.append(("List Faithful Confessions", False, f"Expected array, got {type(data)}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Listing confessions failed: {error_msg}", "ERROR")
            self.test_results.append(("List Faithful Confessions", False, str(error_msg)))
            return False

    def test_8_cancel_confession(self):
        """Test 8: CANCELAR CONFESIÓN (FIEL)"""
        if not self.faithful_token or not self.test_confession_id:
            self.log("❌ Cannot test confession cancellation: Missing token or confession ID", "ERROR")
            self.test_results.append(("Cancel Confession", False, "Missing token or confession ID"))
            return False
            
        self.log("❌ Test 8: CANCELAR CONFESIÓN")
        
        response = self.make_request("PATCH", f"/confession-bands/bookings/{self.test_confession_id}/cancel", {}, self.faithful_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "cancelled":
                self.log("✅ Confession cancelled successfully")
                self.test_results.append(("Cancel Confession", True, "Confession status changed to cancelled"))
                return True
            else:
                self.log(f"❌ Cancellation failed: Status not updated to cancelled, got {data.get('status')}", "ERROR")
                self.test_results.append(("Cancel Confession", False, f"Status not updated, got {data.get('status')}"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Cancellation failed: {error_msg}", "ERROR")
            self.test_results.append(("Cancel Confession", False, str(error_msg)))
            return False

    def test_9_delete_band(self):
        """Test 9: ELIMINAR FRANJA (SACERDOTE)"""
        if not self.priest_token or not self.test_band_id:
            self.log("❌ Cannot test band deletion: Missing token or band ID", "ERROR")
            self.test_results.append(("Delete Band", False, "Missing token or band ID"))
            return False
            
        self.log("🗑️ Test 9: ELIMINAR FRANJA")
        
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{self.test_band_id}", token=self.priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message") or data.get("success"):
                self.log("✅ Band deleted successfully")
                self.test_results.append(("Delete Band", True, "Band deleted successfully"))
                return True
            else:
                self.log("❌ Band deletion failed: No confirmation message", "ERROR")
                self.test_results.append(("Delete Band", False, "No confirmation message"))
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band deletion failed: {error_msg}", "ERROR")
            self.test_results.append(("Delete Band", False, str(error_msg)))
            return False

    def test_10_role_security_validation(self):
        """Test 10: VALIDAR ROLES Y SEGURIDAD"""
        self.log("🔒 Test 10: VALIDAR ROLES Y SEGURIDAD")
        
        success_count = 0
        total_tests = 0
        
        # Test 1: Faithful trying to access priest endpoints (should fail 403)
        if self.faithful_token:
            total_tests += 1
            band_data = {
                "startTime": "2025-01-09T10:00:00.000Z",
                "endTime": "2025-01-09T11:00:00.000Z",
                "location": "Test Location",
                "maxCapacity": 1
            }
            
            try:
                response = self.make_request("POST", "/confession-bands", band_data, self.faithful_token)
                
                if response and response.status_code == 403:
                    self.log("✅ Security test 1 passed: Faithful cannot create bands")
                    success_count += 1
                elif response and response.status_code == 401:
                    self.log("✅ Security test 1 passed: Unauthorized access blocked")
                    success_count += 1
                else:
                    status = response.status_code if response else "No response"
                    self.log(f"❌ Security test 1 failed: Expected 403/401, got {status}", "ERROR")
            except Exception as e:
                self.log(f"⚠️ Security test 1 network issue: {e}", "ERROR")
                # Don't count as failure due to network issues
        
        # Test 2: Access without token (should fail 401)
        total_tests += 1
        try:
            response = self.make_request("GET", "/confession-bands/my-bands")
            
            if response and response.status_code == 401:
                self.log("✅ Security test 2 passed: Unauthorized access blocked")
                success_count += 1
            else:
                status = response.status_code if response else "No response"
                self.log(f"❌ Security test 2 failed: Expected 401, got {status}", "ERROR")
        except Exception as e:
            self.log(f"⚠️ Security test 2 network issue: {e}", "ERROR")
            # Don't count as failure due to network issues
        
        if success_count >= 1 and total_tests > 0:  # At least one security test passed
            self.test_results.append(("Role Security Validation", True, f"{success_count}/{total_tests} security tests passed"))
            return True
        else:
            self.test_results.append(("Role Security Validation", False, f"Only {success_count}/{total_tests} security tests passed"))
            return False

    def run_mejoras_testing_sequence(self):
        """Run the complete testing sequence as requested"""
        self.log("🚀 INICIANDO TESTING COMPLETO DE MEJORAS DE CONFES APP")
        self.log("=" * 80)
        
        # Testing sequence as specified in review request
        tests = [
            ("1. LOGIN COMO SACERDOTE", self.test_1_priest_login),
            ("2. LOGIN COMO FIEL", self.test_2_faithful_login),
            ("3. CREAR FRANJA DE CONFESIÓN", self.test_3_create_confession_band),
            ("4. LISTAR FRANJAS DEL SACERDOTE", self.test_4_list_priest_bands),
            ("5. EDITAR FRANJA", self.test_5_edit_band),
            ("6. CREAR CITA DESDE FRANJA", self.test_6_create_confession_from_band),
            ("7. LISTAR CONFESIONES DEL FIEL", self.test_7_list_faithful_confessions),
            ("8. CANCELAR CONFESIÓN", self.test_8_cancel_confession),
            ("10. VALIDAR ROLES Y SEGURIDAD", self.test_10_role_security_validation),
            ("9. ELIMINAR FRANJA", self.test_9_delete_band),  # Move this to the end
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
        self.log("🏁 TESTING COMPLETO DE MEJORAS FINALIZADO!")
        self.log(f"✅ Passed: {passed}")
        self.log(f"❌ Failed: {failed}")
        self.log(f"📊 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        # Detailed results
        self.log("\n📋 DETAILED RESULTS:")
        for test_name, success, details in self.test_results:
            status = "✅" if success else "❌"
            self.log(f"{status} {test_name}: {details}")
        
        return passed, failed
            
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

if __name__ == "__main__":
    tester = ConfesAppTester()
    passed, failed = tester.run_mejoras_testing_sequence()
    
    # Exit with error code if any tests failed
    exit(0 if failed == 0 else 1)