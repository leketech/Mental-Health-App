# Mental-Health-App

# 🌿 Mental Health Companion App

A full-stack mental health tracker with AI support.

## 🚀 Features
- User login with JWT
- Mood tracking
- AI chat via OpenAI
- PostgreSQL backend
- Deployed on AWS

[![CI/CD](https://github.com/yourname/mental-health-app/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourname/mental-health-app/actions)

graph TD
    A[Push to main] --> B(Checkout Code)
    B --> C(Setup Go)
    C --> D(Go mod tidy/test)
    D --> E(gosec Security Scan)
    E --> F(Setup Node.js)
    F --> G(Build React)
    G --> H(npm audit)
    H --> I{Pass?}
    I -->|Yes| J[Deploy to Render]
    I -->|No| K[Block Deploy]

## 🛠️ Run Locally

```bash
git clone https://github.com/leketech/mental-health-app.git
cd mental-health-app
docker-compose up -d

Copyright (c) 2025 Aduraleke Faith Akintade

All rights reserved.

This source code is proprietary and confidential. No part of this code may be copied, modified, distributed, or used without explicit written permission from the author.

Unauthorized use is strictly prohibited and may result in legal action.
