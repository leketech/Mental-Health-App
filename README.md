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

### Render Deployment (Recommended)

1. **Prerequisites**:
   - Make sure there's no [go.mod](file:///mnt/c/Users/Leke/Mental-Health-App/go.mod) file in the root directory (it confuses Render)
   - Ensure your `render.yaml` file is in the root directory

2. **Deploy using Docker Compose**:
   - Render will use `mentalhealthwebapp/docker-compose.render.yml` to deploy both frontend and backend services together
   - This approach manages both services as a single deployment

3. **Deploy using the deployment script**:
   ```bash
   ./deploy-render.sh
   ```

4. **Or manually deploy through the Render dashboard**:
   - Go to https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to `mentalhealthwebapp`
   - Use the Docker command: `docker-compose -f docker-compose.render.yml up`
   - Add environment variables:
     - `JWT_SECRET` (minimum 32 characters)
     - `PORT` (set to 80)

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

## License

This project is licensed under the MIT License.