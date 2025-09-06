# 🚀 OG MERCH STORE - DEPLOYMENT GUIDE

## 🔥 Quick Deploy (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (optional, for cloning)

### One-Click Deployment

**Windows:**
```bash
# Double-click deploy.bat or run in Command Prompt
deploy.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### Access Your Store
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **Health Check:** http://localhost:8000/health

---

## 📋 Manual Deployment Steps

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp backend/.env.production backend/.env
   ```

2. Edit `backend/.env` with your actual values:
   - Database URLs
   - API keys (Shopify, WhatsApp, etc.)
   - Security secrets

### 2. Build Frontend

```bash
cd frontend
yarn install
yarn build
cd ..
```

### 3. Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Stop Services

```bash
docker-compose down
```

---

## 🌐 Production Deployment Options

### Option 1: VPS/Cloud Server

1. **Setup Server:**
   - Ubuntu 20.04+ or similar
   - Install Docker & Docker Compose
   - Configure firewall (ports 80, 443, 8000)

2. **Deploy:**
   ```bash
   git clone <your-repo>
   cd Og1.5-main
   ./deploy.sh
   ```

3. **Domain Setup:**
   - Point your domain to server IP
   - Configure reverse proxy (Nginx)
   - Setup SSL certificates (Let's Encrypt)

### Option 2: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
heroku create og-merch-store
heroku container:push web --app og-merch-store
heroku container:release web --app og-merch-store
```

#### DigitalOcean App Platform
- Connect your GitHub repository
- Configure build settings
- Deploy automatically

#### AWS/GCP/Azure
- Use container services (ECS, Cloud Run, Container Instances)
- Configure load balancers and databases

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Required
SECRET_KEY=your-secret-key
DATABASE_URL=mongodb://localhost:27017/og_merch
SHOPIFY_API_KEY=your-shopify-key
SHOPIFY_API_SECRET=your-shopify-secret

# Optional
WHATSAPP_BUSINESS_PHONE=+1234567890
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
```

### Frontend Configuration

Update `frontend/src/config.js` if needed:
```javascript
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com'
  : 'http://localhost:8000';
```

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:8000/health

# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Backup
```bash
# Backup database (if using MongoDB)
docker exec -it og15-main_backend_1 mongodump --out /backup

# Copy backup from container
docker cp og15-main_backend_1:/backup ./backup
```

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill processes on port 80/8000
sudo lsof -ti:80 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

**Docker Build Fails:**
```bash
# Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

**Frontend Not Loading:**
- Check if build folder exists: `frontend/build/`
- Verify nginx configuration
- Check browser console for errors

**Backend API Errors:**
- Verify `.env` file configuration
- Check database connectivity
- Review backend logs: `docker-compose logs backend`

### Getting Help

1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all required services are running
4. Check firewall/port configurations

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database setup and accessible
- [ ] SSL certificates installed
- [ ] Domain pointing to server
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] CDN setup (optional)

---

**🔥 Your OG Merch Store is ready to conquer the digital battlefield! 🔥**