'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianReviews() {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const res = await axios.get(`${apiUrl}/api/tickets/technician-reviews/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">My Reviews</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">See what customers are saying about your work.</p>
        </div>
        
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-6 py-4 flex flex-col items-center shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</span>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">{reviews.length} total reviews</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
              <Star className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews yet</h3>
            <p className="max-w-md">Complete more tickets to start receiving ratings and feedback from your customers!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-neutral-800'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-400 dark:text-neutral-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  <Link href={`/dashboard/technician/ticket/${review.ticket}`} className="hover:text-[#0052FF] transition-colors">
                    Ticket #{review.ticket}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {review.comment ? (
                  <div className="relative">
                    <MessageSquare className="absolute top-0 left-0 w-4 h-4 text-gray-300 dark:text-neutral-700" />
                    <p className="text-gray-600 dark:text-neutral-300 italic text-sm pl-6 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-neutral-500 text-sm italic">
                    No comment provided.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
