# RealServ MVP - Production Launch Checklist

**Version**: 1.0  
**Last Updated**: January 12, 2026  
**Owner**: RealServ Tech Team

---

## 📋 HOW TO USE THIS CHECKLIST

- [ ] Complete sections in order (top to bottom)
- [ ] Each section has a sign-off field
- [ ] Don't skip critical items (marked 🔴)
- [ ] Document any deviations in notes section

---

## 🔐 SECTION 1: SECURITY (Critical)

### Authentication & Authorization
- [ ] 🔴 Firebase Authentication configured (prod project)
- [ ] 🔴 JWT token validation working in all 7 services
- [ ] 🔴 Token expiry configured (60 min access, 30 day refresh)
- [ ] 🔴 RBAC enforced in all services (not just IdentityService)
- [ ] Service-to-service authentication implemented
- [ ] Multi-factor authentication enabled for admin users

**Sign-off**: _________________ Date: _______

### Input Validation
- [ ] 🔴 FluentValidation enabled in ALL 7 services
- [ ] 🔴 File upload size limits enforced (100MB max)
- [ ] 🔴 Phone number validation (E.164 format)
- [ ] Email validation (RFC 5322)
- [ ] SQL injection protection verified (no raw SQL)
- [ ] XSS protection (output encoding in templates)

**Sign-off**: _________________ Date: _______

### Secrets Management
- [ ] 🔴 AWS Secrets Manager configured
- [ ] 🔴 Database passwords in Secrets Manager
- [ ] 🔴 Firebase service account key in Secrets Manager
- [ ] 🔴 Razorpay API keys in Secrets Manager
- [ ] 🔴 WhatsApp API tokens in Secrets Manager
- [ ] 🔴 Google Maps API key in Secrets Manager
- [ ] NO secrets in appsettings.json (production)
- [ ] NO secrets in code
- [ ] Secret rotation procedure documented

**Sign-off**: _________________ Date: _______

### Webhook Security
- [ ] 🔴 Razorpay webhook signature verification
- [ ] 🔴 WhatsApp webhook signature verification
- [ ] Webhook endpoints use HTTPS only
- [ ] Webhook IP whitelist configured (if supported)

**Sign-off**: _________________ Date: _______

### Network Security
- [ ] 🔴 HTTPS enforced (redirect HTTP → HTTPS)
- [ ] 🔴 SSL/TLS certificates valid (Let's Encrypt or AWS ACM)
- [ ] Security groups configured (restrict inbound traffic)
- [ ] WAF configured (DDoS protection)
- [ ] CORS configured (only allowed origins)
- [ ] Rate limiting enabled (all services)

**Sign-off**: _________________ Date: _______

---

## 🏗️ SECTION 2: INFRASTRUCTURE (Critical)

### API Gateway
- [ ] 🔴 API Gateway deployed (AWS API Gateway)
- [ ] 🔴 Custom domain configured (api.realserv.com)
- [ ] 🔴 Routes configured for all 7 services
- [ ] Global rate limiting configured
- [ ] Request/response logging enabled
- [ ] API keys generated (for mobile apps)

**Sign-off**: _________________ Date: _______

### Databases
- [ ] 🔴 All 7 PostgreSQL databases created (RDS)
- [ ] 🔴 Automated backups enabled (7-day retention)
- [ ] 🔴 Point-in-time recovery enabled
- [ ] 🔴 Database encryption at rest enabled
- [ ] Database encryption in transit enabled (SSL)
- [ ] Connection pooling configured (all services)
- [ ] Database credentials rotated (initial setup)
- [ ] Backup restore tested (at least once)

**Database List**:
- [ ] realserv_identity_db
- [ ] realserv_vendor_db
- [ ] realserv_order_db
- [ ] realserv_catalog_db
- [ ] realserv_payment_db
- [ ] realserv_notification_db
- [ ] realserv_integration_db

**Sign-off**: _________________ Date: _______

### Caching
- [ ] Redis cluster deployed (ElastiCache)
- [ ] Redis encryption at rest
- [ ] Redis encryption in transit
- [ ] Automatic failover configured
- [ ] Cache expiration policies configured

**Sign-off**: _________________ Date: _______

### File Storage
- [ ] 🔴 S3 bucket created (realserv-media-prod)
- [ ] 🔴 S3 bucket encryption enabled
- [ ] S3 versioning enabled
- [ ] S3 lifecycle policies configured (delete old files)
- [ ] CloudFront CDN configured (for public files)
- [ ] Presigned URL generation working

**Sign-off**: _________________ Date: _______

### Compute (ECS)
- [ ] 🔴 ECS cluster created
- [ ] 🔴 All 7 services deployed as ECS tasks
- [ ] Task definitions configured (CPU, memory limits)
- [ ] Auto-scaling configured (min 2, max 10 per service)
- [ ] Health checks configured (all tasks)
- [ ] Service discovery configured (AWS Cloud Map)

**Service List**:
- [ ] IdentityService (port 5001)
- [ ] VendorService (port 5002)
- [ ] OrderService (port 5004)
- [ ] CatalogService (port 5005)
- [ ] PaymentService (port 5007)
- [ ] NotificationService (port 5010)
- [ ] IntegrationService (port 5012)

**Sign-off**: _________________ Date: _______

### Load Balancer
- [ ] Application Load Balancer (ALB) created
- [ ] Target groups created (one per service)
- [ ] Health check endpoints configured
- [ ] SSL certificate attached
- [ ] Sticky sessions configured (if needed)

**Sign-off**: _________________ Date: _______

---

## 📊 SECTION 3: OBSERVABILITY (High Priority)

### Logging
- [ ] 🔴 CloudWatch Logs configured (all services)
- [ ] 🔴 Log retention policy (30 days)
- [ ] Structured logging (JSON format)
- [ ] Correlation IDs in all requests
- [ ] Log levels configured (Info in prod)
- [ ] Sensitive data NOT logged (passwords, tokens)

**Sign-off**: _________________ Date: _______

### Monitoring
- [ ] 🔴 CloudWatch dashboards created
  - [ ] Service health status (all 7 services)
  - [ ] Request rate per service
  - [ ] Error rate per service
  - [ ] Response time (p50, p95, p99)
  - [ ] Database connections per service
  - [ ] External API success rate
- [ ] Custom metrics configured (business metrics)
- [ ] Dashboard accessible to ops team

**Sign-off**: _________________ Date: _______

### Alerting
- [ ] 🔴 CloudWatch Alarms configured
  - [ ] Service down (health check fails)
  - [ ] High error rate (>5%)
  - [ ] High latency (p95 > 2s)
  - [ ] Database connection pool exhausted
  - [ ] Redis down
  - [ ] S3 upload failures
- [ ] SNS topics configured (Email + Slack)
- [ ] On-call schedule defined
- [ ] Runbook links in alarms

**Sign-off**: _________________ Date: _______

### Distributed Tracing
- [ ] AWS X-Ray enabled (all services)
- [ ] Request tracing across services
- [ ] X-Ray console access granted to team

**Sign-off**: _________________ Date: _______

### Health Checks
- [ ] 🔴 `/health` endpoint in all services
- [ ] Database connection check
- [ ] Redis connection check
- [ ] Firebase Auth check
- [ ] Razorpay API check
- [ ] WhatsApp API check
- [ ] Google Maps API check
- [ ] S3 access check

**Sign-off**: _________________ Date: _______

---

## ✅ SECTION 4: TESTING (Critical)

### Unit Tests
- [ ] 🔴 Unit tests for OrderService (70%+ coverage)
  - [ ] Order creation
  - [ ] Order status transitions
  - [ ] Order cancellation
  - [ ] Refund calculation
- [ ] 🔴 Unit tests for PaymentService (70%+ coverage)
  - [ ] Payment capture
  - [ ] Refund processing
  - [ ] Webhook signature validation
  - [ ] Payment reconciliation
- [ ] 🔴 Unit tests for IdentityService (70%+ coverage)
  - [ ] User registration
  - [ ] Login flow
  - [ ] RBAC permission checks
  - [ ] Token generation
- [ ] Unit tests for NotificationService
- [ ] Unit tests for VendorService
- [ ] Unit tests for CatalogService
- [ ] Unit tests for IntegrationService

**Sign-off**: _________________ Date: _______

### Integration Tests
- [ ] Database operations (all services)
- [ ] Firebase Auth integration
- [ ] Razorpay API integration (test mode)
- [ ] WhatsApp API integration (test number)
- [ ] Google Maps API integration
- [ ] S3 upload/download
- [ ] Redis caching

**Sign-off**: _________________ Date: _______

### End-to-End Tests
- [ ] 🔴 Complete order flow (buyer → catalog → order → payment → notification)
- [ ] Vendor registration → KYC → order fulfillment
- [ ] Admin → manage users → assign roles
- [ ] WhatsApp bot conversation flow
- [ ] Refund flow (payment → refund → notification)

**Sign-off**: _________________ Date: _______

### Load Testing
- [ ] Load test: 100 concurrent users
- [ ] Load test: 500 concurrent users
- [ ] Load test: 1000 concurrent users
- [ ] Stress test: Find breaking point
- [ ] Response time < 500ms (p95) under load
- [ ] No errors under normal load

**Sign-off**: _________________ Date: _______

### Security Testing
- [ ] SQL injection testing (automated scan)
- [ ] XSS testing (automated scan)
- [ ] Authentication bypass attempts
- [ ] Authorization bypass attempts
- [ ] OWASP Top 10 verification
- [ ] Secrets leak scan (git history)

**Sign-off**: _________________ Date: _______

---

## 🔧 SECTION 5: CONFIGURATION (High Priority)

### Environment Variables
- [ ] All environment-specific configs in env vars (not appsettings)
- [ ] Separate configs for dev/staging/prod
- [ ] No hardcoded URLs
- [ ] No hardcoded credentials

**Sign-off**: _________________ Date: _______

### Feature Flags
- [ ] Feature flag system configured (LaunchDarkly OR custom)
- [ ] Critical features behind flags:
  - [ ] Payment processing
  - [ ] WhatsApp messaging
  - [ ] Email notifications
- [ ] Kill switch ready (can disable features instantly)

**Sign-off**: _________________ Date: _______

### External Service Configuration
- [ ] 🔴 Firebase project (PRODUCTION)
- [ ] 🔴 Razorpay account (LIVE mode)
- [ ] 🔴 WhatsApp Business API (PRODUCTION)
- [ ] 🔴 Google Maps API (billing enabled)
- [ ] 🔴 AWS account (PRODUCTION)
- [ ] SendGrid/AWS SES for emails
- [ ] Twilio for SMS (if used)

**Sign-off**: _________________ Date: _______

---

## 📚 SECTION 6: DOCUMENTATION (Medium Priority)

### Technical Documentation
- [ ] README.md for each service (8-point plan applied)
- [ ] API_REFERENCE.md with code examples
- [ ] Database schema documentation
- [ ] Architecture diagrams (up to date)
- [ ] Sequence diagrams (critical flows)

**Sign-off**: _________________ Date: _______

### Operational Documentation
- [ ] Deployment runbook
- [ ] Rollback procedure
- [ ] Incident response playbook
- [ ] Disaster recovery plan
- [ ] Common operations guide (restart service, check logs, etc.)
- [ ] On-call escalation procedure

**Sign-off**: _________________ Date: _______

### User Documentation
- [ ] API documentation (for mobile/web teams)
- [ ] Integration guides (Razorpay, WhatsApp, etc.)
- [ ] Error codes reference
- [ ] Rate limits documented

**Sign-off**: _________________ Date: _______

---

## 🚀 SECTION 7: DEPLOYMENT (Critical)

### Pre-Deployment
- [ ] 🔴 Code freeze (no new features)
- [ ] 🔴 All tests passing (unit, integration, E2E)
- [ ] 🔴 Security scan passed
- [ ] 🔴 Load test passed
- [ ] Database migrations prepared
- [ ] Rollback plan documented
- [ ] Stakeholder approval obtained

**Sign-off**: _________________ Date: _______

### Deployment to Staging
- [ ] Deploy all 7 services to staging
- [ ] Run smoke tests
- [ ] Run E2E tests
- [ ] Performance test in staging
- [ ] Security test in staging
- [ ] Verify all external integrations (test mode)

**Sign-off**: _________________ Date: _______

### Deployment to Production
- [ ] 🔴 Database migrations executed (with backup)
- [ ] 🔴 Deploy services in correct order:
  1. [ ] IdentityService (other services depend on it)
  2. [ ] CatalogService
  3. [ ] VendorService
  4. [ ] OrderService
  5. [ ] PaymentService
  6. [ ] NotificationService
  7. [ ] IntegrationService
- [ ] 🔴 Verify health checks (all services)
- [ ] 🔴 Verify database connections
- [ ] 🔴 Verify Redis connections
- [ ] 🔴 Run smoke tests
- [ ] Monitor error rates (first 30 min)
- [ ] Monitor response times (first 30 min)

**Sign-off**: _________________ Date: _______

### Post-Deployment Verification
- [ ] 🔴 Create test buyer account
- [ ] 🔴 Create test vendor account
- [ ] 🔴 Create test order (end-to-end)
- [ ] 🔴 Process test payment (₹1)
- [ ] 🔴 Receive notifications (Email, WhatsApp)
- [ ] Check CloudWatch dashboards
- [ ] Check CloudWatch Logs (no errors)
- [ ] Check database (data written correctly)

**Sign-off**: _________________ Date: _______

---

## 📞 SECTION 8: OPERATIONS (Post-Launch)

### Monitoring (First 24 Hours)
- [ ] Monitor dashboards every 30 min
- [ ] Check error logs every hour
- [ ] Check user registrations (expected volume)
- [ ] Check order creation (expected volume)
- [ ] Verify payment webhooks working
- [ ] Verify notifications sent

**Sign-off**: _________________ Date: _______

### Incident Response
- [ ] On-call rotation schedule published
- [ ] Incident response channel created (Slack)
- [ ] PagerDuty / OpsGenie configured (if used)
- [ ] Escalation matrix defined
- [ ] War room procedure defined

**Sign-off**: _________________ Date: _______

### Business Continuity
- [ ] Backup strategy tested
- [ ] Disaster recovery plan tested
- [ ] Data retention policy documented
- [ ] Compliance requirements met (GDPR, etc.)

**Sign-off**: _________________ Date: _______

---

## ✅ FINAL SIGN-OFF

### Pre-Launch Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Tech Lead** | ____________ | ____________ | ______ |
| **DevOps Lead** | ____________ | ____________ | ______ |
| **QA Lead** | ____________ | ____________ | ______ |
| **Product Manager** | ____________ | ____________ | ______ |
| **CTO/VP Eng** | ____________ | ____________ | ______ |

### Go / No-Go Decision

- [ ] ✅ **GO** - All critical items complete, ready to launch
- [ ] ⛔ **NO-GO** - Critical items incomplete, see notes below

**Notes / Blockers**:
```
[If NO-GO, list blockers here]







```

---

## 📊 METRICS TO TRACK (First 30 Days)

### Performance Metrics
- [ ] Response time (p50, p95, p99)
- [ ] Error rate (target: <1%)
- [ ] Uptime (target: 99.9%)
- [ ] Throughput (requests per second)

### Business Metrics
- [ ] User registrations
- [ ] Orders created
- [ ] Payment success rate (target: >95%)
- [ ] Notification delivery rate (target: >98%)

### Infrastructure Metrics
- [ ] Auto-scaling events
- [ ] Database performance (query time)
- [ ] Cache hit rate (target: >80%)
- [ ] S3 upload success rate (target: >99%)

---

## 🎉 POST-LAUNCH TASKS

### Week 1
- [ ] Daily monitoring review
- [ ] Daily error log review
- [ ] Performance optimization (if needed)
- [ ] User feedback collection

### Week 2-4
- [ ] Implement monitoring improvements
- [ ] Optimize database queries
- [ ] Fine-tune auto-scaling
- [ ] Plan next iteration

---

## 📋 APPENDIX: ROLLBACK PROCEDURE

If critical issues occur after deployment:

1. **Decision**: Go/No-Go on rollback (Tech Lead + Product Manager)
2. **Communication**: Notify team via Slack/Email
3. **Database**: Restore from backup (if schema changed)
4. **Services**: Redeploy previous version (ECS task definition)
5. **Verification**: Run smoke tests
6. **Monitoring**: Watch dashboards for 30 min
7. **Post-Mortem**: Schedule within 24 hours

---

**Checklist Version**: 1.0  
**Created**: January 12, 2026  
**Owner**: RealServ Tech Team  
**Next Review**: After MVP launch
