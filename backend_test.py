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
        
        # Get diocese ID from bishop user or use the actual diocese ID from seed
        diocese_id = "a81d2bd3-c2e2-42ac-b4e7-66b44e4ad358"  # Actual diocese ID from seed
        
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
        seed_token = "ebe0d53471a55634e1e8b0652f19ac1f1a69eac876285928b1ba54d3873f83da"
        
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
        
        # Get diocese ID (using actual diocese ID from seed)
        diocese_id = "a81d2bd3-c2e2-42ac-b4e7-66b44e4ad358"
        
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
        diocese_id = "a81d2bd3-c2e2-42ac-b4e7-66b44e4ad358"
        
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
            "dioceseId": "a81d2bd3-c2e2-42ac-b4e7-66b44e4ad358",
        }
        
        response = self.make_request("POST", "/auth/register-priest", priest_data)
        
        if response and response.status_code == 401:  # Unauthorized for existing user
            self.log("✅ Email uniqueness validation working")
            return True
        else:
            status = response.status_code if response else "No response"
            self.log(f"❌ Email uniqueness validation failed: Expected 401, got {status}", "ERROR")
            return False

    # ===== CONFESSION BANDS TESTING =====

    def test_seed_priest_login(self):
        """Test login with seed priest data"""
        self.log("Testing seed priest login...")
        
        login_data = {
            "email": "padre.parroco@sanmiguel.es",
            "password": "Pass123!"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("access_token") and data.get("user"):
                self.seed_priest_token = data["access_token"]
                self.log(f"✅ Seed priest login successful: {data['user']['email']}")
                return True
            else:
                self.log(f"❌ Seed priest login failed: Missing token or user data", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Seed priest login failed: {error_msg}", "ERROR")
            return False

    def test_create_confession_band(self):
        """Test creating a confession band"""
        if not self.seed_priest_token:
            self.log("❌ Cannot test band creation: No seed priest token", "ERROR")
            return False
            
        self.log("Testing confession band creation...")
        
        # Create band for tomorrow
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Confesionario Principal",
            "maxCapacity": 5,
            "notes": "Franja de prueba para testing",
            "isRecurrent": False
        }
        
        response = self.make_request("POST", "/confession-bands", band_data, self.seed_priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id"):
                self.test_band_id = data["id"]
                self.log(f"✅ Confession band created successfully: {self.test_band_id}")
                return True
            else:
                self.log(f"❌ Band creation failed: No ID returned", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band creation failed: {error_msg}", "ERROR")
            return False

    def test_get_priest_bands(self):
        """Test getting priest's own bands"""
        if not self.seed_priest_token:
            self.log("❌ Cannot test getting bands: No seed priest token", "ERROR")
            return False
            
        self.log("Testing getting priest's bands...")
        
        response = self.make_request("GET", "/confession-bands/my-bands", token=self.seed_priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log(f"✅ Priest bands retrieved: {len(data)} bands found")
                return True
            else:
                self.log(f"❌ Getting bands failed: Expected array, got {type(data)}", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Getting bands failed: {error_msg}", "ERROR")
            return False

    def test_update_confession_band(self):
        """Test updating a confession band"""
        if not self.seed_priest_token or not self.test_band_id:
            self.log("❌ Cannot test band update: Missing token or band ID", "ERROR")
            return False
            
        self.log("Testing confession band update...")
        
        update_data = {
            "notes": "Franja actualizada en testing",
            "maxCapacity": 8
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}", update_data, self.seed_priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("notes") == "Franja actualizada en testing" and data.get("maxCapacity") == 8:
                self.log("✅ Confession band updated successfully")
                return True
            else:
                self.log(f"❌ Band update failed: Data not updated correctly", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band update failed: {error_msg}", "ERROR")
            return False

    def test_change_band_status(self):
        """Test changing band status"""
        if not self.seed_priest_token or not self.test_band_id:
            self.log("❌ Cannot test status change: Missing token or band ID", "ERROR")
            return False
            
        self.log("Testing band status change...")
        
        status_data = {
            "status": "cancelled"
        }
        
        response = self.make_request("PATCH", f"/confession-bands/my-bands/{self.test_band_id}/status", status_data, self.seed_priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "cancelled":
                self.log("✅ Band status changed successfully")
                return True
            else:
                self.log(f"❌ Status change failed: Status not updated", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Status change failed: {error_msg}", "ERROR")
            return False

    def test_create_recurrent_band(self):
        """Test creating a recurrent confession band"""
        if not self.seed_priest_token:
            self.log("❌ Cannot test recurrent band creation: No seed priest token", "ERROR")
            return False
            
        self.log("Testing recurrent confession band creation...")
        
        # Create recurrent band starting tomorrow
        tomorrow = datetime.now() + timedelta(days=1)
        start_time = tomorrow.replace(hour=15, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        end_recurrence = tomorrow + timedelta(days=30)  # 30 days of recurrence
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Capilla del Santísimo",
            "maxCapacity": 3,
            "isRecurrent": True,
            "recurrenceType": "weekly",
            "recurrenceDays": [1, 3, 5],  # Monday, Wednesday, Friday
            "recurrenceEndDate": end_recurrence.isoformat() + "Z"
        }
        
        response = self.make_request("POST", "/confession-bands", band_data, self.seed_priest_token)
        
        if response and response.status_code == 201:
            data = response.json()
            if data.get("id") and data.get("isRecurrent") == True:
                self.test_recurrent_band_id = data["id"]
                self.log(f"✅ Recurrent confession band created successfully: {self.test_recurrent_band_id}")
                return True
            else:
                self.log(f"❌ Recurrent band creation failed: Missing ID or not marked as recurrent", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Recurrent band creation failed: {error_msg}", "ERROR")
            return False

    def test_delete_confession_band(self):
        """Test deleting a confession band"""
        if not self.seed_priest_token:
            self.log("❌ Cannot test band deletion: No seed priest token", "ERROR")
            return False
            
        # Create a new band specifically for deletion test
        self.log("Testing confession band deletion...")
        
        tomorrow = datetime.now() + timedelta(days=2)
        start_time = tomorrow.replace(hour=18, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(hours=1)
        
        band_data = {
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "location": "Confesionario para eliminar",
            "maxCapacity": 2,
            "notes": "Banda para test de eliminación"
        }
        
        # Create the band
        create_response = self.make_request("POST", "/confession-bands", band_data, self.seed_priest_token)
        
        if not create_response or create_response.status_code != 201:
            self.log("❌ Cannot create band for deletion test", "ERROR")
            return False
            
        band_id = create_response.json()["id"]
        
        # Now delete it
        response = self.make_request("DELETE", f"/confession-bands/my-bands/{band_id}", token=self.seed_priest_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message"):
                self.log("✅ Confession band deleted successfully")
                return True
            else:
                self.log(f"❌ Band deletion failed: No confirmation message", "ERROR")
                return False
        else:
            error_msg = response.json() if response else "No response"
            self.log(f"❌ Band deletion failed: {error_msg}", "ERROR")
            return False

    def test_jwt_protection(self):
        """Test that confession-bands endpoints require JWT"""
        self.log("Testing JWT protection on confession-bands endpoints...")
        
        # Try to create band without token
        band_data = {
            "startTime": "2025-01-21T10:00:00.000Z",
            "endTime": "2025-01-21T11:00:00.000Z",
            "location": "Test Location",
            "maxCapacity": 1
        }
        
        response = self.make_request("POST", "/confession-bands", band_data)
        
        if response and response.status_code == 401:
            self.log("✅ JWT protection working: Unauthorized access blocked")
            return True
        elif response:
            status = response.status_code
            self.log(f"❌ JWT protection failed: Expected 401, got {status}", "ERROR")
            return False
        else:
            # If no response, try a simpler test
            self.log("No response received, trying alternative test...")
            try:
                import requests
                url = f"{self.base_url}/confession-bands"
                response = requests.post(url, json=band_data, headers={"Content-Type": "application/json"}, timeout=5)
                if response.status_code == 401:
                    self.log("✅ JWT protection working: Unauthorized access blocked (alternative test)")
                    return True
                else:
                    self.log(f"❌ JWT protection failed: Expected 401, got {response.status_code}", "ERROR")
                    return False
            except Exception as e:
                self.log(f"❌ JWT protection test failed with exception: {e}", "ERROR")
                return False

    def test_error_cases(self):
        """Test various error cases"""
        if not self.seed_priest_token:
            self.log("❌ Cannot test error cases: No seed priest token", "ERROR")
            return False
            
        self.log("Testing error cases...")
        
        # Test 1: Create band with past date
        yesterday = datetime.now() - timedelta(days=1)
        past_band_data = {
            "startTime": yesterday.isoformat() + "Z",
            "endTime": (yesterday + timedelta(hours=1)).isoformat() + "Z",
            "location": "Past Location",
            "maxCapacity": 1
        }
        
        response = self.make_request("POST", "/confession-bands", past_band_data, self.seed_priest_token)
        
        if not response or response.status_code != 400:
            self.log("❌ Past date validation failed", "ERROR")
            return False
            
        # Test 2: Try to access non-existent band
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = self.make_request("GET", f"/confession-bands/my-bands/{fake_id}", token=self.seed_priest_token)
        
        if not response or response.status_code != 404:
            self.log("❌ Non-existent band handling failed", "ERROR")
            return False
            
        self.log("✅ Error cases handled correctly")
        return True

    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting ConfesApp Backend Testing Suite")
        self.log("=" * 60)
        
        tests = [
            ("Health Check", self.test_health_check),
            ("Seed Priest Login", self.test_seed_priest_login),
            ("Create Confession Band", self.test_create_confession_band),
            ("Get Priest Bands", self.test_get_priest_bands),
            ("Update Confession Band", self.test_update_confession_band),
            ("Change Band Status", self.test_change_band_status),
            ("Create Recurrent Band", self.test_create_recurrent_band),
            ("Delete Confession Band", self.test_delete_confession_band),
            ("JWT Protection", self.test_jwt_protection),
            ("Error Cases", self.test_error_cases),
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