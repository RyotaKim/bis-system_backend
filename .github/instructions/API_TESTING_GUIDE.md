# BIS System Backend - API Testing Guide

This guide provides curl commands and Postman examples to test all backend API endpoints.

## Quick Start

1. Server is running at: `http://localhost:3000`
2. Default admin credentials:
   - Username: `admin`
   - Password: `admin123`

---

## 1. Authentication Routes

### 1.1 Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "672a1234567890abcd1234ef",
    "name": "System Administrator",
    "role": "admin",
    "username": "admin"
  }
}
```

Save the token for authenticated requests.

### 1.2 Create New Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "password": "securepassword",
    "name": "New Admin",
    "contactNumber": "+1987654321"
  }'
```

---

## 2. Resident Routes (No Authentication Required)

### 2.1 File a Request
```bash
curl -X POST http://localhost:3000/api/resident/request \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Dela Cruz",
    "contactNumber": "09123456789",
    "address": "123 Main Street, Barangay Sample",
    "purpose": "Employment",
    "eduAttainment": "Bachelor Degree",
    "eduCourse": "Computer Science",
    "age": 26,
    "maritalStatus": "Single",
    "docTypeId": "DOCUMENT_TYPE_ID_HERE"
  }'
```

**First, get document types:**
```bash
curl http://localhost:3000/api/document-types
```

Use one of the returned IDs in the `docTypeId` field.

**Expected Response:**
```json
{
  "message": "Request filed successfully",
  "ref": "REQ-2025-10-00001",
  "request": {
    "_id": "672a1234567890abcd1234ef",
    "ref": "REQ-2025-10-00001",
    "fullName": "Juan Dela Cruz",
    "status": "pending",
    "createdAt": "2025-10-21T10:30:00Z",
    ...
  }
}
```

**Save the reference number** (e.g., `REQ-2025-10-00001`) for status checking.

### 2.2 Check Request Status
```bash
curl "http://localhost:3000/api/resident/request/status?ref=REQ-2025-10-00001"
```

### 2.3 File a Complaint
# This endpoint is now admin-only. Residents cannot file complaints.

---

## 3. Admin Routes (Authentication Required)

**All admin routes require a JWT token in the Authorization header:**
```bash
Authorization: Bearer <your-jwt-token>
```

### 3.1 Get Dashboard Statistics
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "totalRequests": 5,
  "totalComplaints": 2,
  "pendingRequests": 3,
  "resolvedComplaints": 1,
  "approvedRequests": 1,
  "rejectedRequests": 1
}
```

### 3.2 Get All Requests
```bash
curl -X GET http://localhost:3000/api/admin/requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.3 Get Request by ID
```bash
curl -X GET http://localhost:3000/api/admin/requests/REQUEST_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.4 Update Request Status
```bash
curl -X PUT http://localhost:3000/api/admin/requests/REQUEST_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

**Valid statuses:** `pending`, `approved`, `rejected`

### 3.5 Delete Request
```bash
curl -X DELETE http://localhost:3000/api/admin/requests/REQUEST_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.6 Get All Complaints
```bash
curl -X GET http://localhost:3000/api/admin/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.7 Get Complaint by ID
```bash
curl -X GET http://localhost:3000/api/admin/complaints/COMPLAINT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.8 Update Complaint Status
```bash
curl -X PUT http://localhost:3000/api/admin/complaints/COMPLAINT_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'
```

**Valid statuses:** `pending`, `in_progress`, `resolved`

### 3.9 Delete Complaint
```bash
curl -X DELETE http://localhost:3000/api/admin/complaints/COMPLAINT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.10 Encode a Complaint (Admin Only)
```bash
curl -X POST http://localhost:3000/api/admin/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "reporterName": "Maria Santos",
    "contactNumber": "09198765432",
    "address": "456 Oak Avenue",
    "complaintType": "Noise Disturbance",
    "description": "Loud music and parties until late night from the neighboring house"
  }'
```

**Expected Response:**
```json
{
  "message": "Complaint encoded successfully",
  "ref": "CMPL-2025-10-00001",
  "complaint": { ... }
}
```

---

## 4. Analytics Routes (Admin Only)

### 4.1 Get Weekly Request Statistics
```bash
curl -X GET http://localhost:3000/api/analytics/weekly-requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "requestStats": [
    {
      "_id": {
        "date": "2025-10-21",
        "docType": "Barangay Clearance"
      },
      "count": 2
    },
    {
      "_id": {
        "date": "2025-10-22",
        "docType": "Business Permit"
      },
      "count": 1
    }
  ]
}
```

### 4.2 Get Complaint Resolution Rate
```bash
curl -X GET http://localhost:3000/api/analytics/complaint-resolution \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4.3 Get All Analytics
```bash
curl -X GET http://localhost:3000/api/analytics/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Using Postman

### 1. Import as Environment Variables
```json
{
  "base_url": "http://localhost:3000",
  "token": "your-token-here"
}
```

### 2. Set Authorization
For authenticated requests, go to the **Authorization** tab:
- Type: `Bearer Token`
- Token: `{{token}}`

### 3. Sample Collection
Create requests with the following base structure:

**POST Request Example:**
```
Method: POST
URL: {{base_url}}/api/resident/request
Headers: Content-Type: application/json
Body (raw JSON):
{
  "fullName": "Test User",
  "contactNumber": "09123456789",
  ...
}
```

---

## Common Issues & Solutions

### 1. "Invalid credentials" error
- Verify username and password
- Default credentials: `admin` / `admin123`

### 2. "No token provided" error
- Make sure to include the Authorization header
- Format: `Authorization: Bearer <token>`

### 3. "Admin access required" error
- User role must be 'admin'
- Use the token from admin login

### 4. MongoDB connection errors
- Verify MONGODB_URI in .env file
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check username and password in connection string

### 5. CORS errors in frontend
- CORS is enabled in the backend
- Ensure frontend is making requests to correct API URL
- Check browser console for specific CORS error

---

## Performance Tips

1. **Pagination (Future Enhancement)**
   - Consider adding limit and skip parameters for large datasets

2. **Database Indexing**
   - Ensure indexes on frequently queried fields (ref, status, createdAt)

3. **Caching**
   - Consider caching document types (rarely changes)

4. **Rate Limiting**
   - Implement rate limiting to prevent abuse

---

## Next Steps

1. ✅ Backend API is fully functional
2. Frontend development can now proceed
3. Integrate frontend with these API endpoints
4. Add file upload functionality (if needed)
5. Implement email notifications

For detailed API documentation, see `README.md`.
