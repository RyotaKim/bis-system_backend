# BIS System Frontend - Backend Integration Guide

Your backend API is now ready to be consumed by your frontend application. This guide shows how to integrate with the API from different frontend frameworks.

## Backend API Base URL

```
http://localhost:3000
```

For production, update this to your deployed backend URL.

---

## 1. Setup API Client Configuration

### Create an API configuration file

**JavaScript/React (`src/api/config.js`):**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,

  // Resident
  FILE_REQUEST: `${API_BASE_URL}/api/resident/request`,
  CHECK_STATUS: `${API_BASE_URL}/api/resident/request/status`,

  // Document Types
  GET_DOCUMENT_TYPES: `${API_BASE_URL}/api/document-types`,

  // Admin
  DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  GET_REQUESTS: `${API_BASE_URL}/api/admin/requests`,
  GET_REQUEST: (id) => `${API_BASE_URL}/api/admin/requests/${id}`,
  UPDATE_REQUEST_STATUS: (id) => `${API_BASE_URL}/api/admin/requests/${id}/status`,
  DELETE_REQUEST: (id) => `${API_BASE_URL}/api/admin/requests/${id}`,

  GET_COMPLAINTS: `${API_BASE_URL}/api/admin/complaints`,
  GET_COMPLAINT: (id) => `${API_BASE_URL}/api/admin/complaints/${id}`,
  UPDATE_COMPLAINT_STATUS: (id) => `${API_BASE_URL}/api/admin/complaints/${id}/status`,
  DELETE_COMPLAINT: (id) => `${API_BASE_URL}/api/admin/complaints/${id}`,
  CREATE_COMPLAINT: `${API_BASE_URL}/api/admin/complaints`,

  // Analytics
  WEEKLY_REQUESTS: `${API_BASE_URL}/api/analytics/weekly-requests`,
  COMPLAINT_RESOLUTION: `${API_BASE_URL}/api/analytics/complaint-resolution`,
  ALL_ANALYTICS: `${API_BASE_URL}/api/analytics/all`
};
```

**Update `.env` file:**
```env
REACT_APP_API_URL=http://localhost:3000
```

---

## 2. Create API Service Functions

### Generic API Service (`src/api/service.js`)

```javascript
import { API_ENDPOINTS } from './config';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  getPublicHeader() {
    return {
      'Content-Type': 'application/json'
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }

  // Authentication
  async login(username, password) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: this.getPublicHeader(),
      body: JSON.stringify({ username, password })
    });
    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  async register(username, password, name, contactNumber) {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: this.getPublicHeader(),
      body: JSON.stringify({ username, password, name, contactNumber })
    });
    return this.handleResponse(response);
  }

  // Resident - Requests
  async fileRequest(requestData) {
    const response = await fetch(API_ENDPOINTS.FILE_REQUEST, {
      method: 'POST',
      headers: this.getPublicHeader(),
      body: JSON.stringify(requestData)
    });
    return this.handleResponse(response);
  }

  async checkRequestStatus(ref) {
    const url = new URL(API_ENDPOINTS.CHECK_STATUS);
    url.searchParams.append('ref', ref);
    const response = await fetch(url, {
      headers: this.getPublicHeader()
    });
    return this.handleResponse(response);
  }

  // Admin - Dashboard
  async getDashboardStats() {
    const response = await fetch(API_ENDPOINTS.DASHBOARD, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  // Admin - Requests
  async getAllRequests() {
    const response = await fetch(API_ENDPOINTS.GET_REQUESTS, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async getRequestById(id) {
    const response = await fetch(API_ENDPOINTS.GET_REQUEST(id), {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async updateRequestStatus(id, status) {
    const response = await fetch(API_ENDPOINTS.UPDATE_REQUEST_STATUS(id), {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }

  async deleteRequest(id) {
    const response = await fetch(API_ENDPOINTS.DELETE_REQUEST(id), {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  // Admin - Complaints
  async getAllComplaints() {
    const response = await fetch(API_ENDPOINTS.GET_COMPLAINTS, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async getComplaintById(id) {
    const response = await fetch(API_ENDPOINTS.GET_COMPLAINT(id), {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async updateComplaintStatus(id, status) {
    const response = await fetch(API_ENDPOINTS.UPDATE_COMPLAINT_STATUS(id), {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }

  async deleteComplaint(id) {
    const response = await fetch(API_ENDPOINTS.DELETE_COMPLAINT(id), {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  // To encode a complaint (admin only):
  async createComplaint(complaintData) {
    const response = await fetch(API_ENDPOINTS.CREATE_COMPLAINT, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(complaintData)
    });
    return this.handleResponse(response);
  }

  // Analytics
  async getWeeklyRequests() {
    const response = await fetch(API_ENDPOINTS.WEEKLY_REQUESTS, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async getComplaintResolution() {
    const response = await fetch(API_ENDPOINTS.COMPLAINT_RESOLUTION, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }

  async getAllAnalytics() {
    const response = await fetch(API_ENDPOINTS.ALL_ANALYTICS, {
      headers: this.getAuthHeader()
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();
```

---

## 3. React Component Examples

### Login Component (`src/pages/AdminLogin.jsx`)

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/service';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(username, password);
      alert(`Welcome, ${response.user.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### File Request Component (`src/pages/FileRequest.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../api/service';

export default function FileRequest() {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address: '',
    purpose: '',
    eduAttainment: '',
    eduCourse: '',
    age: '',
    maritalStatus: '',
    docTypeId: ''
  });

  const [docTypes, setDocTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const data = await ApiService.getDocumentTypes();
      setDocTypes(data.docTypes);
    } catch (err) {
      setMessage('Error loading document types');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await ApiService.fileRequest(formData);
      setReferenceNumber(response.ref);
      setMessage(`Request filed successfully! Reference: ${response.ref}`);
      setFormData({
        fullName: '',
        contactNumber: '',
        address: '',
        purpose: '',
        eduAttainment: '',
        eduCourse: '',
        age: '',
        maritalStatus: '',
        docTypeId: ''
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-form">
      <h2>File a Request</h2>
      {message && <p className="message">{message}</p>}
      {referenceNumber && <p className="success">Save this reference: {referenceNumber}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />
        
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="eduAttainment"
          placeholder="Educational Attainment (if any)"
          value={formData.eduAttainment}
          onChange={handleChange}
        />
        
        <input
          type="text"
          name="eduCourse"
          placeholder="Educational Course (if student)"
          value={formData.eduCourse}
          onChange={handleChange}
        />
        
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
        
        <select
          name="docTypeId"
          value={formData.docTypeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Document Type</option>
          {docTypes.map(doc => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
            </option>
          ))}
        </select>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Filing...' : 'File Request'}
        </button>
      </form>
    </div>
  );
}
```

### Check Request Status Component (`src/pages/CheckStatus.jsx`)

```jsx
import React, { useState } from 'react';
import ApiService from '../api/service';

export default function CheckStatus() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequest(null);

    try {
      const data = await ApiService.checkRequestStatus(referenceNumber);
      setRequest(data.request);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-status">
      <h2>Check Request Status</h2>
      
      <form onSubmit={handleCheck}>
        <input
          type="text"
          placeholder="Enter Reference Number (e.g., REQ-2025-10-00001)"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {request && (
        <div className="request-details">
          <p><strong>Reference:</strong> {request.ref}</p>
          <p><strong>Name:</strong> {request.fullName}</p>
          <p><strong>Status:</strong> <span className={`status-${request.status}`}>{request.status.toUpperCase()}</span></p>
          <p><strong>Purpose:</strong> {request.purpose}</p>
          <p><strong>Date Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Admin Dashboard Component (`src/pages/AdminDashboard.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../api/service';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await ApiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-number">{stats.totalRequests}</p>
          </div>
          
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingRequests}</p>
          </div>
          
          <div className="stat-card">
            <h3>Approved Requests</h3>
            <p className="stat-number">{stats.approvedRequests}</p>
          </div>
          
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p className="stat-number">{stats.totalComplaints}</p>
          </div>
          
          <div className="stat-card">
            <h3>Resolved Complaints</h3>
            <p className="stat-number">{stats.resolvedComplaints}</p>
          </div>
          
          <div className="stat-card">
            <h3>Rejected Requests</h3>
            <p className="stat-number">{stats.rejectedRequests}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Admin Requests Management (`src/pages/AdminRequests.jsx`)

```jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../api/service';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await ApiService.getAllRequests();
      setRequests(data.requests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await ApiService.updateRequestStatus(id, newStatus);
      fetchRequests(); // Refresh list
      alert('Request status updated');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await ApiService.deleteRequest(id);
        fetchRequests();
        alert('Request deleted');
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="requests-management">
      <h2>Request Management</h2>
      
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Name</th>
            <th>Document Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.ref}</td>
              <td>{req.fullName}</td>
              <td>{req.docTypeId?.name}</td>
              <td>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td>{new Date(req.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteRequest(req._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 4. Vue.js Example

### Composable API Service (`src/composables/useApi.js`)

```javascript
import { ref } from 'vue';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useApi() {
  const token = ref(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref(null);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const getHeaders = (isAuth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (isAuth && token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }
    return headers;
  };

  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setToken(data.token);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fileRequest = async (requestData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/resident/request`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getDocumentTypes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_BASE_URL}/api/document-types`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.docTypes;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    token,
    loading,
    error,
    login,
    fileRequest,
    getDocumentTypes,
    setToken
  };
}
```

---

## 5. Angular Example

### API Service (`src/app/services/api.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private getHeaders(auth = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (auth && this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }, {
      headers: this.getHeaders()
    });
  }

  fileRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/resident/request`, data, {
      headers: this.getHeaders()
    });
  }

  getDocumentTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/document-types`, {
      headers: this.getHeaders()
    });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard`, {
      headers: this.getHeaders(true)
    });
  }

  getAllRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/requests`, {
      headers: this.getHeaders(true)
    });
  }

  updateRequestStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/requests/${id}/status`, { status }, {
      headers: this.getHeaders(true)
    });
  }
}
```

---

## 6. Environment Configuration

### React (`.env`)
```env
REACT_APP_API_URL=http://localhost:3000
```

### Vue (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Production Deployment
```env
REACT_APP_API_URL=https://api.yourbarangay.com
VITE_API_URL=https://api.yourbarangay.com
```

---

## 7. Common Response Formats

### Success Response
```json
{
  "message": "Success",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### List Response
```json
{
  "requests": [ ... ],
  "complaints": [ ... ]
}
```

---

## 8. Authentication Flow

1. User enters credentials
2. Frontend calls `/api/auth/login`
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for protected routes
6. Backend validates token
7. Request proceeds or returns 401 if invalid

---

## 9. CORS Setup

Your backend is configured with CORS enabled. If you encounter CORS errors:

1. **Development**: Ensure frontend runs on different port (3001, 5173, etc.)
2. **Production**: Update CORS in `index.js` if needed:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## 10. Testing with Postman/Insomnia

1. Import the API collection
2. Set `{{base_url}}` = `http://localhost:3000`
3. Login to get token
4. Set `{{token}}` = token from login response
5. Use `{{token}}` in Authorization header for admin routes

---

## 11. Troubleshooting

**CORS Error:**
- Check backend CORS configuration
- Ensure frontend API URL matches backend

**401 Unauthorized:**
- Check if token is included
- Verify token is not expired (24 hours)
- Re-login to get new token

**API Not Responding:**
- Verify backend is running on port 3000
- Check API_URL configuration
- Use curl to test: `curl http://localhost:3000`

**MongoDB Connection Error:**
- Check MongoDB URI in .env
- Verify IP whitelist in MongoDB Atlas

---

**Your backend is ready!** Start building your frontend now. Use the code examples above based on your framework choice.
