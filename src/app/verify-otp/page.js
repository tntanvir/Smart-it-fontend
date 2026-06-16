"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(defaultEmail);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp/`, {
        email: email,
        otp_code: otpCode,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Verification Successful!</h2>
        <p className="text-gray-500 dark:text-neutral-400 mb-6">Redirecting to login...</p>
        <Link href="/login">
          <Button variant="outline">Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-gray-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:bg-neutral-900">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp_code">OTP Code</Label>
              <Input
                id="otp_code"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                required
                className="text-center tracking-widest text-lg font-bold"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-[#0052FF] hover:bg-blue-700 text-white"
              disabled={isLoading || !email || !otpCode}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group w-fit mx-auto">
          <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-neutral-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium text-gray-500 dark:text-neutral-500">Back to home</span>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-[#0052FF] flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
          Security Check
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}>
          <VerifyOTPForm />
        </Suspense>
      </div>
    </div>
  );
}
