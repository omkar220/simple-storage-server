import requests
import pytest
import os
import random
import time
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:8080"
SAMPLE_FILE = "sample.txt"

# -----------------------------
# Helper functions
# -----------------------------
def create_sample_file(filename=SAMPLE_FILE):
    """Create a sample file if it doesn't exist"""
    if not os.path.exists(filename):
        with open(filename, "w") as f:
            f.write("This is a sample file for QA automation assignment.")

def get_bearer_header(token):
    return {"Authorization": f"Bearer {token}"}

# -----------------------------
# Auth fixture
# -----------------------------
@pytest.fixture(scope="session")
def auth_token():
    USERNAME = f"testuser{random.randint(1000,9999)}"
    PASSWORD = "Test@123"
    EMAIL = f"{USERNAME}@example.com"

    # Register user
    payload = {"username": USERNAME, "password": PASSWORD, "email": EMAIL}
    r = requests.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code == 204, f"Register failed: {r.status_code}"
    time.sleep(0.2)

    # Login user
    r = requests.get(f"{BASE_URL}/login", auth=HTTPBasicAuth(USERNAME, PASSWORD))
    assert r.status_code == 200, f"Login failed: {r.status_code}"

    token = r.json()
    assert token, "Token not returned from login"
    print("\nTOKEN:", token)
    return token

# -----------------------------
# Test Cases
# -----------------------------

def test_health_check():
    r = requests.get(BASE_URL)
    assert r.status_code in [200, 404]

def test_file_upload(auth_token):
    # Each test gets unique file name to avoid conflicts
    unique_filename = f"sample_{random.randint(1000,9999)}.txt"
    create_sample_file(unique_filename)
    url = f"{BASE_URL}/files/{unique_filename}"

    with open(unique_filename, "rb") as f:
        r = requests.post(url, files={"file": f}, headers=get_bearer_header(auth_token))

    assert r.status_code == 201, f"Upload failed: {r.status_code}"
    # Save the uploaded filename for dependent tests
    global LAST_UPLOADED_FILE
    LAST_UPLOADED_FILE = unique_filename

def test_file_download(auth_token):
    # Use the last uploaded file
    url = f"{BASE_URL}/files/{LAST_UPLOADED_FILE}"
    r = requests.get(url, headers=get_bearer_header(auth_token))
    assert r.status_code == 200

    # Save downloaded file locally
    with open(f"downloaded_{LAST_UPLOADED_FILE}", "w") as f:
        f.write(str(r.json()))

def test_file_list(auth_token):
    r = requests.get(f"{BASE_URL}/files/", headers=get_bearer_header(auth_token))
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_file_delete(auth_token):
    # Use the last uploaded file
    url = f"{BASE_URL}/files/{LAST_UPLOADED_FILE}"
    r = requests.delete(url, headers=get_bearer_header(auth_token))
    assert r.status_code == 204
