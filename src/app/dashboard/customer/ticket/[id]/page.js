"use client";

import React, { useEffect, useState, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, ArrowLeft, Tag, DollarSign, Clock, User as UserIcon, 
  AlertCircle, Pencil, Trash2, X, Save, CheckCircle2, AlertTriangle,
  Phone, MapPin, Star, Wrench, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import TicketChat from '@/components/chat/TicketChat';
export default function TicketDetail({ params }) {
  const { id } = use(params);
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Payment state
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const startEditing = () => {
    setEditData({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      budget: ticket.budget,
      address: ticket.address || '',
    });
    setIsEditing(true);
    setSaveError('');
    setSaveSuccess(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTicket(response.data);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.error || err.response?.data?.detail || 'Failed to update ticket.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/dashboard/customer');
    } catch (err) {
      console.error("Failed to delete ticket", err);
      alert(err.response?.data?.error || 'Failed to delete ticket.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/checkout/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Failed to get checkout URL from server.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error("Failed to init checkout", err);
      alert("Failed to initiate secure checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating first.");
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}/review/`, {
        rating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReviewSuccess(true);
      // Update local ticket with new review
      setTicket(prev => ({
        ...prev,
        review: response.data
      }));
    } catch (err) {
      console.error("Failed to submit review", err);
      alert(err.response?.data?.error || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Check if user is the ticket owner
  const isOwner = ticket && user && ticket.user === user.id;
  // Also allow if the customer_info email matches
  const isOwnerByEmail = ticket?.customer_info?.email === user?.email;
  const canEdit = isOwner || isOwnerByEmail;

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
          <Link href="/dashboard/customer">
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
    } else if (s === 'open') {
      badgeClass = 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300';
      label = 'OPEN';
    } else if (s === 'pending_confirmation') {
      badgeClass = 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400';
      label = 'PENDING';
    }

    return (
      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
        {label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete this ticket?</h3>
              <p className="text-gray-500 dark:text-neutral-400 mb-6">
                This action cannot be undone. The ticket <strong className="text-gray-900 dark:text-white">"{ticket.title}"</strong> will be permanently removed.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6"
                >
                  {deleting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="w-4 h-4 mr-2" /> Delete</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Ticket updated successfully!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/customer" className="inline-flex items-center text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">{ticket.title}</h1>
              {getStatusBadge(ticket.status)}
            </div>
            <p className="text-gray-500 dark:text-neutral-400 transition-colors duration-200">
              Ticket #{ticket.id} • Created {new Date(ticket.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {canEdit && ticket.status === 'pending_confirmation' && (
            <Button 
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/20 px-6"
            >
              {checkoutLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><DollarSign className="w-4 h-4" /> Pay ${ticket.budget} Now</>
              )}
            </Button>
          )}
          {canEdit && !isEditing && ticket.status !== 'pending_confirmation' && ticket.status !== 'completed' && ticket.status !== 'done' && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={startEditing}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          )}
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={cancelEditing}
                disabled={saving}
                className="gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="gap-2 bg-[#0052FF] hover:bg-[#0040CC] text-white"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {saveError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Edit Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-gray-700 dark:text-neutral-200">Title</Label>
                  <Input 
                    value={editData.title || ''} 
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    placeholder="Issue title"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-gray-700 dark:text-neutral-200">Description</Label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    rows="6"
                    placeholder="Describe the issue..."
                    className="flex w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700 dark:text-neutral-200">Category</Label>
                    <select
                      value={editData.category || 'hardware'}
                      onChange={(e) => setEditData({...editData, category: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200"
                    >
                      <option value="hardware">Hardware</option>
                      <option value="software">Software</option>
                      <option value="network">Network</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700 dark:text-neutral-200">Priority</Label>
                    <select
                      value={editData.priority || 'medium'}
                      onChange={(e) => setEditData({...editData, priority: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] transition-colors duration-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700 dark:text-neutral-200">Budget ($)</Label>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      value={editData.budget || ''} 
                      onChange={(e) => setEditData({...editData, budget: e.target.value})}
                      placeholder="50.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-gray-700 dark:text-neutral-200">Service Address</Label>
                  <Input 
                    value={editData.address || ''} 
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    placeholder="Full address"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed transition-colors duration-200">
                  {ticket.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          )}

          {ticket.status === 'done' && (
            <Card className="mt-8 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Completed & Paid!</h3>
                <p className="text-gray-600 dark:text-green-200/80 max-w-md mx-auto mb-6">
                  Thank you for using Smart IT. Your ticket has been successfully resolved and payment is confirmed.
                </p>

                {/* Review Section */}
                {!ticket.review && !reviewSuccess ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 text-left mt-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Rate Your Experience</h4>
                    <div className="flex gap-2 mb-6 justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-neutral-700'}`} 
                          />
                        </button>
                      ))}
                    </div>
                    
                    <Label htmlFor="reviewComment" className="text-sm text-gray-600 dark:text-neutral-400 block mb-2">Any additional feedback? (Optional)</Label>
                    <textarea 
                      id="reviewComment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] dark:text-white min-h-[100px] mb-4"
                      placeholder="Tell us what you loved, or what we can improve..."
                    />
                    
                    <Button 
                      onClick={submitReview} 
                      disabled={submittingReview || rating === 0}
                      className="w-full bg-[#0052FF] hover:bg-blue-700 text-white"
                    >
                      {submittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Submit Feedback
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 text-left mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Your Review</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${star <= (ticket.review?.rating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-neutral-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    {(ticket.review?.comment || reviewComment) && (
                      <p className="text-gray-600 dark:text-neutral-400 text-sm mt-3 italic">
                        "{ticket.review?.comment || reviewComment}"
                      </p>
                    )}
                  </div>
                )}
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
              <CardTitle className="text-lg font-bold">Ticket Details</CardTitle>
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
                <span className="font-bold text-gray-900 dark:text-white transition-colors duration-200">${ticket.budget}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-200">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Updated</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-200">
                  {new Date(ticket.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Assigned Technician</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.technician_info ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-100 dark:border-neutral-800 pb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-xl transition-colors duration-200">
                      {ticket.technician_info.first_name?.[0] || ticket.technician_info.name?.[0] || 'T'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white transition-colors duration-200">
                        {ticket.technician_info.first_name || ticket.technician_info.name} {ticket.technician_info.last_name || ''}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-200">{ticket.technician_info.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-1">
                    {ticket.technician_info.phone && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                        <Phone className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                        {ticket.technician_info.phone}
                      </div>
                    )}
                    {ticket.technician_info.location && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                        {ticket.technician_info.location}
                      </div>
                    )}
                    {ticket.technician_info.technician_profile && (
                      <>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {ticket.technician_info.technician_profile.rating}
                          </span>
                          <span className="text-gray-400 text-xs">(Rating)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-300">
                          <Briefcase className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                          {ticket.technician_info.technician_profile.experience_years} years experience
                        </div>
                        {ticket.technician_info.technician_profile.skills && (
                          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-neutral-300">
                            <Wrench className="w-4 h-4 text-gray-400 dark:text-neutral-500 mt-0.5 shrink-0" />
                            <span className="leading-snug">{ticket.technician_info.technician_profile.skills}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-neutral-400 flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 transition-colors duration-200">
                    <UserIcon className="w-6 h-6 text-gray-400 dark:text-neutral-500" />
                  </div>
                  <p className="font-medium">Not assigned yet</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">A technician will be assigned soon</p>
                </div>
              )}
            </CardContent>
          </Card>

          {ticket.customer_info && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Submitted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-lg transition-colors duration-200">
                    {ticket.customer_info.name?.[0] || ticket.customer_info.email?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-200">
                      {ticket.customer_info.name || ticket.customer_info.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-200">{ticket.customer_info.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
