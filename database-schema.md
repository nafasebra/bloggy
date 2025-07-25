# Database Schema

## User Schema
```typescript
interface User {
  _id: ObjectId;
  name: string;           // Required
  email: string;          // Required, unique
  bio?: string;           // Optional
  avatar?: string;        // Optional - avatar initials or image URL
  location?: string;      // Optional
  website?: string;       // Optional
  twitter?: string;       // Optional
  followers: number;      // Default: 0
  following: number;      // Default: 0
  category: string;       // Primary category/focus
  joinDate: Date;        // Auto-generated
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

## Post Schema
```typescript
interface Post {
  _id: ObjectId;
  title: string;          // Required
  excerpt: string;        // Required - summary
  content: string;        // Required - full content (HTML)
  authorId: ObjectId;     // Reference to User
  author: string;         // Denormalized author name
  date: Date;            // Publication date
  readTime: string;       // Calculated (e.g., "5 min read")
  category: string;       // Required
  tags: string[];         // Array of tags
  views: number;          // Default: 0
  likes: number;          // Default: 0
  commentsCount: number;  // Calculated field
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

## Comment Schema
```typescript
interface Comment {
  _id: ObjectId;
  postId: ObjectId;       // Reference to Post
  author: string;         // Commenter name
  content: string;        // Required
  parentId?: ObjectId;    // For nested comments (optional)
  likes: number;          // Default: 0
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

## Category Schema
```typescript
interface Category {
  _id: ObjectId;
  name: string;           // Required, unique
  description?: string;   // Optional
  slug: string;          // URL-friendly name
  postCount: number;     // Calculated field
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

## Tag Schema
```typescript
interface Tag {
  _id: ObjectId;
  name: string;           // Required, unique
  slug: string;          // URL-friendly name
  postCount: number;     // Calculated field
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
``` 