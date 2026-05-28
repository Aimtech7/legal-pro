# LegalPro Case Management User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Case Management](#case-management)
3. [Document Management](#document-management)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Search & Filtering](#search--filtering)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection:** Stable broadband connection
- **Screen Resolution:** Minimum 1024x768 (recommended: 1920x1080)

### First Login
1. Navigate to the LegalPro application URL
2. Enter your email and password provided by your system administrator
3. If this is your first login, you may be prompted to change your password
4. Complete any required profile information

### Dashboard Overview
After logging in, you'll see the main dashboard with:
- **Case Statistics:** Overview of your cases by status and priority
- **Recent Cases:** Quick access to recently viewed or updated cases
- **Upcoming Court Dates:** Calendar view of scheduled court appearances
- **Quick Actions:** Buttons to create new cases, upload documents, etc.

---

## Case Management

### Creating a New Case

#### For Advocates and Admins:
1. Click the **"+ New Case"** button on the dashboard or cases page
2. Fill in the required information:
   - **Case Title:** Descriptive title for the case (max 200 characters)
   - **Description:** Detailed description of the case (max 5000 characters)
   - **Category:** Select from available legal practice areas
   - **Priority:** Choose Low, Medium, High, or Urgent
   - **Client:** Select the client from the dropdown
   - **Assigned To:** Optionally assign to a specific team member
   - **Court Date:** Set if known (must be a future date)
3. Click **"Create Case"** to save

#### Validation Rules:
- All required fields must be completed
- Case title must be unique within the system
- Court date cannot be in the past
- Client must be an active user with "client" role

### Viewing Cases

#### Case List View:
- **Table Format:** Shows key information in sortable columns
- **Status Indicators:** Color-coded status badges
- **Priority Icons:** Visual priority indicators
- **Action Buttons:** Quick access to view, edit, or delete

#### Case Details View:
Access detailed case information by clicking on any case. The details view includes:

**Overview Tab:**
- Complete case information
- Client and assigned attorney details
- Case timeline and status history
- Document statistics

**Documents Tab:**
- All uploaded documents
- Upload new documents
- Download or delete existing documents
- Document metadata and version history

**Timeline Tab:**
- Chronological list of case events
- System-generated and manual entries
- User actions and status changes

**Notes Tab:**
- Case notes and comments
- Private notes (staff only) and public notes
- Rich text formatting support

### Updating Cases

#### Status Updates:
1. Open the case details
2. In the Overview tab, click the status dropdown
3. Select the new status:
   - **Pending:** Case is awaiting review or assignment
   - **In Progress:** Active work is being performed
   - **Completed:** Case work is finished
   - **Closed:** Case is finalized and archived
4. Optionally add a reason for the status change

#### Editing Case Information:
1. Click the **"Edit"** button in case details
2. Modify any editable fields
3. Click **"Update Case"** to save changes

**Note:** Only advocates and authorized admins can edit case information.

### Case Assignment

#### For Advocates:
1. Open the case details
2. Click **"Assign Case"** button
3. Select the team member from the dropdown
4. Add an optional note about the assignment
5. Click **"Assign"** to confirm

The assigned user will receive a notification and the case will appear in their assigned cases list.

---

## Document Management

### Supported File Types
- **Documents:** PDF, DOC, DOCX, RTF, TXT
- **Images:** JPG, JPEG, PNG, GIF, WebP
- **Spreadsheets:** XLS, XLSX, CSV
- **Presentations:** PPT, PPTX
- **Archives:** ZIP, RAR

### File Size Limits
- **Maximum file size:** 10MB per file
- **Maximum files per case:** 50 files
- **Total storage per case:** 500MB

### Uploading Documents

#### Method 1: Drag and Drop
1. Open the case details and go to the Documents tab
2. Click **"Add Documents"** to open the upload interface
3. Drag files from your computer to the upload area
4. Files will be validated and added to the upload queue
5. Click **"Upload All"** to start the upload process

#### Method 2: File Browser
1. Click the upload area or **"Browse Files"** button
2. Select files using your system's file browser
3. Multiple files can be selected using Ctrl+Click (Windows) or Cmd+Click (Mac)
4. Click **"Upload All"** to start the upload

#### Adding Metadata:
- **Custom Name:** Override the original filename
- **Description:** Add context about the document
- **Tags:** Add searchable keywords (comma-separated)

### Managing Documents

#### Viewing Documents:
- **Grid View:** Thumbnail view with file information
- **List View:** Detailed list with metadata
- **Search:** Find documents by name, description, or tags
- **Filter:** Filter by file type, upload date, or uploader

#### Downloading Documents:
1. Click the download icon next to any document
2. The file will open in a new tab or download automatically
3. Download count is tracked for audit purposes

#### Deleting Documents:
1. Click the delete icon next to the document
2. Confirm the deletion in the popup dialog
3. **Note:** Deletion is permanent and cannot be undone

**Permission Rules:**
- **Advocates:** Can delete any document
- **Admins:** Can delete if they have delete permissions
- **Clients:** Can only delete documents they uploaded

---

## User Roles & Permissions

### Advocate (Super Admin)
**Full system access including:**
- Create, edit, and delete all cases
- Manage all users and permissions
- Access all documents and files
- View system analytics and reports
- Configure system settings

### Admin
**Configurable permissions may include:**
- **Case Management:** Create and edit cases
- **File Access:** View and download documents
- **File Upload:** Upload documents to cases
- **File Deletion:** Delete documents from cases
- **Client Management:** Create and manage client accounts
- **Reporting:** Access to analytics and reports

### Client
**Limited access including:**
- View own cases only
- Upload documents to own cases
- Download documents from own cases
- Add public notes to own cases
- View case timeline and updates

---

## Search & Filtering

### Basic Search
Use the search bar at the top of the cases page to search across:
- Case titles
- Case numbers
- Case descriptions
- Client names and email addresses

### Advanced Filtering

#### Quick Filters:
- **Status:** Filter by case status
- **Priority:** Filter by priority level
- **Category:** Filter by legal practice area
- **Assigned To:** Filter by assigned team member

#### Advanced Filters:
Click **"More Filters"** to access additional options:
- **Date Range:** Filter by creation or update date
- **Court Date Range:** Filter by scheduled court dates
- **Document Status:** Cases with or without documents
- **Custom Sorting:** Sort by various fields in ascending or descending order

#### Saving Searches:
1. Configure your desired filters
2. Click **"Save Search"** (if available)
3. Give your search a name
4. Access saved searches from the dropdown menu

---

## Best Practices

### Case Management
1. **Use Descriptive Titles:** Make case titles clear and searchable
2. **Regular Updates:** Keep case status and information current
3. **Detailed Descriptions:** Provide comprehensive case descriptions
4. **Proper Categorization:** Use appropriate legal categories
5. **Timeline Maintenance:** Add important events to the case timeline

### Document Management
1. **Consistent Naming:** Use clear, consistent file naming conventions
2. **Version Control:** Include version numbers in document names
3. **Metadata Usage:** Add descriptions and tags for better searchability
4. **Regular Cleanup:** Remove outdated or duplicate documents
5. **Security Awareness:** Mark sensitive documents appropriately

### Collaboration
1. **Clear Communication:** Use case notes for team communication
2. **Assignment Clarity:** Clearly define responsibilities when assigning cases
3. **Status Updates:** Regularly update case status for team visibility
4. **Document Sharing:** Use proper permissions for document access

---

## Troubleshooting

### Common Issues

#### Login Problems
**Issue:** Cannot log in to the system
**Solutions:**
1. Verify your email and password are correct
2. Check if Caps Lock is enabled
3. Try resetting your password using "Forgot Password"
4. Contact your system administrator if the account is locked

#### File Upload Issues
**Issue:** Documents won't upload
**Solutions:**
1. Check file size (must be under 10MB)
2. Verify file type is supported
3. Ensure stable internet connection
4. Try uploading one file at a time
5. Clear browser cache and cookies

#### Performance Issues
**Issue:** System is running slowly
**Solutions:**
1. Check your internet connection speed
2. Close unnecessary browser tabs
3. Clear browser cache and cookies
4. Try using a different browser
5. Restart your browser

#### Search Not Working
**Issue:** Search results are not accurate
**Solutions:**
1. Try different search terms
2. Use quotation marks for exact phrases
3. Clear existing filters
4. Refresh the page and try again

### Getting Help

#### In-App Support:
- Click the **"Help"** button in the top navigation
- Access the built-in knowledge base
- Submit support tickets directly from the application

#### Contact Information:
- **Email Support:** support@legalpro.com
- **Phone Support:** +1-800-LEGAL-PRO
- **Live Chat:** Available during business hours
- **Documentation:** docs.legalpro.com

#### Training Resources:
- **Video Tutorials:** Available in the help section
- **Webinar Training:** Monthly training sessions
- **User Manual:** Downloadable PDF guide
- **FAQ Section:** Common questions and answers

---

## Keyboard Shortcuts

### Global Shortcuts
- **Ctrl+/** (Windows) or **Cmd+/** (Mac): Open help
- **Ctrl+K** (Windows) or **Cmd+K** (Mac): Quick search
- **Esc**: Close modal dialogs

### Case Management
- **Ctrl+N** (Windows) or **Cmd+N** (Mac): Create new case
- **Ctrl+E** (Windows) or **Cmd+E** (Mac): Edit current case
- **Ctrl+S** (Windows) or **Cmd+S** (Mac): Save changes

### Navigation
- **Ctrl+1-9** (Windows) or **Cmd+1-9** (Mac): Switch between tabs
- **Ctrl+F** (Windows) or **Cmd+F** (Mac): Find on page
- **Ctrl+R** (Windows) or **Cmd+R** (Mac): Refresh page

---

*Last Updated: March 2024*  
*Version: 1.0.1*
