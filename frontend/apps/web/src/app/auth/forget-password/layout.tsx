import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Reset your Bloggy account password by entering your registered email address.',
  robots: { index: false, follow: false },
};

export default function ForgetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
