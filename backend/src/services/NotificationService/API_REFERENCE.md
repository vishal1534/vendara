# NotificationService API Reference

Complete API documentation for RealServ NotificationService with code examples.

**Base URL**: `http://localhost:5010`  
**Version**: 1.0.0  
**Authentication**: Firebase JWT (to be implemented)

---

## Table of Contents

1. [Notification Endpoints](#notification-endpoints)
2. [Template Endpoints](#template-endpoints)
3. [Preference Endpoints](#preference-endpoints)
4. [Health & Info](#health--info)
5. [Error Responses](#error-responses)

---

## Notification Endpoints

### Send Email Notification

**Endpoint**: `POST /api/v1/notifications/email`

Send an email notification via AWS SES.

**Request Body**:
```json
{
  "recipientId": "uuid",
  "recipientType": "buyer|vendor|admin",
  "recipientEmail": "string",
  "notificationType": "string",
  "subject": "string",
  "body": "string",
  "data": {
    "key": "value"
  }
}
```

**Response**: `200 OK`
```json
{
  "notificationId": "uuid",
  "status": "sent|pending|failed",
  "providerMessageId": "string",
  "message": "Email notification queued successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:5010/api/v1/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientEmail": "john@example.com",
    "notificationType": "order_created",
    "subject": "Order Confirmed - #12345",
    "body": "Hi John, your order has been confirmed. Total: ₹5,000."
  }'
```

---

### Send WhatsApp Notification

**Endpoint**: `POST /api/v1/notifications/whatsapp`

Send a WhatsApp template message via WhatsApp Business API.

**Request Body**:
```json
{
  "recipientId": "uuid",
  "recipientType": "buyer|vendor|admin",
  "recipientPhone": "+917906441952",
  "notificationType": "string",
  "templateName": "string",
  "language": "en|hi",
  "parameters": {
    "1": "value1",
    "2": "value2"
  }
}
```

**Response**: `200 OK`
```json
{
  "notificationId": "uuid",
  "status": "sent|pending|failed",
  "providerMessageId": "wamid.xxx",
  "message": "WhatsApp notification sent successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:5010/api/v1/notifications/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientPhone": "+917906441952",
    "notificationType": "order_created",
    "templateName": "order_confirmation",
    "language": "en",
    "parameters": {
      "1": "John",
      "2": "12345",
      "3": "5000",
      "4": "2024-01-15"
    }
  }'
```

---

### Send SMS Notification

**Endpoint**: `POST /api/v1/notifications/sms`

Send an SMS via AWS SNS.

**Request Body**:
```json
{
  "recipientId": "uuid",
  "recipientType": "buyer|vendor|admin",
  "recipientPhone": "+917906441952",
  "notificationType": "string",
  "message": "string"
}
```

**Response**: `200 OK`
```json
{
  "notificationId": "uuid",
  "status": "sent|pending|failed",
  "providerMessageId": "string",
  "message": "SMS notification sent successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:5010/api/v1/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "recipientPhone": "+917906441952",
    "notificationType": "otp_verification",
    "message": "Your RealServ OTP is: 123456. Valid for 10 minutes."
  }'
```

---

### Send Push Notification

**Endpoint**: `POST /api/v1/notifications/push`

Send a push notification via Firebase Cloud Messaging.

**Request Body**:
```json
{
  "recipientId": "uuid",
  "recipientType": "buyer|vendor|admin",
  "deviceToken": "string",
  "notificationType": "string",
  "title": "string",
  "body": "string",
  "data": {
    "key": "value"
  }
}
```

**Response**: `200 OK`
```json
{
  "notificationId": "uuid",
  "status": "sent|pending|failed",
  "providerMessageId": "string",
  "message": "Push notification sent successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:5010/api/v1/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "recipientType": "buyer",
    "deviceToken": "fcm_device_token_here",
    "notificationType": "order_status_update",
    "title": "Order Update",
    "body": "Your order #12345 is out for delivery!",
    "data": {
      "orderId": "12345",
      "status": "out_for_delivery"
    }
  }'
```

---

### Get Notification by ID

**Endpoint**: `GET /api/v1/notifications/{id}`

Retrieve a specific notification by ID.

**Path Parameters**:
- `id` (uuid, required): Notification ID

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "recipientId": "uuid",
  "recipientType": "buyer",
  "notificationType": "order_created",
  "channel": "email",
  "subject": "Order Confirmed",
  "body": "Your order has been confirmed.",
  "data": {},
  "status": "sent",
  "sentAt": "2024-01-12T10:30:00Z",
  "deliveredAt": "2024-01-12T10:30:05Z",
  "failedReason": null,
  "provider": "ses",
  "createdAt": "2024-01-12T10:30:00Z"
}
```

**Example**:
```bash
curl http://localhost:5010/api/v1/notifications/123e4567-e89b-12d3-a456-426614174000
```

---

### Get User Notification History

**Endpoint**: `GET /api/v1/notifications/user/{userId}`

Get paginated notification history for a user.

**Path Parameters**:
- `userId` (uuid, required): User ID

**Query Parameters**:
- `page` (int, optional, default: 1): Page number
- `pageSize` (int, optional, default: 20): Items per page

**Response**: `200 OK`
```json
{
  "notifications": [
    {
      "id": "uuid",
      "recipientId": "uuid",
      "recipientType": "buyer",
      "notificationType": "order_created",
      "channel": "email",
      "subject": "Order Confirmed",
      "body": "...",
      "status": "sent",
      "sentAt": "2024-01-12T10:30:00Z",
      "createdAt": "2024-01-12T10:30:00Z"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 20
}
```

**Example**:
```bash
# Get first page
curl http://localhost:5010/api/v1/notifications/user/123e4567-e89b-12d3-a456-426614174000

# Get second page with custom page size
curl "http://localhost:5010/api/v1/notifications/user/123e4567-e89b-12d3-a456-426614174000?page=2&pageSize=50"
```

---

## Template Endpoints

### Get All Templates

**Endpoint**: `GET /api/v1/notifications/templates`

Retrieve all notification templates.

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "templateName": "order_created_email",
    "templateType": "email",
    "subject": "Order Confirmed - {{order_number}}",
    "body": "Hi {{customer_name}}, your order #{{order_number}} has been confirmed...",
    "variables": ["customer_name", "order_number", "order_total", "delivery_date"],
    "whatsAppTemplateId": null,
    "whatsAppLanguage": null,
    "isActive": true,
    "createdAt": "2024-01-12T10:00:00Z",
    "updatedAt": "2024-01-12T10:00:00Z"
  }
]
```

**Example**:
```bash
curl http://localhost:5010/api/v1/notifications/templates
```

---

### Get Template by ID

**Endpoint**: `GET /api/v1/notifications/templates/{id}`

**Example**:
```bash
curl http://localhost:5010/api/v1/notifications/templates/123e4567-e89b-12d3-a456-426614174000
```

---

### Get Template by Name

**Endpoint**: `GET /api/v1/notifications/templates/by-name/{templateName}`

**Example**:
```bash
curl http://localhost:5010/api/v1/notifications/templates/by-name/order_created_email
```

---

### Create Template (Admin Only)

**Endpoint**: `POST /api/v1/notifications/templates`

**Request Body**:
```json
{
  "templateName": "custom_template",
  "templateType": "email|whatsapp|sms|push",
  "subject": "string (optional, for email)",
  "body": "string",
  "variables": ["var1", "var2"],
  "whatsAppTemplateId": "string (optional)",
  "whatsAppLanguage": "en|hi (optional)"
}
```

**Example**:
```bash
curl -X POST http://localhost:5010/api/v1/notifications/templates \
  -H "Content-Type: application/json" \
  -d '{
    "templateName": "payment_success_email",
    "templateType": "email",
    "subject": "Payment Successful - {{order_number}}",
    "body": "Hi {{customer_name}}, your payment of ₹{{amount}} was successful.",
    "variables": ["customer_name", "order_number", "amount"]
  }'
```

---

### Update Template (Admin Only)

**Endpoint**: `PUT /api/v1/notifications/templates/{id}`

**Request Body**:
```json
{
  "subject": "string (optional)",
  "body": "string (optional)",
  "variables": ["var1", "var2"] (optional),
  "isActive": true|false (optional)
}
```

**Example**:
```bash
curl -X PUT http://localhost:5010/api/v1/notifications/templates/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Updated Subject - {{order_number}}",
    "isActive": true
  }'
```

---

### Delete Template (Admin Only)

**Endpoint**: `DELETE /api/v1/notifications/templates/{id}`

**Example**:
```bash
curl -X DELETE http://localhost:5010/api/v1/notifications/templates/123e4567-e89b-12d3-a456-426614174000
```

---

## Preference Endpoints

### Get User Preferences

**Endpoint**: `GET /api/v1/notifications/preferences/{userId}`

Get or create notification preferences for a user.

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "emailEnabled": true,
  "emailOrderUpdates": true,
  "emailPaymentUpdates": true,
  "emailPromotions": false,
  "whatsAppEnabled": true,
  "whatsAppOrderUpdates": true,
  "whatsAppPaymentUpdates": true,
  "whatsAppPromotions": false,
  "smsEnabled": false,
  "smsOrderUpdates": false,
  "pushEnabled": true,
  "pushOrderUpdates": true,
  "pushPaymentUpdates": true,
  "updatedAt": "2024-01-12T10:00:00Z"
}
```

**Example**:
```bash
curl http://localhost:5010/api/v1/notifications/preferences/123e4567-e89b-12d3-a456-426614174000
```

---

### Update User Preferences

**Endpoint**: `PUT /api/v1/notifications/preferences/{userId}`

Update notification preferences (all fields optional).

**Request Body**:
```json
{
  "emailEnabled": true|false (optional),
  "emailOrderUpdates": true|false (optional),
  "emailPaymentUpdates": true|false (optional),
  "emailPromotions": true|false (optional),
  "whatsAppEnabled": true|false (optional),
  "whatsAppOrderUpdates": true|false (optional),
  "whatsAppPaymentUpdates": true|false (optional),
  "whatsAppPromotions": true|false (optional),
  "smsEnabled": true|false (optional),
  "smsOrderUpdates": true|false (optional),
  "pushEnabled": true|false (optional),
  "pushOrderUpdates": true|false (optional),
  "pushPaymentUpdates": true|false (optional)
}
```

**Example**:
```bash
curl -X PUT http://localhost:5010/api/v1/notifications/preferences/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "emailPromotions": false,
    "whatsAppPromotions": false,
    "smsEnabled": true
  }'
```

---

## Health & Info

### Health Check

**Endpoint**: `GET /health`

**Response**: `200 OK`
```json
{
  "status": "Healthy",
  "checks": {
    "database": "Healthy",
    "redis": "Healthy"
  }
}
```

---

### Service Info

**Endpoint**: `GET /`

**Response**: `200 OK`
```json
{
  "service": "RealServ NotificationService",
  "version": "1.0.0",
  "status": "running",
  "timestamp": "2024-01-12T10:30:00Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Example Error Response

```json
{
  "error": "Failed to send email notification",
  "details": "Invalid email address format"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Testing with Postman

Import the Postman collection: [NotificationService.postman_collection.json](./postman/NotificationService.postman_collection.json)

---

## Support

- **Documentation**: See [README.md](./README.md)
- **Quickstart**: See [QUICKSTART.md](./QUICKSTART.md)
- **Architecture**: See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Issues**: Contact backend team
- **Slack**: #backend-dev

---

**Last Updated**: January 12, 2026  
**API Version**: 1.0.0
