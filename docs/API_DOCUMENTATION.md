# LegalPro Case Management API Documentation

## Overview
This document provides comprehensive documentation for the LegalPro Case Management API endpoints, including request/response formats, authentication requirements, and usage examples.

## Base URL
```
Production: https://api.legalpro.com
Development: http://localhost:5000
```

## Authentication
All API endpoints require authentication using JWT tokens passed in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "pagination": object (for paginated responses),
  "errors": array (for validation errors)
}
```

## Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Case Management Endpoints

### 1. Get All Cases
Retrieve a paginated list of cases based on user role and filters.

**Endpoint:** `GET /api/cases`

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10, max: 50)
- `search` (string, optional) - Search in title, description, case number
- `status` (string, optional) - Filter by status: `pending`, `in_progress`, `completed`, `closed`
- `category` (string, optional) - Filter by category
- `priority` (string, optional) - Filter by priority: `low`, `medium`, `high`, `urgent`
- `assignedTo` (string, optional) - Filter by assigned user ID
- `startDate` (string, optional) - Filter by creation date (ISO format)
- `endDate` (string, optional) - Filter by creation date (ISO format)
- `sortBy` (string, optional) - Sort field (default: `createdAt`)
- `sortOrder` (string, optional) - Sort order: `asc`, `desc` (default: `desc`)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "caseNumber": "CASE-2024-0001",
      "title": "Property Dispute Resolution",
      "description": "Boundary dispute between neighboring properties",
      "category": "Property Law",
      "status": "in_progress",
      "priority": "high",
      "clientId": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "assignedTo": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@lawfirm.com"
      },
      "courtDate": "2024-04-15T10:00:00.000Z",
      "createdAt": "2024-03-01T09:00:00.000Z",
      "updatedAt": "2024-03-10T14:30:00.000Z",
      "documentStats": {
        "totalDocuments": 5,
        "totalSize": 2048000
      }
    }
  ]
}
```

### 2. Get Single Case
Retrieve detailed information about a specific case.

**Endpoint:** `GET /api/cases/:id`

**Parameters:**
- `id` (string, required) - Case ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-2024-0001",
    "title": "Property Dispute Resolution",
    "description": "Detailed case description...",
    "category": "Property Law",
    "status": "in_progress",
    "priority": "high",
    "clientId": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@lawfirm.com"
    },
    "courtDate": "2024-04-15T10:00:00.000Z",
    "documents": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Property Deed",
        "originalName": "property_deed.pdf",
        "type": "application/pdf",
        "size": 1024000,
        "url": "https://cloudinary.com/...",
        "uploadedBy": {
          "_id": "507f1f77bcf86cd799439013",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "createdAt": "2024-03-05T11:00:00.000Z"
      }
    ],
    "notes": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "content": "Initial consultation completed",
        "author": {
          "_id": "507f1f77bcf86cd799439013",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "isPrivate": false,
        "createdAt": "2024-03-02T10:00:00.000Z"
      }
    ],
    "timeline": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "event": "case_created",
        "description": "Case opened",
        "user": {
          "_id": "507f1f77bcf86cd799439013",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "metadata": {},
        "createdAt": "2024-03-01T09:00:00.000Z"
      }
    ],
    "documentStats": {
      "totalDocuments": 5,
      "totalSize": 2048000,
      "remainingSlots": 45,
      "remainingSize": 522240000
    },
    "createdAt": "2024-03-01T09:00:00.000Z",
    "updatedAt": "2024-03-10T14:30:00.000Z"
  }
}
```

### 3. Create New Case
Create a new case in the system.

**Endpoint:** `POST /api/cases`

**Required Permissions:** Admin or Advocate role

**Request Body:**
```json
{
  "title": "Property Dispute Resolution",
  "description": "Boundary dispute between neighboring properties requiring legal intervention",
  "category": "Property Law",
  "priority": "high",
  "clientId": "507f1f77bcf86cd799439012",
  "assignedTo": "507f1f77bcf86cd799439013",
  "courtDate": "2024-04-15T10:00:00.000Z"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Required, max 5000 characters
- `category`: Required, must be valid category
- `priority`: Optional, one of: `low`, `medium`, `high`, `urgent` (default: `medium`)
- `clientId`: Required, valid client user ID
- `assignedTo`: Optional, valid admin/advocate user ID
- `courtDate`: Optional, must be future date

**Response:**
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-2024-0001",
    "title": "Property Dispute Resolution",
    "status": "pending",
    // ... other case fields
  }
}
```

### 4. Update Case
Update an existing case.

**Endpoint:** `PUT /api/cases/:id`

**Required Permissions:** Admin or Advocate role

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Case Title",
  "description": "Updated description",
  "category": "Family Law",
  "priority": "urgent",
  "assignedTo": "507f1f77bcf86cd799439013",
  "courtDate": "2024-05-01T14:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case updated successfully",
  "data": {
    // Updated case object
  }
}
```

### 5. Archive Case (Soft Delete)
Archive a case (soft delete).

**Endpoint:** `DELETE /api/cases/:id`

**Required Permissions:** Advocate role only

**Request Body:** (optional)
```json
{
  "reason": "Case resolved and closed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case archived successfully"
}
```

### 6. Restore Archived Case
Restore a previously archived case.

**Endpoint:** `PUT /api/cases/:id/restore`

**Required Permissions:** Advocate role only

**Request Body:** (optional)
```json
{
  "reason": "Case needs to be reopened"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case restored successfully",
  "data": {
    // Restored case object
  }
}
```

### 7. Assign Case to User
Assign a case to a specific user.

**Endpoint:** `PUT /api/cases/:id/assign`

**Required Permissions:** Advocate role only

**Request Body:**
```json
{
  "assignedTo": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case assigned successfully",
  "data": {
    // Updated case object with new assignee
  }
}
```

### 8. Update Case Status
Update the status of a case.

**Endpoint:** `PUT /api/cases/:id/status`

**Required Permissions:** Admin or Advocate role

**Request Body:**
```json
{
  "status": "in_progress",
  "reason": "Starting work on the case"
}
```

**Valid Status Values:**
- `pending` - Case is pending review/assignment
- `in_progress` - Case is actively being worked on
- `completed` - Case work is completed
- `closed` - Case is closed and finalized

**Response:**
```json
{
  "success": true,
  "message": "Case status updated successfully",
  "data": {
    // Updated case object
  }
}
```

### 9. Add Case Note
Add a note to a case.

**Endpoint:** `POST /api/cases/:id/notes`

**Request Body:**
```json
{
  "content": "Client meeting scheduled for next week",
  "isPrivate": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    // Updated case object with new note
  }
}
```

### 10. Get Case Timeline
Retrieve the timeline of events for a case.

**Endpoint:** `GET /api/cases/:id/timeline`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "event": "case_created",
      "description": "Case opened",
      "user": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "metadata": {},
      "createdAt": "2024-03-01T09:00:00.000Z"
    }
  ]
}
```

### 11. Get Case Statistics
Retrieve statistical information about cases.

**Endpoint:** `GET /api/cases/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCases": 150,
      "pendingCases": 25,
      "inProgressCases": 75,
      "completedCases": 40,
      "closedCases": 10,
      "urgentCases": 5,
      "highPriorityCases": 20
    },
    "categoryBreakdown": [
      {
        "_id": "Family Law",
        "count": 45
      },
      {
        "_id": "Corporate Law",
        "count": 30
      }
    ]
  }
}
```

### 12. Advanced Case Search
Perform advanced search across cases with multiple criteria.

**Endpoint:** `GET /api/cases/search`

**Query Parameters:**
- `q` (string, optional) - General search query
- `title` (string, optional) - Search in case titles
- `client` (string, optional) - Search by client name
- `status` (string, optional) - Filter by status
- `category` (string, optional) - Filter by category
- `priority` (string, optional) - Filter by priority
- `assignedTo` (string, optional) - Filter by assigned user
- `startDate` (string, optional) - Date range start
- `endDate` (string, optional) - Date range end
- `courtDateStart` (string, optional) - Court date range start
- `courtDateEnd` (string, optional) - Court date range end
- `hasDocuments` (boolean, optional) - Filter cases with/without documents
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page
- `sortBy` (string, optional) - Sort field
- `sortOrder` (string, optional) - Sort order

**Response:**
```json
{
  "success": true,
  "count": 15,
  "total": 45,
  "pagination": {
    "page": 1,
    "limit": 15,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "searchCriteria": {
    "q": "property",
    "status": "in_progress",
    "priority": "high"
  },
  "data": [
    // Array of matching cases with enhanced metadata
  ]
}
```

---

## Document Management Endpoints

### 1. Get Case Documents
Retrieve all documents associated with a case.

**Endpoint:** `GET /api/cases/:id/documents`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Property Deed",
      "originalName": "property_deed.pdf",
      "type": "application/pdf",
      "size": 1024000,
      "url": "https://cloudinary.com/...",
      "publicId": "legalpro/cases/507f1f77bcf86cd799439011/doc1",
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "description": "Original property deed document",
      "tags": ["property", "legal", "deed"],
      "downloadCount": 5,
      "lastAccessed": "2024-03-10T09:00:00.000Z",
      "metadata": {
        "format": "pdf",
        "pages": 3
      },
      "createdAt": "2024-03-05T11:00:00.000Z",
      "updatedAt": "2024-03-05T11:00:00.000Z"
    }
  ]
}
```

### 2. Upload Document to Case
Upload a new document to a case.

**Endpoint:** `POST /api/cases/:id/documents`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `document` (file, required) - The file to upload
- `name` (string, optional) - Custom name for the document
- `description` (string, optional) - Document description
- `tags` (string, optional) - Comma-separated tags

**File Constraints:**
- **Maximum file size:** 10MB
- **Allowed types:** PDF, DOC, DOCX, RTF, TXT, JPG, PNG, GIF, WebP, XLS, XLSX, CSV, PPT, PPTX, ZIP, RAR
- **Maximum files per case:** 50
- **Total storage per case:** 500MB

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Contract Agreement",
    "originalName": "contract_v2.pdf",
    "type": "application/pdf",
    "size": 2048000,
    "url": "https://cloudinary.com/secure/...",
    "publicId": "legalpro/cases/507f1f77bcf86cd799439011/1672531200000-a1b2c3d4",
    "uploadedBy": "507f1f77bcf86cd799439013",
    "description": "Updated contract with new terms",
    "tags": ["contract", "agreement"],
    "metadata": {
      "format": "pdf",
      "pages": 5
    },
    "createdAt": "2024-03-11T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "File type application/exe is not allowed",
  "code": "INVALID_FILE_TYPE"
}
```

```json
{
  "success": false,
  "message": "File size exceeds 10MB limit",
  "code": "FILE_TOO_LARGE"
}
```

### 3. Download Document
Get a secure download link for a document.

**Endpoint:** `GET /api/cases/:caseId/documents/:docId/download`

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cloudinary.com/secure/download/...",
    "filename": "property_deed.pdf",
    "size": 1024000,
    "type": "application/pdf"
  }
}
```

### 4. Delete Document
Delete a document from a case.

**Endpoint:** `DELETE /api/cases/:caseId/documents/:docId`

**Permissions:**
- **Advocates:** Can delete any document
- **Admins:** Can delete if they have `canDeleteFiles` permission
- **Clients:** Can only delete documents they uploaded

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## Role-Based Access Control

### Permission Matrix

| Operation | Advocate | Admin* | Client |
|-----------|----------|--------|--------|
| **View All Cases** | ✅ | 🔧 | ❌ |
| **View Own Cases** | ✅ | ✅ | ✅ |
| **Create Case** | ✅ | 🔧 | ❌ |
| **Update Case** | ✅ | 🔧 | ❌ |
| **Delete Case** | ✅ | ❌ | ❌ |
| **Upload Documents** | ✅ | 🔧 | ✅** |
| **Download Documents** | ✅ | 🔧 | ✅** |
| **Delete Documents** | ✅ | 🔧 | ✅*** |

*🔧 = Configurable based on admin permissions
**✅ = Own cases only
***✅ = Own uploaded documents only

### Admin Permissions
Admins have configurable permissions that control their access:

```json
{
  "canManageCases": true,
  "canViewAllCases": false,
  "canUploadFiles": true,
  "canDownloadFiles": true,
  "canDeleteFiles": false,
  "canOpenFiles": true
}
```

---

## Rate Limiting
API endpoints are rate-limited to prevent abuse:

- **General endpoints:** 100 requests per minute per user
- **File upload endpoints:** 10 requests per minute per user
- **Search endpoints:** 50 requests per minute per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks (Future Feature)
LegalPro will support webhooks for real-time notifications:

**Supported Events:**
- `case.created`
- `case.updated`
- `case.status_changed`
- `document.uploaded`
- `document.deleted`
- `note.added`

**Webhook Payload Example:**
```json
{
  "event": "case.created",
  "timestamp": "2024-03-11T10:00:00.000Z",
  "data": {
    "caseId": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-2024-0001",
    "title": "New Case Title",
    "clientId": "507f1f77bcf86cd799439012",
    "assignedTo": "507f1f77bcf86cd799439013"
  }
}
```

---

## SDK and Libraries
Official SDKs are available for popular programming languages:

- **JavaScript/Node.js:** `npm install @legalpro/sdk`
- **Python:** `pip install legalpro-sdk`
- **PHP:** `composer require legalpro/sdk`

**Example Usage (JavaScript):**
```javascript
import { LegalProClient } from '@legalpro/sdk';

const client = new LegalProClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.legalpro.com'
});

// Get all cases
const cases = await client.cases.list({
  status: 'in_progress',
  limit: 20
});

// Create a new case
const newCase = await client.cases.create({
  title: 'New Legal Case',
  description: 'Case description',
  category: 'Family Law',
  clientId: 'client-id'
});
```
