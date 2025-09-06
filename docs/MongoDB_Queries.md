# MongoDB Queries

## Description
MongoDB queries in NestJS applications use Mongoose to interact with the database. Mongoose provides a rich query API for finding, creating, updating, and deleting documents with support for filtering, sorting, pagination, and aggregation.

## Syntax
```typescript
// Basic query
const result = await Model.find(filter).exec();

// Query with options
const result = await Model.find(filter)
  .select(fields)
  .sort(sortOptions)
  .limit(limit)
  .skip(skip)
  .populate(relations)
  .exec();
```

## Parameters

| Method | Description | Example |
|--------|-------------|---------|
| `find()` | Find multiple documents | `User.find({ active: true })` |
| `findOne()` | Find single document | `User.findOne({ email })` |
| `findById()` | Find by ObjectId | `User.findById(id)` |
| `create()` | Create new document | `User.create(userData)` |
| `save()` | Save document instance | `user.save()` |
| `updateOne()` | Update single document | `User.updateOne(filter, update)` |
| `updateMany()` | Update multiple documents | `User.updateMany(filter, update)` |
| `deleteOne()` | Delete single document | `User.deleteOne(filter)` |
| `deleteMany()` | Delete multiple documents | `User.deleteMany(filter)` |
| `aggregate()` | Run aggregation pipeline | `User.aggregate(pipeline)` |

## Examples

### Example 1: Basic CRUD Operations
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // Create
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // Find all with pagination
  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Find by ID
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Find by username
  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  // Find by email
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  // Update
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  // Delete
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
```

### Example 2: Advanced Queries with Filtering
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // Find users with complex filtering
  async findUsers(filters: {
    search?: string;
    category?: string;
    isActive?: boolean;
    minFollowers?: number;
    maxFollowers?: number;
  }): Promise<User[]> {
    const query: any = {};

    // Text search
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
        { bio: { $regex: filters.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    // Followers range filter
    if (filters.minFollowers || filters.maxFollowers) {
      query.followers = {};
      if (filters.minFollowers) {
        query.followers.$gte = filters.minFollowers;
      }
      if (filters.maxFollowers) {
        query.followers.$lte = filters.maxFollowers;
      }
    }

    return this.userModel
      .find(query)
      .sort({ followers: -1, createdAt: -1 })
      .exec();
  }

  // Find users with specific conditions
  async findActiveUsers(): Promise<User[]> {
    return this.userModel
      .find({ 
        isActive: true,
        followers: { $gte: 10 }
      })
      .sort({ followers: -1 })
      .limit(20)
      .exec();
  }

  // Find users created in last 30 days
  async findRecentUsers(): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.userModel
      .find({
        createdAt: { $gte: thirtyDaysAgo }
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
```

### Example 3: Aggregation Queries
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // Get user statistics
  async getUserStats(): Promise<any> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          avgFollowers: { $avg: '$followers' },
          maxFollowers: { $max: '$followers' },
          minFollowers: { $min: '$followers' }
        }
      }
    ]);
  }

  // Get users by category with counts
  async getUsersByCategory(): Promise<any> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgFollowers: { $avg: '$followers' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
  }

  // Get top users by followers
  async getTopUsers(limit: number = 10): Promise<User[]> {
    return this.userModel.aggregate([
      {
        $match: {
          isActive: true,
          followers: { $gt: 0 }
        }
      },
      {
        $sort: { followers: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          followers: 1,
          category: 1,
          avatar: 1
        }
      }
    ]);
  }

  // Get user growth over time
  async getUserGrowth(): Promise<any> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
  }
}
```

### Example 4: Posts with User Population
```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  // Find posts with author information
  async findAllWithAuthor(page: number = 1, limit: number = 10): Promise<Post[]> {
    const skip = (page - 1) * limit;
    
    return this.postModel
      .find({ isPublished: true })
      .populate('authorId', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Find posts by user with comments
  async findPostsByUser(userId: string): Promise<Post[]> {
    return this.postModel
      .find({ authorId: userId })
      .populate('authorId', 'name username avatar')
      .populate({
        path: 'commentIds',
        populate: {
          path: 'authorId',
          select: 'name username avatar'
        }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Find popular posts
  async findPopularPosts(limit: number = 10): Promise<Post[]> {
    return this.postModel
      .find({ isPublished: true })
      .populate('authorId', 'name username avatar')
      .sort({ 
        likes: -1, 
        views: -1, 
        createdAt: -1 
      })
      .limit(limit)
      .exec();
  }
}
```

### Example 5: Comments with Nested Population
```typescript
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  // Find comments for a post with author info
  async findCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId })
      .populate('authorId', 'name username avatar')
      .populate({
        path: 'parentCommentId',
        populate: {
          path: 'authorId',
          select: 'name username avatar'
        }
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  // Find replies to a comment
  async findReplies(commentId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ parentCommentId: commentId })
      .populate('authorId', 'name username avatar')
      .sort({ createdAt: 1 })
      .exec();
  }
}
```

### Example 6: Bulk Operations
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // Bulk update users
  async bulkUpdateUsers(updates: Array<{ id: string; update: any }>): Promise<any> {
    const bulkOps = updates.map(({ id, update }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: update }
      }
    }));

    return this.userModel.bulkWrite(bulkOps);
  }

  // Bulk delete inactive users
  async deleteInactiveUsers(): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.userModel.deleteMany({
      isActive: false,
      lastLoginAt: { $lt: thirtyDaysAgo }
    });
  }

  // Update follower counts
  async updateFollowerCounts(): Promise<any> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'followers',
          localField: '_id',
          foreignField: 'followingId',
          as: 'followers'
        }
      },
      {
        $addFields: {
          followerCount: { $size: '$followers' }
        }
      },
      {
        $out: 'users'
      }
    ]);
  }
}
```

## Notes

- **Query Optimization**: Use indexes for frequently queried fields
- **Population**: Use `populate()` to fetch related documents
- **Projection**: Use `select()` to limit returned fields
- **Sorting**: Use `sort()` for consistent ordering
- **Pagination**: Use `skip()` and `limit()` for large datasets
- **Aggregation**: Use `aggregate()` for complex data processing
- **Bulk Operations**: Use `bulkWrite()` for multiple operations
- **Transactions**: Use transactions for multi-document operations
- **Indexes**: Create indexes on frequently queried fields
- **Query Performance**: Monitor query performance with MongoDB profiler

## Related Links
- [Mongoose Query API](https://mongoosejs.com/docs/queries.html)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [Mongoose Population](https://mongoosejs.com/docs/populate.html)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/) 