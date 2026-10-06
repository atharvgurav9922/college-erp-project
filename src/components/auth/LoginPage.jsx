import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_USERS } from '../../data/mockData';
import {
  Sparkles,
  Shield,
  GraduationCap,
  Users,
  BedDouble,
  Bus,
  ArrowRight,
  Lock,
  Mail,
  KeyRound
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, quickLoginAs } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(email, password);
      setIsLoading(false);

      if (res.success && res.user) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        redirectToRole(res.user.role);
      } else {
        addToast(res.message || 'Invalid credentials. Use one-click login below!', 'error');
      }
    } catch (err) {
      setIsLoading(false);
      addToast(err.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    try {
      const user = await quickLoginAs(role);
      setIsLoading(false);
      if (user) {
        addToast(`Logged in as ${user.name} (${role.toUpperCase()})`, 'success');
        redirectToRole(role);
      } else {
        addToast(`Could not authenticate as ${role}`, 'error');
      }
    } catch (err) {
      setIsLoading(false);
      addToast(`Login failed: ${err.message}`, 'error');
    }
  };

  const redirectToRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'faculty':
        navigate('/faculty');
        break;
      case 'student':
        navigate('/student');
        break;
      case 'warden':
        navigate('/hostel');
        break;
      case 'transport':
        navigate('/transport');
        break;
      default:
        navigate('/admin');
    }
  };

  const roleIcons = {
    admin: Shield,
    faculty: Users,
    student: GraduationCap,
    warden: BedDouble,
    transport: Bus
  };

  const roleGradients = {
    admin: 'from-rose-500 to-red-600',
    faculty: 'from-emerald-500 to-teal-600',
    student: 'from-indigo-500 to-blue-600',
    warden: 'from-amber-500 to-orange-600',
    transport: 'from-cyan-500 to-blue-600'
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/25 mb-4 ring-4 ring-indigo-500/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
          CampusPulse ERP
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Next-Generation Integrated University Management System
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Standard Credentials Login Form */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Sign In</h3>
              </div>

              <form onSubmit={handleStandardLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@campus.edu"
                      className="w-full bg-slate-900/90 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/90 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign In with Credentials'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
              <p className="text-xs text-slate-400">
                🔒 Instant mock access — click any role card to login immediately.
              </p>
            </div>
          </div>

          {/* Right Column: 1-Click Role Quick Login Cards */}
          <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">1-Click Demo Login</h3>
                  <p className="text-xs text-slate-400">Select any role to test its specific features</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-300 font-semibold rounded-full border border-indigo-500/30">
                  5 Active Roles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {MOCK_USERS.map((user) => {
                  const Icon = roleIcons[user.role] || Shield;
                  const gradient = roleGradients[user.role] || 'from-indigo-500 to-blue-600';

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickLogin(user.role)}
                      className="text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-200 group flex items-start gap-3 shadow-sm hover:shadow-lg"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                            {user.name}
                          </p>
                        </div>
                        <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide">
                          {user.role === 'warden' ? 'Hostel Warden' : user.role === 'transport' ? 'Transport Mgr' : user.role}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <span>All 5 dashboards communicate with synchronized data</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
