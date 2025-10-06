import { Book, Users, Zap } from 'lucide-react';

export default function AboutBlog() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Bloggy
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Bloggy is a modern blogging platform designed to connect writers and
            readers from around the world. Share your thoughts, discover new
            perspectives, and build a community through the power of
            storytelling. Whether you're a seasoned author or just starting your
            writing journey, Bloggy provides the tools you need to express
            yourself and engage with like-minded individuals.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Share Stories
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Publish your articles and reach a global audience of readers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Build Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with fellow writers and readers through comments and
                discussions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Get Inspired
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover diverse perspectives and find inspiration in every
                story.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
