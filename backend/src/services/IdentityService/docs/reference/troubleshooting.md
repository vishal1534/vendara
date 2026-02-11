---
title: Troubleshooting - Identity Service
service: Identity Service
category: reference
last_updated: 2026-01-11
version: 1.0.0
status: active
audience: developers
---

# Troubleshooting Guide - Identity Service

**Service:** Identity Service  
**Category:** Reference  
**Last Updated:** January 11, 2026  
**Version:** 1.0.0

> **Quick Summary:** Common issues and solutions for Identity Service.

---

## Authentication Issues

### Issue: "INVALID_FIREBASE_TOKEN" Error

**Symptoms:**
- 401 Unauthorized errors
- "Firebase token invalid or expired" message

**Causes:**
- Token expired (>1 hour old)
- Token from wrong Firebase project
- Token tampered with

**Solutions:**

```javascript
// Solution 1: Refresh token
const auth = getAuth();
const freshToken = await auth.currentUser.getIdToken(true); // Force refresh

// Solution 2: Re-authenticate
await auth.signOut();
await signInWithEmailAndPassword(auth, email, password);
const newToken = await auth.currentUser.getIdToken();
```

**Verify token manually:**
```bash
# Decode JWT (debugging only - don't share)
echo "YOUR_TOKEN" | cut -d. -f2 | base64 -d | jq
```

---

### Issue: Firebase Connection Failed

**Symptoms:**
- "Firebase authentication failed"
- Service won't start

**Check Firebase credentials:**
```bash
# Verify file exists
ls firebase-admin-sdk.json

# Check file permissions
chmod 644 firebase-admin-sdk.json

# Verify JSON is valid
cat firebase-admin-sdk.json | jq

# Check appsettings.json
cat appsettings.json | grep -A 3 "Firebase"
```

**Verify Firebase project ID:**
```bash
# Should match Firebase Console
jq -r .project_id firebase-admin-sdk.json
```

---

### Issue: Email Already Exists

**Symptoms:**
- 409 Conflict error on signup
- "Email already registered"

**Solutions:**

```javascript
// Check if user exists before signup
try {
  await createUserWithEmailAndPassword(auth, email, password);
} catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

---

## Database Issues

### Issue: Database Connection Failed

**Symptoms:**
- "DATABASE_ERROR" responses
- Service won't start
- "Npgsql connection failed"

**Check PostgreSQL:**
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Start if not running
docker-compose up -d postgres

# Test connection
docker exec -it postgres psql -U postgres -d realserv_identity
```

**Check connection string:**
```bash
# View connection string (mask password)
cat appsettings.json | grep "IdentityServiceDb"

# Test from service
dotnet ef database update --verbose
```

**Common fixes:**
```bash
# Fix 1: Reset PostgreSQL
docker-compose down
docker-compose up -d postgres

# Fix 2: Recreate database
dotnet ef database drop
dotnet ef database update

# Fix 3: Check PostgreSQL logs
docker logs postgres
```

---

### Issue: Migration Failed

**Symptoms:**
- "Migration failed" error
- Tables not created

**Solutions:**

```bash
# Check migration status
dotnet ef migrations list

# Remove failed migration
dotnet ef migrations remove

# Create fresh migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update

# If all else fails, drop and recreate
dotnet ef database drop --force
dotnet ef database update
```

---

## OTP Issues

### Issue: OTP Not Received

**Symptoms:**
- No OTP SMS/WhatsApp received
- sendPhoneOtp succeeds but no message

**Check logs:**
```bash
# View service logs
docker logs identity-service | grep OTP

# Should see: "OTP Code for +91XXXXXXXXXX: 123456"
```

**In development:**
- OTP is logged to console (check logs)
- WhatsApp/SMS not actually sent in dev mode

**In production:**
- Verify WhatsApp Business API configured
- Check SMS provider credentials
- Verify phone number format (+91XXXXXXXXXX)

---

### Issue: OTP Always Invalid

**Symptoms:**
- "Invalid OTP code" error
- Correct OTP entered

**Solutions:**

```bash
# Check if OTP expired (>5 minutes)
# Request new OTP

# Check attempt count (max 3 attempts)
# Request new OTP if exceeded

# Verify OTP in logs (development)
docker logs identity-service | grep "OTP Code"
```

---

## Performance Issues

### Issue: Slow Response Times

**Symptoms:**
- API calls taking >2 seconds
- Timeouts

**Diagnose:**

```bash
# Check database query performance
docker exec -it postgres psql -U postgres -d realserv_identity

# Enable query logging
ALTER DATABASE realserv_identity SET log_statement = 'all';

# Check slow queries
SELECT query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Solutions:**

```bash
# Add missing indexes
dotnet ef migrations add AddIndexes

# Update statistics
docker exec -it postgres psql -U postgres -d realserv_identity -c "ANALYZE;"

# Check connection pool
# Increase in appsettings.json:
# "ConnectionString": "...;Maximum Pool Size=50"
```

---

## Rate Limiting Issues

### Issue: "RATE_LIMIT_EXCEEDED" Error

**Symptoms:**
- 429 Too Many Requests
- "Rate limit exceeded" message

**Check rate limits:**
```json
{
  "RateLimit": {
    "AuthEndpoints": 10,      // req/min
    "ReadEndpoints": 100,     // req/min
    "WriteEndpoints": 50      // req/min
  }
}
```

**Solutions:**

```javascript
// Implement exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
        continue;
      }
      throw error;
    }
  }
}
```

---

## CORS Issues

### Issue: CORS Error in Browser

**Symptoms:**
- "Access-Control-Allow-Origin" error
- Failed preflight request

**Check CORS configuration:**
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

**Add your frontend URL:**
```bash
# Edit appsettings.json
# Add your frontend URL to AllowedOrigins

# Restart service
dotnet run
```

---

## Docker Issues

### Issue: Docker Container Won't Start

**Symptoms:**
- Container exits immediately
- "Error: 1" exit code

**Check logs:**
```bash
# View container logs
docker logs identity-service

# Common issues:
# 1. Missing environment variables
# 2. Wrong connection string
# 3. Firebase credentials not mounted
```

**Solutions:**

```bash
# Verify environment variables
docker inspect identity-service | jq '.[0].Config.Env'

# Check volume mounts
docker inspect identity-service | jq '.[0].Mounts'

# Rebuild image
docker-compose build identity-service
docker-compose up identity-service
```

---

## Common Error Messages

### "The ConnectionString property has not been initialized"

**Cause:** Missing database connection string

**Fix:**
```json
// appsettings.json
{
  "ConnectionStrings": {
    "IdentityServiceDb": "Host=localhost;Database=realserv_identity;Username=postgres;Password=postgres"
  }
}
```

---

### "Firebase project ID is required"

**Cause:** Missing Firebase configuration

**Fix:**
```json
{
  "Firebase": {
    "ProjectId": "your-firebase-project-id",
    "CredentialsPath": "firebase-admin-sdk.json",
    "ApiKey": "YOUR_FIREBASE_API_KEY"
  }
}
```

---

### "Table 'users' doesn't exist"

**Cause:** Database migrations not applied

**Fix:**
```bash
dotnet ef database update
```

---

## Quick Diagnostic Commands

```bash
# Health check
curl http://localhost:5001/api/v1/health

# Check if service is running
docker ps | grep identity-service

# View real-time logs
docker logs -f identity-service

# Check PostgreSQL
docker exec -it postgres psql -U postgres -l

# Test database connection
dotnet ef database update --verbose

# Verify Firebase credentials
cat firebase-admin-sdk.json | jq .project_id
```

---

## Getting Help

### Log Collection

```bash
# Collect service logs
docker logs identity-service > identity-service.log

# Collect PostgreSQL logs
docker logs postgres > postgres.log

# Check .NET logs
cat /var/log/identity-service/*.log
```

### Include in Support Request

1. Error message (exact text)
2. Service logs
3. Steps to reproduce
4. Environment (dev/staging/prod)
5. Configuration (mask sensitive data)

---

**Service:** Identity Service  
**Version:** 1.0.0  
**Last Updated:** January 11, 2026  
**Issues Covered:** 15+
