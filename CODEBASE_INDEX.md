# 📋 LegalPro Codebase Index v1.0.1

## 🏗️ Project Overview
**LegalPro** is a comprehensive advocate case management system built with modern web technologies. This index provides a complete overview of the codebase structure, components, and functionality.

## 🎯 Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: React Query + Context API
- **Form Handling**: React Hook Form 7.59.0
- **Routing**: React Router v6.22.1
- **Animations**: Framer Motion 11.0.3
- **Icons**: Lucide React 0.344.0
- **HTTP Client**: Axios 1.10.0
- **Notifications**: React Hot Toast 2.5.2
- **Date Handling**: Date-fns 3.3.1
- **Maps**: Google Maps React Wrapper 1.2.0

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB + Mongoose 8.0.3
- **Authentication**: JWT 9.0.2 + bcrypt 2.4.3
- **File Storage**: Cloudinary 1.41.0
- **Real-time**: Socket.IO 4.7.4
- **Email**: Nodemailer 6.9.7
- **SMS**: Twilio 4.19.0
- **Security**: Helmet 7.1.0, CORS 2.8.5, Rate Limiting 7.1.5
- **Validation**: Express Validator 7.0.1
- **File Upload**: Multer 1.4.5-lts.1

## 📁 Project Structure

```
advocate_app/
├── 📄 Documentation & Config
│   ├── README.md                    # Main project documentation
│   ├── CODEBASE_INDEX.md           # This comprehensive codebase index
│   ├── CODE_INDEX.md               # Alternative codebase structure guide
│   ├── CHANGELOG.md                # Version history and updates
│   ├── CONTRIBUTING.md             # Contribution guidelines
│   ├── CODE_OF_CONDUCT.md          # Community standards
│   ├── DEPLOYMENT_GUIDE.md         # Deployment instructions
│   ├── IMPLEMENTATION_PLAN.md      # Development roadmap
│   ├── IMPLEMENTATION_SUMMARY.md   # Implementation status summary
│   └── PRIORITY_IMPLEMENTATION_PLAN.md # Priority features plan
│
├── 🎨 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Layout/            # Layout components
│   │   │   │   ├── Layout.tsx     # Main layout wrapper with Outlet
│   │   │   │   ├── Navbar.tsx     # Navigation bar with auth state
│   │   │   │   └── Footer.tsx     # Site footer with links & contact
│   │   │   ├── ui/                # Basic UI components
│   │   │   │   ├── Button.tsx     # Reusable button with variants
│   │   │   │   ├── Card.tsx       # Card container component
│   │   │   │   └── Input.tsx      # Form input with forwardRef
│   │   │   ├── calendar/          # Calendar components
│   │   │   │   └── CalendarWidget.tsx # Calendar widget (placeholder)
│   │   │   ├── chat/              # Chat components
│   │   │   ├── files/             # File handling components
│   │   │   ├── maps/              # Google Maps components
│   │   │   ├── notifications/     # Notification components
│   │   │   ├── payments/          # Payment components
│   │   │   ├── whatsapp/          # WhatsApp widget
│   │   │   │   └── WhatsAppWidget.tsx # WhatsApp contact widget
│   │   │   └── UserManagement/    # User management components
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.tsx           # Landing page with hero section
│   │   │   ├── About.tsx          # About page
│   │   │   ├── Dashboard.tsx      # User dashboard with stats
│   │   │   ├── Cases.tsx          # Case management interface
│   │   │   ├── Appointments.tsx   # Appointment scheduling
│   │   │   ├── Messages.tsx       # Chat interface
│   │   │   ├── AdminManagement.tsx # Admin panel (advocate only)
│   │   │   ├── PracticeAreas.tsx  # Practice areas showcase
│   │   │   ├── Contact.tsx        # Contact page
│   │   │   ├── AreasWeServe.tsx   # Service areas
│   │   │   ├── Resources.tsx      # Legal resources
│   │   │   ├── Locations.tsx      # Office locations
│   │   │   ├── NotFound.tsx       # 404 error page
│   │   │   └── auth/              # Authentication pages
│   │   │       ├── Login.tsx      # Login form
│   │   │       ├── Register.tsx   # Client registration
│   │   │       └── AdvocateRegister.tsx # Advocate registration
│   │   ├── contexts/              # React contexts
│   │   │   └── AuthContext.tsx    # Authentication state management
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useApi.ts          # API state management hook
│   │   ├── services/              # API services
│   │   │   ├── apiService.ts      # Main API client with axios
│   │   │   ├── authService.ts     # Authentication API calls
│   │   │   ├── paymentService.ts  # Payment API integration
│   │   │   └── userManagementService.ts # User management API
│   │   ├── types/                 # TypeScript definitions
│   │   │   └── index.ts           # Complete type definitions
│   │   ├── App.tsx                # Main app component with routing
│   │   ├── main.tsx               # App entry point
│   │   ├── index.css              # Global styles with Tailwind
│   │   └── vite-env.d.ts          # Vite type definitions
│   ├── index.html                 # HTML template
│   ├── package.json               # Frontend dependencies
│   ├── package-lock.json          # Dependency lock file
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.js          # PostCSS config
│   ├── tsconfig.json              # TypeScript config
│   ├── tsconfig.app.json          # App-specific TS config
│   ├── tsconfig.node.json         # Node-specific TS config
│   ├── eslint.config.js           # ESLint configuration
│   └── vercel.json                # Vercel deployment config
│
├── 🔧 Backend (Node.js + Express)
│   ├── backend/
│   │   ├── controllers/           # Route controllers
│   │   │   ├── authController.js  # Authentication logic & JWT
│   │   │   ├── caseController.js  # Case CRUD operations
│   │   │   ├── appointmentController.js # Appointment scheduling
│   │   │   ├── chatController.js  # Real-time chat functionality
│   │   │   ├── dashboardController.js # Dashboard statistics
│   │   │   ├── paymentController.js # Payment processing
│   │   │   ├── notificationController.js # Notification management
│   │   │   └── userManagementController.js # User management
│   │   ├── models/                # Mongoose database models
│   │   │   ├── User.js            # User schema with roles & permissions
│   │   │   ├── Case.js            # Case schema with documents & notes
│   │   │   ├── Appointment.js     # Appointment schema
│   │   │   ├── ChatMessage.js     # Chat message schema
│   │   │   └── Payment.js         # Payment transaction schema
│   │   ├── routes/                # Express API routes
│   │   │   ├── auth.js            # Authentication endpoints
│   │   │   ├── cases.js           # Case management endpoints
│   │   │   ├── appointments.js    # Appointment endpoints
│   │   │   ├── chat.js            # Chat endpoints
│   │   │   ├── dashboard.js       # Dashboard data endpoints
│   │   │   ├── payments.js        # Payment endpoints
│   │   │   ├── notifications.js   # Notification endpoints
│   │   │   ├── whatsapp.js        # WhatsApp integration
│   │   │   └── userManagement.js  # User management endpoints
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   ├── validation.js      # Input validation middleware
│   │   │   ├── upload.js          # File upload handling (Multer)
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   └── notFound.js        # 404 handler
│   │   ├── utils/                 # Utility functions
│   │   │   ├── auth.js            # Auth helper functions
│   │   │   ├── email.js           # Email service (Nodemailer)
│   │   │   ├── sms.js             # SMS service (Twilio)
│   │   │   ├── mpesaService.js    # M-Pesa Daraja API integration
│   │   │   ├── notificationService.js # Unified notification service
│   │   │   └── whatsappService.js # WhatsApp API integration
│   │   ├── config/                # Configuration files
│   │   │   └── cloudinary.js      # Cloudinary file storage setup
│   │   ├── socket/                # Socket.IO handlers
│   │   │   └── socketHandler.js   # Real-time communication setup
│   │   ├── scripts/               # Database & utility scripts
│   │   │   └── seedDatabase.js    # Database seeding script
│   │   ├── server.js              # Main Express server file
│   │   ├── package.json           # Backend dependencies
│   │   ├── package-lock.json      # Backend dependency lock
│   │   ├── Procfile               # Heroku deployment config
│   │   ├── railway.json           # Railway deployment config
│   │   └── README.md              # Backend documentation
│
├── 🚀 DevOps & Automation
│   └── scripts/                   # Automation scripts
│       ├── git-workflow.sh        # Git workflow automation
│       ├── create-feature-branch.sh # Feature branch creation
│       ├── create-pull-request.sh # Pull request automation
│       ├── release.sh             # Release deployment
│       ├── release-notes.sh       # Release notes generation
│       ├── setup-repository.sh    # Repository setup
│       └── pr-template.md         # Pull request template
│
└── 📊 Additional Files
    ├── cookies.txt                # HTTP cookies configuration
    └── .gitignore                 # Git ignore patterns
```

## 🔑 Key Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Client, Advocate, Admin) with granular permissions
- **Protected routes** with middleware validation
- **Password hashing** with bcrypt for security
- **Account verification** system for advocates
- **Temporary password** support for admin-created accounts
- **Last login tracking** and session management

### 📋 Case Management
- **Complete CRUD operations** for legal cases
- **Client information tracking** with detailed profiles
- **Case status management** (pending, in_progress, completed, closed)
- **Priority levels** (low, medium, high, urgent)
- **Document upload and storage** via Cloudinary
- **Case timeline and notes** with private/public visibility
- **Case categorization** by legal practice areas
- **Auto-generated case numbers** for tracking

### 📅 Appointment Scheduling
- **Calendar integration** with date/time management
- **Client-advocate meeting scheduling** with conflict detection
- **Multiple appointment types** (consultation, follow_up, court_appearance)
- **Appointment status tracking** (scheduled, confirmed, completed, cancelled)
- **Fee management** and payment integration
- **Location and meeting link** support
- **Automated notifications** for upcoming appointments

### 💬 Real-time Communication
- **Socket.IO-based chat system** for instant messaging
- **Client-advocate messaging** with role-based access
- **Message history and status** tracking
- **File sharing capabilities** in chat
- **Real-time notifications** for new messages
- **Read status indicators** for message tracking

### 💳 Payment Processing
- **M-Pesa Daraja API integration** for mobile payments
- **Multiple payment methods** (M-Pesa, card, bank transfer)
- **Payment tracking and history** with transaction IDs
- **Billing management** for appointments and services
- **Transaction status monitoring** (pending, completed, failed, refunded)
- **Automated payment notifications** via email/SMS

### 📊 Dashboard & Analytics
- **Comprehensive statistics** (total cases, users, appointments)
- **Recent activities** overview with real-time updates
- **Case distribution** by status and priority
- **Appointment calendar** with upcoming events
- **Performance metrics** and analytics
- **Role-based dashboard views** for different user types

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration (client/advocate)
- `POST /login` - User login with role validation
- `GET /me` - Get current authenticated user
- `POST /forgot-password` - Request password reset
- `PUT /reset-password` - Reset password with token
- `PUT /change-password` - Change password (authenticated)

### Cases (`/api/cases`)
- `GET /` - Get all cases (with filtering & pagination)
- `POST /` - Create new case
- `GET /:id` - Get specific case details
- `PUT /:id` - Update case information
- `DELETE /:id` - Delete case (soft delete)
- `POST /:id/documents` - Upload case documents
- `POST /:id/notes` - Add case notes
- `GET /:id/timeline` - Get case timeline

### Appointments (`/api/appointments`)
- `GET /` - Get appointments (with date filtering)
- `POST /` - Create new appointment
- `GET /:id` - Get specific appointment
- `PUT /:id` - Update appointment details
- `DELETE /:id` - Cancel appointment
- `PUT /:id/confirm` - Confirm appointment
- `PUT /:id/complete` - Mark appointment as completed

### Chat (`/api/chat`)
- `GET /messages` - Get chat messages (with pagination)
- `POST /messages` - Send new message
- `PUT /messages/read` - Mark messages as read
- `GET /conversations` - Get user conversations
- `POST /upload` - Upload file in chat

### Payments (`/api/payments`)
- `GET /` - Get payment history
- `POST /` - Process new payment
- `GET /:id` - Get payment details
- `POST /mpesa` - M-Pesa payment initiation
- `POST /mpesa/callback` - M-Pesa callback handler
- `GET /methods` - Get available payment methods

### Dashboard (`/api/dashboard`)
- `GET /` - Get comprehensive dashboard data
- `GET /stats` - Get statistics summary
- `GET /recent-activities` - Get recent activities
- `GET /analytics` - Get analytics data

### User Management (`/api/user-management`)
- `GET /users` - Get all users (admin/advocate only)
- `POST /users` - Create new user account
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Deactivate user account
- `PUT /users/:id/permissions` - Update user permissions
- `PUT /users/:id/verify` - Verify advocate account

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `POST /` - Send notification
- `PUT /:id/read` - Mark notification as read
- `DELETE /:id` - Delete notification

### WhatsApp (`/api/whatsapp`)
- `POST /send` - Send WhatsApp message
- `GET /status` - Get WhatsApp service status

### System
- `GET /api/health` - Health check endpoint
- `GET /api/version` - Get API version info

## 📊 Database Models & Schemas

### User Model
```javascript
{
  firstName: String (required, max 50 chars),
  lastName: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['advocate', 'admin', 'client']),
  phone: String (optional),
  avatar: String (optional),

  // Advocate-specific fields
  licenseNumber: String (required for advocates),
  specialization: [String],
  experience: Number,
  education: String,
  barAdmission: String,
  isVerified: Boolean (default false for advocates),

  // Admin permissions
  permissions: {
    canOpenFiles: Boolean,
    canUploadFiles: Boolean,
    canAdmitClients: Boolean,
    canManageCases: Boolean,
    canScheduleAppointments: Boolean,
    canAccessReports: Boolean
  },

  // Management fields
  createdBy: ObjectId (ref: User),
  isTemporaryPassword: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Case Model
```javascript
{
  caseNumber: String (unique, auto-generated),
  title: String (required, max 200 chars),
  description: String (required),
  category: String (enum: practice areas),
  status: String (enum: ['pending', 'in_progress', 'completed', 'closed']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  clientId: ObjectId (ref: User, required),
  assignedTo: ObjectId (ref: User),
  courtDate: Date,

  // Embedded schemas
  documents: [{
    name: String,
    type: String,
    size: Number,
    url: String,
    uploadedBy: ObjectId (ref: User),
    timestamps: true
  }],

  notes: [{
    content: String,
    author: ObjectId (ref: User),
    isPrivate: Boolean,
    timestamps: true
  }],

  timeline: [{
    event: String,
    description: String,
    performedBy: ObjectId (ref: User),
    timestamp: Date
  }],

  isArchived: Boolean,
  timestamps: true
}
```

### Appointment Model
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  time: String (required),
  duration: Number (minutes),
  status: String (enum: ['scheduled', 'confirmed', 'completed', 'cancelled']),
  type: String (enum: ['consultation', 'follow_up', 'court_appearance']),
  clientId: ObjectId (ref: User, required),
  advocateId: ObjectId (ref: User),
  location: String,
  meetingLink: String,
  fee: Number,
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  notes: String,
  timestamps: true
}
```

## 🔧 Development Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB Atlas** account or local MongoDB
- **Git** for version control
- **Cloudinary** account for file storage
- **Twilio** account for SMS (optional)
- **Email service** credentials (Gmail/SMTP)

### Installation
```bash
# Clone repository
git clone https://github.com/mokwathedeveloper/advocate_app.git
cd advocate_app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start development servers
npm run dev  # Frontend (port 5173)
cd backend && npm run dev  # Backend (port 5000)
```

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/advocate_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment (M-Pesa Daraja API)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_business_shortcode
MPESA_PASSKEY=your_passkey

# Notification Settings
NOTIFY_EMAIL=admin@yourdomain.com
NOTIFY_PHONE=+254700000000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🛡️ Security Features
- **CORS Protection** with configurable origins
- **Rate Limiting** (100 requests per 15 minutes)
- **XSS Prevention** with xss-clean middleware
- **MongoDB Injection Protection** with mongo-sanitize
- **Helmet Security Headers** for HTTP security
- **Data Sanitization** for all inputs
- **Parameter Pollution Protection** with hpp
- **JWT Token Validation** for protected routes
- **Password Hashing** with bcrypt (salt rounds: 10)
- **Input Validation** with express-validator

## 📝 Recent Updates (v1.0.1)
- ✅ **Fixed React ref warnings** with forwardRef implementation
- ✅ **Resolved CORS issues** for frontend-backend communication
- ✅ **Updated API URLs** to use correct port (5000)
- ✅ **Enhanced CORS configuration** for better cross-origin support
- ✅ **Implemented complete dashboard controller** with data aggregation
- ✅ **Added comprehensive user management** with role-based permissions
- ✅ **Integrated WhatsApp widget** for client communication
- ✅ **Enhanced authentication system** with account verification
- ✅ **Improved error handling** and validation across all endpoints
- ✅ **Added notification service** with email and SMS support
- ✅ **Implemented file upload** with Cloudinary integration
- ✅ **Added Socket.IO** for real-time communication
- ✅ **Complete API documentation** with all endpoints
- ✅ **All 84+ files committed** individually with descriptive messages

## 🎯 Current Status
- **Frontend**: ✅ Running on http://localhost:5173 (Vite dev server)
- **Backend**: ✅ Running on http://localhost:5000 (Express server)
- **Database**: ✅ Connected to MongoDB Atlas
- **Authentication**: ✅ JWT system operational with role-based access
- **API Communication**: ✅ CORS resolved, all endpoints working
- **File Upload**: ✅ Cloudinary integration working
- **Real-time Chat**: ✅ Socket.IO configured and operational
- **Payment Integration**: ✅ M-Pesa Daraja API ready
- **Email/SMS**: ✅ Notification services configured
- **File Structure**: ✅ Complete and well-organized
- **Git Repository**: ✅ All files committed with proper structure

## 🚀 Next Steps
1. **Testing & Quality Assurance**
   - Unit tests for all controllers and models
   - Integration tests for API endpoints
   - Frontend component testing
   - End-to-end testing with Cypress

2. **UI/UX Enhancements**
   - Mobile responsiveness improvements
   - Loading states and error handling
   - Professional color scheme consistency
   - Accessibility improvements

3. **Advanced Features**
   - Email notification templates
   - Advanced search and filtering
   - Report generation (PDF)
   - Calendar integration (Google Calendar)
   - Mobile app development

4. **Production Deployment**
   - Environment-specific configurations
   - SSL certificate setup
   - Database optimization
   - Performance monitoring
   - Backup strategies

---
*Last Updated: July 1, 2025 - LegalPro v1.0.1*
*Comprehensive Codebase Index - Complete System Overview*
