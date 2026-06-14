"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, User as UserIcon, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSettings() {
  const { token, role, user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    skills: '',
    experience_years: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          location: data.location || '',
          skills: data.technician_profile?.skills || '',
          experience_years: data.technician_profile?.experience_years || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Build payload dynamically based on role
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location
      };
      
      if (role === 'technician') {
        payload.skills = formData.skills;
        payload.experience_years = parseInt(formData.experience_years) || 0;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(response.data);
      // Update global user state with new name if needed
      if (user && user.name !== response.data.name) {
        updateUser({ name: response.data.name });
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0052FF]" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors duration-200">Profile Settings</h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-200">Update your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-[#F4F7FC] dark:bg-neutral-800 border-b border-gray-100 dark:border-neutral-700 rounded-t-xl transition-colors duration-200">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <CardDescription>Manage your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form id="profile-form" onSubmit={handleSave} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="name" className="text-gray-700 dark:text-neutral-200 font-bold">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe" 
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-neutral-200 font-bold">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-gray-700 dark:text-neutral-200 font-bold">Location</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA" 
                    />
                  </div>
                </div>

                {role === 'technician' && (
                  <>
                    <div className="h-px bg-gray-100 dark:bg-neutral-800 my-6"></div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="skills" className="text-gray-700 dark:text-neutral-200 font-bold">Professional Skills</Label>
                        <Input 
                          id="skills" 
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          placeholder="e.g. Windows, Networking, Hardware Repair" 
                        />
                        <p className="text-xs text-gray-500 dark:text-neutral-500">Comma separated list of your technical skills.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="experience_years" className="text-gray-700 dark:text-neutral-200 font-bold">Years of Experience</Label>
                        <Input 
                          id="experience_years" 
                          name="experience_years"
                          type="number"
                          min="0"
                          value={formData.experience_years}
                          onChange={handleChange}
                          placeholder="0" 
                        />
                      </div>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-neutral-800 border-t border-gray-100 dark:border-neutral-700 p-6 flex justify-end rounded-b-xl transition-colors duration-200">
              <Button 
                type="submit" 
                form="profile-form"
                disabled={saving}
                className="bg-[#0052FF] hover:bg-[#0040CC] px-8 text-white rounded-full shadow-lg shadow-blue-500/20 font-bold transition-all"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl transition-colors duration-200">
                  {profile?.name?.[0] || profile?.email?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white transition-colors duration-200">{profile?.email}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300 capitalize transition-colors duration-200 mt-1">
                    {profile?.role} Account
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-neutral-800 my-4"></div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 transition-colors duration-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm transition-colors duration-200">Email Verified</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Your account is fully active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
