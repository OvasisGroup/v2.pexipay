'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ShieldExclamationIcon,
  ClipboardDocumentListIcon,
  KeyIcon,
  ChartPieIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronLeftIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  role: 'ADMIN' | 'SUPER_MERCHANT' | 'MERCHANT';
  onCollapseChange?: (collapsed: boolean) => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const menuItems: Record<string, MenuItem[]> = {
  ADMIN: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Merchants', href: '/admin/merchants', icon: BuildingStorefrontIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon },
    { name: 'Settlements', href: '/admin/settlements', icon: BanknotesIcon },
    { name: 'KYC Reviews', href: '/admin/kyc', icon: CheckBadgeIcon },
    { name: 'Fraud Cases', href: '/admin/fraud', icon: ShieldExclamationIcon },
    { name: 'Audit Logs', href: '/admin/audit', icon: ClipboardDocumentListIcon },
  ],
  SUPER_MERCHANT: [
    { name: 'Dashboard', href: '/super-merchant/dashboard', icon: ChartBarIcon },
    { name: 'Sub-Merchants', href: '/super-merchant/merchants', icon: BuildingStorefrontIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon },
    { name: 'Settlements', href: '/super-merchant/settlements', icon: BanknotesIcon },
    { name: 'API Keys', href: '/merchant/api-keys', icon: KeyIcon },
    { name: 'API Documentation', href: '/docs/api-documentation', icon: BookOpenIcon },
    { name: 'Reports', href: '/super-merchant/reports', icon: ChartPieIcon },
    { name: 'Settings', href: '/super-merchant/settings', icon: CogIcon },
  ],
  MERCHANT: [
    { name: 'Dashboard', href: '/merchant/dashboard', icon: ChartBarIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon },
    { name: 'Settlements', href: '/merchant/settlements', icon: BanknotesIcon },
    { name: 'API Keys', href: '/merchant/api-keys', icon: KeyIcon },
    { name: 'API Documentation', href: '/docs/api-documentation', icon: BookOpenIcon },
    { name: 'Reports', href: '/merchant/reports', icon: ChartPieIcon },
    { name: 'Test Shop', href: '/test-shop', icon: BuildingStorefrontIcon },
    { name: 'Settings', href: '/merchant/settings', icon: CogIcon },
  ],
};

export default function Sidebar({ role, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });
  const items = menuItems[role] || [];

  // Notify parent of collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  // Close mobile menu on route change
  useEffect(() => {
    if (!isDesktop && mobileOpen) {
      startTransition(() => {
        setMobileOpen(false);
      });
    }
  }, [pathname, isDesktop, mobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: mobileOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6"
        >
          {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (mobileOpen ? 0 : -280),
          width: collapsed ? 80 : 256,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 lg:z-30"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/pexipay.png"
                    alt="PexiPay Logo"
                    width={182}
                    height={52}
                    className="h-10 w-auto"
                    priority
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-8rem)]">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <item.icon className="w-6 h-6 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-gray-500"
              >
                <p className="font-semibold">PexiPay</p>
                <p>v1.0.0</p>
              </motion.div>
            ) : (
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-gray-500 text-center"
              >
                <p>v1.0</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
