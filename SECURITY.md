# 🔒 Security Protection Guide

This document outlines security measures to protect the UnwindMind application from malicious attacks and unauthorized access.

## 🛡️ How to Protect the Site

### 1. Add Basic Route Validation in React Router

In your frontend, add a check in your `/register` route component to block malformed queries:

```javascript
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Block URLs with suspicious patterns
    if (location.search.includes('~and~') || location.search.length > 200) {
      console.warn('Blocked suspicious URL:', location.search);
      navigate('/register', { replace: true }); // Redirect to clean URL
    }
  }, [location, navigate]);

  // ... rest of your component
}
```

### 2. Add a Web Application Firewall (WAF)

Create a WAF rule to block suspicious requests:

- **Field**: URI
- **Operator**: contains
- **Value**: `~and~`
- **Action**: Block

This rule will help prevent SQL injection and other malicious URL-based attacks by blocking requests that contain suspicious patterns.

## 🔐 Additional Security Recommendations

### Environment Variables
- Store all secrets in environment variables, never in code
- Use strong, randomly generated secrets (32+ characters for JWT)
- Rotate secrets regularly

### CORS Protection
- Always restrict CORS to specific domains
- Never use wildcard (`*`) for CORS origins in production
- Validate origins on the server side

### JWT Security
- Use sufficiently long, random secrets
- Implement proper token expiration
- Use refresh tokens for long-lived sessions
- Blacklist tokens on logout

### Input Validation
- Validate all user inputs on both client and server
- Use parameterized queries to prevent SQL injection
- Sanitize user inputs before displaying them

### Regular Security Audits
- Perform regular code reviews focusing on security
- Keep dependencies up to date
- Run security scanning tools regularly
- Monitor logs for suspicious activity

## 🚨 Incident Response

If a security issue is discovered:

1. Immediately revoke affected tokens/secrets
2. Audit logs for signs of compromise
3. Notify affected users if necessary
4. Apply security patches
5. Document the incident and lessons learned