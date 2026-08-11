'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function useAuthCheck() {
  const router = useRouter();

  const checkAuthAndExecute = (action: () => void) => {
    const user = localStorage.getItem('electrohub_user');
    if (!user) {
      // If user is not logged in, redirect to login page
      router.push('/login');
      return false;
    }
    action();
    return true;
  };

  return { checkAuthAndExecute };
}