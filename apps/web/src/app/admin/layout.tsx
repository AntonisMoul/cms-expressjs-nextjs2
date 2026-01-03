import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return false;
    }

    // Verify token by calling /api/v1/auth/me
    // Pass the cookie in the headers since we're in a server component
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `token=${token.value}`,
      },
      cache: 'no-store', // Always fetch fresh
    });

    return response.ok;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Get the current pathname from headers (set by middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Skip auth check for login and logout pages
  // These are in the (auth) route group, but Next.js still applies parent layouts
  if (pathname === '/admin/login' || pathname === '/admin/logout') {
    return <>{children}</>;
  }

  // Verify authentication server-side for all other admin pages
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    // Redirect to login
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h1>CMS Admin</h1>
        </div>
        <ul className="admin-nav-menu">
          <li>
            <a href="/admin">Dashboard</a>
          </li>
          <li>
            <a href="/admin/pages">Pages</a>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
