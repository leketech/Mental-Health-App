# Multi-stage build: Node.js for frontend, Go for backend
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps

# Copy frontend source code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Use the official Go image as base for backend
FROM golang:1.24-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Copy go mod files from the mentalhealthwebapp directory
COPY mentalhealthwebapp/go.mod mentalhealthwebapp/go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY mentalhealthwebapp/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage - minimal image
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /root/

# Copy the backend binary from builder stage
COPY --from=backend-builder /app/main .

# Copy the frontend build from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build /root/frontend/build

# Expose port (Railway will set PORT environment variable)
EXPOSE $PORT

# Run the application
CMD ["./main"]