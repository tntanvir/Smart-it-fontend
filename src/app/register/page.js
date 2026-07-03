"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^[0-9]+$/, { message: "number not valid" }).min(10, { message: "number not valid" }),
  location: z.string().min(2, { message: "Location is required." }),
  nid_number: z.string().regex(/^[0-9]+$/, { message: "number not valid" }).min(1, { message: "NID Number is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "password not match",
  path: ["confirmPassword"],
});

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'technician' ? 'technician' : 'customer';
  
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const {
    register,
    handleSubmit,
    getValues,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        phone: data.phone,
        location: data.location,
        nid_number: data.nid_number,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }, 3000);
    } catch (err) {
      const errData = err.response?.data;
      if (errData) {
        let hasFieldError = false;
        if (errData.email) {
          const msg = Array.isArray(errData.email) ? errData.email[0] : errData.email;
          setFormError('email', { type: 'server', message: msg.toLowerCase().includes('already exists') ? 'email already exit' : msg });
          hasFieldError = true;
        }
        if (errData.phone) {
          setFormError('phone', { type: 'server', message: 'number not valid' });
          hasFieldError = true;
        }
        if (errData.nid_number) {
          const msg = Array.isArray(errData.nid_number) ? errData.nid_number[0] : errData.nid_number;
          setFormError('nid_number', { type: 'server', message: msg });
          hasFieldError = true;
        }
        
        if (!hasFieldError) {
          if (errData.detail) setError(errData.detail);
          else if (errData.error) setError(errData.error);
          else if (errData.non_field_errors) setError(errData.non_field_errors[0]);
          else setError('Failed to register account. Please check your inputs.');
        }
      } else {
        setError('Network error. Please try again later.');
      }
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
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Registration Successful!</h2>
        <p className="text-gray-500 dark:text-neutral-400 mb-6">Redirecting to OTP verification...</p>
        <Link href={`/verify-otp?email=${encodeURIComponent(getValues('email') || '')}`}>
          <Button variant="outline">Verify Now</Button>
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
          <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white dark:bg-black shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setRole('customer')}
            >
              Customer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'technician' ? 'bg-white dark:bg-black shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
              onClick={() => setRole('technician')}
            >
              Technician
            </button>
          </div>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join TechBridge Support as a {role} today.
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  inputMode="numeric"
                  {...register('phone', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }
                  })} 
                  className={errors.phone ? 'border-red-500' : ''} 
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} className={errors.location ? 'border-red-500' : ''} />
                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nid_number">NID Number</Label>
              <Input 
                id="nid_number" 
                inputMode="numeric"
                {...register('nid_number', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }
                })} 
                className={errors.nid_number ? 'border-red-500' : ''} 
              />
              {errors.nid_number && <p className="text-sm text-red-500">{errors.nid_number.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...register('password')} 
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register('confirmPassword')} 
                  className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button 
              type="submit" 
              className={`w-full mt-6 ${role === 'technician' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-100 dark:border-neutral-800 pt-6">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function RegisterPage() {
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
          Join Us
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
