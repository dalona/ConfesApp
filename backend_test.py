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
BASE_URL = "https://33b12723-aeaa-4cc2-9720-af825e7904e6.preview.emergentagent.com/api"
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
        # New variables for priest registration testing
        self.bishop_token = None
        self.bishop_user = None
        self.test_invite_token = None
        self.test_invite_email = None
        self.validated_invite_token = None
        self.validated_invite_email = None
        self.invited_priest_token = None
        self.invited_priest_user = None
        self.pending_priest_user = None
        
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
        
        # Create a fresh faithful user for this test to avoid token issues
        faithful_data = {
            "email": f"role.test.{int(time.time())}@test.com",
            "password": "RoleTest123",
            "firstName": "Role",
            "lastName": "Test",
            "role": "faithful"
        }
        
        # Register the user
        reg_response = self.make_request("POST", "/auth/register", faithful_data)
        if not reg_response or reg_response.status_code != 201:
            self.log("❌ Cannot test role access: Failed to register test user", "ERROR")
            return False
            
        test_token = reg_response.json().get("access_token")
        if not test_token:
            self.log("❌ Cannot test role access: No token received", "ERROR")
            return False
        
        # Try to create slot (should fail with 403)
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=19, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        slot_data = {
            "startTime": start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "location": "Role Test Location"
        }
        
        response = self.make_request("POST", "/confession-slots", slot_data, test_token)
        
        if response and response.status_code == 403:
            self.log("✅ Role-based access working: Faithful cannot create slots")
            return True
        else:
            status = response.status_code if response else "No response"
            self.log(f"❌ Role-based access failed: Expected 403, got {status}", "ERROR")
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
        
        # Get diocese ID from bishop user or use a test UUID
        diocese_id = "550e8400-e29b-41d4-a716-446655440000"  # Test UUID
        
        invite_data = {
            "email": f"nuevo.sacerdote.{int(time.time())}@parroquia.com",
            "role": "priest",
            "dioceseId": diocese_id,
            "message": "Te invitamos a unirte como sacerdote a nuestra diócesis"
        }
        
        response = self.make_request("POST", "/invites", invite_data, self.bishop_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id") and data.get("token"):
                self.test_invite_token = data["token"]
                self.test_invite_email = data["email"]
                self.log(f"✅ Invitation created successfully: {data['email']}")
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
        # Use the seed data token first
        seed_token = "036d051a50b642c564378e5d046611acbe5957e23c7126535953a9fbadcba7b7"
        
        self.log("Testing invitation token validation...")
        
        response = self.make_request("GET", f"/invites/by-token/{seed_token}")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("email") and data.get("role"):
                self.log(f"✅ Invitation token validated: {data['email']} as {data['role']}")
                self.validated_invite_token = seed_token
                self.validated_invite_email = data["email"]
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
        if not hasattr(self, 'validated_invite_token'):
            self.log("❌ Cannot test registration from invite: No validated token", "ERROR")
            return False
            
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
        
        response = self.make_request("POST", f"/auth/register-from-invite/{self.validated_invite_token}", register_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.invited_priest_token = data["access_token"]
                self.invited_priest_user = data["user"]
                self.log(f"✅ Priest registered from invitation: {self.invited_priest_user['email']}")
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
        
        # Get diocese ID (using test UUID)
        diocese_id = "550e8400-e29b-41d4-a716-446655440000"
        
        priest_data = {
            "email": f"padre.directo.{int(time.time())}@ejemplo.com",
            "password": "PadreDirecto123",
            "firstName": "Padre Directo",
            "lastName": "Martínez",
            "phone": "+34 555 666 777",
            "dioceseId": diocese_id,
            "bio": "Sacerdote recién ordenado buscando parroquia",
            "specialties": "Juventud, Catequesis",
            "languages": "Español"
        }
        
        response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("success") and data.get("user"):
                self.pending_priest_user = data["user"]
                self.log(f"✅ Direct priest application successful: {self.pending_priest_user['email']}")
                return True
            else:
                self.log(f"❌ Direct priest application failed: Missing success or user", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Direct priest application failed: {error_msg}", "ERROR")
            return False

    def test_bishop_approve_priest(self):
        """Test bishop approving pending priest"""
        if not self.bishop_token:
            self.log("❌ Cannot test priest approval: No bishop token", "ERROR")
            return False
            
        # Use seed data pending priest
        pending_priest_id = "pending-priest-id"  # This would come from seed data
        
        self.log("Testing bishop approving pending priest...")
        
        approval_data = {
            "approved": True
        }
        
        # Try with a test user ID first, then fall back to creating one
        response = self.make_request("PATCH", f"/auth/approve-priest/{pending_priest_id}", approval_data, self.bishop_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log("✅ Priest approval successful")
                return True
            else:
                self.log(f"❌ Priest approval failed: No success flag", "ERROR")
                return False
        else:
            # If the specific ID doesn't work, try with our created pending priest
            if hasattr(self, 'pending_priest_user'):
                response = self.make_request("PATCH", f"/auth/approve-priest/{self.pending_priest_user['id']}", approval_data, self.bishop_token)
                if response and response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log("✅ Priest approval successful (with created user)")
                        return True
            
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
        diocese_id = "550e8400-e29b-41d4-a716-446655440000"
        
        priest_data = {
            "email": f"padre.rechazo.{int(time.time())}@ejemplo.com",
            "password": "PadreRechazo123",
            "firstName": "Padre Rechazo",
            "lastName": "Test",
            "phone": "+34 999 888 777",
            "dioceseId": diocese_id,
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
            "dioceseId": "550e8400-e29b-41d4-a716-446655440000",
        }
        
        response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if response and response.status_code == 401:  # Unauthorized for existing user
            self.log("✅ Email uniqueness validation working")
            return True
        else:
            status = response.status_code if response else "No response"
            self.log(f"❌ Email uniqueness validation failed: Expected 401, got {status}", "ERROR")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting ConfesApp Backend Testing Suite")
        self.log("=" * 60)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Bishop Login", self.test_bishop_login),
            ("Bishop Create Invitation", self.test_bishop_create_invitation),
            ("Validate Invitation Token", self.test_validate_invitation_token),
            ("Register from Invitation", self.test_register_from_invitation),
            ("Direct Priest Application", self.test_direct_priest_application),
            ("Bishop Approve Priest", self.test_bishop_approve_priest),
            ("Bishop Reject Priest", self.test_bishop_reject_priest),
            ("Email Uniqueness Validation", self.test_email_uniqueness_validation),
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