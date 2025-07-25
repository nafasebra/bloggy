# Bloggy Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Entities & Data Models](#entities--data-models)
4. [Use Cases](#use-cases)
5. [Database Design](#database-design)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [Technical Stack](#technical-stack)

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
  views: number;          // Default: 0
  likes: number;          // Default: 0
  commentsCount: number;  // Calculated field
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### 3. Comment Entity
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
- **Framework**: Next.js 15
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

## Database Schema

### Overview
The Bloggy application uses MongoDB as its NoSQL database with a document-based schema design. The database consists of five main collections that work together to provide a complete blogging platform functionality.

### Collections

#### 1. Users Collection
The users collection stores user profile information and authentication data.

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `name`: User's full name (required)
- `email`: Email address (required, unique)
- `bio`: User biography (optional)
- `avatar`: Profile picture URL or initials (optional)
- `location`: User's location (optional)
- `website`: Personal website URL (optional)
- `twitter`: Twitter handle (optional)
- `followers`: Number of followers (default: 0)
- `following`: Number of users being followed (default: 0)
- `category`: Primary category/focus area
- `joinDate`: Account creation date
- `createdAt`: Document creation timestamp
- `updatedAt`: Document last update timestamp

#### 2. Posts Collection
The posts collection stores all blog posts and articles.

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `title`: Post title (required)
- `excerpt`: Post summary/excerpt (required)
- `content`: Full post content in HTML format (required)
- `authorId`: Reference to the author's user ID (ObjectId)
- `author`: Denormalized author name for performance
- `date`: Publication date
- `readTime`: Estimated reading time (calculated)
- `category`: Post category (required)
- `tags`: Array of tag strings
- `views`: View count (default: 0)
- `likes`: Like count (default: 0)
- `commentsCount`: Number of comments (calculated)
- `createdAt`: Document creation timestamp
- `updatedAt`: Document last update timestamp

#### 3. Comments Collection
The comments collection stores user comments on posts.

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `postId`: Reference to the post being commented on (ObjectId)
- `author`: Commenter's name
- `content`: Comment text content (required)
- `parentId`: Reference to parent comment for nested replies (optional)
- `likes`: Like count on the comment (default: 0)
- `createdAt`: Document creation timestamp
- `updatedAt`: Document last update timestamp

#### 4. Categories Collection
The categories collection manages post categorization.

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `name`: Category name (required, unique)
- `description`: Category description (optional)
- `slug`: URL-friendly category name
- `postCount`: Number of posts in this category (calculated)
- `createdAt`: Document creation timestamp
- `updatedAt`: Document last update timestamp

#### 5. Tags Collection
The tags collection manages post tagging system.

**Fields:**
- `_id`: Unique identifier (ObjectId)
- `name`: Tag name (required, unique)
- `slug`: URL-friendly tag name
- `postCount`: Number of posts using this tag (calculated)
- `createdAt`: Document creation timestamp
- `updatedAt`: Document last update timestamp

### Relationships

**One-to-Many Relationships:**
- User → Posts: A user can create multiple posts
- Post → Comments: A post can have multiple comments
- Category → Posts: A category can contain multiple posts

**Many-to-Many Relationships:**
- Posts ↔ Tags: Posts can have multiple tags, tags can be used by multiple posts

**Self-Referencing Relationships:**
- Comments → Comments: Comments can have nested replies via parentId

### Indexing Strategy

**Primary Indexes:**
- `_id`: Automatic primary key index on all collections
- `email`: Unique index on users collection
- `name`: Unique index on categories and tags collections

**Performance Indexes:**
- `authorId`: Index on posts collection for user queries
- `postId`: Index on comments collection for post queries
- `category`: Index on posts collection for category filtering
- `tags`: Index on posts collection for tag searches
- `date`: Index on posts collection for chronological sorting
- `createdAt`: Index on all collections for time-based queries

### Data Integrity

**Constraints:**
- Email uniqueness enforced at database level
- Category and tag name uniqueness enforced
- Required fields validated at application level
- ObjectId references validated for data consistency

**Calculated Fields:**
- `commentsCount`: Updated via aggregation or application logic
- `postCount`: Updated when posts are added/removed from categories/tags
- `readTime`: Calculated based on content length
- `views` and `likes`: Incremented via atomic operations

### Schema Evolution

The MongoDB schema is designed to be flexible and allow for future enhancements:
- Optional fields can be added without breaking existing documents
- New collections can be introduced for additional features
- Indexes can be added or modified for performance optimization
- Denormalized fields can be added for query performance 