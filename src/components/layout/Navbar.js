"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "@/components/layout/NotificationBell";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img src="/techbridge.png" alt="TechBridge Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <span className="font-bold text-lg md:text-2xl tracking-tight text-[#0052FF]">
              TechBridge
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/#services" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Services</Link>
            <Link href="/#how-it-works" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">How it Works</Link>
            <Link href="/products" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Products</Link>
            <Link href="/teams" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Teams</Link>
            <Link href="/jobs" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Jobs</Link>
            <Link href="/support" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Support</Link>
            <Link href="/refund-policy" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Refund Policy</Link>
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-500 dark:text-neutral-400">
              {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
            </button>

            {mounted && isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:pl-3 sm:pr-1 rounded-full sm:border border-transparent sm:border-gray-200 dark:sm:border-neutral-800 hover:border-[#0052FF] transition-colors focus:outline-none"
                  >
                    <span className="text-sm font-semibold hidden sm:block text-gray-700 dark:text-neutral-300">
                      {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {user?.name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50"
                      >
                        <Link
                          href={`/dashboard/${role}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-[#0052FF]"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 text-left"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors hidden md:block">
                  Log In
                </Link>
                <Link href="/register" className="hidden md:block">
                  <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full px-6 py-5 text-sm font-bold shadow-md shadow-blue-500/20">
                    Book an IT Expert
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center ml-2">
              <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 rounded-lg text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none">
                {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-neutral-800 overflow-hidden bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg absolute w-full"
          >
            <nav className="flex flex-col px-4 py-6 space-y-4">
              <Link href="/#services" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Services</Link>
              <Link href="/#how-it-works" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">How it Works</Link>
              <Link href="/products" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Products</Link>
              <Link href="/teams" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Teams</Link>
              <Link href="/jobs" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Jobs</Link>
              <Link href="/support" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Support</Link>
              <Link href="/refund-policy" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Refund Policy</Link>

              {!isAuthenticated ? (
                <div className="pt-4 flex flex-col gap-4 border-t border-gray-100 dark:border-neutral-800">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-800">Log In</Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full bg-[#0052FF] hover:bg-[#0040CC] text-white">Book a Tech</Button>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 flex flex-col gap-4 border-t border-gray-100 dark:border-neutral-800">
                  <Link href={`/dashboard/${role}`} className="w-full">
                    <Button className="w-full bg-[#0052FF] hover:bg-[#0040CC] text-white">Dashboard</Button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileNavOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-500/30 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 font-bold"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
