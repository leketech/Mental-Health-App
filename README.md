# UnwindMind - Mental Health & Wellness Application

UnwindMind is a comprehensive mental health and wellness application designed to help users track their mood, maintain a personal journal, and engage with an AI-powered chat assistant for emotional support. Built with a modern tech stack, it offers a seamless experience for users seeking to improve their mental well-being.

## Features

- Mood tracking with visual analytics
- Personal journaling with rich text editing
- AI-powered chat assistant for emotional support
- User profile management
- Secure authentication system
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js with hooks
- React Router for navigation
- Axios for HTTP requests
- Tailwind CSS for styling
- Chart.js for data visualization

### Backend
- Go (Golang) with Gorilla Mux router
- PostgreSQL database
- JWT for authentication
- Docker for containerization

### AI Integration
- OpenAI GPT API for chat functionality

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js (v14 or higher) and npm (for frontend development)
- Go (v1.19 or higher) (for backend development)
- PostgreSQL (v13 or higher)

## Deployment

### Render Deployment Architecture

Render does not natively support multi-container Docker Compose deployments. The application is deployed as separate services:

1. **Frontend**: Static site serving the React application
2. **Backend**: Web service running the Go API
3. **Database**: PostgreSQL database service

For detailed information about this deployment architecture, see [DEPLOYMENT_ARCHITECTURE_RENDER.md](DEPLOYMENT_ARCHITECTURE_RENDER.md).

### Frontend Deployment (Render Static Site)

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
   - `DATABASE_URL` (from your PostgreSQL service)

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