# LegalPro Backend - Production Deployment Guide

## Prerequisites

- Node.js 16 or higher
- MongoDB instance (local or cloud)
- PM2 process manager
- Environment variables configured

## Deployment Steps

### 1. Environment Setup

Copy the production environment template:
```bash
cp .env.production.example .env.production
```

Update the production environment variables:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong, unique JWT secret
- Email, SMS, Cloudinary, and M-Pesa production credentials
- `CLIENT_URL`: Production frontend URL

### 2. Deploy Application

Run the deployment script:
```bash
./deploy.sh
```

This script will:
- Install production dependencies
- Build the NestJS application
- Configure PM2 process manager
- Start the application in cluster mode
- Setup automatic startup on system reboot

### 3. Verify Deployment

Check application status:
```bash
pm2 status
```

Test health endpoints:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/readiness
```

View API documentation:
```
http://localhost:5000/api/docs
```

## Production Management

### Process Management
```bash
# View application status
pm2 status

# View logs
pm2 logs legalpro-api

# Restart application
pm2 restart legalpro-api

# Stop application
pm2 stop legalpro-api

# Monitor resources
pm2 monit
```

### Log Management
Logs are stored in the `logs/` directory:
- `err.log`: Error logs
- `out.log`: Standard output logs
- `combined.log`: Combined logs

### Database Backup
Ensure regular MongoDB backups:
```bash
mongodump --uri="your_mongodb_uri" --out=/path/to/backup
```

### SSL/HTTPS Setup
For production, configure a reverse proxy (nginx) with SSL:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

1. **Environment Variables**: Never commit production secrets to version control
2. **Database Security**: Use MongoDB authentication and network restrictions
3. **API Rate Limiting**: Configure appropriate rate limits for production traffic
4. **CORS**: Restrict CORS origins to your production frontend domain
5. **Monitoring**: Set up application monitoring and alerting

## Troubleshooting

### Application Won't Start
1. Check PM2 logs: `pm2 logs legalpro-api`
2. Verify environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check port availability

### High Memory Usage
1. Monitor with: `pm2 monit`
2. Adjust `max_memory_restart` in `ecosystem.config.js`
3. Consider reducing cluster instances if needed

### Database Connection Issues
1. Verify MongoDB URI format
2. Check network connectivity
3. Ensure database user has proper permissions
4. Test connection manually with MongoDB client

## Maintenance

### Updates
1. Pull latest code changes
2. Run deployment script: `./deploy.sh`
3. PM2 will handle zero-downtime restart

### Scaling
Adjust cluster instances in `ecosystem.config.js`:
```javascript
instances: 4, // or 'max' for CPU count
```

Then restart: `pm2 restart legalpro-api`