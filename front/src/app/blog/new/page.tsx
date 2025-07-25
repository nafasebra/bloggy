'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogPostForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  readTime: string;
}

const categories = [
  "Technology",
  "Lifestyle",
  "Food",
  "Travel",
  "Health",
  "Business",
  "Creative",
  "Education",
  "Entertainment",
  "Sports"
];

export default function NewBlogPost() {
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    readTime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Here you would typically send the data to your backend
    console.log('Blog post data:', formData);
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData(prev => ({
      ...prev,
      content,
      readTime: calculateReadTime(content).toString()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Post
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Share your thoughts and ideas with the community
              </p>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Form Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setIsPreview(false)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  !isPreview
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setIsPreview(true)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isPreview
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {!isPreview ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your post title..."
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Write a brief summary of your post..."
                  required
                />
              </div>

              {/* Category and Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter tags separated by commas..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Separate tags with commas (e.g., "Web Development, AI, Frameworks")
                </p>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleContentChange}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
                  placeholder="Write your blog post content here..."
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.content.length} characters
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ~{Math.ceil(formData.content.length / 5)} words
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          ) : (
            /* Preview Mode */
            <div className="p-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {formData.title || 'Your Post Title'}
                </h1>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span>{formData.category || 'Category'}</span>
                  <span>•</span>
                  <span>{formData.readTime || '0'} min read</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {formData.excerpt && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {formData.excerpt}
                    </p>
                  </div>
                )}

                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {formData.content || 'Your content will appear here...'}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button
                  onClick={() => setIsPreview(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 