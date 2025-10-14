import React, { useState } from 'react';
import { CommentWithAuthor } from '@/types';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';

interface CommentCardProps {
  comment: CommentWithAuthor;
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onLike,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const { accessToken } = useAuth();

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(comment._id);
  };

  return (
    <div key={comment._id} className="flex space-x-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-medium">
          {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {comment.author?.name || 'Anonymous'}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {comment.content}
        </p>

        <div className="flex items-center space-x-4 mt-3">
          <button
            onClick={() => setIsReply(!isReply)}
            className={`cursor-pointer text-xs transition-colors ${
              isReply
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Reply
          </button>
          <button
            onClick={handleLike}
            className={`cursor-pointer text-xs ${
              isLiked
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
            } transition-colors flex items-center`}
          >
            <Heart
              className="mr-1"
              size={16}
              fill={isLiked ? 'red' : 'none'}
              color={isLiked ? 'red' : 'currentColor'}
            />
            Like (0)
          </button>
        </div>

        {/* Reply Input */}
        {isReply && (
          <>
            {accessToken ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  className="w-full p-2 border rounded-md text-sm focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs">
                  Reply
                </button>
              </div>
            ) : (
              <div className="text-center mt-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You should be logged in to reply.
                </p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs">
                  Login
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
