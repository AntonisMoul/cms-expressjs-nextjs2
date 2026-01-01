'use client';

import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">CMS Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, Admin</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-gray-800 min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin"
                  className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/pages"
                  className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded"
                >
                  Pages
                </a>
              </li>
              <li>
                <details className="group">
                  <summary className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer">
                    Blog
                  </summary>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>
                      <a
                        href="/admin/blog/posts"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Posts
                      </a>
                    </li>
                    <li>
                      <a
                        href="/admin/blog/categories"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Categories
                      </a>
                    </li>
                    <li>
                      <a
                        href="/admin/blog/tags"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Tags
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <a
                  href="/admin/media"
                  className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded"
                >
                  Media
                </a>
              </li>
              <li>
                <a
                  href="/admin/menu"
                  className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded"
                >
                  Menus
                </a>
              </li>
              <li>
                <details className="group">
                  <summary className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded cursor-pointer">
                    Appearance
                  </summary>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>
                      <a
                        href="/admin/appearance/menus"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Menus
                      </a>
                    </li>
                    <li>
                      <a
                        href="/admin/appearance/themes"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Themes
                      </a>
                    </li>
                    <li>
                      <a
                        href="/admin/appearance/widgets"
                        className="block px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Widgets
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <a
                  href="/admin/settings"
                  className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded"
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
