FROM node:18-alpine

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

# Install serve globally
RUN npm install -g serve

# Copy source code
COPY . .

# Set build arguments and environment variables
ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build:ci

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
