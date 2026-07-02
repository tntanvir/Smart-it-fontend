import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-[#0052FF] hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <div className="space-y-6 text-gray-600 dark:text-neutral-300">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">1. General Policy</h2>
          <p>
            At TechBridge Support, we strive to ensure our customers are completely satisfied with our services. If you are not satisfied with the support provided, we offer a straightforward refund policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">2. Eligibility for Refund</h2>
          <p>
            Refunds may be granted under the following circumstances:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The IT issue was not resolved as agreed upon in the service ticket.</li>
            <li>You were charged incorrectly for a service.</li>
            <li>You canceled your service request before a technician began working on it.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">3. Non-Refundable Cases</h2>
          <p>
            Please note that we cannot offer refunds if:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The service was successfully completed and verified by the customer.</li>
            <li>The issue is caused by hardware failure that was diagnosed by our technician (diagnostic fees apply).</li>
            <li>More than 14 days have passed since the service completion date.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">4. Requesting a Refund</h2>
          <p>
            To request a refund, please contact our support team with your ticket number and a detailed explanation of why you are requesting a refund. Our team will review your request within 3-5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
