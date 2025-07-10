# MongoDB Setup Guide

## Installation

Install the required dependencies:

```bash
npm install @nestjs/mongoose mongoose
```

## Environment Variables

Create a `.env` file in the root of the backend directory with:

```
MONGODB_URI=mongodb://localhost:27017/bloggy
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloggy?retryWrites=true&w=majority
```

## Local MongoDB Setup

1. Install MongoDB locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Or install MongoDB Community Edition from the official website.

## Usage

The application now includes:

- **Database Module**: Handles MongoDB connection
- **Users Module**: Example CRUD operations with MongoDB
- **User Schema**: Sample schema with timestamps

## API Endpoints

Once running, you can test the MongoDB integration with:

- `POST /users` - Create a user
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Example Usage

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "bio": "Developer"}'

# Get all users
curl http://localhost:3000/users
``` 