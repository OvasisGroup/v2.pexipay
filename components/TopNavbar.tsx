'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface TopNavbarProps {
  user: User;
  sidebarCollapsed?: boolean;
  isDesktop?: boolean;
}

export default function TopNavbar({ user, sidebarCollapsed = false, isDesktop = false }: TopNavbarProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const getProfileRoute = () => {
    switch (user.role) {
      case 'ADMIN':
        return '/admin/profile';
      case 'SUPER_MERCHANT':
        return '/super-merchant/profile';
      case 'MERCHANT':
        return '/merchant/profile';
      default:
        return '/profile';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      ADMIN: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      SUPER_MERCHANT: { color: 'bg-blue-100 text-blue-800', label: 'Super Merchant' },
      MERCHANT: { color: 'bg-green-100 text-green-800', label: 'Merchant' },
    };
    return badges[role] || { color: 'bg-gray-100 text-gray-800', label: role };
  };

  const badge = getRoleBadge(user.role);

  return (
    <header 
      className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-10 transition-all duration-300"
      style={{
        left: isDesktop ? (sidebarCollapsed ? '80px' : '256px') : '0'
      }}
    >  <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Search bar - hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search transactions, merchants, users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile spacing */}
        <div className="flex-1 sm:hidden"></div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-4 sm:ml-6">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BellIcon className="w-6 h-6 text-gray-700" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </motion.button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold"
              >
                {getInitials(user.name)}
              </motion.div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block"
              >
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </motion.div>
            </motion.button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        router.push(getProfileRoute());
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 transition flex items-center space-x-3"
                    >
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <span>Profile</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        const settingsRoute = user.role === 'ADMIN' ? '/admin/settings' : 
                                            user.role === 'SUPER_MERCHANT' ? '/super-merchant/settings' : 
                                            '/merchant/settings';
                        router.push(settingsRoute);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 transition flex items-center space-x-3"
                    >
                      <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                      <span>Settings</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        const helpRoute = '/help';
                        router.push(helpRoute);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 transition flex items-center space-x-3"
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5 text-gray-600" />
                      <span>Help & Support</span>
                    </motion.button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 pt-2">
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: '#fef2f2' }}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 transition flex items-center space-x-3"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
