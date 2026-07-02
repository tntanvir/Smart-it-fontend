import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Products() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center text-[#0052FF] hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-6">Products</h1>
      <p className="text-gray-600 dark:text-neutral-400">
        Products page coming soon.
      </p>
    </div>
  );
}
