"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  category: string;
}

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Convert tags string to array
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const postData = {
        ...data,
        tags: tagsArray,
      };

      console.log(postData);
      // API call would go here
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="shadow-lg rounded-lg overflow-hidden max-w-4xl w-full mx-4 bg-white dark:bg-gray-800">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Create New Post
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Share your thoughts with the world
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your post title"
                  {...register("title", {
                    required: "Title is required",
                  })}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Brief summary of your post"
                  {...register("excerpt", {
                    required: "Excerpt is required",
                  })}
                />
                {errors.excerpt && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Write your post content here..."
                  {...register("content", {
                    required: "Content is required",
                  })}
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Technology, Lifestyle"
                    {...register("category", {
                      required: "Category is required",
                    })}
                  />
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="javascript, react, web-development"
                    {...register("tags", {
                      required: "At least one tag is required",
                    })}
                  />
                  {errors.tags && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.tags.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Separate tags with commas
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Post..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}