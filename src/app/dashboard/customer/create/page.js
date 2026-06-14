"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

const ticketSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long." }),
  description: z.string().min(10, { message: "Please provide more details." }),
  category: z.string().min(1, { message: "Please select a category." }),
  priority: z.string().min(1, { message: "Please select a priority level." }),
  budget: z.string().min(1, { message: "Please enter an estimated budget." }),
});

export default function CreateTicket() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: 'hardware',
      priority: 'medium',
      budget: '50.00'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/dashboard/customer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Link href="/dashboard/customer" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-neutral-400 hover:text-[#0052FF] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">Create a New Ticket</h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Describe your issue so we can match you with the right expert.</p>
      </div>

      <div className="max-w-3xl">
        <Card className="shadow-xl shadow-blue-500/5 dark:shadow-none">
          <CardHeader className="bg-[#F4F7FC] dark:bg-neutral-800 border-b border-gray-100 dark:border-neutral-700 rounded-t-xl transition-colors duration-200">
            <CardTitle className="text-xl">Ticket Details</CardTitle>
            <CardDescription>All fields are required to process your request.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form id="ticket-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="title" className="text-gray-700 dark:text-neutral-200 font-bold">Issue Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Laptop won't turn on" 
                  className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  {...register('title')} 
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-gray-700 dark:text-neutral-200 font-bold">Category</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200"
                    {...register('category')}
                  >
                    <option value="hardware">Hardware Repair</option>
                    <option value="software">Software Issue</option>
                    <option value="networking">WiFi & Network</option>
                    <option value="general">Other / Not Sure</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="priority" className="text-gray-700 dark:text-neutral-200 font-bold">Priority</Label>
                  <select 
                    id="priority" 
                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200"
                    {...register('priority')}
                  >
                    <option value="low">Low - Whenever possible</option>
                    <option value="medium">Medium - Soon</option>
                    <option value="high">High - Urgent / ASAP</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-gray-700 dark:text-neutral-200 font-bold">Detailed Description</Label>
                <textarea 
                  id="description" 
                  rows="4"
                  placeholder="Please describe exactly what's happening..."
                  className={`flex w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200 ${errors.description ? 'border-red-500' : ''}`}
                  {...register('description')} 
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="budget" className="text-gray-700 dark:text-neutral-200 font-bold">Estimated Budget ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-neutral-400">$</span>
                  <Input 
                    id="budget" 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="50.00" 
                    className={`pl-8 ${errors.budget ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    {...register('budget')} 
                  />
                </div>
                {errors.budget && <p className="text-sm text-red-500">{errors.budget.message}</p>}
                <p className="text-xs text-gray-500 dark:text-neutral-500">This helps us match you with a technician in your price range.</p>
              </div>

            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-neutral-800 border-t border-gray-100 dark:border-neutral-700 p-4 md:p-6 flex justify-end rounded-b-xl transition-colors duration-200">
            <Button 
              type="submit" 
              form="ticket-form"
              className="bg-[#0052FF] hover:bg-[#0040CC] px-8 text-white rounded-full shadow-lg shadow-blue-500/20 font-bold w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Request</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
