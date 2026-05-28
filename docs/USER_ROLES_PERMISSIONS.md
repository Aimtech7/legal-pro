# User Roles & Permissions Specification

## 📋 Overview
Comprehensive specification for role-based access control (RBAC) in the LegalPro case management system, defining permissions for case operations and document management across different user roles.

## 👥 User Role Hierarchy

```
Advocate (Super Admin)
    ├── Admin (Configurable Permissions)
    └── Client (Limited Access)
```

## 🔐 Role Definitions

### 1. Advocate (Super Admin)
**Description**: Law firm owners, senior partners, or system administrators with full system access.

**Core Characteristics**:
- Highest level of system access
- Can create and manage admin accounts
- Full oversight of all cases and clients
- System configuration capabilities

### 2. Admin
**Description**: Law firm staff (junior lawyers, paralegals, assistants) with configurable permissions.

**Core Characteristics**:
- Permissions defined by advocate
- Can be assigned specific cases
- Limited to assigned responsibilities
- Cannot modify system settings

### 3. Client
**Description**: Law firm clients with access to their own cases and related information.

**Core Characteristics**:
- Access limited to own cases only
- Cannot view other clients' information
- Can upload documents and communicate
- Read-only access to most case data

## 🎯 Permission Matrix

### Case Management Permissions

| Operation | Advocate | Admin* | Client |
|-----------|----------|--------|--------|
| **View All Cases** | ✅ | ❌ | ❌ |
| **View Own Cases** | ✅ | ✅ | ✅ |
| **View Assigned Cases** | ✅ | ✅ | ❌ |
| **Create Case** | ✅ | 🔧 | ❌ |
| **Update Case** | ✅ | 🔧 | ❌ |
| **Delete Case** | ✅ | ❌ | ❌ |
| **Archive Case** | ✅ | 🔧 | ❌ |
| **Assign Case** | ✅ | ❌ | ❌ |
| **Change Case Status** | ✅ | 🔧 | ❌ |
| **Add Case Notes** | ✅ | ✅ | ✅** |
| **View Private Notes** | ✅ | ✅*** | ❌ |

*🔧 = Configurable based on admin permissions  
**✅ = Public notes only  
***✅ = Own notes only

### Document Management Permissions

| Operation | Advocate | Admin* | Client |
|-----------|----------|--------|--------|
| **Upload Documents** | ✅ | 🔧 | ✅**** |
| **Download Documents** | ✅ | 🔧 | ✅**** |
| **Delete Documents** | ✅ | 🔧 | ✅***** |
| **View Document Metadata** | ✅ | ✅ | ✅**** |
| **Share Documents** | ✅ | 🔧 | ❌ |
| **Set Document Privacy** | ✅ | 🔧 | ❌ |

****✅ = Own cases only  
*****✅ = Own uploaded documents only

### User Management Permissions

| Operation | Advocate | Admin | Client |
|-----------|----------|-------|--------|
| **Create Admin Account** | ✅ | ❌ | ❌ |
| **Create Client Account** | ✅ | 🔧 | ❌ |
| **Update User Profiles** | ✅ | 🔧 | ✅****** |
| **Deactivate Users** | ✅ | ❌ | ❌ |
| **View User List** | ✅ | 🔧 | ❌ |
| **Assign Permissions** | ✅ | ❌ | ❌ |

******✅ = Own profile only

## 🔧 Admin Permission Configuration

### Configurable Permissions for Admin Role

```javascript
const adminPermissions = {
  // Case Management
  canManageCases: Boolean,        // Create, update cases
  canDeleteCases: Boolean,        // Delete cases (rare)
  canAssignCases: Boolean,        // Assign cases to users
  canViewAllCases: Boolean,       // View cases not assigned to them
  
  // File Management
  canUploadFiles: Boolean,        // Upload documents
  canDownloadFiles: Boolean,      // Download documents
  canDeleteFiles: Boolean,        // Delete documents
  canOpenFiles: Boolean,          // View/open documents
  
  // Client Management
  canAdmitClients: Boolean,       // Create client accounts
  canViewClients: Boolean,        // View client information
  canUpdateClients: Boolean,      // Update client profiles
  
  // Scheduling
  canScheduleAppointments: Boolean, // Create appointments
  canManageCalendar: Boolean,       // Manage calendar settings
  
  // Reporting
  canAccessReports: Boolean,      // View analytics and reports
  canExportData: Boolean,         // Export case/client data
  
  // Communication
  canSendNotifications: Boolean,  // Send emails/SMS
  canAccessChat: Boolean,         // Use messaging system
};
```

### Permission Inheritance Rules

1. **Advocate permissions**: Always include all admin permissions
2. **Admin permissions**: Cannot exceed advocate permissions
3. **Client permissions**: Fixed and cannot be modified
4. **Default admin permissions**: All set to `false` (must be explicitly granted)

## 🛡️ Security Implementation

### Backend Authorization Middleware

```javascript
// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this action'
      });
    }
    
    next();
  };
};

// Permission-based authorization for admins
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'advocate') {
      return next(); // Advocates have all permissions
    }
    
    if (req.user.role === 'admin') {
      if (!req.user.permissions || !req.user.permissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`
        });
      }
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  };
};
```

### Frontend Permission Checking

```typescript
// Permission hook
const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'advocate') return true;
    
    if (user.role === 'admin') {
      return user.permissions?.[permission] || false;
    }
    
    return false;
  };
  
  const canAccessCase = (caseItem: Case): boolean => {
    if (!user) return false;
    
    if (user.role === 'advocate') return true;
    
    if (user.role === 'admin') {
      return caseItem.assignedTo === user.id || 
             hasPermission('canViewAllCases');
    }
    
    if (user.role === 'client') {
      return caseItem.clientId === user.id;
    }
    
    return false;
  };
  
  return { hasPermission, canAccessCase };
};
```

## 📊 Data Access Patterns

### Case Data Filtering

```javascript
// Backend: Filter cases based on user role
const getCasesQuery = (user) => {
  let query = { isArchived: false };
  
  switch (user.role) {
    case 'advocate':
      // No additional filtering - can see all cases
      break;
      
    case 'admin':
      if (user.permissions.canViewAllCases) {
        // No additional filtering
      } else {
        // Only assigned cases
        query.assignedTo = user._id;
      }
      break;
      
    case 'client':
      // Only own cases
      query.clientId = user._id;
      break;
  }
  
  return query;
};
```

### Document Access Control

```javascript
// Check if user can access document
const canAccessDocument = (user, document, caseItem) => {
  // Advocates can access all documents
  if (user.role === 'advocate') return true;
  
  // Check if user can access the case
  if (!canAccessCase(user, caseItem)) return false;
  
  // Admin with file permissions
  if (user.role === 'admin' && user.permissions.canOpenFiles) {
    return true;
  }
  
  // Client can access documents in their cases
  if (user.role === 'client' && caseItem.clientId.toString() === user._id.toString()) {
    return true;
  }
  
  return false;
};
```

## 🔄 Permission Updates

### Dynamic Permission Changes

1. **Immediate effect**: Permission changes take effect on next API call
2. **Token refresh**: May require token refresh for frontend updates
3. **Active sessions**: Existing sessions respect new permissions
4. **Audit trail**: All permission changes are logged

### Permission Validation

```javascript
// Validate permission object
const validatePermissions = (permissions) => {
  const allowedPermissions = [
    'canManageCases', 'canDeleteCases', 'canAssignCases',
    'canViewAllCases', 'canUploadFiles', 'canDownloadFiles',
    'canDeleteFiles', 'canOpenFiles', 'canAdmitClients',
    'canViewClients', 'canUpdateClients', 'canScheduleAppointments',
    'canManageCalendar', 'canAccessReports', 'canExportData',
    'canSendNotifications', 'canAccessChat'
  ];
  
  for (const permission in permissions) {
    if (!allowedPermissions.includes(permission)) {
      throw new Error(`Invalid permission: ${permission}`);
    }
    
    if (typeof permissions[permission] !== 'boolean') {
      throw new Error(`Permission ${permission} must be boolean`);
    }
  }
  
  return true;
};
```

## 🧪 Testing Strategy

### Permission Testing

1. **Unit tests**: Test individual permission checks
2. **Integration tests**: Test API endpoints with different roles
3. **E2E tests**: Test complete workflows for each role
4. **Security tests**: Attempt unauthorized access

### Test Scenarios

```javascript
describe('Case Access Control', () => {
  test('Advocate can access all cases', async () => {
    // Test implementation
  });
  
  test('Admin can only access assigned cases without viewAll permission', async () => {
    // Test implementation
  });
  
  test('Client can only access own cases', async () => {
    // Test implementation
  });
  
  test('Unauthorized access returns 403', async () => {
    // Test implementation
  });
});
```

## 📋 Implementation Checklist

### Backend Implementation
- [ ] Update auth middleware with permission checking
- [ ] Implement role-based query filtering
- [ ] Add permission validation for all endpoints
- [ ] Create permission management endpoints
- [ ] Add audit logging for permission changes

### Frontend Implementation
- [ ] Create permission checking hooks
- [ ] Implement conditional UI rendering
- [ ] Add permission-based route protection
- [ ] Create admin permission management interface
- [ ] Add user role indicators in UI

### Testing Implementation
- [ ] Write permission unit tests
- [ ] Create role-based integration tests
- [ ] Implement security penetration tests
- [ ] Add permission change workflow tests
- [ ] Create user experience tests for each role

---
*Document Version: 1.0*  
*Last Updated: 2025-07-02*
