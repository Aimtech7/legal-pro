# LegalPro Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the LegalPro Case Management System in production and development environments.

## System Requirements

### Minimum Hardware Requirements
- **CPU:** 2 cores, 2.4 GHz
- **RAM:** 4GB (8GB recommended)
- **Storage:** 50GB SSD (100GB+ recommended for production)
- **Network:** 100 Mbps internet connection

### Recommended Production Hardware
- **CPU:** 4+ cores, 3.0+ GHz
- **RAM:** 16GB+
- **Storage:** 200GB+ SSD with backup
- **Network:** 1 Gbps connection
- **Load Balancer:** For high availability

### Software Requirements
- **Node.js:** v18.0.0 or higher
- **MongoDB:** v6.0 or higher
- **Redis:** v6.0 or higher (for caching)
- **Nginx:** v1.20+ (reverse proxy)
- **SSL Certificate:** For HTTPS

---

## Environment Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legalpro?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb://localhost:27017/legalpro_test

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d

# Cloudinary Configuration (File Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@legalpro.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
MAX_FILES_PER_CASE=50
MAX_STORAGE_PER_CASE=524288000

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=LegalPro
VITE_APP_VERSION=1.0.1

# Environment
VITE_NODE_ENV=production

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_NOTIFICATIONS=true
```

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account:**
   - Sign up at https://www.mongodb.com/atlas
   - Create a new cluster
   - Choose appropriate tier (M10+ for production)

2. **Configure Database:**
   ```bash
   # Connect to your cluster
   mongosh "mongodb+srv://cluster.mongodb.net/legalpro" --username <username>
   
   # Create indexes for better performance
   use legalpro
   
   # User indexes
   db.users.createIndex({ "email": 1 }, { unique: true })
   db.users.createIndex({ "role": 1 })
   
   # Case indexes
   db.cases.createIndex({ "caseNumber": 1 }, { unique: true })
   db.cases.createIndex({ "clientId": 1, "status": 1 })
   db.cases.createIndex({ "assignedTo": 1, "status": 1 })
   db.cases.createIndex({ "category": 1, "status": 1 })
   db.cases.createIndex({ "createdAt": -1 })
   db.cases.createIndex({ "courtDate": 1 })
   ```

3. **Set Up Database User:**
   - Create database user with read/write permissions
   - Configure IP whitelist or use 0.0.0.0/0 for cloud deployment
   - Enable MongoDB monitoring and alerts

### Local MongoDB (Development)

1. **Install MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB:**
   ```bash
   # Linux/macOS
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

---

## Cloudinary Setup

### Account Configuration
1. **Create Cloudinary Account:**
   - Sign up at https://cloudinary.com
   - Note your Cloud Name, API Key, and API Secret

2. **Configure Upload Presets:**
   ```javascript
   // Create upload preset in Cloudinary dashboard
   {
     "name": "legalpro_documents",
     "unsigned": false,
     "folder": "legalpro/cases",
     "resource_type": "auto",
     "allowed_formats": ["pdf", "doc", "docx", "jpg", "png", "gif"],
     "max_file_size": 10485760,
     "use_filename": true,
     "unique_filename": true
   }
   ```

3. **Set Up Transformations:**
   ```javascript
   // For document thumbnails
   {
     "name": "document_thumbnail",
     "transformation": [
       { "width": 200, "height": 200, "crop": "fill" },
       { "quality": "auto", "format": "auto" }
     ]
   }
   ```

---

## Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/yourusername/legalpro.git
cd legalpro

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies and build
cd ../
npm install
npm run build

# Set up PM2 ecosystem
pm2 ecosystem
```

#### 3. PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'legalpro-backend',
      script: './backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

#### 4. Nginx Configuration
```nginx
# /etc/nginx/sites-available/legalpro
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/legalpro/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # File upload size
        client_max_body_size 10M;
    }

    # Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5. SSL Certificate Setup
```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Docker Deployment

#### 1. Dockerfile (Backend)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["node", "server.js"]
```

#### 2. Dockerfile (Frontend)
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:5000

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### Option 3: Cloud Platform Deployment (Heroku)

#### 1. Heroku Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create applications
heroku create legalpro-backend
heroku create legalpro-frontend

# Set environment variables
heroku config:set NODE_ENV=production --app legalpro-backend
heroku config:set MONGODB_URI=your-mongodb-uri --app legalpro-backend
heroku config:set JWT_SECRET=your-jwt-secret --app legalpro-backend
# ... add all other environment variables
```

#### 2. Procfile (Backend)
```
web: node server.js
```

#### 3. Deploy
```bash
# Backend deployment
cd backend
git init
heroku git:remote -a legalpro-backend
git add .
git commit -m "Initial deployment"
git push heroku main

# Frontend deployment
cd ../
heroku git:remote -a legalpro-frontend
git add .
git commit -m "Initial deployment"
git push heroku main
```

---

## Monitoring & Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs legalpro-backend

# Restart application
pm2 restart legalpro-backend

# Check status
pm2 status
```

### Database Monitoring
```bash
# MongoDB status
mongosh --eval "db.runCommand({serverStatus: 1})"

# Check database size
mongosh --eval "db.stats()"

# Monitor slow queries
mongosh --eval "db.setProfilingLevel(2, {slowms: 100})"
```

### Backup Strategy
```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/mongodb_$DATE"
tar -czf "/backups/mongodb_$DATE.tar.gz" "/backups/mongodb_$DATE"
rm -rf "/backups/mongodb_$DATE"

# Keep only last 7 days of backups
find /backups -name "mongodb_*.tar.gz" -mtime +7 -delete
```

### Security Checklist
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall configured (only necessary ports open)
- [ ] Database access restricted to application servers
- [ ] Environment variables secured
- [ ] Regular security updates applied
- [ ] Backup and recovery procedures tested
- [ ] Monitoring and alerting configured
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization in place

---

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs legalpro-backend

# Check environment variables
pm2 env 0

# Restart with fresh environment
pm2 delete legalpro-backend
pm2 start ecosystem.config.js
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "$MONGODB_URI"

# Check network connectivity
telnet cluster.mongodb.net 27017
```

#### File Upload Issues
```bash
# Check Cloudinary configuration
curl -X POST \
  https://api.cloudinary.com/v1_1/your-cloud-name/image/upload \
  -F "file=@test.jpg" \
  -F "upload_preset=your-preset"
```

### Performance Optimization
1. **Enable Gzip compression in Nginx**
2. **Configure browser caching**
3. **Optimize database queries with proper indexing**
4. **Implement Redis caching for frequently accessed data**
5. **Use CDN for static assets**
6. **Monitor and optimize bundle sizes**

---

*Last Updated: March 2024*  
*Version: 1.0.1*
