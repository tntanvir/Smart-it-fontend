"use client";

import React, { useEffect, useState, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, ArrowLeft, Tag, DollarSign, Clock, User as UserIcon, 
  AlertCircle, MapPin, Navigation, ArrowRight, Wrench
} from 'lucide-react';
import Link from 'next/link';

export default function PublicJobDetailPage({ params }) {
  const { id } = use(params);
  const { token, isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/public-jobs/${id}/`);
        setTicket(response.data);
      } catch (err) {
        console.error("Failed to fetch ticket", err);
        setError('Failed to load job details or it is no longer available.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const handleAcceptJob = async () => {
    if (!isAuthenticated || role !== 'technician') {
      alert("You need to register as a technician to accept jobs.");
      router.push('/register?role=technician');
      return;
    }

    setAcceptingId(id);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/ticket/${id}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/dashboard/technician');
    } catch (err) {
      console.error("Failed to accept job", err);
      alert(err.response?.data?.error || "Failed to accept job. Another technician might have claimed it or you are not authorized.");
    } finally {
      setAcceptingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    return (
      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
        AVAILABLE
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
        <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-[#0052FF]">Smart IT</span>
            </Link>
          </div>
        </header>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
        <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-[#0052FF]">Smart IT</span>
            </Link>
          </div>
        </header>
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
          <p className="text-gray-500 dark:text-neutral-400 mb-6">{error}</p>
          <Link href="/jobs">
            <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/techbridge.png" alt="TechBridge Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl text-[#0052FF]">TechBridge</span>
          </Link>
          <Link href="/jobs" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">{ticket.title}</h1>
                {getStatusBadge(ticket.status)}
              </div>
              <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">
                Ticket #{ticket.id} • Posted on {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                onClick={handleAcceptJob} 
                disabled={acceptingId === id}
                className="bg-[#0052FF] hover:bg-[#0040CC] text-white shadow-lg shadow-blue-500/20 rounded-full px-6 py-5 w-full md:w-auto text-base font-bold"
              >
                {acceptingId === id ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Accepting...</>
                ) : (
                  <>Accept Job <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-gray-200 dark:border-neutral-800 shadow-sm dark:bg-neutral-900">
              <CardHeader className="border-b border-gray-100 dark:border-neutral-800 pb-4">
                <CardTitle className="text-lg">Problem Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Ticket Details */}
            <Card className="border-gray-200 dark:border-neutral-800 shadow-sm dark:bg-neutral-900">
              <CardHeader className="border-b border-gray-100 dark:border-neutral-800 pb-4">
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{ticket.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0 mt-1">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">Priority</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{ticket.priority}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0 mt-1">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">Budget</p>
                    <p className="font-black text-xl text-green-600 dark:text-green-400">${ticket.budget}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {ticket.address ? ticket.address : <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                    {ticket.address && (
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(ticket.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-[#0052FF] hover:underline mt-1"
                      >
                        <Navigation className="w-3 h-3 mr-1" /> View on map
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info Snippet */}
            <Card className="border-gray-200 dark:border-neutral-800 shadow-sm dark:bg-neutral-900">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold text-xl shrink-0">
                  {ticket.customer_info?.name?.[0] || 'C'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-bold text-gray-900 dark:text-white">{ticket.customer_info?.name}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
