import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>
  ) {}

  async create(post: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findBySearch(query: string): Promise<Post[]> {
    if (!query || query.trim() === '') {
      return this.postModel.find().sort({ createdAt: -1 }).exec();
    }

    const searchQuery = query.trim();
    return this.postModel
      .find({
        title: { $regex: searchQuery, $options: 'i' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // find by category
  async findByCategory(category: string): Promise<Post[]> {
    if (!category || category.trim() === '') {
      return this.postModel.find().sort({ createdAt: -1 }).exec();
    }

    const categoryQuery = category.trim();
    return this.postModel
      .find({
        category: { $regex: categoryQuery, $options: 'i' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, post: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, post, {
        new: true,
      })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    const posts = await this.postModel.find({ authorId: userId }).exec();
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user');
    }
    return posts;
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }
}
