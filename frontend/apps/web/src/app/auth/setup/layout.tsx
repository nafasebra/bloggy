import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup Profile',
  description:
    'Complete your Bloggy profile setup to personalize your account and connect with readers.',
  robots: { index: false, follow: false },
};

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
