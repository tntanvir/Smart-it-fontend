"use client";

import React, { useEffect, useState, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, ArrowLeft, Tag, DollarSign, Clock, User as UserIcon, 
  AlertCircle, CheckCircle2, Navigation, MessageSquare, Phone, Star, MapPin
} from 'lucide-react';
import Link from 'next/link';
import TicketChat from '@/components/chat/TicketChat';

export default function TechnicianTicketDetail({ params }) {
  const { id } = use(params);
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [completing, setCompleting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTicket(response.data);
      } catch (err) {
        console.error("Failed to fetch ticket", err);
        setError('Failed to load ticket details or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchTicket();
    }
  }, [token, id]);

  const handleAcceptJob = async () => {
    setAccepting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/ticket/${id}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the ticket
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
    } catch (err) {
      console.error("Failed to accept job", err);
      alert(err.response?.data?.error || "Failed to accept job. Another technician might have claimed it.");
    } finally {
      setAccepting(false);
    }
  };

  const handleCompleteJob = async () => {
    setCompleting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/ticket/${id}/complete/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the ticket
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket(response.data);
    } catch (err) {
      console.error("Failed to complete job", err);
      alert(err.response?.data?.error || "Failed to mark job as complete.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      </DashboardLayout>
    );
  }

  if (error || !ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ticket Not Found</h2>
          <p className="text-gray-500 dark:text-neutral-400 mb-6">{error}</p>
          <Link href="/dashboard/technician">
            <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    let badgeClass = 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300';
    let label = status?.toUpperCase() || 'OPEN';

    if (s === 'completed' || s === 'done') {
      badgeClass = 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
      label = 'DONE';
    } else if (s === 'in_progress') {
      badgeClass = 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
      label = 'IN PROGRESS';
    } else if (s === 'assigned') {
      badgeClass = 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      label = 'ASSIGNED';
    } else if (s === 'pending_confirmation') {
      badgeClass = 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400';
      label = 'PENDING PAYMENT';
    }

    return (
      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
        {label}
      </span>
    );
  };

  const isActiveJob = ticket.status === 'assigned' || ticket.status === 'in_progress';
  const isCompleted = ticket.status === 'done' || ticket.status === 'pending_confirmation';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Link href="/dashboard/technician" className="inline-flex items-center text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Active Jobs
        </Link>
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
          {isActiveJob && (
            <Button 
              onClick={handleCompleteJob}
              disabled={completing}
              className="bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg shadow-green-500/20"
            >
              {completing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              ) : (
                <><CheckCircle2 className="w-5 h-5" /> Mark Job Complete</>
              )}
            </Button>
          )}
          {ticket.status === 'open' && (
            <Button 
              onClick={handleAcceptJob}
              disabled={accepting}
              className="bg-[#0052FF] hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-500/20 px-6"
            >
              {accepting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
              ) : (
                <>Accept Job</>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Issue Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed transition-colors duration-200">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {isCompleted && (
            <Card className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 transition-colors duration-200">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-400 text-lg mb-1">Job Completed</h3>
                  <p className="text-green-700 dark:text-green-500 text-sm">
                    You have successfully marked this job as complete. The customer has been notified to review the work and complete the payment of <strong>${ticket.budget}</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {ticket.review && (
            <Card className="bg-white dark:bg-neutral-900 border-yellow-200 dark:border-yellow-900/50 shadow-sm transition-colors duration-200 mt-6 overflow-hidden">
              <div className="h-2 w-full bg-yellow-400"></div>
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-neutral-800">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 
                  Customer Review
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-5 h-5 ${star <= ticket.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-neutral-800'}`} 
                    />
                  ))}
                </div>
                {ticket.review.comment ? (
                  <div className="relative">
                    <MessageSquare className="absolute top-0 left-0 w-5 h-5 text-gray-200 dark:text-neutral-800" />
                    <p className="text-gray-700 dark:text-neutral-300 italic text-lg leading-relaxed pl-8">
                      "{ticket.review.comment}"
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-neutral-500 italic">No additional comments provided.</p>
                )}
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-6">
                  Reviewed on {new Date(ticket.review.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Chat Component */}
          {ticket.status !== 'open' && (
            <div className="mt-8">
              <TicketChat ticketId={id} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-sm">Category</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white capitalize transition-colors duration-200">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Priority</span>
                </div>
                <span className={`font-semibold capitalize ${ticket.priority === 'high' ? 'text-red-600 dark:text-red-400' : ticket.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'} transition-colors duration-200`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Address</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200 text-right max-w-[60%] line-clamp-2">
                  {ticket.address || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm">Budget</span>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400 text-lg transition-colors duration-200">${ticket.budget}</span>
              </div>
            </CardContent>
          </Card>

          {ticket.customer_info && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Customer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl transition-colors duration-200">
                    {ticket.customer_info.name?.[0] || ticket.customer_info.email?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-200">
                      {ticket.customer_info.name || ticket.customer_info.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-200">Customer</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                    <MessageSquare className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                    <span className="truncate">{ticket.customer_info.email}</span>
                  </div>
                  {ticket.customer_info.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                      <Phone className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                      {ticket.customer_info.phone}
                    </div>
                  )}
                  {ticket.customer_info.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                      <Navigation className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                      {ticket.customer_info.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
