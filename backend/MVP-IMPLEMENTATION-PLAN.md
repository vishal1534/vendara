# RealServ MVP - Simplified Implementation Plan

**Date**: January 12, 2026  
**Focus**: MVP-Ready (No Over-Engineering)  
**Timeline**: 4-5 weeks

---

## ✅ SKIPPED (RDS/AWS Handles Automatically)

- ~~Database backups~~ → RDS automated backups
- ~~Database encryption~~ → RDS encryption at rest
- ~~SSL/TLS certificates~~ → AWS ALB handles
- ~~Auto-scaling infrastructure~~ → Basic ECS config is enough for MVP
- ~~CDN for S3~~ → Direct S3 access is fine for MVP

---

## 🎯 MVP IMPLEMENTATION PLAN (Simplified)

### Week 1: Critical Foundation (5 days)

#### Day 1: Shared Infrastructure
- [x] Create RealServ.Shared.Common library
  - Common middleware (CorrelationId, RequestLogging)
  - Common exceptions
  - Common response wrappers
  - Common utilities

#### Day 2: Service-to-Service Authentication
- [ ] Implement internal API key authentication
- [ ] Add to all 7 services
- [ ] Configure in appsettings.json

#### Day 3: Enhanced Health Checks
- [ ] Add health checks for external dependencies (all services)
  - Database
  - Redis
  - Firebase
  - Razorpay
  - WhatsApp
  - Google Maps
  - S3

#### Day 4: Input Validation (Missing Services)
- [ ] Add FluentValidation to CatalogService
- [ ] Add FluentValidation to NotificationService
- [ ] Add FluentValidation to VendorService (complete it)

#### Day 5: Error Handling & Logging
- [ ] Add correlation IDs to all services
- [ ] Add global exception handler to all services
- [ ] Standardize error responses

---

### Week 2: Security & RBAC (5 days)

#### Day 6-7: RBAC Enforcement (All Services)
- [ ] Create shared RBAC middleware
- [ ] Implement permission-based authorization
- [ ] Apply to all services (not just IdentityService)

#### Day 8-9: Rate Limiting (All Services)
- [ ] Add AspNetCoreRateLimit to all services
- [ ] Configure role-based limits
- [ ] Test rate limiting

#### Day 10: Security Audit
- [ ] Review all endpoints for auth
- [ ] Review all inputs for validation
- [ ] Review all secrets (no hardcoding)

---

### Week 3: Testing Foundation (5 days)

#### Day 11-12: Unit Tests (Critical Paths)
- [ ] OrderService: Order creation, status transitions, cancellation
- [ ] PaymentService: Payment capture, refunds, webhooks
- [ ] IdentityService: Registration, login, RBAC

#### Day 13-14: Integration Tests
- [ ] Database operations (all services)
- [ ] External API mocks (Razorpay, WhatsApp, Firebase)

#### Day 15: E2E Tests
- [ ] Order flow (buyer → catalog → order → payment → notification)

---

### Week 4: Observability & Polish (5 days)

#### Day 16-17: Basic Observability
- [ ] Add AWS X-Ray to all services
- [ ] Create CloudWatch dashboard (manual, not Terraform)
- [ ] Set up basic alarms (service down, high error rate)

#### Day 18-19: Documentation
- [ ] Apply 8-point Universal Documentation Standard to remaining 5 services
- [ ] Create deployment guide
- [ ] Create incident response guide

#### Day 20: Final Verification
- [ ] Run all tests
- [ ] Deploy to staging
- [ ] Smoke test
- [ ] GO/NO-GO decision

---

## 📋 IMPLEMENTATION CHECKLIST

### ✅ Phase 1: Shared Foundation (STARTING HERE)
- [ ] **Task 1.1**: Create RealServ.Shared.Common library
- [ ] **Task 1.2**: Add CorrelationIdMiddleware
- [ ] **Task 1.3**: Add RequestLoggingMiddleware
- [ ] **Task 1.4**: Add GlobalExceptionHandler
- [ ] **Task 1.5**: Add Common Response Models
- [ ] **Task 1.6**: Add Service-to-Service Auth Middleware

### ✅ Phase 2: Service-to-Service Auth
- [ ] **Task 2.1**: Create InternalApiKeyAuthenticationHandler
- [ ] **Task 2.2**: Add to all 7 services
- [ ] **Task 2.3**: Configure internal API keys
- [ ] **Task 2.4**: Test inter-service calls

### ✅ Phase 3: Enhanced Health Checks
- [ ] **Task 3.1**: Create health check classes for external dependencies
- [ ] **Task 3.2**: Add to IdentityService
- [ ] **Task 3.3**: Add to VendorService
- [ ] **Task 3.4**: Add to OrderService
- [ ] **Task 3.5**: Add to CatalogService
- [ ] **Task 3.6**: Add to PaymentService
- [ ] **Task 3.7**: Add to NotificationService
- [ ] **Task 3.8**: Add to IntegrationService

### ✅ Phase 4: Input Validation (Complete)
- [ ] **Task 4.1**: FluentValidation in CatalogService
- [ ] **Task 4.2**: FluentValidation in NotificationService
- [ ] **Task 4.3**: FluentValidation in VendorService (complete)

### ✅ Phase 5: RBAC Enforcement
- [ ] **Task 5.1**: Create shared RBAC attribute [RequirePermission("permission:name")]
- [ ] **Task 5.2**: Apply to OrderService
- [ ] **Task 5.3**: Apply to VendorService
- [ ] **Task 5.4**: Apply to CatalogService
- [ ] **Task 5.5**: Apply to PaymentService
- [ ] **Task 5.6**: Apply to NotificationService
- [ ] **Task 5.7**: Apply to IntegrationService

### ✅ Phase 6: Rate Limiting
- [ ] **Task 6.1**: Add to IdentityService
- [ ] **Task 6.2**: Add to VendorService
- [ ] **Task 6.3**: Add to OrderService
- [ ] **Task 6.4**: Add to CatalogService
- [ ] **Task 6.5**: Add to PaymentService
- [ ] **Task 6.6**: Add to NotificationService
- [ ] **Task 6.7**: Already done in IntegrationService ✅

### ✅ Phase 7: Unit Tests (Critical Paths Only)
- [ ] **Task 7.1**: OrderService tests
- [ ] **Task 7.2**: PaymentService tests
- [ ] **Task 7.3**: IdentityService tests

### ✅ Phase 8: Basic Observability
- [ ] **Task 8.1**: Add X-Ray to all services
- [ ] **Task 8.2**: Create CloudWatch dashboard (manual)
- [ ] **Task 8.3**: Set up SNS alerts

---

## 🚀 LET'S START

**Starting with**: Phase 1 - Shared Foundation

**First Task**: Create `RealServ.Shared.Common` library with:
1. CorrelationIdMiddleware
2. RequestLoggingMiddleware
3. GlobalExceptionHandler
4. Common Response Models
5. InternalApiKeyAuthenticationHandler

---

**Status**: Ready to implement  
**Next**: Create shared library and middleware
