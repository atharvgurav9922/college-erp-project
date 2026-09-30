import React, { useState } from 'react';
import { Menu, RotateCcw, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { INITIAL_ROLES } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ setIsMobileOpen }) => {
  const { currentUser, role, quickLoginAs } = useAuth();
  const { resetToMockData } = useERP();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleSwitch = (roleId) => {
    quickLoginAs(roleId);
    setIsRoleDropdownOpen(false);
    addToast(`Switched view to ${roleId.toUpperCase()} portal`, 'info');
    
    // Redirect to corresponding dashboard
    if (roleId === 'admin') navigate('/admin');
    else if (roleId === 'faculty') navigate('/faculty');
    else if (roleId === 'student') navigate('/student');
    else if (roleId === 'warden') navigate('/hostel');
    else if (roleId === 'transport') navigate('/transport');
  };

  const handleResetData = () => {
    resetToMockData();
    addToast('Demo database reset to initial seed state!', 'success');
  };

  const currentRoleObj = INITIAL_ROLES.find((r) => r.id === role);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Portal:</span>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${currentRoleObj?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
            {currentRoleObj?.name || role}
          </span>
        </div>
      </div>

      {/* Right Section: Quick Role Switcher + Reset + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          title="Reset demo data to initial mock records"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Demo Data</span>
        </button>

        {/* Quick Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Switch Role:</span>
            <span className="capitalize">{role === 'warden' ? 'Warden' : role === 'transport' ? 'Transport' : role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Preview Different Roles
                </div>
                {INITIAL_ROLES.map((r) => {
                  const isSelected = r.id === role;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSwitch(r.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                        {r.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
