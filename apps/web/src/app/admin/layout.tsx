'use client';

import { ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
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

