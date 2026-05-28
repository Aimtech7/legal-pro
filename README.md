# LegalPro - Advocate Case Management System v1.0.1

[![CI/CD Pipeline](https://github.com/mokwathedeveloper/advocate_app/actions/workflows/ci.yml/badge.svg)](https://github.com/mokwathedeveloper/advocate_app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/mokwathedeveloper/advocate_app/releases)

A comprehensive, production-ready case management system designed specifically for legal professionals, law firms, and their clients. Built with a modern, highly scalable architecture combining a robust **NestJS** backend and a responsive **React** frontend.

---

## 🚀 Key Features

### For Legal Professionals (Advocates & Admins)
- **Case Management**: Complete case lifecycle tracker with secure cloud document storage, case priority tags, status updates, and auto-generated tracking numbers.
- **Appointment Scheduling**: Integrated calendar with type filters (`consultation`, `follow_up`, `court_appearance`), status indicators, conflict detection, and automated SMS/Email reminders.
- **Client Profiles**: Detailed index profiles of all admitted clients, including active cases, pending payments, and histories.
- **Case Notes**: Threaded timeline events with public or private visibility switches (for secure internal advocate notes).
- **Communication Panel**: Real-time websocket-based chat system with clients, including read indicators and file sharing.
- **Admin Control Panel**: Advanced dashboard metrics, transaction audit trails, role updates, advocate verification, and B2C refund mechanisms.

### For Clients
- **Interactive Dashboard**: Direct overview of active legal cases, upcoming appointments, and recent timeline updates.
- **Self-Service Appointments**: Live calendar check and self-booking tool with integrated consulting fee parameters.
- **M-Pesa Checkout**: Secure and seamless Kenyan mobile checkout utilizing Safaricom Daraja STK Push requests with live response tracking.
- **Case Tracking & Documents**: Safe access to court dates, status timelines, and uploaded documents.
- **Direct Messaging**: Quick real-time chat with assigned legal teams.

---

## 🛠️ Technology Stack

### Backend (API Server)
- **NestJS v11** & **TypeScript** - Modular architecture with dependency injection and clean separation of concerns.
- **Mongoose ODM** & **MongoDB Atlas** - Scalable schema tracking and document relationships.
- **Passport.js & JWT** - Secure token-based user authentication and guard-based permission control.
- **Swagger / OpenAPI** - Auto-generated and interactive API documentation served at `/api/docs`.
- **Socket.io** - Real-time full-duplex communication handler.
- **Cloudinary SDK** - Secure, signed legal document upload and delivery.
- **Nodemailer & Twilio** - Multi-channel (email/SMS) transaction alerts and reminders.

### Frontend (Client SPA)
- **React v18** & **Vite** - High-speed hot module replacement and bundle optimization.
- **TypeScript** - Full strict-type integration for development speed and safety.
- **Tailwind CSS** - HSL-tailored custom color palette and responsive utility framework.
- **Framer Motion** - Premium micro-animations, modal triggers, and transition states.
- **React Hook Form** - Optimized user input collection and validation.
- **React Query (TanStack)** - Query caching, background refetching, and state management.

---

## 📁 Project Structure

```
advocate_app/
├── src/                    # React Frontend Source Code
│   ├── components/         # Reusable design components (ui, Layout, calendar, payments)
│   ├── pages/             # Page components (Home, Dashboard, Cases, Appointments, etc.)
│   ├── contexts/          # React contexts (AuthContext session tracker)
│   ├── hooks/             # Custom state hooks (useApi)
│   ├── services/          # Axios HTTP and API layer (auth, payments, cases)
│   └── utils/             # Front-end date, map, and validation helpers
│
├── backend/               # NestJS Backend Source Code
│   ├── src/
│   │   ├── auth/          # Authentication module (JWT strategies, schemas, controllers)
│   │   ├── users/         # User and Advocate profiles module (services, guards)
│   │   ├── common/        # Shared decorators, guards, exception filters, and interceptors
│   │   ├── health/        # System status and db connection checker module
│   │   ├── config/        # Centralized configuration mapping and validation schema
│   │   ├── app.module.ts  # Root application module imports
│   │   └── main.ts        # Server entry point and configuration bootstrap
│   ├── test/              # Integration and end-to-end (e2e) tests
│   └── nest-cli.json      # NestJS project configuration
│
└── docs/                  # Project Requirements, API, and Integration Documentation
```

---

## ⚙️ Environment Configuration

### 1. Frontend Setup (`.env`)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_APP_NAME=LegalPro
VITE_APP_VERSION=1.0.1
```

### 2. Backend Setup (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Connection (MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/legalpro

# Security Tokens
JWT_SECRET=development-jwt-secret-key-for-testing-only-change-in-production
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Notifications (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# M-Pesa payments (Daraja API)
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
```

---

## 🚀 Quick Start Guide

Follow these steps to set up and launch LegalPro locally:

### Step 1: Install Dependencies
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Launch the Backend Server
```bash
cd backend
npm run start:dev
```
The NestJS server will start in watch mode at [http://localhost:5000](http://localhost:5000).  
Interactive Swagger API documentation is available at [http://localhost:5000/api/docs](http://localhost:5000/api/docs).

### Step 3: Launch the Frontend Client
Open a new terminal session in the root folder and run:
```bash
npm run dev
```
The Vite development server will spin up the web app at [http://localhost:5173](http://localhost:5173).

---

## 🧪 Testing

### Running Frontend Tests (Vitest)
```bash
# Run tests
npm run test

# Run tests with HTML coverage report
npm run test:coverage
```

### Running Backend Tests (Jest)
```bash
cd backend

# Run unit tests
npm run test

# Run e2e (end-to-end) tests
npm run test:e2e
```

---

## 📄 License & Contributing

This project is licensed under the MIT License. Contributions are welcome! Please check the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a Pull Request.

---
*Made with ❤️ by the LegalPro Development Team*