"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { token } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze/customer/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setTickets(ticketsRes.data.results || ticketsRes.data);
        setHasNext(!!ticketsRes.data.next);
        setHasPrev(!!ticketsRes.data.previous);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, page]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">My Tickets</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Manage your service requests and track progress.</p>
        </div>
        <Link href="/dashboard/customer/create">
          <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full">
            <Plus className="w-4 h-4 mr-2" /> New Ticket
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Total Posts</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.total_posts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Total Accepted</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.total_accepted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Work Done</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.total_work_done}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Total Spent</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">${stats.total_payments_spent.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {tickets.length === 0 ? (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-[#0052FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">No tickets yet</h3>
                <p className="text-gray-500 dark:text-neutral-400 mb-6">Create your first ticket to get help from an expert.</p>
                <Link href="/dashboard/customer/create">
                  <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white">Create Ticket</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
            <div className="grid gap-4">
              {tickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 shrink-0 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl flex items-center justify-center transition-colors duration-200">
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">{ticket.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 flex flex-wrap items-center gap-2 mt-1 transition-colors duration-200">
                          <span className="capitalize">{ticket.category}</span> • 
                          <span>Budget: ${ticket.budget}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4 sm:gap-6 border-t sm:border-0 border-gray-100 dark:border-neutral-800 pt-4 sm:pt-0">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ticket.status === 'done' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                        ticket.status === 'assigned' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                        ticket.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300'
                      }`}>
                        {ticket.status === 'done' ? 'DONE' : ticket.status === 'assigned' ? 'ASSIGNED' : ticket.status === 'in_progress' ? 'IN PROGRESS' : ticket.status?.toUpperCase() || 'OPEN'}
                      </span>
                      <Link href={`/dashboard/customer/ticket/${ticket.id}`}>
                        <Button variant="outline" size="sm" className="font-semibold text-sm">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {(hasPrev || hasNext) && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!hasPrev || loading}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Page {page}</span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasNext || loading}
                >
                  Next
                </Button>
              </div>
            )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
