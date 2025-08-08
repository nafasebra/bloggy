"use client";

import Link from "next/link";
import { useState } from "react";

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

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    author: "John Doe",
    content:
      "This is a fantastic article! I've been following these trends and it's great to see them all summarized in one place.",
    date: "2024-01-15T10:30:00Z",
    avatar: "JD",
  },
  {
    id: 2,
    author: "Jane Smith",
    content:
      "I particularly enjoyed the section about AI-powered development tools. GitHub Copilot has been a game-changer for my workflow.",
    date: "2024-01-15T14:20:00Z",
    avatar: "JS",
  },
  {
    id: 3,
    author: "Mike Johnson",
    content:
      "Great insights! I'm excited to see how these technologies evolve throughout the year.",
    date: "2024-01-16T09:15:00Z",
    avatar: "MJ",
  },
];

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: authorName,
      content: newComment,
      date: new Date().toISOString(),
      avatar: authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setAuthorName("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>


      {/** required login panel to comment */}
      <div className="flex flex-col gap-2">
        <p>Please login to comment</p>
        <Link href="/auth/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            Login
          </button>
        </Link>
      </div>

      {/* Add Comment Form */}
      <form
        onSubmit={handleSubmitComment}
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
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Share your thoughts..."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {comment.avatar}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {comment.content}
              </p>

              <div className="flex items-center space-x-4 mt-3">
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Reply
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Like
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
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
