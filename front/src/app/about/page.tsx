import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Bloggy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              An open-source blogging platform built with modern technologies. Bloggy is more than just a project - 
              it&apos;s a collaborative effort where developers contribute, learn, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We believe in the power of open-source collaboration. Our mission is to create a modern, accessible blogging platform 
                that developers can learn from, contribute to, and use in their own projects. Whether you&apos;re a seasoned developer 
                or just starting your coding journey, Bloggy provides a real-world example of full-stack development.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We&apos;re committed to fostering a community where developers can collaborate, learn from each other, 
                and build something meaningful together.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Empowering Developers</h3>
                <p className="text-blue-100">
                  Every contribution matters. Every line of code counts. Every developer has a place here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core principles guide everything we do and every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Trust & Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your content and data are protected with enterprise-grade security. We believe in transparency and always put your privacy first.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We&apos;re building more than a platform - we&apos;re building a community where developers support and inspire each other.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We constantly push the boundaries of what&apos;s possible, creating tools that make development effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We use cutting-edge technologies to deliver the best experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Next.js 14</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">React Framework</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">NestJS</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Backend Framework</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">MongoDB</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Database</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">TypeScript</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Type Safety</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Contribute?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of developers who are already contributing to Bloggy. 
              Start coding, learning, and growing together.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://github.com/yourusername/bloggy"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View on GitHub
            </Link>
            <Link
              href="https://github.com/yourusername/bloggy/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contribute
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 