#!/bin/bash

# LegalPro Backend Deployment Script
set -e

echo "🚀 Starting LegalPro Backend Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Stop existing application if running
echo "🛑 Stopping existing application..."
pm2 stop legalpro-api 2>/dev/null || true
pm2 delete legalpro-api 2>/dev/null || true

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
pm2 status

echo ""
echo "🔗 Application URLs:"
echo "   API: http://localhost:5000"
echo "   Health: http://localhost:5000/api/health"
echo "   Documentation: http://localhost:5000/api/docs"
echo ""
echo "📝 Useful commands:"
echo "   View logs: pm2 logs legalpro-api"
echo "   Restart: pm2 restart legalpro-api"
echo "   Stop: pm2 stop legalpro-api"
echo "   Monitor: pm2 monit"