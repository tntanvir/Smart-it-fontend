"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Wifi,
  Smartphone,
  Tv,
  Home as HomeIcon,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Clock,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "@/components/layout/NotificationBell";

const services = [
  { name: "Computers & Printers", icon: Monitor },
  { name: "WiFi & Network", icon: Wifi },
  { name: "Mobile Devices", icon: Smartphone },
  { name: "Audio & Video", icon: Tv },
  { name: "Smart Home", icon: HomeIcon },
  { name: "Home Security", icon: ShieldCheck },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("I need help with...");
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role, logout } = useAuthStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-[#0052FF] selection:text-white transition-colors duration-200">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex-shrink-0 flex items-center gap-1.5 md:gap-2 cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0052FF] flex items-center justify-center">
                <Wrench className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="font-bold text-lg md:text-2xl tracking-tight text-[#0052FF]">
                Smart IT
              </span>
            </Link>



            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#services" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">Services</a>
              <a href="#how-it-works" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">How it Works</a>
              <a href="#benefits" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF] transition-colors">For Business</a>
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
                      Book a Tech
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
                <a href="#services" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">Services</a>
                <a href="#how-it-works" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">How it Works</a>
                <a href="#benefits" onClick={() => setIsMobileNavOpen(false)} className="text-lg font-semibold text-gray-700 dark:text-neutral-300 hover:text-[#0052FF]">For Business</a>

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

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-[#F4F7FC] dark:bg-neutral-950 pt-16 pb-20 lg:pt-24 lg:pb-32 relative z-20 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left pt-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-[#1A1F36] dark:text-white leading-[1.1] transition-colors duration-200"
              >
                In-Home & Online Support for your <br className="hidden lg:block" />
                <span className="text-[#0052FF]">Technology</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-lg md:text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto lg:mx-0 mb-8 font-medium transition-colors duration-200"
              >
                The best tech solution, ready to help you - anytime, anywhere.
              </motion.p>

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative max-w-md mx-auto lg:mx-0 z-30"
              >
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-[#0052FF] transition-colors shadow-sm"
                >
                  <span className="text-gray-600 dark:text-neutral-400 font-medium">{selectedService}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-neutral-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl z-20 overflow-hidden"
                    >
                      {services.map((service, index) => (
                        <Link
                          href="/register?role=customer"
                          key={index}
                          className="flex items-center gap-3 p-4 hover:bg-[#F4F7FC] dark:hover:bg-neutral-800 transition-colors border-b border-gray-100 dark:border-neutral-800 last:border-0"
                        >
                          <service.icon className="w-5 h-5 text-[#0052FF]" />
                          <span className="font-medium text-gray-700 dark:text-neutral-300">{service.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full lg:w-1/2 relative hidden md:block"
            >
              <div className="relative w-full max-w-lg mx-auto aspect-square h-[100vh]">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-500/10 rounded-full opacity-50 blur-3xl mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="relative z-10 w-full h-full bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 flex flex-col p-8 overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6 border-b pb-4 border-gray-100 dark:border-neutral-800">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Tech Arriving Soon</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">Expected in 15 mins</p>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-start justify-start text-left border border-gray-100 dark:border-neutral-700 border-dashed overflow-hidden">
                    <img src="/smartit.png" alt="Smart IT App Preview" className="w-full h-full object-cover object-left-top" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Banner */}
        <div className="bg-[#1A1F36] dark:bg-neutral-950 dark:border-y dark:border-neutral-800 py-4 w-full text-center transition-colors duration-200">
          <div className="text-white font-medium flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-[#0052FF] shrink-0" />
            <span className="text-center">Thousands of Techs Nationwide. 100% Satisfaction Guarantee.</span>
          </div>
        </div>

        {/* Services Grid */}
        <section id="services" className="py-20 bg-white dark:bg-black transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#1A1F36] dark:text-white transition-colors duration-200">What do you need help with?</h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors duration-200">We provide affordable, same-day on-site and online tech support services.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => (
                <Link
                  href="/register?role=customer"
                  key={index}
                  className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-[#0052FF] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <service.icon className="w-10 h-10 md:w-12 md:h-12 text-[#0052FF] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm md:text-base font-bold text-center text-gray-900 dark:text-white transition-colors duration-200">{service.name}</h3>
                </Link>
              ))}

              <Link
                href="/register?role=customer"
                className="col-span-2 md:col-span-1 lg:col-span-2 group flex flex-col sm:flex-row items-center justify-center p-6 md:p-8 rounded-2xl bg-[#F4F7FC] dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-[#0052FF] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 gap-4"
              >
                <div className="text-center sm:text-left">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-200">Don't see your issue?</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1 transition-colors duration-200">Describe it to us and we'll match you with a pro.</p>
                </div>
                <ArrowRight className="w-6 h-6 text-[#0052FF] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 bg-[#F4F7FC] dark:bg-neutral-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#1A1F36] dark:text-white transition-colors duration-200">How Smart IT Works</h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors duration-200">Get your tech fixed in three easy steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 text-center relative pt-12 transition-colors duration-200">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1A1F36] dark:bg-[#0052FF] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">1</div>
                <h3 className="text-xl font-bold mb-3 text-[#1A1F36] dark:text-white transition-colors duration-200">Book Online</h3>
                <p className="text-gray-600 dark:text-neutral-400 transition-colors duration-200">Select your service, describe the issue, and pick a time that works for you.</p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 text-center relative pt-12 transition-colors duration-200">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1A1F36] dark:bg-[#0052FF] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">2</div>
                <h3 className="text-xl font-bold mb-3 text-[#1A1F36] dark:text-white transition-colors duration-200">Tech Arrives</h3>
                <p className="text-gray-600 dark:text-neutral-400 transition-colors duration-200">A vetted, background-checked technician comes to your home or office.</p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 text-center relative pt-12 transition-colors duration-200">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1A1F36] dark:bg-[#0052FF] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">3</div>
                <h3 className="text-xl font-bold mb-3 text-[#1A1F36] dark:text-white transition-colors duration-200">Problem Solved</h3>
                <p className="text-gray-600 dark:text-neutral-400 transition-colors duration-200">Your tech is fixed. You only pay when the job is completely done.</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/register">
                <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-blue-500/20 w-full sm:w-auto">
                  Book Service Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Technician CTA */}
        <section className="py-20 bg-[#1A1F36] dark:bg-neutral-950 dark:border-y dark:border-neutral-800 text-white transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Wrench className="w-12 h-12 text-[#0052FF] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Are you a tech professional?</h2>
            <p className="text-xl text-gray-300 dark:text-neutral-400 max-w-2xl mx-auto mb-8">Join our network of verified technicians, set your own schedule, and earn money fixing tech.</p>
            <Link href="/register?role=technician">
              <Button className="bg-white hover:bg-gray-100 text-[#1A1F36] rounded-full px-8 py-6 text-lg font-bold shadow-lg w-full sm:w-auto">
                Apply to be a Tech
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800 pt-16 pb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-[#0052FF]">Smart IT</span>
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
              &copy; {new Date().getFullYear()} Smart IT Support. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400 dark:text-neutral-600">
              <Link href="#" className="hover:text-gray-600 dark:hover:text-neutral-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-600 dark:hover:text-neutral-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
