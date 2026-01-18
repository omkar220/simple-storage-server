Simple Storage – Backend + QA Automation Assignment

Backend:
Node.js + Express + MongoDB + JWT Authentication

Features Implemented:
- User Registration
- User Login with JWT
- File Upload
- File List
- File Download
- File Delete

QA Automation:
- Pytest + Requests
- Automated API test coverage:
  - Health Check
  - Register
  - Login
  - Upload File
  - List Files
  - Download File
  - Delete File

How to Run Backend:

1) Install dependencies
   npm install

2) Create .env file (not committed):
   APP_SECRET=MyStrongSecret123
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/simple-storage
   AWS_BUCKET=<your-bucket-name>
   AWS_ACCESS_KEY_ID=<your-key>
   AWS_SECRET_ACCESS_KEY=<your-secret>
   AWS_REGION=ap-south-1

3) Start server
   npm start

How to Run QA Tests:

cd QA-Automation
pip install -r requirements.txt
pytest test_api.py --html=report.html

All tests pass successfully.

Author:
Omkar Irale
