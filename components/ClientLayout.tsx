"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  const hideGlobalNav = [
    '/auth',
    '/dashboard',
    '/merchant',
    '/super-merchant',
    '/admin',
  ].some((p) => pathname.startsWith(p));

  return (
    <>
      {!hideGlobalNav && <Navbar />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      {children}
      {!hideGlobalNav && <Footer />}
    </>
  );
}
