import { ReactNode } from 'react';

// Layout for auth pages (login, logout) - no auth check needed
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

