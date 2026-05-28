# LegalPro Deployment Guide

## 🚀 Quick Deployment (Vercel + Railway)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas (already configured)

## 📦 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 1.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `advocate_app` repository
4. Select the `backend` folder as root directory
5. Railway will auto-detect Node.js and deploy

### 1.3 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://mokwastudies:mokwa123@advocate.wcrkd4r.mongodb.net/?retryWrites=true&w=majority&appName=advocate
JWT_SECRET=your-super-secure-jwt-secret-key-for-production-2024
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 1.4 Get Backend URL
- Copy your Railway backend URL (e.g., `https://your-app.railway.app`)

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Frontend
1. Click "New Project"
2. Import your `advocate_app` repository
3. Set root directory to `/` (main folder)
4. Vercel will auto-detect Vite/React

### 2.3 Configure Environment Variables
In Vercel dashboard, add:
```
VITE_API_URL=https://your-backend-url.railway.app
```

### 2.4 Update Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 🔧 Step 3: Update Configuration

### 3.1 Update API URL in Frontend
Update the API URL in your frontend code to point to Railway backend.

### 3.2 Update CORS in Backend
Update CORS settings to allow your Vercel frontend URL.

## ✅ Step 4: Test Deployment

1. Visit your Vercel frontend URL
2. Test advocate registration with super key: `ADVOCATE_MASTER_2024_LEGALPRO`
3. Test login functionality
4. Verify all features work

## 🔒 Security Notes

- Never commit `.env` files to GitHub
- Use environment variables for all secrets
- Enable HTTPS (automatic on Vercel/Railway)
- Configure proper CORS settings

## 📱 Features Available After Deployment

- ✅ Advocate Registration & Login
- ✅ WhatsApp Integration (0726745739)
- ✅ Google Maps Integration
- ✅ M-Pesa Payments
- ✅ Real-time Chat
- ✅ Document Management
- ✅ Case Management
- ✅ Client Management
- ✅ Analytics Dashboard

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update FRONTEND_URL in backend environment
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Failures**: Check Node.js version compatibility
4. **API Errors**: Verify backend URL in frontend environment

### Support:
- WhatsApp: 0726745739
- Email: Contact through the application
