# Implementation Plan - LegalPro Documentation & Launch

This plan outlines the steps to explore the LegalPro codebase, create a comprehensive main README.md, document the complete functionality and technical implementation in a new master reference guide, and run the entire application (frontend & backend).

## User Review Required

> [!IMPORTANT]
> The backend uses a pre-configured MongoDB cloud URI in `backend/.env.example`. We will use this pre-configured URI to set up `backend/.env` so the application connects seamlessly without requiring a local MongoDB instance. If you prefer to use a local or different instance, please let us know!

> [!TIP]
> We will launch the backend (NestJS, port 5000) and frontend (Vite React + TypeScript, port 5173) in separate background terminal instances. You will be able to access the web application at http://localhost:5173 and the API documentation at http://localhost:5000/api/docs.

## Proposed Changes

### Documentation Updates

We will enhance existing docs and create a new master manual to explain all modules, workflows, architecture, and technology choices in detail.

#### [MODIFY] [README.md](file:///c:/Users/wilso/Downloads/advocate_app-main/advocate_app-main/README.md)
Update the root README.md to:
- Document the modern NestJS backend architecture (following the recent migration from Express).
- Align with the React + Vite + TypeScript frontend stack.
- Include step-by-step setup, configuration, and run instructions.
- Outline all available scripts, tools, and testing commands.

#### [NEW] [APP_FUNCTIONALITY_AND_IMPLEMENTATION.md](file:///c:/Users/wilso/Downloads/advocate_app-main/advocate_app-main/docs/APP_FUNCTIONALITY_AND_IMPLEMENTATION.md)
Create a comprehensive master document detailing:
- **System Architecture**: Client-Server diagram, folder structure, database schema overview, and tech stack details.
- **Backend Architecture (NestJS)**: Explain Modules (Auth, Users, Health, Common), Guards, Interceptors, Exception Filters, validation pipes, and Swagger documentation.
- **Frontend Architecture (React + TS)**: Detail Page Routing, State Management (AuthContext, Custom Hooks, React Query), Component Structure, and styling.
- **Core Features & Workflows**: Detail step-by-step workflows for User Registration & Role-based Access, Case Management (documents, notes), Appointment Booking (status, duration), Real-Time Chat (Socket.io), and Payment Integration (M-Pesa Daraja STK Push & refunds).
- **Environment & Integration Setup**: Detail integration steps for M-Pesa, Cloudinary, Twilio SMS, Nodemailer, and Google Maps.

### Application Startup Configuration

#### [NEW] [.env](file:///c:/Users/wilso/Downloads/advocate_app-main/advocate_app-main/.env)
Create the frontend environment file by copying `.env.example` with the local API and Socket URLs.

#### [NEW] [backend/.env](file:///c:/Users/wilso/Downloads/advocate_app-main/advocate_app-main/backend/.env)
Create the backend environment file by copying `backend/.env.example`, including the cloud MongoDB URI.

## Verification & Execution Plan

### Automated Run Commands
1. Copy `.env.example` to `.env` in root.
2. Copy `backend/.env.example` to `backend/.env` in backend.
3. Install frontend and backend packages (using `npm install`).
4. Start the NestJS backend in development mode (`npm run start:dev` inside backend folder).
5. Start the Vite React frontend in development mode (`npm run dev` in root folder).
6. Verify access to:
   - Frontend: http://localhost:5173
   - Backend API Health: http://localhost:5000/api/health
   - API Docs (Swagger): http://localhost:5000/api/docs

### Manual Verification
- We will monitor background terminal commands to ensure both services build and run cleanly without errors.
- Confirm connection status of the MongoDB database through the `/api/health` and `/api/readiness` endpoints.
