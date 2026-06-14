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
import { Monitor, ArrowLeft, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`, {
        email: data.email,
        password: data.password,
      });
      
      const { access, refresh, user } = response.data;
      
      login(user, access, refresh, user.role);
      
      if (user.role === 'customer') {
        router.push('/dashboard/customer');
      } else if (user.role === 'technician') {
        router.push('/dashboard/technician');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Invalid email or password.');
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-400 transition-colors duration-200">
          Sign in to your account to continue
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
              <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg mb-4">
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white dark:bg-black shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
                  onClick={() => setRole('customer')}
                >
                  Customer
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'technician' ? 'bg-white dark:bg-black shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
                  onClick={() => setRole('technician')}
                >
                  Technician
                </button>
              </div>
              <CardTitle>Sign in as {role === 'customer' ? 'Customer' : 'Technician'}</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="name@example.com" 
                    {...register('email')}
                    className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register('password')}
                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className={`w-full mt-6 ${role === 'technician' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-4 border-t border-gray-100 dark:border-neutral-800 pt-6">
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Don't have an account?{' '}
                <Link href={`/register?role=${role}`} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Sign up
                </Link>
              </p>
              
              <a 
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/admin/`}
                className="text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-neutral-500 dark:hover:text-indigo-400 transition-colors"
              >
                Login as an Admin
              </a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
