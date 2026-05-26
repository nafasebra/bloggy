# 🚀 Bloggy - Modern Blogging Platform

A full-stack blogging platform built with Next.js, NestJS, and MongoDB. Create, share, and discover amazing content with a beautiful, modern interface.

![Bloggy Platform](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-red?style=for-the-badge&logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📝 Content Management
- **Rich Markdown Editor**: Write with a powerful markdown editor featuring a toolbar
- **Markdown Support**: Full GitHub Flavored Markdown (GFM) support
- **Live Preview**: Real-time preview of your markdown content
- **Side-by-Side Editing**: Edit and preview simultaneously
- **Category & Tags**: Organize content with categories and tags
- **Auto-calculated Read Time**: Smart reading time estimation
- **Draft System**: Save and edit drafts before publishing

### 👥 User Experience
- **User Profiles**: Beautiful user profiles with social links
- **Comment System**: Engage with readers through comments
- **Search & Discovery**: Find content and users easily
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode**: Elegant dark/light theme support

### 🔧 Admin Dashboard
- **Dashboard Overview**: View key statistics and metrics
- **Post Management**: Create, edit, and delete blog posts
- **User Management**: Manage user accounts and roles

### 🔍 Discovery & Search
- **Advanced Search**: Search posts by title, content, and tags
- **Category Filtering**: Browse posts by category
- **User Discovery**: Find and follow interesting authors
- **Latest Content**: Stay updated with recent posts

### 🎨 Modern UI/UX
- **Clean Design**: Modern, minimalist interface
- **Smooth Animations**: Delightful user interactions
- **Accessibility**: Built with accessibility in mind
- **Performance**: Optimized for speed and efficiency

## 🏗️ Architecture

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

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - Latest React with enhanced features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI
- **React SimpleMDE Editor** - Rich markdown editor (EasyMDE)
- **React Markdown** - Markdown rendering with GFM support
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form validation with Zod
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend
- **NestJS 11** - Progressive Node.js framework
- **MongoDB 8** - NoSQL database with Mongoose ODM
- **Mongoose** - Elegant MongoDB object modeling
- **Passport.js** - Authentication middleware (JWT & Local strategies)
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Express Session** - Session management with MongoDB store
- **Swagger** - API documentation
- **Class Validator** - DTO validation
- **Class Transformer** - Object transformation

### Development Tools
- **ESLint 9** - Code linting for both frontend and backend
- **Prettier** - Code formatting
- **Jest** - Backend testing framework
- **Vitest** - Frontend testing framework with browser mode
- **Storybook 9** - UI component development and documentation
- **Playwright** - E2E testing browser automation
- **TypeScript** - Static type checking across the stack

### 🪝 Git Hooks (Husky)

This repository uses Husky to manage Git hooks in the root. Husky is installed and configured in the root `package.json` and the `.husky/` folder. Commit message linting is provided by `commitlint` and configured in `commitlint.config.cjs`.

- Location: `.husky/` at the repo root (hooks are versioned)
- Commitlint config: `commitlint.config.cjs` (root)

Installing / enabling Husky (Husky v9)
```bash
# from repo root — required so Git uses .husky/_ as hooksPath
npm install
npm run hooks:check   # should print: hooks OK: .husky/_
```

Hooks are plain shell scripts in `.husky/` (no `husky install` / `husky add` — those commands are removed in v9). After `npm install`, `prepare` runs `husky`, which sets `core.hooksPath` to `.husky/_` in your local clone.

Add or update hooks by editing files in `.husky/` directly, then commit them.

Run hooks manually
```bash
sh .husky/pre-commit
sh .husky/commit-msg .git/COMMIT_EDITMSG
```

Tips
- If you need to remove or change a hook, edit or delete files in the `.husky/` directory and commit the changes
- If you prefer hooks only in a specific package, update the package script and hook commands accordingly


## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn or pnpm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nafasebra/bloggy.git
   cd bloggy
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd back && npm install
   
   # Install frontend dependencies
   cd ../front && npm install
   ```

3. **Environment Setup**

   **Backend (.env in `back/` directory):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bloggy
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   ```

   **Frontend (.env.local in `front/` directory):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   # https://docs.mongodb.com/manual/installation/
   ```

5. **Run the application**

   **Backend (in `back/` directory):**
   ```bash
   cd back
   npm run start:dev
   ```
   Backend will run at: http://localhost:3000

   **Frontend (in `front/` directory):**
   ```bash
   cd front
   npm run dev
   ```
   Frontend will run at: http://localhost:3000 (Next.js default port)

## 📁 Project Structure

```
bloggy/
├── back/                           # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                  # Authentication module
│   │   │   ├── dto/               # Auth DTOs (login, register, etc.)
│   │   │   ├── jwt-auth.guard.ts  # JWT authentication guard
│   │   │   ├── jwt.strategy.ts    # JWT strategy
│   │   │   └── auth.service.ts    # Auth business logic
│   │   ├── users/                 # User management module
│   │   │   ├── dto/               # User DTOs
│   │   │   ├── schemas/           # User Mongoose schemas
│   │   │   └── users.service.ts   # User business logic
│   │   ├── posts/                 # Blog posts module
│   │   │   ├── dto/               # Post DTOs
│   │   │   ├── schemas/           # Post Mongoose schemas
│   │   │   └── posts.service.ts   # Post business logic
│   │   ├── comments/              # Comments module
│   │   │   ├── dto/               # Comment DTOs
│   │   │   ├── schemas/           # Comment Mongoose schemas
│   │   │   └── comments.service.ts # Comment business logic
│   │   ├── database/              # Database configuration
│   │   │   └── database.module.ts # MongoDB setup
│   │   ├── app.module.ts          # Root application module
│   │   └── main.ts                # Application entry point
│   ├── test/                      # E2E tests
│   ├── eslint.config.mjs          # ESLint configuration
│   ├── nest-cli.json              # NestJS CLI configuration
│   └── package.json
├── front/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── auth/              # Authentication pages (login, register)
│   │   │   ├── blog/              # Blog listing pages
│   │   │   ├── post/              # Individual post pages
│   │   │   ├── dashboard/         # Admin dashboard
│   │   │   ├── user/              # User profile pages
│   │   │   ├── api/               # API routes
│   │   │   └── layout.tsx         # Root layout
│   │   ├── components/            # React components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── layout/            # Layout components (header, footer)
│   │   │   ├── pages/             # Page-specific components
│   │   │   ├── shared/            # Shared/reusable components
│   │   │   └── ui/                # UI components (shadcn/ui)
│   │   ├── contexts/              # React contexts
│   │   │   └── auth-provider.tsx  # Authentication context
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useTheme.ts        # Theme management hook
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── http.ts            # HTTP client (axios)
│   │   │   └── utils.ts           # Helper functions
│   │   ├── services/              # API service layer
│   │   │   ├── auth.services.ts   # Auth API calls
│   │   │   ├── post.services.ts   # Post API calls
│   │   │   ├── user.services.ts   # User API calls
│   │   │   └── comment.services.ts # Comment API calls
│   │   ├── stories/               # Storybook stories
│   │   │   ├── Button.stories.ts  # Button component stories
│   │   │   ├── Header.stories.ts  # Header component stories
│   │   │   └── Page.stories.ts    # Page component stories
│   │   ├── styles/                # Global styles
│   │   │   └── markdown-editor.css # Markdown editor styles
│   │   └── types/                 # TypeScript type definitions
│   ├── public/                    # Static assets
│   ├── components.json            # shadcn/ui configuration
│   ├── vitest.config.ts           # Vitest configuration
│   └── package.json
└── README.md                      # Project documentation
```

## 🎯 Available Scripts

### Backend (in `back/` directory)
```bash
npm run start:dev      # Start in development mode with watch
npm run start:debug    # Start in debug mode
npm run build          # Build the application
npm run start          # Start in production mode (with env file)
npm run start:prod     # Start in production mode (dist)
npm run format         # Format code with Prettier
npm run lint           # Lint and fix code with ESLint
npm run test           # Run unit tests with Jest
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:debug     # Run tests in debug mode
npm run test:e2e       # Run end-to-end tests
```

### Frontend (in `front/` directory)
```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build the application for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run test             # Run tests with Vitest
npm run storybook        # Start Storybook development server (port 6006)
npm run build-storybook  # Build Storybook for production
```

## 📚 API Documentation

The backend includes Swagger documentation available at `http://localhost:3000/api` when running in development mode.

### Authentication
```
POST   /auth/register         # Register new user
POST   /auth/login            # Login user
POST   /auth/refresh          # Refresh JWT token
POST   /auth/forget-password  # Request password reset
POST   /auth/change-password  # Change user password
```

### Users
```
GET    /users                 # Get all users
GET    /users/:id             # Get user by ID
POST   /users                 # Create new user (admin)
PATCH  /users/:id             # Update user profile
DELETE /users/:id             # Delete user (admin)
```

### Posts
```
GET    /posts                 # Get all posts (with pagination, filters)
GET    /posts/:id             # Get post by ID
POST   /posts                 # Create new post (authenticated)
PATCH  /posts/:id             # Update post (author only)
DELETE /posts/:id             # Delete post (author/admin)
GET    /posts/search          # Search posts by title, content, tags
GET    /posts/category/:cat   # Get posts by category
POST   /posts/:id/like        # Like/unlike a post
```

### Comments
```
GET    /comments/:postId      # Get comments for a post
POST   /comments              # Create new comment (authenticated)
PATCH  /comments/:id          # Update comment (author only)
DELETE /comments/:id          # Delete comment (author/admin)
POST   /comments/:id/reply    # Reply to a comment
POST   /comments/:id/like     # Like/unlike a comment
```

## 🎨 Features in Detail

### Blog Post Creation
- **Rich Markdown Editor** with intuitive toolbar
  - Bold, Italic, Headings formatting
  - Lists (ordered & unordered)
  - Code blocks and inline code
  - Tables, quotes, and links
  - Image embedding support
  - Fullscreen and side-by-side modes
- **Live Preview**: Real-time markdown rendering
- **GitHub Flavored Markdown** (GFM) support
- Category and tag selection
- Auto-calculated read time
- Draft saving and editing
- SEO-friendly URLs

### User Profiles
- Customizable user profiles
- Social media links
- Post statistics
- Follower/following system
- User activity feed

### Search & Discovery
- Full-text search across posts
- Category-based filtering
- Tag-based content discovery
- User search functionality
- Advanced filtering options

### Comment System
- Nested comment threads
- Like/unlike comments
- Real-time comment updates
- Comment moderation tools

### Admin Dashboard
- Statistics dashboard with real-time metrics
- Comprehensive post management interface
- User administration and role management
- Content moderation and oversight tools

## 🔧 Configuration

### Database Setup
The application uses MongoDB with Mongoose ODM. You can either:

1. **Use MongoDB Atlas** (Recommended for production)
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloggy
   ```

2. **Use Local MongoDB**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bloggy
   ```

### Environment Variables

**Backend (.env in `back/` directory)**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bloggy

# Server
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session (if using express-session)
SESSION_SECRET=your-session-secret-key
```

**Frontend (.env.local in `front/` directory)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Site Configuration (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build commands
4. Deploy automatically

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update connection string

## 🧪 Testing

### Backend Testing (Jest)
```bash
cd back

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### Frontend Testing (Vitest)
```bash
cd front

# Run tests
npm run test

# Run tests with UI
npm run test -- --ui

# Run tests with coverage
npm run test -- --coverage
```

### Storybook Testing
```bash
cd front

# Start Storybook for visual testing
npm run storybook

# Build Storybook
npm run build-storybook
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Key Features Implementation

### Authentication System
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Passport.js strategies (JWT and Local)
- Protected routes with guards
- Session management with MongoDB store

### Database Schema
- **Users**: Profile information, authentication credentials, social links
- **Posts**: Blog content, metadata, categories, tags, read time
- **Comments**: Nested comments with replies, likes
- **Post Likes**: User engagement tracking
- **Comment Likes**: Comment interaction tracking

### Frontend Architecture
- Server and Client Components (React Server Components)
- API route handlers for backend communication
- Context-based authentication state
- Custom hooks for theme and data fetching
- Service layer for API abstraction
- Component-driven development with Storybook

## �🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework with App Router
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [MongoDB](https://mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TypeScript](https://typescriptlang.org/) - Type safety
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Storybook](https://storybook.js.org/) - Component documentation
- [Vitest](https://vitest.dev/) - Fast unit testing

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/nafasebra">Nafas Ebrahimi</a></p>
  <p>If this project helps you, please give it a ⭐️</p>
</div>
