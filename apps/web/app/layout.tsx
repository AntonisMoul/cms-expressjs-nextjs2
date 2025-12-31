import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Botble CMS',
  description: 'Modern CMS built with Next.js and Express.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
