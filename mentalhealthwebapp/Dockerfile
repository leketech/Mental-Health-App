FROM golang:1.22-alpine AS builder

# Set Go toolchain to use the container's Go version
ENV GOTOOLCHAIN=local

# Configure Go environment for faster builds
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org
ENV CGO_ENABLED=0
ENV GOOS=linux

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies with verbose output for debugging
RUN go mod download -x

# Copy source code
COPY . .

# Build the application with optimizations
RUN go build -ldflags="-w -s" -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates wget

# Set working directory
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Run the application
CMD ["./main"]