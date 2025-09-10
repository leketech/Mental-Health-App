# Docker Issue Fix Guide

## Problem
You're experiencing `URLSchemeUnknown: Not supported URL scheme http+docker` error, which indicates a Docker daemon connectivity issue in WSL2.

## Root Cause
This error typically occurs when:
1. Docker Desktop is not properly integrated with WSL2
2. There's a version conflict between Docker CLI and Docker daemon
3. Docker daemon is not accessible from the WSL2 environment

## Solutions (Try in Order)

### Solution 1: Fix Docker Desktop WSL2 Integration
1. Open Docker Desktop on Windows
2. Go to Settings → Resources → WSL Integration
3. Enable integration with your Ubuntu distribution
4. Click "Apply & Restart"
5. Restart WSL2: `wsl --shutdown` (run in Windows CMD/PowerShell)
6. Restart WSL2 and try again

### Solution 2: Use Modern Docker Compose
I've already updated your scripts to use `docker compose` (without hyphen) instead of `docker-compose`. This should resolve compatibility issues.

### Solution 3: Reset Docker Environment
```bash
# Unset any Docker environment variables that might be causing conflicts
unset DOCKER_HOST
unset DOCKER_TLS_VERIFY
unset DOCKER_CERT_PATH

# Try running Docker commands again
docker version
docker compose version
```

### Solution 4: Restart Docker Service (if you have native Docker)
```bash
sudo systemctl restart docker
sudo systemctl restart containerd
```

### Solution 5: Use Native Installation (Alternative)
If Docker Desktop continues to have issues, you can run the application natively using the `run-native.sh` script I created. This bypasses Docker entirely and runs:
- PostgreSQL natively on Ubuntu
- Go backend directly
- React frontend with npm start

## Updated Files
I've made the following changes to fix the Docker issues:

1. **docker-dev.sh**: Updated to use modern `docker compose` commands
2. **docker-compose.yml**: Removed deprecated `version` field
3. **start-docker.sh**: Created a simpler startup script
4. **run-native.sh**: Created native alternative (no Docker needed)

## Quick Test
Try this simple test to verify Docker is working:
```bash
docker run --rm hello-world
```

If this works, then try:
```bash
cd /mnt/c/Users/Leke/Mental-Health-App/mentalhealthwebapp
docker compose config
```

## Recommendation
Since you're experiencing Docker connectivity issues and your goal is to deploy to Render (which doesn't require local Docker), I recommend:

1. **For Development**: Use the `run-native.sh` script to run locally without Docker
2. **For Deployment**: Continue with the Render deployment we configured earlier

The native approach will be faster for development and avoids Docker complexity while still allowing you to deploy to Render successfully.