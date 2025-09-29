'use client';

import { useAuth } from '@/contexts/auth-provider';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CommentCard from '@/components/shared/comment-card';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar: string;
}

interface CommentSectionProps {
  postId: number;
}

// Zod schema for comment validation
const commentSchema = z.object({
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    author: 'John Doe',
    content:
      "This is a fantastic article! I've been following these trends and it's great to see them all summarized in one place.",
    date: '2024-01-15T10:30:00Z',
    avatar: 'JD',
  },
  {
    id: 2,
    author: 'Jane Smith',
    content:
      'I particularly enjoyed the section about AI-powered development tools. GitHub Copilot has been a game-changer for my workflow.',
    date: '2024-01-15T14:20:00Z',
    avatar: 'JS',
  },
  {
    id: 3,
    author: 'Mike Johnson',
    content:
      "Great insights! I'm excited to see how these technologies evolve throughout the year.",
    date: '2024-01-16T09:15:00Z',
    avatar: 'MJ',
  },
];

export default function CommentSection({ postId }: CommentSectionProps) {
  // get accesstoken
  const { accessToken } = useAuth();
  console.log(postId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (data: CommentFormData) => {
    console.log('Comment submitted:', data);
    // Handle comment submission here
    reset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({mockComments.length})
      </h3>

      {accessToken ? (
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              {...register('comment')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Share your thoughts..."
            />
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 flex flex-col gap-3 border border-gray-300 dark:border-gray-600 py-5 px-3 rounded-lg text-center items-center justify-center ">
          <p>Please login to write your thoughts</p>
          <Link href="/auth/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
              Login
            </button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6 mt-9">
        {mockComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      {mockComments.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
