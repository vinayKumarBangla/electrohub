'use client';

import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

export default function HomeAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleProtectedAction = (e: React.MouseEvent) => {
    const user = localStorage.getItem('electrohub_user');
    
    // If user is not logged in, stop their action and redirect to login/register
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      router.push('/login');
    }
  };

  return (
    <div onClickCapture={handleProtectedAction}>
      {children}
    </div>
  );
}