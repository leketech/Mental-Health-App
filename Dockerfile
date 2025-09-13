# Use the official Go image as base
FROM golang:1.22-alpine AS builder

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

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port (Railway will set PORT environment variable)
EXPOSE $PORT

# Run the application
CMD ["./main"]