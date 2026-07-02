"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import NotificationBell from './NotificationBell';
import { 
  LayoutDashboard, 
  TicketPlus, 
  CreditCard, 
  Settings, 
  LogOut, 
  ListChecks,
  Wrench,
  MessageSquare,
  Sun,
  Moon,
  User,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function DashboardLayout({ children }) {
  const { user, role, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted || !isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const customerLinks = [
    { name: 'Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'Create Ticket', href: '/dashboard/customer/create', icon: TicketPlus },
    { name: 'Payments', href: '/dashboard/customer/payments', icon: CreditCard },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
    { name: 'Support', href: '/support', icon: MessageSquare },
  ];

  const technicianLinks = [
    { name: 'My Tickets', href: '/dashboard/technician', icon: LayoutDashboard },
    { name: 'Available Tickets', href: '/dashboard/technician/available', icon: ListChecks },
    { name: 'My Reviews', href: '/dashboard/technician/reviews', icon: Star },
    { name: 'Earnings', href: '/dashboard/technician/earnings', icon: CreditCard },
    { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
    { name: 'Support', href: '/support', icon: MessageSquare },
  ];

  const links = role === 'technician' ? technicianLinks : customerLinks;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex transition-colors duration-200">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 
        flex flex-col fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/techbridge.png" alt="TechBridge Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-[#0052FF]">TechBridge</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="flex items-center justify-between px-2 mb-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
              {role === 'technician' ? 'Technician Portal' : 'Customer Portal'}
            </p>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-[#F4F7FC] dark:hover:bg-neutral-800 hover:text-[#0052FF] dark:hover:text-[#0052FF] transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold uppercase">
              {user?.email ? user.email.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-500 capitalize">{role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Optional Breadcrumbs or Page Title could go here */}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell />
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-neutral-300 shadow-sm border border-transparent dark:border-neutral-800">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
