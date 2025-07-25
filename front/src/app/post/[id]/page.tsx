import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/CommentSection';

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    content: `
      <p>The landscape of web development is constantly evolving, and 2024 promises to bring some of the most exciting changes yet. From AI-powered development tools to new frameworks and methodologies, developers are witnessing a paradigm shift in how we build for the web.</p>
      
      <h2>The Rise of AI-Powered Development</h2>
      <p>Artificial Intelligence is no longer just a buzzword in the tech industry. In 2024, we're seeing AI tools that can write code, debug applications, and even suggest optimizations. GitHub Copilot and similar tools are becoming indispensable for developers, helping them write better code faster.</p>
      
      <p>These AI assistants are particularly useful for:</p>
      <ul>
        <li>Code completion and suggestions</li>
        <li>Bug detection and fixing</li>
        <li>Code documentation generation</li>
        <li>Performance optimization recommendations</li>
      </ul>
      
      <h2>New Frameworks and Technologies</h2>
      <p>The JavaScript ecosystem continues to grow with new frameworks emerging that focus on performance and developer experience. React 18's concurrent features, Vue 3's Composition API, and the rise of frameworks like Svelte and Solid.js are changing how we think about state management and component architecture.</p>
      
      <h2>Web Components and Micro Frontends</h2>
      <p>Web Components are gaining traction as a way to create reusable, framework-agnostic components. Combined with the micro frontend architecture, teams can now build large applications using different technologies while maintaining consistency and reusability.</p>
      
      <h2>Performance and Core Web Vitals</h2>
      <p>Google's Core Web Vitals continue to be crucial for SEO and user experience. Developers are focusing more than ever on:</p>
      <ul>
        <li>Largest Contentful Paint (LCP)</li>
        <li>First Input Delay (FID)</li>
        <li>Cumulative Layout Shift (CLS)</li>
      </ul>
      
      <p>Tools like Lighthouse, WebPageTest, and Chrome DevTools are essential for monitoring and improving these metrics.</p>
      
      <h2>Conclusion</h2>
      <p>As we move through 2024, web developers need to stay adaptable and continuously learn. The tools and technologies we use today might be obsolete tomorrow, but the fundamental principles of good web development remain the same: create fast, accessible, and user-friendly experiences.</p>
    `,
    author: "Sarah Johnson",
    authorId: 1,
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Technology",
    tags: ["Web Development", "AI", "Frameworks", "Performance"],
    excerpt: "Exploring the latest trends and technologies that are shaping the future of web development, from AI-powered tools to new frameworks and methodologies."
  },
  {
    id: 2,
    title: "Mindful Living: A Beginner's Guide",
    content: `
      <p>In our fast-paced world, finding moments of peace and clarity can seem impossible. However, mindfulness offers a simple yet powerful way to bring awareness and presence into our daily lives.</p>
      
      <h2>What is Mindfulness?</h2>
      <p>Mindfulness is the practice of being fully present in the moment, aware of where we are and what we're doing, without being overly reactive or overwhelmed by what's going on around us.</p>
      
      <h2>Simple Practices to Get Started</h2>
      <p>You don't need to meditate for hours to experience the benefits of mindfulness. Here are some simple practices you can incorporate into your daily routine:</p>
      
      <h3>1. Mindful Breathing</h3>
      <p>Take a few minutes each day to focus on your breath. Sit comfortably, close your eyes, and simply observe your breathing without trying to change it.</p>
      
      <h3>2. Mindful Eating</h3>
      <p>Instead of eating on autopilot, take time to savor each bite. Notice the flavors, textures, and sensations of your food.</p>
      
      <h3>3. Mindful Walking</h3>
      <p>When walking, pay attention to the sensation of your feet touching the ground and the movement of your body.</p>
      
      <h2>The Benefits of Mindfulness</h2>
      <p>Research has shown that regular mindfulness practice can:</p>
      <ul>
        <li>Reduce stress and anxiety</li>
        <li>Improve focus and concentration</li>
        <li>Enhance emotional regulation</li>
        <li>Improve sleep quality</li>
        <li>Increase self-awareness</li>
      </ul>
      
      <h2>Making Mindfulness a Habit</h2>
      <p>Start small with just 5-10 minutes a day. Consistency is more important than duration. You can gradually increase the time as you become more comfortable with the practice.</p>
      
      <h2>Conclusion</h2>
      <p>Mindfulness is a journey, not a destination. Be patient with yourself and remember that every moment of awareness is a step in the right direction.</p>
    `,
    author: "Michael Chen",
    authorId: 2,
    date: "2024-01-14",
    readTime: "8 min read",
    category: "Lifestyle",
    tags: ["Mindfulness", "Meditation", "Wellness", "Mental Health"],
    excerpt: "Discover simple practices to bring mindfulness into your daily routine and improve your well-being through meditation and conscious living."
  }
];

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = blogPosts.find(p => p.id === parseInt(params.id));
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <Link 
                href={`/user/${post.authorId}`}
                className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.author}
              </Link>
              <p className="text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div 
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
} 