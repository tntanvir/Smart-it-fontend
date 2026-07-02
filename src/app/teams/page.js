"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, GraduationCap, Wrench, Phone } from "lucide-react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    id: 1,
    name: "Fa Mim Fozle Rabbi",
    location: "Dhaka",
    university: "Northern University Bangladesh",
    phone: "01701574246",
    image: "/image/Fa Mim Fozle Rabbi .jpeg",
  },
  {
    id: 2,
    name: "Bilash Chandra Sarker",
    location: "Dinajpur",
    university: "Northern University Bangladesh",
    phone: "01860386568",
    image: "/image/Bilash Chandra Sarker.jpeg",
  },
  {
    id: 3,
    name: "Md. Mahidur Rahman",
    location: "Narayanganj, Dhaka",
    university: "Northern University Bangladesh",
    phone: "01871307265",
    image: "/image/Mahidur Rahman.jpeg",
  }
];

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200">
      <main className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4"
          >
            Meet Our <span className="text-[#0052FF]">Expert Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Dedicated professionals committed to providing you with the best IT support experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-square w-full overflow-hidden relative bg-gray-100 dark:bg-neutral-800">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="w-5 h-5 mr-3 text-[#0052FF]" />
                  <span className="font-medium text-[15px]">{member.location}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <GraduationCap className="w-5 h-5 mr-3 text-[#0052FF]" />
                  <span className="font-medium text-[15px]">{member.university}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5 mr-3 text-[#0052FF]" />
                  <span className="font-medium text-[15px]">{member.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

    </div>
  );
}
