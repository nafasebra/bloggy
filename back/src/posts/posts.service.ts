import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(private readonly postModel: Model<Post>) {}

  async create(post: Post): Promise<Post> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, post: Post): Promise<Post> {
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
    const posts = await this.postModel.find({ userId }).exec();
    if (!posts) {
      throw new NotFoundException('No posts found for this user');
    }
    return posts;
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }
}
