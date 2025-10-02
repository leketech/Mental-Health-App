# Nginx Configuration Files

This directory contains multiple nginx configuration files for different deployment environments.

## Configuration Files

### 1. nginx-prod.conf
- **Purpose**: Original production configuration for Render deployment
- **Server Name**: `unwindmind-frontend.onrender.com`
- **API Proxy**: Points to `http://web:8080`

### 2. nginx-prod-enhanced.conf
- **Purpose**: Enhanced production configuration with additional security and performance optimizations
- **Features**:
  - Brotli compression support
  - Enhanced Content Security Policy
  - Additional file type caching
  - Security improvements for various file types
  - Better cache control headers

### 3. nginx-aws.conf
- **Purpose**: Production configuration optimized for AWS deployment
- **Features**:
  - Generic server name (`_`) for AWS Load Balancer compatibility
  - Optimized security headers for AWS environment
  - Enhanced caching strategies
  - Improved proxy settings for ECS containers
  - Additional security measures for cloud deployment

## Usage

### For Render Deployment
Use `nginx-prod.conf` as is.

### For AWS Deployment
Use `nginx-aws.conf` for optimal performance and security in AWS environments.

### For Enhanced Security
Use `nginx-prod-enhanced.conf` if you want additional security headers and compression options.

## Customization

When deploying to different environments, you may need to adjust:

1. **Server Name**: Change to match your domain
2. **API Proxy**: Update the backend service address
3. **Security Headers**: Modify Content Security Policy based on your requirements
4. **Cache Settings**: Adjust expiration times based on your update frequency

## Security Features

All configurations include:

- Gzip compression for reduced bandwidth
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Static asset caching
- Hidden file protection
- Backup file protection
- Health check endpoint

The enhanced and AWS configurations include additional features:

- Brotli compression (if available)
- Enhanced Content Security Policy
- Strict Transport Security
- Additional file type handling