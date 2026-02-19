import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Bloggy profile, view your posts, and track your followers.',
  robots: { index: false, follow: false },
};

export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
