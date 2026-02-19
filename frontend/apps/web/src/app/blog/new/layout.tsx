import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Post',
  description:
    'Write and publish a new blog post on Bloggy. Share your thoughts, stories, and insights with the community.',
  robots: { index: false, follow: false },
};

export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
