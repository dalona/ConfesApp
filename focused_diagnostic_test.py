#!/usr/bin/env python3
"""
ConfesApp Backend - FOCUSED DIAGNOSTIC TEST
Testing ONLY the specific issues reported by user:
1. DELETE /api/confession-bands/my-bands/:id (priest franja deletion)
2. PATCH /api/confessions/:id/cancel (faithful confession cancellation)
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "https://confes-scheduler.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

def log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def make_request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = HEADERS.copy()
    
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
        
        return response
    except Exception as e:
        log(f"❌ Request failed: {e}")
        return None

def main():
    log("🚀 FOCUSED DIAGNOSTIC TEST - DELETE & CANCEL FUNCTIONALITY")
    log("=" * 70)
    
    # Step 1: Login as priest
    log("🔐 Step 1: Priest Login")
    priest_login = {
        "email": "padre.parroco@sanmiguel.es",
        "password": "Pass123!"
    }
    
    response = make_request("POST", "/auth/login", priest_login)
    if not response or response.status_code != 201:
        log("❌ PRIEST LOGIN FAILED")
        return
    
    priest_data = response.json()
    priest_token = priest_data.get("access_token")
    log("✅ Priest login successful")
    
    # Step 2: Login as faithful
    log("🔐 Step 2: Faithful Login")
    faithful_login = {
        "email": "fiel1@ejemplo.com",
        "password": "Pass123!"
    }
    
    response = make_request("POST", "/auth/login", faithful_login)
    if not response or response.status_code != 201:
        log("❌ FAITHFUL LOGIN FAILED")
        return
    
    faithful_data = response.json()
    faithful_token = faithful_data.get("access_token")
    log("✅ Faithful login successful")
    
    # Step 3: Get priest bands
    log("📋 Step 3: Get Priest Bands")
    response = make_request("GET", "/confession-bands/my-bands", token=priest_token)
    if not response or response.status_code != 200:
        log("❌ GET BANDS FAILED")
        return
    
    bands = response.json()
    log(f"✅ Retrieved {len(bands)} bands")
    
    if not bands:
        log("❌ No bands found for deletion test")
        return
    
    # Step 4: TEST DELETE BAND (CRITICAL)
    log("🗑️ Step 4: TEST DELETE BAND - CRITICAL")
    band_to_delete = bands[0]
    band_id = band_to_delete.get("id")
    log(f"🎯 Attempting to delete band: {band_id}")
    
    response = make_request("DELETE", f"/confession-bands/my-bands/{band_id}", token=priest_token)
    
    if response and response.status_code == 200:
        log("✅ DELETE BAND SUCCESS - Backend API working!")
        delete_result = "WORKING"
    else:
        status = response.status_code if response else "No response"
        error = response.json() if response else "Network error"
        log(f"❌ DELETE BAND FAILED - Status: {status}, Error: {error}")
        delete_result = f"FAILED - {status}"
    
    # Step 5: Get faithful confessions
    log("📋 Step 5: Get Faithful Confessions")
    response = make_request("GET", "/confessions", token=faithful_token)
    if not response or response.status_code != 200:
        log("❌ GET CONFESSIONS FAILED")
        return
    
    confessions = response.json()
    log(f"✅ Retrieved {len(confessions)} confessions")
    
    # Find a bookable confession
    bookable_confession = None
    for conf in confessions:
        if conf.get("status") == "booked":
            bookable_confession = conf
            break
    
    if not bookable_confession:
        log("❌ No bookable confessions found for cancellation test")
        cancel_result = "NO DATA"
    else:
        # Step 6: TEST CANCEL CONFESSION (CRITICAL)
        log("❌ Step 6: TEST CANCEL CONFESSION - CRITICAL")
        confession_id = bookable_confession.get("id")
        log(f"🎯 Attempting to cancel confession: {confession_id}")
        
        response = make_request("PATCH", f"/confessions/{confession_id}/cancel", {}, faithful_token)
        
        if response and response.status_code == 200:
            result_data = response.json()
            if result_data.get("status") == "cancelled":
                log("✅ CANCEL CONFESSION SUCCESS - Backend API working!")
                cancel_result = "WORKING"
            else:
                log(f"❌ CANCEL FAILED - Status not updated: {result_data.get('status')}")
                cancel_result = "FAILED - Status not updated"
        else:
            status = response.status_code if response else "No response"
            error = response.json() if response else "Network error"
            log(f"❌ CANCEL CONFESSION FAILED - Status: {status}, Error: {error}")
            cancel_result = f"FAILED - {status}"
    
    # Final Results
    log("=" * 70)
    log("🏁 DIAGNOSTIC RESULTS:")
    log(f"🗑️ DELETE FRANJAS (Priest): {delete_result}")
    log(f"❌ CANCEL CONFESSIONS (Faithful): {cancel_result}")
    log("=" * 70)
    
    if delete_result == "WORKING" and cancel_result == "WORKING":
        log("✅ CONCLUSION: Both backend APIs are working correctly!")
        log("   The reported issues are likely FRONTEND problems, not backend.")
    elif delete_result == "WORKING":
        log("✅ DELETE API working, ❌ CANCEL API has issues")
    elif cancel_result == "WORKING":
        log("❌ DELETE API has issues, ✅ CANCEL API working")
    else:
        log("❌ Both APIs have issues - backend problems confirmed")

if __name__ == "__main__":
    main()