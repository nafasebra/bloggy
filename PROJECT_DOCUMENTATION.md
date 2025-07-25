# Bloggy Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Entities & Data Models](#entities--data-models)
4. [Use Cases](#use-cases)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Technical Stack](#technical-stack)

## Project Overview

**Bloggy** is a modern blogging platform built with a full-stack architecture:
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: NestJS with MongoDB (Mongoose)
- **Database**: MongoDB

The platform allows users to create, read, and interact with blog posts, with features like user profiles, comments, and search functionality.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - User Interface│    │ - REST API      │    │ - Collections   │
│ - Components    │    │ - Controllers   │    │ - Documents     │
│ - Pages         │    │ - Services      │    │ - Indexes       │
│ - State Mgmt    │    │ - Schemas       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Entities & Data Models

### 1. User Entity
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
  isActive: boolean;      // Default: false
  postsCount: number;     // Calculated field
  followers: number;      // Default: 0
  following: number;      // Default: 0
  category: string;       // Primary category/focus
  joinDate: Date;        // Auto-generated
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### 2. Post Entity
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
  status: PostStatus;     // draft, published, archived
  views: number;          // Default: 0
  likes: number;          // Default: 0
  commentsCount: number;  // Calculated field
  featured: boolean;      // Default: false
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}

enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
```

### 3. Comment Entity
```typescript
interface Comment {
  _id: ObjectId;
  postId: ObjectId;       // Reference to Post
  author: string;         // Commenter name
  content: string;        // Required
  avatar: string;         // Author initials
  parentId?: ObjectId;    // For nested comments (optional)
  likes: number;          // Default: 0
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### 4. Category Entity
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

### 5. Tag Entity
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

## Use Cases

### User Management
1. **User Registration**
   - Create new user account
   - Validate email uniqueness
   - Set default values

2. **User Profile Management**
   - View user profile
   - Update profile information
   - Upload avatar
   - Manage social links

3. **User Discovery**
   - Browse all users
   - Search users by name/category
   - View user's posts

### Post Management
1. **Post Creation**
   - Write new blog post
   - Add title, excerpt, content
   - Select category and tags
   - Preview before publishing
   - Auto-calculate read time

2. **Post Publishing**
   - Publish draft posts
   - Schedule posts for later
   - Set post status

3. **Post Discovery**
   - Browse all posts
   - Filter by category
   - Search posts by title/content/tags
   - View trending posts

4. **Post Reading**
   - View full post content
   - Track post views
   - Like/unlike posts
   - Share posts

### Comment System
1. **Comment Creation**
   - Add comments to posts
   - Reply to existing comments
   - Like comments

2. **Comment Management**
   - View all comments for a post
   - Moderate comments
   - Delete inappropriate comments

### Search & Discovery
1. **Content Search**
   - Search posts by title, content, tags
   - Search users by name, bio
   - Advanced filtering options

2. **Content Discovery**
   - Latest posts
   - Popular posts
   - Posts by category
   - Related posts

## Database Design

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  bio: String,
  avatar: String,
  location: String,
  website: String,
  twitter: String,
  isActive: Boolean,
  postsCount: Number,
  followers: Number,
  following: Number,
  category: String,
  joinDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ email: 1 }` (unique)
- `{ name: 1 }`
- `{ category: 1 }`
- `{ isActive: 1 }`

#### 2. Posts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  excerpt: String,
  content: String,
  authorId: ObjectId,
  author: String,
  date: Date,
  readTime: String,
  category: String,
  tags: [String],
  status: String,
  views: Number,
  likes: Number,
  commentsCount: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ authorId: 1 }`
- `{ category: 1 }`
- `{ status: 1 }`
- `{ date: -1 }`
- `{ views: -1 }`
- `{ likes: -1 }`
- `{ tags: 1 }`
- `{ title: "text", content: "text", excerpt: "text" }` (text index)

#### 3. Comments Collection
```javascript
{
  _id: ObjectId,
  postId: ObjectId,
  author: String,
  content: String,
  avatar: String,
  parentId: ObjectId,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ postId: 1 }`
- `{ parentId: 1 }`
- `{ createdAt: -1 }`

#### 4. Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  slug: String,
  postCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ name: 1 }` (unique)
- `{ slug: 1 }` (unique)

#### 5. Tags Collection
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  postCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ name: 1 }` (unique)
- `{ slug: 1 }` (unique)

### Database Relationships

1. **One-to-Many**: User → Posts
   - A user can have multiple posts
   - Posts reference user via `authorId`

2. **One-to-Many**: Post → Comments
   - A post can have multiple comments
   - Comments reference post via `postId`

3. **Many-to-Many**: Posts ↔ Tags
   - Posts can have multiple tags
   - Tags can be used by multiple posts
   - Implemented via array field in posts

4. **One-to-Many**: Category → Posts
   - A category can have multiple posts
   - Posts reference category via `category` field

### Data Integrity Considerations

1. **Referential Integrity**
   - When a user is deleted, handle their posts (archive or delete)
   - When a post is deleted, delete associated comments
   - When a category is deleted, update posts to use default category

2. **Denormalization Strategy**
   - Store author name in posts for faster queries
   - Store comment count in posts for performance
   - Store post count in categories and tags

3. **Consistency Patterns**
   - Use transactions for multi-document operations
   - Implement eventual consistency for calculated fields
   - Use background jobs for data aggregation

## API Endpoints

### User Endpoints
```
GET    /users              - Get all users
GET    /users/:id          - Get user by ID
POST   /users              - Create new user
PATCH  /users/:id          - Update user
DELETE /users/:id          - Delete user
GET    /users/:id/posts    - Get user's posts
```

### Post Endpoints
```
GET    /posts              - Get all posts
GET    /posts/:id          - Get post by ID
POST   /posts              - Create new post
PATCH  /posts/:id          - Update post
DELETE /posts/:id          - Delete post
GET    /posts/category/:category - Get posts by category
GET    /posts/search       - Search posts
POST   /posts/:id/like     - Like/unlike post
```

### Comment Endpoints
```
GET    /posts/:id/comments - Get post comments
POST   /posts/:id/comments - Add comment
DELETE /comments/:id       - Delete comment
POST   /comments/:id/like  - Like/unlike comment
```

### Category Endpoints
```
GET    /categories         - Get all categories
GET    /categories/:id     - Get category by ID
POST   /categories         - Create category
PATCH  /categories/:id     - Update category
DELETE /categories/:id     - Delete category
```

### Tag Endpoints
```
GET    /tags               - Get all tags
GET    /tags/:id           - Get tag by ID
POST   /tags               - Create tag
PATCH  /tags/:id           - Update tag
DELETE /tags/:id           - Delete tag
```

## Frontend Components

### Core Components
1. **Navigation** - Main navigation bar
2. **Hero** - Landing page hero section
3. **BlogCard** - Post preview card
4. **UserPostCard** - User's post card
5. **CommentSection** - Comments display and form
6. **SearchBar** - Search functionality
7. **LatestPosts** - Recent posts display
8. **LatestUsers** - Recent users display
9. **Footer** - Site footer

### Page Components
1. **Home Page** (`/`) - Landing page
2. **Blog Page** (`/blog`) - All posts listing
3. **Post Page** (`/post/[id]`) - Individual post view
4. **User Page** (`/user/[id]`) - User profile
5. **New Post Page** (`/blog/new`) - Create new post

## Technical Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Routing**: Next.js App Router

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Class-validator
- **Documentation**: Swagger/OpenAPI

### Database
- **Database**: MongoDB
- **ORM**: Mongoose
- **Connection**: MongoDB Atlas or local instance

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest
- **Process Management**: Concurrently

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/bloggy
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment Considerations

1. **Database**
   - Use MongoDB Atlas for production
   - Set up proper indexes
   - Configure backup strategies

2. **Backend**
   - Deploy to Vercel, Railway, or similar
   - Set up environment variables
   - Configure CORS for frontend

3. **Frontend**
   - Deploy to Vercel or similar
   - Configure API URL for production
   - Set up proper caching strategies

## Performance Optimizations

1. **Database**
   - Implement proper indexing
   - Use aggregation pipelines for complex queries
   - Implement caching with Redis (future)

2. **Frontend**
   - Implement lazy loading for images
   - Use Next.js Image optimization
   - Implement proper SEO meta tags

3. **API**
   - Implement pagination for large datasets
   - Use compression middleware
   - Implement rate limiting

## Security Considerations

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Role-based access control
   - Input validation and sanitization

2. **Data Protection**
   - Encrypt sensitive data
   - Implement proper CORS policies
   - Use HTTPS in production

3. **API Security**
   - Rate limiting
   - Input validation
   - SQL injection prevention (MongoDB injection)

## Future Enhancements

1. **Features**
   - User authentication and authorization
   - Email notifications
   - Social media sharing
   - Rich text editor for posts
   - Image upload functionality
   - Newsletter subscription

2. **Technical**
   - Redis caching
   - Elasticsearch for advanced search
   - CDN for static assets
   - WebSocket for real-time features
   - Mobile app development

3. **Analytics**
   - Post analytics
   - User engagement metrics
   - SEO optimization tools
   - A/B testing capabilities 