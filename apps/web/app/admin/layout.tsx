import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Botble CMS Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, Admin</span>
              <button className="text-gray-500 hover:text-gray-700">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/admin/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/pages" className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium">
                  Pages
                </a>
              </li>
              <li>
                <a href="/admin/blog/posts" className="block px-3 py-2 text-orange-600 hover:bg-orange-50 rounded font-medium">
                  Blog Posts
                </a>
              </li>
              <li>
                <a href="/admin/system/users" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Users
                </a>
              </li>
              <li>
                <a href="/admin/media" className="block px-3 py-2 text-purple-600 hover:bg-purple-50 rounded font-medium">
                  Media
                </a>
              </li>
              <li>
                <a href="/admin/menus" className="block px-3 py-2 text-green-600 hover:bg-green-50 rounded font-medium">
                  Menus
                </a>
              </li>
              <li>
                <a href="/admin/widgets" className="block px-3 py-2 text-purple-600 hover:bg-purple-50 rounded font-medium">
                  Widgets
                </a>
              </li>
              <li>
                <a href="/admin/themes" className="block px-3 py-2 text-pink-600 hover:bg-pink-50 rounded font-medium">
                  Themes
                </a>
              </li>
              <li>
                <a href="/admin/system" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded font-medium">
                  System
                </a>
              </li>
              <li>
                <a href="/admin/translations" className="block px-3 py-2 text-orange-600 hover:bg-orange-50 rounded font-medium">
                  Translations
                </a>
              </li>
              <li>
                <a href="/admin/system/locales" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Locales
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
