"use client";

import React, { useState, useEffect } from "react";
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
  Star,
  Quote,
  Cloud,
  Briefcase,
  Headphones,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/pagination';

const faqs = [
  {
    question: "What areas do you provide on-site support for?",
    answer: "We offer on-site support across most major metropolitan areas. You can enter your zip code during booking to confirm availability in your specific location."
  },
  {
    question: "How quickly can a technician arrive?",
    answer: "For urgent issues, we offer same-day service. Typically, a technician can be at your door within 2-4 hours of booking, depending on technician availability in your area."
  },
  {
    question: "Do I have to pay if the issue isn't fixed?",
    answer: "No! We have a 'No Fix, No Fee' policy. You only pay when your issue is completely resolved to your satisfaction."
  },
  {
    question: "Are your technicians certified and background-checked?",
    answer: "Absolutely. Every tech goes through a rigorous vetting process, including criminal background checks, skill assessments, and continuous performance reviews."
  },
  {
    question: "Can I get help remotely instead of on-site?",
    answer: "Yes! For software issues, virus removal, and general troubleshooting, our remote support team can help you instantly online without needing a home visit."
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("I need help with...");
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    setMounted(true);

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/top-reviews/`);
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch top reviews", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/categories/`);
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchReviews();
    fetchCategories();
  }, []);

  const getIconForCategory = (name) => {
    if (!name) return Wrench;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('computer') || lowerName.includes('laptop')) return Monitor;
    if (lowerName.includes('network') || lowerName.includes('internet')) return Wifi;
    if (lowerName.includes('smart home')) return HomeIcon;
    if (lowerName.includes('cloud')) return Cloud;
    if (lowerName.includes('cyber') || lowerName.includes('security')) return ShieldCheck;
    if (lowerName.includes('mobile') || lowerName.includes('phone')) return Smartphone;
    if (lowerName.includes('business')) return Briefcase;
    if (lowerName.includes('remote')) return Headphones;
    if (lowerName.includes('audio') || lowerName.includes('video')) return Tv;
    return Wrench;
  };

  const getCategoryHref = (catId) => {
    return `/jobs?category=${catId}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-[#0052FF] selection:text-white transition-colors duration-200">
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
                Professional IT Support for Your <br className="hidden lg:block" />
                <span className="text-[#0052FF]">Home, Business, and Digital Life.</span>
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
                      className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {categories.map((cat) => {
                        const Icon = getIconForCategory(cat.name);
                        return (
                          <Link
                            href={getCategoryHref(cat.id)}
                            key={cat.id}
                            className="flex items-center gap-3 p-4 hover:bg-[#F4F7FC] dark:hover:bg-neutral-800 transition-colors border-b border-gray-100 dark:border-neutral-800 last:border-0"
                          >
                            <Icon className="w-5 h-5 text-[#0052FF]" />
                            <span className="font-medium text-gray-700 dark:text-neutral-300">{cat.name}</span>
                          </Link>
                        );
                      })}
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
              className="w-full lg:w-1/2 relative block mt-12 lg:mt-0"
            >
              <div className="relative w-full max-w-md mx-auto aspect-[3/4] lg:aspect-[4/5] h-auto mt-4 lg:mt-0">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-500/10 rounded-full opacity-50 blur-3xl mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="relative z-10 w-full h-full rounded-3xl shadow-2xl overflow-hidden border-[6px] border-white dark:border-neutral-800 transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <img src="/techbridges.png" alt="TechBridge Support Agent" className="w-full h-full object-cover object-center" />
                </div>
                {/* Floating Badge */}
                <div className="absolute -left-4 md:-left-8 bottom-12 z-20 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-4 flex items-center gap-4 border border-gray-100 dark:border-neutral-800">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">Support Ready</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-neutral-500">Available 24/7</p>
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
              {categories.map((cat) => {
                const Icon = getIconForCategory(cat.name);
                return (
                  <Link
                    href={getCategoryHref(cat.id)}
                    key={cat.id}
                    className="group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-[#0052FF] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#0052FF] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm md:text-base font-bold text-center text-gray-900 dark:text-white transition-colors duration-200">{cat.name}</h3>
                  </Link>
                );
              })}

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
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#1A1F36] dark:text-white transition-colors duration-200">How TechBridge Works</h2>
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

        {/* Customer Reviews Slider */}
        {reviews.length > 0 && (
          <section className="py-24 bg-white dark:bg-black transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#1A1F36] dark:text-white transition-colors duration-200">What Our Customers Say</h2>
                <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors duration-200">Don't just take our word for it. See why thousands trust TechBridge.</p>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="pb-16 pt-6"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id} className="h-auto pb-4">
                    <div className="h-full bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                      <Quote className="absolute top-6 right-6 w-16 h-16 text-gray-50 dark:text-neutral-800/50 -rotate-12" />
                      <div className="flex items-center gap-1 mb-6 relative z-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-neutral-800'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-neutral-300 text-lg italic leading-relaxed mb-8 flex-1 relative z-10">
                        "{review.comment || 'Great service! Highly recommended.'}"
                      </p>
                      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-neutral-800 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl">
                          {review.customer_info?.name?.[0] || review.customer_info?.email?.[0] || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {review.customer_info?.name || review.customer_info?.email?.split('@')[0]}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-neutral-500">
                            Service: <span className="capitalize">{review.category}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}
        {/* FAQ Section */}
        <section className="py-24 bg-[#F4F7FC] dark:bg-neutral-950 transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#1A1F36] dark:text-white transition-colors duration-200">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto transition-colors duration-200">Got questions? We've got answers.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">{faq.question}</span>
                    <div className="ml-4 shrink-0 w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center transition-colors duration-200">
                      {activeFaq === index ? (
                        <Minus className="w-5 h-5 text-[#0052FF]" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#0052FF]" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-gray-600 dark:text-neutral-400 border-t border-gray-100 dark:border-neutral-800 pt-4 transition-colors duration-200">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
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
    </div>
  );
}
