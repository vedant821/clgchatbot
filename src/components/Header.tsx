import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  PhoneCall,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  Layers,
  Database,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  Users,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockDatabase';

interface HeaderProps {
  activeTab: 'help' | 'chat' | 'student' | 'admin' | 'database';
  setActiveTab: (tab: 'help' | 'chat' | 'student' | 'admin' | 'database') => void;
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'parent':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'applicant':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'faculty':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Ticker Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            Academic Session 2026-2027 Active
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">
            Fall Mid-Term Examinations begin Oct 18, 2026
          </span>
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          <div className="flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">Emergency Helpline:</span>
            <span className="text-amber-300">+1 (555) 234-8000</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center space-x-1 text-slate-400">
            <span>Accredited:</span>
            <span className="text-white font-medium">NAAC A++ / ABET Tier-1</span>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & University Identity */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('help')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-blue-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                  APEX UNIVERSITY
                </span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  AI AGENTIC
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Autonomous Help Center & Student Knowledge Hub
              </p>
            </div>
          </div>

          {/* Quick Universal Query Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                placeholder="Ask anything (e.g., fee dues, attendance limit, timetable)..."
                className="w-full pl-10 pr-20 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
              >
                Ask AI
              </button>
            </form>
          </div>

          {/* User Persona & Role Selector */}
          <div className="relative">
            <button
              id="role-selector-toggle-btn"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center space-x-3 p-1.5 pr-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-900">{currentUser.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-sm border ${getRoleBadgeColor(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                  {currentUser.studentRollNo || currentUser.department || 'Portal User'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Test role-based context, authorizations & presets
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      id={`select-role-${user.role}`}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                        currentUser.id === user.id ? 'bg-blue-50/60 font-medium' : ''
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
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

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none">
          <button
            id="nav-tab-help"
            onClick={() => setActiveTab('help')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'help'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Help Center Portal</span>
          </button>

          <button
            id="nav-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Agent Chatbot</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 rounded-full">
              10 Agents
            </span>
          </button>

          <button
            id="nav-tab-student"
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'student'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Student Dashboard</span>
            {currentUser.role === 'student' && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Console & Analytics</span>
            {currentUser.role === 'admin' && (
              <span className="bg-rose-500 text-white text-[9px] px-1 rounded-sm font-bold">
                ROOT
              </span>
            )}
          </button>

          <button
            id="nav-tab-database"
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'database'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>PostgreSQL & pgvector Schema</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
