# Authentication Module

This module handles user authentication and registration functionality with comprehensive Swagger documentation.

## API Endpoints

### POST /auth/register

Registers a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `name`: String, required, 2-100 characters
- `username`: String, required, 3-30 characters, must be unique
- `email`: String, required, valid email format, must be unique
- `password`: String, required, minimum 6 characters

**Responses:**
- `201 Created`: User registered successfully
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Username or email already exists
- `500 Internal Server Error`: Server error

### POST /auth/login

Authenticates a user with username/email and password.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `username`: String, required, 3-30 characters
- `password`: String, required, minimum 6 characters

**Responses:**
- `200 OK`: User logged in successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

## DTOs

### RegisterDto
- `name`: User's full name
- `username`: Unique username for the account
- `email`: Valid email address
- `password`: Secure password (min 6 characters)

### LoginDto
- `username`: Username or email for authentication
- `password`: User's password

### AuthResponseDto
- `status`: Authentication status
- `message`: Success message
- `user`: User information (UserResponseDto)
- `token`: Authentication token (optional)
- `expiresAt`: Token expiration time (optional)

## Swagger Documentation

The authentication endpoints are fully documented with Swagger/OpenAPI specifications including:

- Detailed operation descriptions
- Request/response schemas
- Validation rules
- Error responses
- Example values
- HTTP status codes

Access the Swagger documentation at `/api` when the application is running.

## Error Handling

The module includes comprehensive error handling with standardized error responses:

- **Bad Request (400)**: Invalid input data or validation errors
- **Unauthorized (401)**: Invalid credentials during login
- **Conflict (409)**: Username or email already exists during registration
- **Internal Server Error (500)**: Unexpected server errors

All error responses follow the `ErrorResponseDto` structure with status code, message, error type, timestamp, and request path. 