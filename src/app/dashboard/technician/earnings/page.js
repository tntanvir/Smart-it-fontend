"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, DollarSign, Wallet, 
  Filter, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TechnicianEarnings() {
  const { token } = useAuthStore();
  
  // Earnings History state
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  
  // URL to get history data
  const historyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payment/history/technician/`;

  const fetchHistory = useCallback(async (page, status) => {
    setLoading(true);
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
        setTotalPages(Math.ceil(response.data.count / 10));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch earnings history", error);
    } finally {
      setLoading(false);
    }
  }, [token, historyUrl]);

  useEffect(() => {
    if (token) {
      fetchHistory(currentPage, statusFilter);
    }
  }, [token, currentPage, statusFilter, fetchHistory]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase flex items-center w-max gap-1"><CheckCircle2 className="w-3 h-3"/> Paid</span>;
      case 'failed': 
        return <span className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs font-bold uppercase flex items-center w-max gap-1"><XCircle className="w-3 h-3"/> Failed</span>;
      default: 
        return <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded text-xs font-bold uppercase flex items-center w-max gap-1"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  // Calculate page total (Completed)
  const pageTotal = history.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">Earnings</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Track your income from completed jobs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white border-0 shadow-xl shadow-green-900/10 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 font-medium mb-1">Page Earnings (Completed)</p>
                <h3 className="text-4xl font-black">${pageTotal.toFixed(2)}</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1F36] dark:bg-neutral-900 text-white border-0 dark:border dark:border-neutral-800 shadow-xl shadow-blue-900/10 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 dark:text-neutral-400 font-medium mb-1">Payout Status</p>
                <h3 className="text-2xl font-bold">Automatic</h3>
                <p className="text-sm text-blue-200 dark:text-neutral-500 mt-2">Funds are processed securely via Stripe.</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#0052FF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Transactions</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0052FF] outline-none appearance-none transition-colors duration-200"
            >
              <option value="">All Transactions</option>
              <option value="completed">Paid (Completed)</option>
              <option value="pending">Pending Payment</option>
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
                <th className="px-6 py-4">Ticket Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300 transition-colors duration-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0052FF] mx-auto" />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-neutral-400">
                    No transactions found matching your criteria.
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
                          <Link href={`/dashboard/technician/ticket/${payment.ticket_details.id}`} className="font-medium text-gray-900 dark:text-white hover:text-[#0052FF] dark:hover:text-[#0052FF] transition-colors">
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
        {!loading && totalPages > 1 && (
          <div className="border-t border-gray-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between transition-colors duration-200">
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
