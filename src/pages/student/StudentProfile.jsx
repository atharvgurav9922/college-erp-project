import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { UserCheck, Mail, Phone, MapPin, Award, BookOpen, BedDouble, Bus, Save, Shield } from 'lucide-react';

export const StudentProfile = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { addToast } = useToast();

  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 018-4412');
  const [address, setAddress] = useState(currentUser?.address || '452 Elm Street, Maplewood, NJ');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCurrentUser({ phone, address });
    setIsEditing(false);
    addToast('Profile contact information updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Student Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official university identity dossier and personal contact records
        </p>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'}
            alt={currentUser?.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-bold text-slate-900 font-display">{currentUser?.name}</h2>
            <Badge variant="primary">{currentUser?.semester || '6th Semester'}</Badge>
            <Badge variant="success">Active Student</Badge>
          </div>

          <p className="font-mono text-xs sm:text-sm font-bold text-slate-500">
            Roll Number: <span className="text-indigo-600 font-semibold">{currentUser?.rollNumber || '2022-CSE-045'}</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {currentUser?.department || 'Department of Computer Science & Engineering'}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="w-4 h-4 text-indigo-500" />
              {currentUser?.email}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-4 h-4 text-indigo-500" />
              Batch: {currentUser?.batch || '2022 - 2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Academic Information & Contact Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Academic Standings */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-display border-b border-slate-100 pb-3">
            Academic Standings & Allocations
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Cumulative GPA</span>
              <span className="text-lg font-extrabold text-emerald-700 mt-1 block">
                {currentUser?.cgpa || 3.84} / 4.0
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Blood Group</span>
              <span className="text-lg font-extrabold text-slate-800 mt-1 block">
                {currentUser?.bloodGroup || 'O+ve'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 block font-medium">Faculty Academic Mentor</span>
              <span className="font-bold text-slate-800 mt-1 block">
                {currentUser?.mentor || 'Dr. Sarah Jenkins (Dept of CSE)'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 block font-medium flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                Hostel Allotment
              </span>
              <span className="font-bold text-slate-800 mt-1 block">
                {currentUser?.hostelDetails
                  ? `${currentUser.hostelDetails.block}, Room ${currentUser.hostelDetails.roomNo} (${currentUser.hostelDetails.roomType})`
                  : 'Day Scholar (No hostel room allotted)'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
              <span className="text-slate-400 block font-medium flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-cyan-600" />
                Transport Pass
              </span>
              <span className="font-bold text-slate-800 mt-1 block">
                {currentUser?.transportDetails
                  ? `${currentUser.transportDetails.busNo} • ${currentUser.transportDetails.route} • Stop: ${currentUser.transportDetails.stop}`
                  : 'No bus pass registered'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information & Editor */}
        <div className="md:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Contact & Address
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Contact'}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl disabled:bg-slate-100/60 disabled:text-slate-600 focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl disabled:bg-slate-100/60 disabled:text-slate-600 focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full mt-3 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Contact Information
                </button>
              )}
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            For changes to academic registrations or roll numbers, please contact the Registrar Office.
          </div>
        </div>
      </div>
    </div>
  );
};
