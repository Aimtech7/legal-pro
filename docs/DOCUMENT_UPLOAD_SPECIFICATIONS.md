# Document Upload Specifications

## 📋 Overview
Comprehensive specifications for secure document upload functionality in the LegalPro case management system, including file type restrictions, security measures, and storage architecture.

## 📁 Allowed File Types

### Document Files
- **PDF**: `.pdf` (Portable Document Format)
- **Microsoft Word**: `.doc`, `.docx`
- **Rich Text**: `.rtf`
- **Plain Text**: `.txt`

### Image Files
- **JPEG**: `.jpg`, `.jpeg`
- **PNG**: `.png`
- **GIF**: `.gif`
- **WebP**: `.webp`

### Spreadsheet Files
- **Microsoft Excel**: `.xls`, `.xlsx`
- **CSV**: `.csv`

### Presentation Files
- **Microsoft PowerPoint**: `.ppt`, `.pptx`

### Archive Files
- **ZIP**: `.zip`
- **RAR**: `.rar` (read-only)

## 📏 File Size & Limits

### Individual File Limits
- **Maximum file size**: 10MB per file
- **Minimum file size**: 1KB (to prevent empty files)

### Case-Level Limits
- **Maximum files per case**: 50 files
- **Total storage per case**: 500MB
- **Maximum upload batch**: 10 files simultaneously

### System-Level Limits
- **Daily upload limit per user**: 100MB
- **Monthly storage per user**: 2GB

## 🏗️ Storage Architecture

### Cloudinary Configuration
```javascript
{
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  folder: 'legalpro/cases',
  resource_type: 'auto'
}
```

### File Naming Convention
```
Format: {caseId}/{timestamp}-{randomString}-{sanitizedOriginalName}
Example: 507f1f77bcf86cd799439011/1672531200000-a1b2c3d4-contract_agreement.pdf
```

### Folder Structure
```
legalpro/
├── cases/
│   ├── {caseId}/
│   │   ├── documents/
│   │   ├── images/
│   │   └── archives/
├── temp/
│   └── uploads/
└── thumbnails/
    └── {caseId}/
```

## 🔒 Security Requirements

### File Validation
1. **MIME Type Validation**: Verify actual file type matches extension
2. **Magic Number Check**: Validate file headers for authenticity
3. **File Size Validation**: Enforce size limits before upload
4. **Filename Sanitization**: Remove dangerous characters and paths

### Virus Scanning
```javascript
// Integration with ClamAV or similar service
const scanFile = async (filePath) => {
  // Implement virus scanning logic
  return {
    isClean: true,
    threats: []
  };
};
```

### Access Control
- **Role-based access**: Users can only access files they have permission for
- **Signed URLs**: Generate temporary URLs for file access
- **Token-based downloads**: Require authentication for file downloads
- **IP restrictions**: Optional IP-based access control

### Encryption
- **At-rest encryption**: Files encrypted in Cloudinary storage
- **In-transit encryption**: HTTPS for all file transfers
- **Metadata encryption**: Sensitive file metadata encrypted

## 🔧 Upload Process Flow

### 1. Pre-upload Validation
```javascript
const validateFile = (file) => {
  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('File type not allowed');
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  
  // Check filename
  if (!isValidFilename(file.originalname)) {
    throw new Error('Invalid filename');
  }
  
  return true;
};
```

### 2. Upload to Cloudinary
```javascript
const uploadToCloudinary = async (file, caseId) => {
  const options = {
    folder: `legalpro/cases/${caseId}`,
    resource_type: 'auto',
    public_id: generateUniqueId(),
    overwrite: false,
    invalidate: true
  };
  
  return cloudinary.uploader.upload(file.path, options);
};
```

### 3. Database Storage
```javascript
const documentSchema = {
  name: String,           // Original filename
  type: String,           // MIME type
  size: Number,           // File size in bytes
  url: String,            // Cloudinary URL
  publicId: String,       // Cloudinary public ID
  uploadedBy: ObjectId,   // User who uploaded
  caseId: ObjectId,       // Associated case
  isPublic: Boolean,      // Visibility flag
  metadata: {
    width: Number,        // For images
    height: Number,       // For images
    pages: Number,        // For PDFs
    duration: Number      // For videos
  }
};
```

## 🎨 Frontend Upload Interface

### Drag & Drop Component
```typescript
interface UploadProps {
  caseId: string;
  onUploadComplete: (files: Document[]) => void;
  onUploadError: (error: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}
```

### Upload Progress
- **Individual file progress**: Show progress for each file
- **Overall progress**: Show total upload progress
- **Error handling**: Display specific error messages
- **Retry mechanism**: Allow retry for failed uploads

### File Preview
- **Thumbnail generation**: For images and PDFs
- **File metadata display**: Size, type, upload date
- **Download links**: Secure download URLs
- **Delete functionality**: Remove uploaded files

## 📊 File Metadata

### Required Metadata
```javascript
{
  id: String,
  name: String,
  originalName: String,
  type: String,
  size: Number,
  url: String,
  publicId: String,
  uploadedBy: ObjectId,
  uploadedAt: Date,
  caseId: ObjectId
}
```

### Optional Metadata
```javascript
{
  description: String,
  tags: [String],
  isConfidential: Boolean,
  expiresAt: Date,
  downloadCount: Number,
  lastAccessed: Date,
  checksum: String
}
```

## 🔍 File Operations

### Upload Operations
- **Single file upload**: Upload one file at a time
- **Batch upload**: Upload multiple files simultaneously
- **Chunked upload**: For large files (>5MB)
- **Resume upload**: Resume interrupted uploads

### Download Operations
- **Direct download**: Stream file to user
- **Secure download**: Generate temporary signed URL
- **Bulk download**: ZIP multiple files for download
- **Preview**: Display file content in browser

### Management Operations
- **Rename**: Change file display name
- **Move**: Transfer file between cases
- **Copy**: Duplicate file to another case
- **Archive**: Soft delete with recovery option

## 🚨 Error Handling

### Upload Errors
```javascript
const uploadErrors = {
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  INVALID_TYPE: 'File type not supported',
  VIRUS_DETECTED: 'File contains malicious content',
  STORAGE_FULL: 'Case storage limit exceeded',
  NETWORK_ERROR: 'Upload failed due to network issues',
  PERMISSION_DENIED: 'Insufficient permissions to upload'
};
```

### Error Recovery
- **Automatic retry**: Retry failed uploads up to 3 times
- **Partial upload recovery**: Resume from last successful chunk
- **User notification**: Clear error messages with suggested actions
- **Fallback options**: Alternative upload methods if primary fails

## 📈 Performance Optimization

### Upload Optimization
- **Parallel uploads**: Upload multiple files concurrently
- **Compression**: Compress files before upload when beneficial
- **CDN integration**: Use Cloudinary's CDN for fast delivery
- **Caching**: Cache file metadata for quick access

### Bandwidth Management
- **Upload throttling**: Limit upload speed to prevent bandwidth saturation
- **Quality adjustment**: Compress images based on use case
- **Progressive loading**: Load file lists progressively
- **Lazy loading**: Load file previews on demand

## 🧪 Testing Strategy

### Unit Tests
- File validation functions
- Upload utility functions
- Error handling scenarios
- Security validation

### Integration Tests
- End-to-end upload flow
- Cloudinary integration
- Database operations
- Permission enforcement

### Performance Tests
- Large file uploads
- Concurrent upload scenarios
- Storage limit enforcement
- Network failure recovery

## 📋 Implementation Checklist

### Backend Implementation
- [ ] Enhanced upload middleware with validation
- [ ] Cloudinary integration with proper configuration
- [ ] File metadata storage in database
- [ ] Security scanning integration
- [ ] Error handling and logging

### Frontend Implementation
- [ ] Drag-and-drop upload component
- [ ] Progress indicators and error display
- [ ] File preview and management interface
- [ ] Responsive design for mobile devices
- [ ] Accessibility compliance

### Security Implementation
- [ ] File type validation
- [ ] Virus scanning integration
- [ ] Access control enforcement
- [ ] Secure URL generation
- [ ] Audit logging

---
*Document Version: 1.0*  
*Last Updated: 2025-07-02*
