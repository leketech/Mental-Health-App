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

## Build Process

The application now includes a comprehensive build process that compiles both the frontend and backend:

1. **Frontend Build**: React application is built using `npm run build`
2. **Backend Build**: Go application is compiled using `go build`
3. **Combined Build**: Both frontend and backend are built together using `./build.sh`

### Build Scripts

- `npm run build` - Builds only the frontend
- `npm run build:all` - Runs the complete build process (frontend + backend)
- `./build.sh` - Shell script that builds both frontend and backend

The build process creates a `mentalhealthwebapp/frontend/build` directory that contains the compiled frontend assets, which are served by the Go backend.

## Deployment

### Frontend Deployment (Render Static Site)

The frontend is deployed as a separate static site on Render:

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the root directory to `frontend`
4. Set the build command to `npm run build`
5. Set the publish directory to `build`
6. Add the `REACT_APP_API_URL` environment variable

For detailed instructions, see [FRONTEND_DEPLOYMENT_RENDER.md](FRONTEND_DEPLOYMENT_RENDER.md).

### Backend Deployment (Render Web Service)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `mentalhealthwebapp`
4. Set the environment to `Docker`
5. Set the Dockerfile path to `Dockerfile.backend`
6. Add the required environment variables:
   - `JWT_SECRET`
   - `CORS_ORIGIN` (should match your frontend URL)

### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `JWT_SECRET` - Secret key for JWT token signing (minimum 32 characters)
- `PORT` - Port for the application (default: 80)

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
- URL validation to prevent malicious requests
- WAF rules to block suspicious patterns

For detailed security measures, see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License.