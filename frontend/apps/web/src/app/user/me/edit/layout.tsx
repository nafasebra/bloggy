import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Update your Bloggy profile information, bio, and social links.',
  robots: { index: false, follow: false },
};

export default function EditProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
