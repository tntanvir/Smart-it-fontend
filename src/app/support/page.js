"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, LifeBuoy, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Define schema dynamically based on auth status
  const supportSchema = z.object({
    email: isAuthenticated ? z.string().optional() : z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters long." }),
    body: z.string().min(10, { message: "Please provide more details in the message body." }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const headers = isAuthenticated ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/support/`, {
        email: data.email,
        subject: data.subject,
        body: data.body,
      }, { headers });
      
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group w-fit mx-auto">
          <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-neutral-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium text-gray-500 dark:text-neutral-500">Back to home</span>
        </Link>
        
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
            <LifeBuoy className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
          Contact Support
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-400 transition-colors duration-200">
          We're here to help. Send us a message!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-gray-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:bg-neutral-900">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-neutral-400 mb-6">
                    Thank you for reaching out. We will respond to you as soon as possible.
                  </p>
                  <Button 
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20">
                      {error}
                    </div>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        {...register('email')}
                        className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      type="text" 
                      placeholder="How can we help you?" 
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Message</Label>
                    <textarea 
                      id="body" 
                      rows="5"
                      placeholder="Please describe your issue or question in detail..." 
                      {...register('body')}
                      className={`flex w-full rounded-md border bg-white dark:bg-neutral-950 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] dark:text-white ${errors.body ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-neutral-700'}`}
                    />
                    {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-[#0052FF] hover:bg-[#0040CC] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            {!isAuthenticated && !success && (
              <CardFooter className="flex flex-col justify-center gap-4 border-t border-gray-100 dark:border-neutral-800 pt-6">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-[#0052FF] hover:text-[#0040CC]">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
