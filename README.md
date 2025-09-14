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
- **Deployment**: Docker containers on Render
- **Authentication**: JWT tokens with refresh token rotation

## Deployment

### Render Deployment (Recommended)

1. Install the Render CLI (optional):
   ```bash
   curl https://render.com/install.sh | sh
   ```

2. Deploy using the deployment script:
   ```bash
   ./deploy-render.sh
   ```

3. Or manually deploy through the Render dashboard:
   - Go to https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Use the render.yaml configuration file

### Railway Deployment (Alternative)

1. Install the Railway CLI:
   ```bash
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Deploy the application:
   ```bash
   ./deploy-railway.sh
   ```

   Or manually:
   ```bash
   railway up
   ```

### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `JWT_SECRET` - Secret key for JWT token signing (minimum 32 characters)
- `DATABASE_URL` - PostgreSQL database connection URL
- `CORS_ORIGIN` - Frontend domain (e.g., https://unwindmind-frontend.onrender.com)

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
docker-compose up --build
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