# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All API endpoints (except `/auth/register` and `/auth/login`) require authentication via Bearer token.

Include the token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VIEWER"
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Documents

#### Upload Document
```http
POST /documents/:projectId/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

#### List Documents
```http
GET /documents/:projectId
Authorization: Bearer <token>
```

#### Get Document Details
```http
GET /documents/:projectId/:documentId
Authorization: Bearer <token>
```

#### Download Document
```http
GET /documents/:projectId/:documentId/download
Authorization: Bearer <token>
```

#### Ask Question About Document
```http
POST /documents/:projectId/:documentId/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What are the key terms of this contract?"
}
```

#### Delete Document
```http
DELETE /documents/:projectId/:documentId
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-01-13T10:00:00.000Z"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Invalid request data
- `AUTHENTICATION_ERROR` (401): Missing or invalid token
- `AUTHORIZATION_ERROR` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `VDR_CONNECTION_ERROR` (502): VDR provider error
- `AI_SERVICE_ERROR` (502): AI service error
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API requests are rate limited to:
- 100 requests per 15 minutes per IP address

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when the limit resets

## Pagination

List endpoints support pagination:
```http
GET /endpoint?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
