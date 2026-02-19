import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Wrapper from '@/components/wrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Bloggy - Modern Blog Platform',
    template: '%s | Bloggy',
  },
  description:
    'A modern blog platform for sharing stories and connecting with readers.',
  keywords: ['blog', 'writing', 'stories', 'community', 'articles', 'readers'],
  authors: [{ name: 'Bloggy' }],
  creator: 'Bloggy',
  openGraph: {
    type: 'website',
    siteName: 'Bloggy',
    title: 'Bloggy - Modern Blog Platform',
    description:
      'A modern blog platform for sharing stories and connecting with readers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloggy - Modern Blog Platform',
    description:
      'A modern blog platform for sharing stories and connecting with readers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
