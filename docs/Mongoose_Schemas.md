# Mongoose Schemas

## Description
Mongoose schemas define the structure, validation rules, and behavior of MongoDB documents. They provide type safety and data validation for MongoDB collections in NestJS applications.

## Syntax
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class ModelName {
  @Prop({ required: true })
  fieldName: string;
}

export const ModelSchema = SchemaFactory.createForClass(ModelName);
```

## Parameters

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@Schema()` | Defines schema options | `@Schema({ timestamps: true })` |
| `@Prop()` | Defines document property | `@Prop({ required: true })` |
| `@Prop({ type: [SchemaTypes.ObjectId] })` | Array of ObjectIds | `@Prop({ type: [SchemaTypes.ObjectId], ref: 'Model' })` |
| `@Prop({ type: SchemaTypes.ObjectId })` | Single ObjectId | `@Prop({ type: SchemaTypes.ObjectId, ref: 'Model' })` |
| `unique: true` | Makes field unique | `@Prop({ unique: true })` |
| `required: true` | Makes field required | `@Prop({ required: true })` |
| `default: value` | Sets default value | `@Prop({ default: 0 })` |
| `index: true` | Creates database index | `@Prop({ index: true })` |
| `sparse: true` | Creates sparse index | `@Prop({ sparse: true })` |

## Examples

### Example 1: User Schema
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop()
  twitter?: string;

  @Prop({ default: 0 })
  followers?: number;

  @Prop({ default: 0 })
  following?: number;

  @Prop()
  category: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Post' })
  postIds?: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Example 2: Post Schema with References
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  authorId: ObjectId;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Comment' })
  commentIds?: ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
```

### Example 3: Comment Schema
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  authorId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Post', required: true })
  postId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  parentCommentId?: ObjectId;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Comment' })
  replyIds?: ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
```

### Example 4: Schema with Custom Methods
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Custom instance method
UserSchema.methods.getFullProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

// Custom static method
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email });
};

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // Hash password before saving
    this.password = this.password; // Replace with actual hashing
  }
  next();
});
```

## Notes

- **Timestamps**: Use `{ timestamps: true }` to automatically add `createdAt` and `updatedAt` fields
- **References**: Use `ref` to establish relationships between collections
- **Indexes**: Create indexes for frequently queried fields to improve performance
- **Validation**: Mongoose provides built-in validation for common data types
- **Middleware**: Use pre/post hooks for data transformation and validation
- **Virtuals**: Use virtual properties for computed fields that aren't stored in the database
- **Methods**: Add custom instance methods to schema for document-specific operations
- **Statics**: Add custom static methods to schema for collection-wide operations
- **Plugins**: Use plugins to add reusable functionality to schemas

## Related Links
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [NestJS Mongoose](https://docs.nestjs.com/techniques/mongodb)
- [MongoDB Schema Design](https://docs.mongodb.com/manual/data-modeling/)
- [Mongoose Schema Types](https://mongoosejs.com/docs/schematypes.html) 