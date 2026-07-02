"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) return null;
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800 pt-16 pb-8 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/techbridge.png" alt="TechBridge Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-xl text-[#0052FF]">TechBridge</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-neutral-500 mb-4 transition-colors duration-200">
              Nationwide tech support, installation, and repair services at your doorstep.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Services</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-neutral-500">
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Computer Repair</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">TV Mounting</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Smart Home</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">WiFi Setup</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-neutral-500">
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Partner</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-neutral-500">
              <li><Link href="/register?role=technician" className="hover:text-[#0052FF] transition-colors">Become a Tech</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">For Business</Link></li>
              <li><Link href="#" className="hover:text-[#0052FF] transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-neutral-600 transition-colors duration-200">
            &copy; {new Date().getFullYear()} TechBridge Support. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-400 dark:text-neutral-600">
            <Link href="#" className="hover:text-gray-600 dark:hover:text-neutral-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-neutral-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
