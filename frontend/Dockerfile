FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps --only=production

# Copy source code
COPY . .

# Set build arguments and environment variables
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build

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