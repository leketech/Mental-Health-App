# Mental Health App - UnwindMind

A comprehensive mental health application with mood tracking, journaling, and AI chat features.

## Features

- Mood tracking and visualization
- Personal journal with encryption
- AI-powered mental health chat
- User profiles and statistics
- Therapy booking system
- Billing and subscription management

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Go with Fiber framework
- **Database**: PostgreSQL
- **Deployment**: Docker Compose on Render
- **Authentication**: JWT tokens with refresh token rotation

## Deployment Architecture

The application is now deployed using a modern microservices approach:

1. **Frontend**: Deployed as a separate Render Static Site
2. **Backend**: Deployed as a Render Web Service
3. **Database**: PostgreSQL database as a Render service

This separation provides better scalability, maintainability, and performance.

## Frontend Deployment (Render Static Site)

1. The frontend is built using `npm run build`
2. The built files are served directly by Render's CDN
3. All API calls are directed to the backend service

### Environment Variables for Frontend

- `REACT_APP_API_URL`: The URL of the backend API service

## Backend Deployment (Render Web Service)

1. The backend is built using Go
2. Deployed using Docker with a minimal Alpine Linux image
3. Serves only the API endpoints

### Environment Variables for Backend

- `JWT_SECRET`: Secret key for JWT token signing (minimum 32 characters)
- `PORT`: Port for the application (default: 8080)
- `CORS_ORIGIN`: The URL of the frontend for CORS protection

## Deployment Process

### Deploying the Frontend

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the root directory to `frontend`
4. Set the build command to `npm run build`
5. Set the publish directory to `build`
6. Add the `REACT_APP_API_URL` environment variable

### Deploying the Backend

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `mentalhealthwebapp`
4. Set the Dockerfile path to `Dockerfile.backend`
5. Add the required environment variables:
   - `JWT_SECRET`
   - `CORS_ORIGIN` (should match your frontend URL)

### Render Configuration Files

- `frontend/render.yaml`: Configuration for frontend static site deployment
- `render.yaml`: Configuration for backend web service deployment

## Development

### Running Locally

1. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../mentalhealthwebapp && go mod tidy
   ```

2. Start the development servers:
   ```bash
   # Terminal 1: Start backend
   cd mentalhealthwebapp && go run main.go
   
   # Terminal 2: Start frontend
   cd frontend && npm start
   ```

### Docker Deployment

Build and run with Docker Compose:
```bash
cd mentalhealthwebapp
docker-compose -f docker-compose.render.yml up --build
```

## API Documentation

The API is organized into several resource-based endpoints:

- Authentication: `/api/login`, `/api/register`, `/api/refresh`, `/api/logout`
- Mood tracking: `/api/moods`
- Journal entries: `/api/journals`
- User profile: `/api/user/profile`, `/api/user/stats`
- AI Chat: `/api/chat`

All protected endpoints require a valid JWT token in the Authorization header.

## Security

- Passwords are hashed using bcrypt
- JWT tokens with refresh token rotation
- CORS protection
- Input validation and sanitization
- SQL injection prevention through prepared statements

## License

This project is licensed under the MIT License.