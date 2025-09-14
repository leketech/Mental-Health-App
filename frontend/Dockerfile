FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for better reliability
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-factor 2
RUN npm config set fetch-retry-mintimeout 10000
RUN npm config set fetch-retry-maxtimeout 60000

# Install dependencies with retries and verbose logging
RUN npm install --verbose --no-audit --legacy-peer-deps || npm install --verbose --no-audit --legacy-peer-deps

# Copy source code
COPY . .

# Set build arguments and environment variables
ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=http://localhost:3001
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build:ci

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx-prod.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/build /var/www/frontend

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]