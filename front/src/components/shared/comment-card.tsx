import React from 'react';
import { CommentWithAuthor } from '@/types';

interface CommentCardProps {
    comment: CommentWithAuthor;
    onReply?: (commentId: string) => void;
    onLike?: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onReply, onLike }) => {
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

                {/* <div className="flex items-center space-x-4 mt-3">
                    <button 
                        onClick={() => onReply?.(comment._id)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Reply
                    </button>
                    <button 
                        onClick={() => onLike?.(comment._id)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Like
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default CommentCard;