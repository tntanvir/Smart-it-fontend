"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ListChecks, DollarSign, MapPin, AlertCircle, ArrowRight, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AvailableTickets() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  // Filter state
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [address, setAddress] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const fetchAvailableTickets = async () => {
    setLoading(true);
    try {
      let queryUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/technician/tickets/available/?page=${page}`;
      if (category !== 'all') queryUrl += `&category=${category}`;
      if (priority !== 'all') queryUrl += `&priority=${priority}`;
      if (address) queryUrl += `&address=${encodeURIComponent(address)}`;
      if (minBudget) queryUrl += `&min_budget=${minBudget}`;
      if (maxBudget) queryUrl += `&max_budget=${maxBudget}`;

      const response = await axios.get(queryUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data.results || response.data);
      setHasNext(!!response.data.next);
      setHasPrev(!!response.data.previous);
    } catch (error) {
      console.error("Failed to fetch available tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAvailableTickets();
  }, [token, category, priority, address, minBudget, maxBudget, page]);

  const handleAcceptTicket = async (ticketId) => {
    setAcceptingId(ticketId);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/technician/ticket/${ticketId}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/dashboard/technician');
    } catch (error) {
      console.error("Failed to accept ticket", error);
      alert("Failed to accept ticket. Another technician might have claimed it.");
      setAcceptingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">Available Jobs</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Browse open support requests and claim them.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="mb-8 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs text-gray-500 dark:text-neutral-400">Category</Label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              >
                <option value="all">All Categories</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Network & WiFi</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs text-gray-500 dark:text-neutral-400">Priority</Label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs text-gray-500 dark:text-neutral-400">Address / Location</Label>
              <Input 
                type="text" 
                placeholder="Search location" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 focus-visible:ring-[#0052FF]"
              />
            </div>

            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs text-gray-500 dark:text-neutral-400">Min Budget ($)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 focus-visible:ring-[#0052FF]"
              />
            </div>

            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs text-gray-500 dark:text-neutral-400">Max Budget ($)</Label>
              <Input 
                type="number" 
                placeholder="500" 
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 focus-visible:ring-[#0052FF]"
              />
            </div>

            <Button 
              onClick={fetchAvailableTickets}
              className="bg-[#0052FF] hover:bg-blue-700 text-white h-10 px-6 w-full md:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1F36] dark:bg-neutral-900 text-white border-0 dark:border dark:border-neutral-800 mb-8 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/10">
        <CardContent className="p-4 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <ListChecks className="w-8 h-8 text-[#0052FF]" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Find Your Next Job</h3>
              <p className="text-blue-100 dark:text-neutral-400 mt-1">Accepting a ticket binds it to your account immediately.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">No jobs available right now</h3>
            <p className="text-gray-500 dark:text-neutral-400">Check back later when customers submit new tickets.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Open Requests ({tickets.length})</h2>
          {tickets.map(ticket => (
            <Card key={ticket.id} className="hover:shadow-md transition-all rounded-xl overflow-hidden">
              <div className="h-1 w-full bg-[#0052FF]"></div>
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 w-full md:w-auto">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3 line-clamp-2 max-w-2xl transition-colors duration-200">{ticket.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300 capitalize transition-colors duration-200">
                        {ticket.category}
                      </span>
                      {ticket.address && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 transition-colors duration-200">
                          <MapPin className="w-3 h-3 mr-1" /> {ticket.address}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold capitalize ${
                        ticket.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-neutral-800 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-semibold">Budget</p>
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">${ticket.budget}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Link href={`/dashboard/technician/ticket/${ticket.id}`}>
                      <Button variant="outline" className="text-[#0052FF] border-[#0052FF] hover:bg-blue-50 dark:hover:bg-[#0052FF]/10 rounded-full h-10 px-4">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleAcceptTicket(ticket.id)}
                      disabled={acceptingId === ticket.id}
                      className="bg-[#0052FF] hover:bg-[#0040CC] text-white rounded-full shadow-md shadow-blue-500/20 h-10 px-4"
                    >
                      {acceptingId === ticket.id ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Accepting...</>
                      ) : (
                        <>Accept Job <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
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
        </div>
      )}
    </DashboardLayout>
  );
}
