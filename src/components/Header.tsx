import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  PhoneCall,
  ChevronDown,
  Building2,
  Calendar,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockDatabase';

interface HeaderProps {
  activeTab: 'help' | 'chat' | 'student' | 'admin';
  setActiveTab: (tab: 'help' | 'chat' | 'student' | 'admin') => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  onOpenChatWithQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  onOpenChatWithQuery,
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      onOpenChatWithQuery(quickSearchQuery.trim());
      setQuickSearchQuery('');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'parent':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'applicant':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'faculty':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getUserInitials = (user: UserProfile) => {
    if (user.initials) return user.initials;
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar (Black / Dark Slate with Orange Accents) */}
      <div className="bg-slate-950 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-orange-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-1.5"></span>
            JDCOEM Autonomous Campus • DTE Code: 4163
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <a
            href="https://jdcoem.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center space-x-1 text-slate-300 hover:text-orange-400 transition-colors"
          >
            <Globe className="w-3 h-3 text-orange-400" />
            <span>jdcoem.in</span>
          </a>
          <span className="hidden lg:inline text-slate-600">•</span>
          <span className="hidden lg:inline text-slate-300">
            Affiliated to DBATU / RTMNU • NAAC Accredited
          </span>
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          <div className="flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold text-white">Admissions Helpline:</span>
            <span className="text-orange-300 font-mono">+91 9011081548</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div className="hidden sm:flex items-center space-x-1 text-slate-400">
            <span>Location:</span>
            <span className="text-white font-medium">Kalmeshwar Road, Nagpur</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Header (Crisp White + Black + Orange) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & College Identity */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('help')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md border border-orange-500/30 group-hover:border-orange-500 transition-all">
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-orange-500 font-black text-sm tracking-tighter">JD</span>
                <span className="text-[9px] text-white font-bold tracking-widest">COEM</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase font-heading">
                  JD College of Engineering & Management
                </span>
                <span className="hidden sm:inline-block bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                  NAGPUR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center space-x-2">
                <span>Autonomous AI Help Center & Knowledge Base</span>
                <span className="text-slate-300">•</span>
                <span className="text-orange-600 font-semibold">DTE: 4163</span>
              </p>
            </div>
          </div>

          {/* Quick Universal Query Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                placeholder="Ask about MHT-CET cutoffs, fees, bus routes, exams..."
                className="w-full pl-10 pr-20 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
              >
                Ask AI
              </button>
            </form>
          </div>

          {/* User Persona & Role Selector (Clean Typographic Initials Badge - NO DP) */}
          <div className="relative">
            <button
              id="role-selector-toggle-btn"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center space-x-3 p-1.5 pr-3 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
            >
              {/* Profile Avatar Badge: Elegant Initials in Orange/Black, No Image DP */}
              <div className="w-8 h-8 rounded-full bg-slate-950 text-orange-400 flex items-center justify-center font-bold text-xs shadow-xs border border-orange-500/40">
                {getUserInitials(currentUser)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-950">{currentUser.name}</span>
                  <span
                    className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-sm border ${getRoleBadgeColor(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px] font-mono">
                  {currentUser.studentRollNo || currentUser.department || 'JDCOEM User'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-76 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select User Persona
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Switch between Student, Parent, Applicant, Faculty & Admin
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      id={`select-role-${user.role}`}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                        currentUser.id === user.id ? 'bg-orange-50/60 font-semibold' : ''
                      }`}
                    >
                      {/* Initials Badge for demo users - No photo DP */}
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 border border-slate-300">
                        {getUserInitials(user)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {user.name}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1 rounded border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{user.details}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu (Clean, Flat, Black & Orange Theme) */}
        <nav className="flex space-x-1 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none">
          <button
            id="nav-tab-help"
            onClick={() => setActiveTab('help')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'help'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-orange-500" />
            <span>Help Center & Directory</span>
          </button>

          <button
            id="nav-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Agent Chatbot</span>
            <span
              className={`text-[10px] font-black px-1.5 rounded-full ${
                activeTab === 'chat' ? 'bg-slate-950 text-white' : 'bg-orange-100 text-orange-700'
              }`}
            >
              10 Agents
            </span>
          </button>

          <button
            id="nav-tab-student"
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'student'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Student Portal ({currentUser.name === 'Vedant Khade' ? 'Vedant Khade' : currentUser.name})</span>
            {currentUser.role === 'student' && (
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            )}
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'admin'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Admin Console & Analytics</span>
            {currentUser.role === 'admin' && (
              <span className="bg-orange-600 text-white text-[9px] px-1 rounded-sm font-bold">
                ROOT
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
