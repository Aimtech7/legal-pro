# Case Management CRUD & Document Upload Requirements

## 📋 Overview
This document defines the comprehensive requirements for implementing complete case management CRUD operations with secure document upload functionality in the LegalPro system.

## 🎯 Core Requirements

### 1. Case Record Fields & Validation

#### Required Fields
- **caseNumber**: Auto-generated unique identifier (format: CASE-YYYY-NNNN)
- **title**: Case title (max 200 characters, required)
- **description**: Detailed case description (required)
- **category**: Legal practice area (enum, required)
- **status**: Case status (enum: pending, in_progress, completed, closed)
- **priority**: Case priority (enum: low, medium, high, urgent)
- **clientId**: Reference to client user (required)
- **assignedTo**: Reference to assigned advocate/admin (optional)
- **courtDate**: Scheduled court date (optional)

#### Computed Fields
- **createdAt**: Auto-generated timestamp
- **updatedAt**: Auto-updated timestamp
- **isArchived**: Soft delete flag (default: false)

#### Nested Schemas
- **documents[]**: Array of document references
- **notes[]**: Array of case notes with author and privacy settings
- **timeline[]**: Array of case events with metadata

### 2. Document Upload Requirements

#### Allowed File Types
- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, JPEG, PNG, GIF
- **Spreadsheets**: XLS, XLSX
- **Text**: TXT, RTF

#### File Constraints
- **Maximum file size**: 10MB per file
- **Maximum files per case**: 50 files
- **Total storage per case**: 500MB
- **Naming convention**: timestamp-random-originalname

#### Security Requirements
- **Virus scanning**: Integrate with security service
- **Access control**: Role-based file access
- **Encryption**: Files encrypted at rest
- **Audit trail**: Track all file operations

### 3. User Roles & Permissions

#### Advocate (Super Admin)
- **Full CRUD access** to all cases
- **Create/assign** cases to any client
- **Upload/download** all documents
- **Manage** case timeline and notes
- **Archive/restore** cases

#### Admin
- **CRUD access** based on permissions:
  - `canManageCases`: Create, update, delete cases
  - `canOpenFiles`: View case documents
  - `canUploadFiles`: Upload documents to cases
- **View** assigned cases only
- **Add** notes and timeline events

#### Client
- **Read-only access** to own cases
- **Upload** documents to own cases
- **View** own case documents
- **Add** public notes to own cases

### 4. API Endpoints Specification

#### Case CRUD Operations
```
GET    /api/cases                    # List cases (filtered by role)
GET    /api/cases/:id                # Get single case details
POST   /api/cases                    # Create new case
PUT    /api/cases/:id                # Update case
DELETE /api/cases/:id                # Delete case (soft delete)
```

#### Case Management Operations
```
PUT    /api/cases/:id/status         # Update case status
POST   /api/cases/:id/notes          # Add case note
GET    /api/cases/:id/timeline       # Get case timeline
POST   /api/cases/:id/assign         # Assign case to user
```

#### Document Operations
```
POST   /api/cases/:id/documents      # Upload document
GET    /api/cases/:id/documents      # List case documents
GET    /api/cases/:id/documents/:docId # Download document
DELETE /api/cases/:id/documents/:docId # Delete document
```

#### Search & Filtering
```
GET    /api/cases/search?q=term      # Search cases
GET    /api/cases?status=pending     # Filter by status
GET    /api/cases?category=family    # Filter by category
GET    /api/cases?priority=high      # Filter by priority
GET    /api/cases?assignedTo=userId  # Filter by assignee
```

### 5. Frontend Requirements

#### Case Listing Page
- **Table view** with sortable columns
- **Search bar** with real-time filtering
- **Filter dropdowns** for status, category, priority
- **Pagination** with configurable page size
- **Action buttons** for view, edit, delete
- **Bulk operations** for status updates

#### Case Creation/Edit Form
- **Responsive form** with validation
- **Client selection** dropdown
- **Category selection** with descriptions
- **Rich text editor** for description
- **Date picker** for court date
- **Auto-save** functionality

#### Document Management Interface
- **Drag-and-drop** upload area
- **File preview** for supported formats
- **Progress indicators** during upload
- **Document gallery** with thumbnails
- **Download/delete** actions
- **File metadata** display

#### Case Details View
- **Comprehensive case information**
- **Document gallery** with search
- **Timeline view** of case events
- **Notes section** with privacy controls
- **Action buttons** for case management

### 6. Validation Rules

#### Backend Validation
- **Field validation** using express-validator
- **File type validation** using MIME type checking
- **File size validation** before upload
- **Business logic validation** (e.g., court date in future)
- **Permission validation** for all operations

#### Frontend Validation
- **Real-time validation** using React Hook Form
- **Custom validation rules** for business logic
- **Error message display** with user-friendly text
- **Form state management** with loading states

### 7. Error Handling

#### Backend Error Responses
```json
{
  "success": false,
  "message": "User-friendly error message",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

#### Frontend Error Handling
- **Toast notifications** for user feedback
- **Form error display** with field highlighting
- **Retry mechanisms** for failed operations
- **Graceful degradation** for offline scenarios

### 8. Performance Requirements

#### Backend Performance
- **Response time**: < 500ms for CRUD operations
- **File upload**: < 30s for 10MB files
- **Database queries**: Optimized with proper indexing
- **Caching**: Implement Redis for frequently accessed data

#### Frontend Performance
- **Page load time**: < 3s initial load
- **Search response**: < 200ms for filtering
- **File upload**: Progress indicators and chunked uploads
- **Lazy loading**: For large document lists

### 9. Security Requirements

#### Authentication & Authorization
- **JWT token validation** for all requests
- **Role-based access control** enforcement
- **Session management** with token refresh
- **Audit logging** for all operations

#### File Security
- **Virus scanning** before storage
- **Access token generation** for file downloads
- **Secure file URLs** with expiration
- **Content-Type validation** to prevent XSS

### 10. Testing Requirements

#### Backend Testing
- **Unit tests** for all controller methods
- **Integration tests** for API endpoints
- **File upload tests** with various file types
- **Permission tests** for role-based access
- **Error scenario tests** for edge cases

#### Frontend Testing
- **Component tests** for all UI components
- **Form validation tests** for all scenarios
- **User interaction tests** for workflows
- **File upload tests** with mock files
- **Accessibility tests** for compliance

## 📊 Success Criteria

1. **Functional**: All CRUD operations work correctly with proper validation
2. **Security**: Role-based access control enforced throughout
3. **Performance**: Meets specified response time requirements
4. **Usability**: Intuitive interface with clear user feedback
5. **Reliability**: Handles errors gracefully with proper recovery
6. **Scalability**: Supports growth in users and data volume

## 🚀 Implementation Priority

1. **Phase 1**: Backend CRUD operations and validation
2. **Phase 2**: Document upload with Cloudinary integration
3. **Phase 3**: Frontend interface and forms
4. **Phase 4**: Search and filtering capabilities
5. **Phase 5**: Testing and optimization

---
*Document Version: 1.0*  
*Last Updated: 2025-07-02*
