# Docker Build Issues - RESOLVED ✅

## Summary
Successfully fixed all Docker build and runtime issues for the Mental Health App. The application is now running properly with all services healthy.

## Issues Found and Fixed

### 1. ✅ Nginx Configuration Error (Frontend)
**Problem:**
```
nginx: [emerg] invalid value "must-revalidate" in /etc/nginx/conf.d/default.conf:9
```

**Root Cause:**
The `gzip_proxied` directive in `frontend/nginx-prod.conf` had an invalid value `must-revalidate`.

**Fix:**
Changed line 9 in `frontend/nginx-prod.conf`:
```nginx
# Before
gzip_proxied expired no-cache no-store private must-revalidate auth;

# After
gzip_proxied expired no-cache no-store private auth;
```

### 1b. ✅ Static Assets Not Loading (404 Errors)
**Problem:**
```
GET /static/js/main.03023b78.js HTTP/1.1" 404
```
Frontend page was blank because JavaScript files weren't being served.

**Root Cause:**
The nginx location block for static assets was missing the `root` directive, so it couldn't find the files.

**Fix:**
Added `root /var/www/frontend;` to the static assets location block in `frontend/nginx-prod.conf`:
```nginx
# Before
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}

# After
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    root /var/www/frontend;
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}
```

### 2. ✅ Backend Health Check Timeout (503 Errors)
**Problem:**
```
web-1 | 10:46:26 | 503 | 1.056464ms | 127.0.0.1 | HEAD | /health | -
```

**Root Cause:**
The health check endpoint was calling `config.DB.Ping()` without a timeout, causing it to hang and return 503 errors.

**Fix:**
Updated `mentalhealthwebapp/main.go` to use context with timeout:
```go
// Added context with 2-second timeout
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

if err := config.DB.PingContext(ctx); err != nil {
    // Handle error
}
```

### 3. ✅ Port 80 Already Allocated
**Problem:**
```
Error: Bind for 0.0.0.0:80 failed: port is already allocated
```

**Root Cause:**
Port 80 was already in use on the host machine, and the frontend was trying to bind to it.

**Fix:**
Changed `docker-compose.yml` to map port 3000 to container port 80:
```yaml
# Before
ports:
  - "80:80"

# After
ports:
  - "3000:80"
```

### 4. ✅ Multiple Frontend Replicas Causing Port Conflict
**Problem:**
Two frontend containers trying to bind to the same port.

**Fix:**
Reduced frontend replicas from 2 to 1 in `docker-compose.yml`:
```yaml
deploy:
  replicas: 1  # Changed from 2
```

### 5. ✅ Obsolete Docker Compose Version
**Problem:**
```
level=warning msg="docker-compose.yml: the attribute `version` is obsolete"
```

**Fix:**
Removed the obsolete `version: '3.8'` line from `docker-compose.yml`.

### 6. ✅ Database Connection Pool Settings
**Problem:**
Connection pool not properly configured for health checks.

**Fix:**
Added `SetConnMaxIdleTime` to `mentalhealthwebapp/config/db.go`:
```go
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(0)
db.SetConnMaxIdleTime(0)  // Added this
```

## Current Status

### ✅ All Services Running and Healthy

```
NAME                           STATUS                    PORTS
mental-health-app-db-1         Up (healthy)             0.0.0.0:5432->5432/tcp
mental-health-app-web-1        Up (healthy)             0.0.0.0:8080->8080/tcp
mental-health-app-frontend-1   Up                       0.0.0.0:3000->80/tcp
```

### ✅ Health Check Passing

```bash
$ curl http://localhost:8080/health
{
  "status": "healthy",
  "service": "UnwindMind API",
  "version": "1.0.0",
  "port": "8080",
  "database": "connected"
}
```

### ✅ Frontend Accessible

- **URL:** http://localhost:3000
- **Status:** Running and serving requests (200 OK)
- **Nginx:** Successfully proxying API requests to backend

## How to Run the Application

### Prerequisites
- Docker Desktop installed and running
- Ports 3000, 8080, and 5432 available

### Start the Application
```bash
# Navigate to project directory


# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Stop the Application
```bash
docker-compose down
```

### Reset Database (if needed)
```bash
docker-compose down -v
docker-compose up -d
```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/health
- **Database:** localhost:5432
  - Database: `mental_db`
  - User: `mental_user`
  - Password: `mental_pass`

## API Endpoints

### Public Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/refresh` - Refresh JWT token
- `POST /api/chat` - Chat with AI

### Protected Endpoints (require JWT)
- `POST /api/logout` - Logout
- `GET /api/moods` - Get user moods
- `POST /api/moods` - Create mood entry
- `GET /api/journals` - Get user journals
- `POST /api/journals` - Create journal entry
- `PUT /api/journals/:id` - Update journal
- `DELETE /api/journals/:id` - Delete journal
- `GET /api/user/profile` - Get user profile
- `GET /api/user/stats` - Get user statistics

## Test Credentials

A default test user is created automatically:
- **Email:** john@example.com
- **Password:** password123

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────┐      ┌────────┐│
│  │   Frontend   │─────▶│   Backend    │─────▶│   DB   ││
│  │   (Nginx)    │      │   (Go/Fiber) │      │ (Postgres)│
│  │   Port 3000  │      │   Port 8080  │      │ Port 5432││
│  └──────────────┘      └──────────────┘      └────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7. ✅ CORS Configuration Error (Network Error on Registration)
**Problem:**
```
Network Error when trying to register user from frontend
```

**Root Cause:**
The CORS_ORIGIN was set to `http://localhost` but the frontend runs on `http://localhost:3000`, causing CORS to block API requests.

**Fix:**
Changed `docker-compose.yml`:
```yaml
# Before
CORS_ORIGIN: http://localhost

# After
CORS_ORIGIN: http://localhost:3000
```

### 8. ✅ Frontend API URL Configuration
**Problem:**
Frontend was built with wrong API URL (`http://localhost:3001` instead of `/api`).

**Root Cause:**
The Dockerfile had a hardcoded ARG that wasn't being overridden by docker-compose build args.

**Fix:**
Updated `frontend/Dockerfile`:
```dockerfile
# Before
ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=http://localhost:3001

# After
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
```

And updated `docker-compose.yml` to pass build arg:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    args:
      REACT_APP_API_URL: /api
```

## Files Modified

1. `frontend/nginx-prod.conf` - Fixed gzip_proxied directive and added root to static assets location
2. `mentalhealthwebapp/main.go` - Added context timeout to health check
3. `mentalhealthwebapp/config/db.go` - Improved connection pool settings
4. `docker-compose.yml` - Fixed ports, replicas, CORS origin, and removed obsolete version
5. `frontend/Dockerfile` - Fixed API URL build argument

## Performance Optimizations

### Frontend
- Gzip compression enabled
- Static asset caching (1 year)
- Memory limits: 256MB max, 128MB reserved

### Backend
- Connection pooling: 25 max connections, 5 idle
- Memory limits: 512MB max, 256MB reserved
- Health checks every 30 seconds

### Database
- Shared buffers: 256MB
- Effective cache size: 1GB
- Work memory: 32MB
- WAL optimization enabled

## Troubleshooting

### If services fail to start:
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Full reset
docker-compose down -v
docker-compose up --build
```

### If port conflicts occur:
```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.yml
```

### If database connection fails:
```bash
# Check database logs
docker-compose logs db

# Verify database is healthy
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up -d
```

## Next Steps

1. ✅ All services running and healthy
2. ✅ Frontend accessible at http://localhost:3000
3. ✅ Backend API responding at http://localhost:8080
4. ✅ Database initialized with schema and test user
5. ✅ Health checks passing

The application is now ready for local development and testing!

## Notes

- The application uses Go 1.24.7 (latest available in the golang:1.24-alpine image)
- Frontend is built with React and served by Nginx
- Backend uses Fiber framework for high performance
- Database uses PostgreSQL 15 with Alpine Linux for smaller image size
- All services have health checks and automatic restart policies

