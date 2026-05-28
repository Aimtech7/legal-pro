# LegalPro - Complete Codebase Index

## 📋 Project Overview
**LegalPro v1.0.1** - A comprehensive case management system for legal professionals built with Express.js backend and React frontend.

## 🏗️ Current Architecture

### Backend (Express.js + MongoDB)
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB with Mongoose ODM v8.0.3
- **Authentication**: JWT-based authentication
- **File Storage**: Cloudinary integration
- **Real-time**: Socket.io v4.8.1
- **Payment**: M-Pesa Daraja API integration
- **Testing**: Jest with 80%+ coverage requirements

### Frontend (React + TypeScript)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite v5.4.2
- **Styling**: Tailwind CSS v3.4.17
- **State Management**: React Query v3.39.3
- **UI Components**: Custom components with Lucide React icons
- **Testing**: Vitest with React Testing Library

## 📁 Directory Structure

```
advocate_app/
├── backend/                    # Express.js backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── socket/               # Socket.io handlers
│   ├── utils/                # Utility functions
│   ├── tests/                # Backend tests
│   └── server.js             # Main server file
├── src/                      # React frontend
│   ├── components/           # React components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript types
│   └── utils/               # Frontend utilities
├── docs/                    # Documentation
└── scripts/                 # Build/deployment scripts
```

## 🔧 Backend Components

### Controllers (8 files)
- `authController.js` - User authentication & registration
- `caseController.js` - Case management operations
- `appointmentController.js` - Appointment scheduling
- `chatController.js` - Real-time messaging
- `dashboardController.js` - Dashboard statistics
- `paymentController.js` - M-Pesa payment processing
- `fileController.js` - File upload/management
- `userManagementController.js` - User administration

### Models (9 files)
- `User.js` - User accounts with role-based permissions
- `Case.js` - Legal case management
- `Appointment.js` - Appointment scheduling
- `Payment.js` - Payment transactions
- `ChatMessage.js` - Chat messages
- `File.js` - File metadata
- `Conversation.js` - Chat conversations
- `Message.js` - Message entities
- `TransactionLog.js` - Payment audit trail

### Routes (10 files)
- `auth.js` - Authentication endpoints
- `cases.js` - Case management API
- `appointments.js` - Appointment API
- `chat.js` - Chat/messaging API
- `dashboard.js` - Dashboard data API
- `payments.js` - Payment processing API
- `files.js` - File management API
- `notifications.js` - Notification system
- `userManagement.js` - User administration
- `whatsapp.js` - WhatsApp integration

### Middleware (5 files)
- `auth.js` - JWT authentication middleware
- `errorHandler.js` - Global error handling
- `upload.js` - File upload middleware
- `validation.js` - Input validation
- `notFound.js` - 404 handler

### Utilities (11 files)
- `mpesaService.js` - M-Pesa payment integration
- `notificationService.js` - Email/SMS notifications
- `cloudinaryService.js` - File storage service
- `emailVerification.js` - Email verification system
- `auditLogger.js` - Security audit logging
- `templateEngine.js` - Email template engine
- `validationUtils.js` - Input validation helpers
- `whatsappService.js` - WhatsApp integration
- `auth.js` - Authentication utilities
- `email.js` - Email service
- `sms.js` - SMS service

## 🎨 Frontend Components

### Core Components
- **Layout**: Navigation, footer, responsive layout
- **Authentication**: Login, register, email verification
- **Case Management**: Case forms, details, document upload
- **Appointments**: Booking forms, calendar widget
- **Chat System**: Real-time messaging interface
- **Payments**: M-Pesa integration, payment history
- **File Management**: Upload, gallery, document viewer
- **User Management**: Admin dashboard, permissions

### Pages (14 files)
- `Home.tsx` - Landing page
- `Dashboard.tsx` - User dashboard
- `Cases.tsx` - Case management
- `Appointments.tsx` - Appointment management
- `Messages.tsx` - Chat interface
- `Payments.tsx` - Payment dashboard
- `About.tsx` - About page
- `Contact.tsx` - Contact information
- `PracticeAreas.tsx` - Legal practice areas
- `Resources.tsx` - Legal resources
- `Locations.tsx` - Office locations
- `AreasWeServe.tsx` - Service areas
- `AdminManagement.tsx` - Admin panel
- `NotFound.tsx` - 404 page

### Services (8 files)
- `apiService.ts` - Base API client
- `authService.ts` - Authentication API
- `caseService.ts` - Case management API
- `appointmentService.ts` - Appointment API
- `chatService.ts` - Chat/messaging API
- `paymentService.ts` - Payment API
- `fileService.ts` - File management API
- `userManagementService.ts` - User admin API

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (advocate, admin, client)
- Super key verification for advocate registration
- Email verification system
- Password strength validation
- Audit logging for security events

### Data Protection
- Input sanitization (mongo-sanitize, xss-clean)
- Rate limiting (express-rate-limit)
- CORS configuration
- Helmet security headers
- HPP parameter pollution protection
- File upload validation

## 💳 Payment Integration

### M-Pesa Features
- STK Push payments
- Real-time payment status tracking
- B2C refunds (admin only)
- Transaction logging and audit trail
- Payment analytics dashboard
- Retry mechanisms for failed transactions

## 📱 Real-time Features

### Socket.io Implementation
- Real-time chat messaging
- Typing indicators
- Online status tracking
- Room-based conversations
- Rate limiting for socket connections
- Connection validation middleware

## 🧪 Testing Infrastructure

### Backend Testing
- Jest test framework
- 80%+ coverage requirements
- Unit tests for controllers, models, middleware
- Integration tests for API endpoints
- M-Pesa payment testing
- Notification system testing

### Frontend Testing
- Vitest test framework
- React Testing Library
- Component testing
- Service layer testing
- Accessibility testing
- Responsive design testing

## 📊 Key Metrics & Standards

### Code Quality
- ESLint configuration
- Prettier code formatting
- TypeScript strict mode
- Comprehensive error handling
- API response standardization
- Detailed logging and monitoring

### Performance
- Compression middleware
- MongoDB query optimization
- File upload size limits (10MB)
- Rate limiting (100 requests/15min)
- Cloudinary image optimization
- Socket.io connection management

## 🚀 Deployment & DevOps

### CI/CD Pipeline
- GitHub Actions workflows
- Automated testing on PR
- Code coverage reporting
- Release automation
- Environment-specific configurations

### Environment Support
- Development, staging, production configs
- Docker support (optional)
- Railway deployment configuration
- Vercel frontend deployment
- MongoDB Atlas integration

## 📈 Business Logic

### User Roles & Permissions
1. **Client**: Case viewing, appointment booking, payments
2. **Advocate**: Full case management, client communication
3. **Admin**: User management, system administration

### Core Workflows
1. **User Registration**: Email verification → Account activation
2. **Case Management**: Creation → Document upload → Progress tracking
3. **Appointment Booking**: Scheduling → Confirmation → Reminders
4. **Payment Processing**: STK Push → Status tracking → Receipt generation
5. **Communication**: Real-time chat → Notifications → Email alerts

## 🔧 Configuration Management

### Environment Variables
- Database connections
- JWT secrets
- Email/SMS service credentials
- M-Pesa API credentials
- Cloudinary configuration
- Notification settings

### Feature Flags
- Email verification enforcement
- Payment system toggles
- Notification preferences
- Debug logging levels

## 📚 Documentation

### Available Documentation
- API documentation
- Deployment guides
- Testing guides
- User guides
- Implementation summaries
- Integration specifications

This codebase represents a mature, production-ready legal case management system with comprehensive features, security measures, and testing infrastructure.