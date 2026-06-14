"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, CheckCircle2, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianDashboard() {
  const { token } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const [ticketsRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/ticket/accpet/deshboard/?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze/technician/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setTickets(ticketsRes.data.results || ticketsRes.data);
        setHasNext(!!ticketsRes.data.next);
        setHasPrev(!!ticketsRes.data.previous);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTickets();
  }, [token, page]);

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
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
        {label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">My Active Jobs</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Manage the tickets you have accepted.</p>
        </div>
        <Link href="/dashboard/technician/available">
          <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full">
            Find New Jobs
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#0052FF] to-blue-700 text-white border-0 col-span-2 md:col-span-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 font-medium mb-1 text-sm">Active / Accepted</p>
                  <h3 className="text-3xl font-black">{stats.total_accepted}</h3>
                </div>
                <Wrench className="w-6 h-6 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Total Completed</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.total_work_done}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Today's Jobs Completed</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.today_work_done}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">7 Days Jobs Completed</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.seven_days_work_done}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">30 Days Jobs Completed</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.this_month_work_done}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">Total Earned</div>
              <div className="text-3xl font-black text-green-600 dark:text-green-500">${stats.total_money_received?.toFixed(2) || '0.00'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent>
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-[#0052FF]" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">No active jobs</h3>
            <p className="text-gray-500 dark:text-neutral-400 mb-6">Browse available tickets to start earning.</p>
            <Link href="/dashboard/technician/available">
              <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {tickets.map(ticket => (
              <Card key={ticket.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200 flex items-center gap-2">
                      {ticket.title}
                      {getStatusBadge(ticket.status)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2 transition-colors duration-200">{ticket.description}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 px-2 py-1 rounded font-medium capitalize transition-colors duration-200">{ticket.category}</span>
                      <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1"><DollarSign className="w-4 h-4" />{ticket.budget}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href={`/dashboard/technician/ticket/${ticket.id}`} className="w-full md:w-auto">
                      <Button variant="outline" className="w-full">View Details</Button>
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
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Page {page}</span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext || loading}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
