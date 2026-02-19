import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Update your Bloggy account password to keep your account secure.',
  robots: { index: false, follow: false },
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
