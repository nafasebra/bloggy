# 🚀 Bloggy - Modern Blogging Platform

A full-stack blogging platform built with Next.js, NestJS, and MongoDB. Create, share, and discover amazing content with a beautiful, modern interface.

![Bloggy Platform](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-red?style=for-the-badge&logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📝 Content Management
- **Rich Blog Creation**: Write and publish beautiful blog posts
- **Live Preview**: Preview your posts before publishing
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
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe backend development

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Concurrently** - Run multiple commands

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bloggy.git
   cd bloggy
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
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
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both frontend and backend concurrently:
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

## 📁 Project Structure

```
bloggy/
├── back/                    # Backend (NestJS)
│   ├── src/
│   │   ├── users/          # User module
│   │   ├── config/         # Configuration
│   │   └── database/       # Database setup
│   └── package.json
├── front/                   # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── styles/         # Global styles
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🎯 Available Scripts

### Root Directory
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build both applications
npm run start        # Start both applications in production
```

### Backend (in `back/` directory)
```bash
npm run start:dev    # Start in development mode
npm run build        # Build the application
npm run start        # Start in production mode
npm run test         # Run tests
```

### Frontend (in `front/` directory)
```bash
npm run dev          # Start development server
npm run build        # Build the application
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📚 API Documentation

### Users
```
GET    /users              # Get all users
GET    /users/:id          # Get user by ID
POST   /users              # Create new user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user
```

### Posts
```
GET    /posts              # Get all posts
GET    /posts/:id          # Get post by ID
POST   /posts              # Create new post
PATCH  /posts/:id          # Update post
DELETE /posts/:id          # Delete post
GET    /posts/search       # Search posts
```

### Comments
```
GET    /posts/:id/comments # Get post comments
POST   /posts/:id/comments # Add comment
DELETE /comments/:id       # Delete comment
```

## 🎨 Features in Detail

### Blog Post Creation
- Rich text editor with live preview
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
The application uses MongoDB. You can either:

1. **Use MongoDB Atlas** (Recommended for production)
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloggy
   ```

2. **Use Local MongoDB**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bloggy
   ```

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/bloggy
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
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

```bash
# Run backend tests
cd back && npm run test

# Run frontend tests
cd front && npm run test

# Run e2e tests
cd back && npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [MongoDB](https://mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://typescriptlang.org/) - Type safety

## 📞 Support

If you have any questions or need help:

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/bloggy/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/bloggy/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/nafasebra">Nafas Ebrahimi</a></p>
  <p>If this project helps you, please give it a ⭐️</p>
</div>