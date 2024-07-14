'use client';

import { AuthProvider } from '@/contexts/authContext';

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}