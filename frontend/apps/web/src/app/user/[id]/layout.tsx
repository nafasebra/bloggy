import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile',
  description:
    'View this author\'s profile, published posts, and follower activity on Bloggy.',
  openGraph: {
    title: 'User Profile | Bloggy',
    description:
      'View this author\'s profile, published posts, and follower activity on Bloggy.',
  },
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
