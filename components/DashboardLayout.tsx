'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_MERCHANT' | 'MERCHANT';
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'SUPER_MERCHANT' | 'MERCHANT' | 'ANY';
  fullWidth?: boolean;
}

export default function DashboardLayout({ children, requiredRole = 'ANY', fullWidth = false }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      // Check role authorization
      if (requiredRole !== 'ANY' && parsedUser.role !== requiredRole) {
        // Redirect to appropriate dashboard
        const redirectMap: Record<string, string> = {
          ADMIN: '/admin/dashboard',
          SUPER_MERCHANT: '/super-merchant/dashboard',
          MERCHANT: '/merchant/dashboard',
        };
        router.push(redirectMap[parsedUser.role] || '/auth/login');
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/auth/login');
      return;
    } finally {
      setLoading(false);
    }
  }, [router, requiredRole]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} onCollapseChange={setSidebarCollapsed} />
      <TopNavbar user={user} sidebarCollapsed={sidebarCollapsed} isDesktop={isDesktop} />
      
      <main 
        className="mt-16 p-4 sm:p-6 lg:p-8 transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (sidebarCollapsed ? '80px' : '256px') : '0',
          width: isDesktop ? (sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)') : '100%'
        }}
      >
        {fullWidth ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
