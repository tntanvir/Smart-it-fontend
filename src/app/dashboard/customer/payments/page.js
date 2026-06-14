"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, CreditCard, DollarSign, ArrowRight, ShieldCheck, 
  Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerPayments() {
  const { token } = useAuthStore();
  
  // Pending invoices state
  const [pendingTickets, setPendingTickets] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingHasNext, setPendingHasNext] = useState(false);
  const [pendingHasPrev, setPendingHasPrev] = useState(false);

  // Payment History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  
  // URL to get history data
  const historyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payment/history/customer/`;

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/payment-requests/?page=${pendingPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingTickets(response.data.results || response.data);
      setPendingHasNext(!!response.data.next);
      setPendingHasPrev(!!response.data.previous);
    } catch (error) {
      console.error("Failed to fetch pending tickets", error);
    } finally {
      setPendingLoading(false);
    }
  }, [token, pendingPage]);

  const fetchHistory = useCallback(async (page, status) => {
    setHistoryLoading(true);
    try {
      let url = `${historyUrl}?page=${page}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.results || []);
      // Calculate total pages based on count and page size (10)
      if (response.data.count) {
        setTotalItems(response.data.count);
        setTotalPages(Math.ceil(response.data.count / 10));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch payment history", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [token, historyUrl]);

  useEffect(() => {
    if (token) {
      fetchPending();
      fetchHistory(currentPage, statusFilter);
    }
  }, [token, currentPage, statusFilter, fetchPending, fetchHistory]);

  const handleCheckout = async (ticketId) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/checkout/${ticketId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Failed to init checkout", error);
      alert("Failed to initiate secure checkout. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">Completed</span>;
      case 'failed': 
        return <span className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs font-bold uppercase">Failed</span>;
      default: 
        return <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">Payments</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Review your pending invoices and full payment history.</p>
        </div>
      </div>

      <Card className="relative overflow-hidden bg-gradient-to-br from-[#0052FF] to-indigo-700 text-white border-0 mb-8 rounded-3xl shadow-2xl shadow-blue-600/20 group">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2"></div>
        
        <CardContent className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 shrink-0 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tight mb-1 flex items-center gap-2">
                100% Secure Payments
              </h3>
              <p className="text-blue-100/90 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                We use enterprise-grade Stripe encryption to process all payments securely. Your billing info is never stored on our servers.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-100">Powered by</span>
            <span className="font-black text-white">Stripe</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invoices Section */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Pending Invoices</h2>
      {pendingLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#0052FF]" /></div>
      ) : pendingTickets.length === 0 ? (
        <Card className="mb-10 text-center py-12 border-dashed bg-gray-50/50 dark:bg-neutral-900/50">
          <CardContent className="pb-0">
            <h3 className="font-bold text-gray-900 dark:text-white">No pending payments</h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400">You are all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 mb-10">
          {pendingTickets.map(ticket => (
            <Card key={`pending-${ticket.id}`} className="hover:shadow-md transition-all rounded-xl overflow-hidden border-l-4 border-l-yellow-400">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4 w-full sm:w-auto">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl mt-1 transition-colors duration-200">
                    <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">{ticket.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2 transition-colors duration-200">Service completed by technician. Awaiting payment.</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300 transition-colors duration-200">
                      Ticket #{ticket.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 dark:border-neutral-800">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-semibold">Amount Due</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-200">${ticket.budget}</p>
                  </div>
                  <Button 
                    onClick={() => handleCheckout(ticket.id)}
                    className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full shadow-md shadow-blue-500/20"
                  >
                    Pay Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment History Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Payment History</h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to page 1 on filter
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none appearance-none transition-colors duration-200 w-full sm:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-800/50 text-gray-500 dark:text-neutral-400 uppercase font-semibold text-xs transition-colors duration-200">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300 transition-colors duration-200">
              {historyLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0052FF] mx-auto" />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-neutral-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                history.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">
                      #{payment.id}
                      {payment.stripe_checkout_session_id && (
                        <span className="block text-[10px] text-gray-400 truncate w-32" title={payment.stripe_checkout_session_id}>
                          {payment.stripe_checkout_session_id.substring(0, 15)}...
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {payment.ticket_details ? (
                        <div>
                          <Link href={`/dashboard/customer/ticket/${payment.ticket_details.id}`} className="font-medium text-gray-900 dark:text-white hover:text-[#0052FF] dark:hover:text-[#0052FF] transition-colors">
                            {payment.ticket_details.title}
                          </Link>
                          <p className="text-xs text-gray-500 capitalize">{payment.ticket_details.category}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Ticket #{payment.ticket}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                      ${payment.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!historyLoading && totalPages > 1 && (
          <div className="border-t border-gray-100 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-200">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Showing page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

    </DashboardLayout>
  );
}
