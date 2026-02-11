# IntegrationService - API Reference

**Service**: IntegrationService  
**Version**: 1.0.0  
**Base URL**: `http://localhost:5011/api/v1`  
**Port**: 5011

---

## Overview

The IntegrationService provides three main integration capabilities:
1. **WhatsApp Bot Gateway** - Send/receive WhatsApp messages
2. **Media Upload** - Upload files to AWS S3
3. **Location Services** - Geocoding and distance calculations via Google Maps

---

## Authentication

All endpoints (except WhatsApp webhook) require Firebase JWT authentication.

**Header**:
```
Authorization: Bearer <firebase_jwt_token>
```

---

## 1. WhatsApp Integration

### 1.1 Send Text Message

Send a plain text message via WhatsApp.

**Endpoint**: `POST /whatsapp/send/text`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "phoneNumber": "+917906441952",
  "message": "Your order #ORD001 has been shipped!",
  "userId": "v_001",
  "userType": "vendor",
  "context": "order_update",
  "relatedEntityId": "ORD001",
  "relatedEntityType": "order"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "messageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "whatsAppMessageId": "wamid.HBgNOTE4NzY...",
    "phoneNumber": "+917906441952",
    "status": "sent",
    "sentAt": "2026-01-12T10:30:00Z"
  },
  "message": "Message sent successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

### 1.2 Send Template Message

Send a pre-approved WhatsApp template message.

**Endpoint**: `POST /whatsapp/send/template`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "phoneNumber": "+917906441952",
  "templateName": "order_confirmation",
  "languageCode": "en",
  "parameters": ["John Doe", "₹5,000", "ORD001"],
  "userId": "v_001",
  "userType": "vendor"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "messageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "whatsAppMessageId": "wamid.HBgNOTE4NzY...",
    "phoneNumber": "+917906441952",
    "status": "sent",
    "sentAt": "2026-01-12T10:30:00Z"
  }
}
```

---

### 1.3 Send Media Message

Send an image, document, video, or audio file.

**Endpoint**: `POST /whatsapp/send/media`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "phoneNumber": "+917906441952",
  "mediaUrl": "https://realserv-media.s3.ap-south-1.amazonaws.com/image/catalog/2026/01/product.jpg",
  "mediaType": "image",
  "caption": "Check out this new product!",
  "userId": "v_001",
  "userType": "vendor"
}
```

**Media Types**: `image`, `document`, `video`, `audio`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "messageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "phoneNumber": "+917906441952",
    "status": "sent"
  }
}
```

---

### 1.4 WhatsApp Webhook (Receive Messages)

Webhook endpoint for receiving inbound WhatsApp messages and status updates.

**Endpoint (Verification)**: `GET /whatsapp/webhook`  
**Auth**: None (Public)

**Query Parameters**:
- `hub.mode=subscribe`
- `hub.challenge=<challenge_string>`
- `hub.verify_token=<your_verify_token>`

**Endpoint (Receive)**: `POST /whatsapp/webhook`  
**Auth**: None (Public)

This endpoint is called by Meta/WhatsApp when:
- A user sends a message to your WhatsApp number
- A message status changes (delivered, read, failed)

**Webhook Payload Example**:
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "BUSINESS_ACCOUNT_ID",
    "changes": [{
      "field": "messages",
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "917906441952",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "messages": [{
          "from": "919123456789",
          "id": "wamid.HBgNOTE4NzY...",
          "timestamp": "1673521234",
          "type": "text",
          "text": {
            "body": "HELP"
          }
        }]
      }
    }]
  }]
}
```

---

### 1.5 Get Message History by Phone

**Endpoint**: `GET /whatsapp/history/phone/{phoneNumber}`  
**Auth**: Required (VendorOrAdmin)

**Query Parameters**:
- `page` (default: 1)
- `pageSize` (default: 50)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "direction": "outbound",
        "messageType": "text",
        "phoneNumber": "+917906441952",
        "content": "Your order has been shipped!",
        "status": "delivered",
        "createdAt": "2026-01-12T10:30:00Z"
      }
    ],
    "totalCount": 25,
    "page": 1,
    "pageSize": 50
  }
}
```

---

### 1.6 Get Message History by User

**Endpoint**: `GET /whatsapp/history/user/{userId}`  
**Auth**: Required (VendorOrAdmin)

**Query Parameters**:
- `page` (default: 1)
- `pageSize` (default: 50)

---

## 2. Media Upload (S3)

### 2.1 Upload Single File

Upload a single file to AWS S3.

**Endpoint**: `POST /media/upload`  
**Auth**: Required (VendorOrAdmin)  
**Content-Type**: `multipart/form-data`  
**Max File Size**: 100 MB

**Form Fields**:
- `file` (required) - The file to upload
- `uploadContext` (optional) - e.g., "profile_photo", "kyc_document", "product_image"
- `uploadedByUserId` (optional)
- `uploadedByUserType` (optional) - "vendor", "buyer", "admin"
- `relatedEntityId` (optional)
- `relatedEntityType` (optional) - "vendor", "product", "order"
- `isPublic` (optional, default: true)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "originalFilename": "product-photo.jpg",
    "url": "https://realserv-media.s3.ap-south-1.amazonaws.com/image/product_image/2026/01/abc123.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 524288,
    "category": "image",
    "uploadedAt": "2026-01-12T10:30:00Z"
  },
  "message": "File uploaded successfully"
}
```

**Allowed File Types**:
- **Images**: .jpg, .jpeg, .png, .gif, .webp, .svg (Max: 10 MB)
- **Documents**: .pdf, .doc, .docx, .xls, .xlsx, .txt (Max: 20 MB)
- **Videos**: .mp4, .mov, .avi, .mkv (Max: 100 MB)
- **Audio**: .mp3, .wav, .ogg, .m4a (Max: 20 MB)

---

### 2.2 Upload Multiple Files

**Endpoint**: `POST /media/upload/multiple`  
**Auth**: Required (VendorOrAdmin)  
**Content-Type**: `multipart/form-data`

**Form Fields**:
- `files[]` (required) - Array of files
- Other fields same as single upload

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "originalFilename": "photo1.jpg",
        "url": "https://...",
        "mimeType": "image/jpeg",
        "fileSize": 524288,
        "category": "image",
        "uploadedAt": "2026-01-12T10:30:00Z"
      }
    ],
    "successCount": 3,
    "failureCount": 0,
    "errors": null
  },
  "message": "3 files uploaded successfully"
}
```

---

### 2.3 Get File Details

**Endpoint**: `GET /media/{fileId}`  
**Auth**: Required (VendorOrAdmin)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "fileId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "originalFilename": "product-photo.jpg",
    "storageFilename": "abc123.jpg",
    "url": "https://realserv-media.s3.ap-south-1.amazonaws.com/...",
    "mimeType": "image/jpeg",
    "fileSize": 524288,
    "category": "image",
    "uploadContext": "product_image",
    "uploadedByUserId": "v_001",
    "uploadedByUserType": "vendor",
    "relatedEntityId": "prod_123",
    "relatedEntityType": "product",
    "isPublic": true,
    "createdAt": "2026-01-12T10:30:00Z"
  }
}
```

---

### 2.4 Get Files by User

**Endpoint**: `GET /media/user/{userId}`  
**Auth**: Required (VendorOrAdmin)

**Query Parameters**:
- `page` (default: 1)
- `pageSize` (default: 50)

---

### 2.5 Get Files by Entity

Get all files related to a specific entity (e.g., all photos for a product).

**Endpoint**: `GET /media/entity/{entityType}/{entityId}`  
**Auth**: Required (VendorOrAdmin)

**Example**: `GET /media/entity/product/prod_123`

---

### 2.6 Delete File

Soft delete a file (marks as deleted, doesn't actually remove from S3 immediately).

**Endpoint**: `DELETE /media/{fileId}`  
**Auth**: Required (VendorOrAdmin)

**Response** (200 OK):
```json
{
  "success": true,
  "data": true,
  "message": "File deleted successfully"
}
```

---

### 2.7 Generate Presigned URL

Generate a temporary URL for accessing private files.

**Endpoint**: `POST /media/presigned-url`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "s3Key": "document/kyc_document/2026/01/abc123.pdf",
  "expirationMinutes": 60
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": "https://realserv-media.s3.ap-south-1.amazonaws.com/document/kyc_document/2026/01/abc123.pdf?X-Amz-Algorithm=...",
  "message": "Presigned URL generated"
}
```

---

## 3. Location Services (Google Maps)

### 3.1 Geocode Address

Convert an address to coordinates (latitude/longitude).

**Endpoint**: `POST /location/geocode`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "address": "Kukatpally, Hyderabad, Telangana, India"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "latitude": 17.4848,
    "longitude": 78.3980,
    "formattedAddress": "Kukatpally, Hyderabad, Telangana 500072, India",
    "city": "Hyderabad",
    "state": "Telangana",
    "postalCode": "500072",
    "country": "India",
    "placeId": "ChIJL_P_CXMEyzsRXpVAFXDJG4",
    "fromCache": false
  },
  "message": "Address geocoded successfully"
}
```

**Note**: Results are cached for 90 days. `fromCache: true` indicates cached result.

---

### 3.2 Reverse Geocode

Convert coordinates to an address.

**Endpoint**: `POST /location/reverse-geocode`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "latitude": 17.4848,
  "longitude": 78.3980
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "formattedAddress": "Kukatpally, Hyderabad, Telangana 500072, India",
    "city": "Hyderabad",
    "state": "Telangana",
    "postalCode": "500072",
    "country": "India",
    "placeId": "ChIJL_P_CXMEyzsRXpVAFXDJG4"
  }
}
```

---

### 3.3 Calculate Distance

Calculate distance and travel time between two addresses.

**Endpoint**: `POST /location/distance`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "originAddress": "Kukatpally, Hyderabad",
  "destinationAddress": "Gachibowli, Hyderabad"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "distanceInKilometers": 12.5,
    "distanceInMeters": 12500,
    "distanceText": "12.5 km",
    "durationInSeconds": 1800,
    "durationText": "30 mins",
    "origin": {
      "latitude": 17.4848,
      "longitude": 78.3980,
      "formattedAddress": "Kukatpally, Hyderabad, Telangana, India"
    },
    "destination": {
      "latitude": 17.4399,
      "longitude": 78.3826,
      "formattedAddress": "Gachibowli, Hyderabad, Telangana, India"
    }
  },
  "message": "Distance calculated successfully"
}
```

---

### 3.4 Calculate Haversine Distance

Calculate straight-line distance using coordinates (no Google Maps API call).

**Endpoint**: `POST /location/distance/haversine`  
**Auth**: Required (VendorOrAdmin)

**Request Body**:
```json
{
  "originLatitude": 17.4848,
  "originLongitude": 78.3980,
  "destinationLatitude": 17.4399,
  "destinationLongitude": 78.3826
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "distanceInKilometers": 8.2,
    "distanceInMeters": 8200,
    "distanceText": "8.20 km"
  },
  "message": "Haversine distance calculated"
}
```

**Note**: This calculates "as the crow flies" distance, not road distance.

---

## Health Check

**Endpoint**: `GET /health`  
**Auth**: None

**Response** (200 OK):
```
Healthy
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request**:
```json
{
  "success": false,
  "data": null,
  "message": "Invalid request",
  "errors": ["Phone number is required"],
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Unauthorized",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**429 Too Many Requests**:
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "An internal error occurred",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## Rate Limits

- **General**: 1000 requests/hour per IP
- **Media Upload**: 20 requests/minute per IP
- **WhatsApp Webhook**: 100 requests/minute per IP

---

## Configuration

Required environment variables:

```bash
# Database
ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=realserv_integration;Username=postgres;Password=postgres"

# Redis Cache
ConnectionStrings__Redis="localhost:6379"

# Firebase
Firebase__ProjectId="realserv-mvp"

# AWS S3
AWS__Region="ap-south-1"
AWS__S3__BucketName="realserv-media"

# WhatsApp (Meta Business API)
WhatsApp__PhoneNumberId="YOUR_PHONE_NUMBER_ID"
WhatsApp__AccessToken="YOUR_ACCESS_TOKEN"
WhatsApp__VerifyToken="YOUR_VERIFY_TOKEN"

# Google Maps
GoogleMaps__ApiKey="YOUR_GOOGLE_MAPS_API_KEY"
```

---

**Last Updated**: January 12, 2026  
**Service Version**: 1.0.0
