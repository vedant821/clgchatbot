import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Header } from './components/Header';
import { HelpCenterHome } from './components/HelpCenterHome';
import { ChatWidget } from './components/ChatWidget';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseSchemaViewer } from './components/DatabaseSchemaViewer';
import { DEMO_USERS } from './data/mockDatabase';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'help' | 'chat' | 'student' | 'admin' | 'database'>('help');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Alex Johnson, Student
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [chatTriggerQuery, setChatTriggerQuery] = useState<string>('');

  const handleOpenChatWithQuery = (query: string) => {
    setChatTriggerQuery(query);
    if (activeTab !== 'chat') {
      setIsFloatingChatOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header & Role Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenChatWithQuery={handleOpenChatWithQuery}
      />

      {/* Main Viewport Container */}
      <main className="flex-1">
        {activeTab === 'help' && (
          <HelpCenterHome
            currentUser={currentUser}
            onOpenChatWithQuery={handleOpenChatWithQuery}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'chat' && (
          <div className="py-6">
            <ChatWidget
              mode="fullscreen"
              currentUser={currentUser}
              initialQuery={chatTriggerQuery}
              onClearInitialQuery={() => setChatTriggerQuery('')}
            />
          </div>
        )}

        {activeTab === 'student' && (
          <StudentDashboard onAskChatbot={handleOpenChatWithQuery} />
        )}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'database' && <DatabaseSchemaViewer />}
      </main>

      {/* Floating Chatbot Widget (Active on non-chat tabs) */}
      {activeTab !== 'chat' && (
        <>
          {/* Floating trigger button */}
          {!isFloatingChatOpen && (
            <button
              id="floating-chat-trigger-btn"
              onClick={() => setIsFloatingChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-blue-900 via-indigo-900 to-blue-700 hover:scale-105 text-white p-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 transition-all group border border-white/20"
              aria-label="Open AI Help Center Chat"
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <span className="text-xs font-bold tracking-tight pr-1">Ask Campus AI</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                10 Agents
              </span>
            </button>
          )}

          {/* Floating Chat Modal */}
          <ChatWidget
            mode="floating"
            isOpen={isFloatingChatOpen}
            onClose={() => setIsFloatingChatOpen(false)}
            currentUser={currentUser}
            initialQuery={chatTriggerQuery}
            onClearInitialQuery={() => setChatTriggerQuery('')}
          />
        </>
      )}

      {/* Modern Academic Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold font-heading text-base">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>APEX UNIVERSITY</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Autonomous College Help Center equipped with multi-agent orchestration, pgvector RAG
              retrieval, live database tools, and certified anti-hallucination policies.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              System Build v2.8 • NAAC Grade A++ Accredited
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Specialized AI Agents
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => { setActiveTab('chat'); setChatTriggerQuery('What are the cutoff ranks for B.Tech admission?'); }} className="hover:text-white transition-colors">Admissions & Eligibility Agent</button></li>
              <li><button onClick={() => { setActiveTab('chat'); setChatTriggerQuery('What is the attendance condonation policy?'); }} className="hover:text-white transition-colors">Academics & Regulations Agent</button></li>
              <li><button onClick={() => { setActiveTab('chat'); setChatTriggerQuery('Check my fee dues and payment deadline'); }} className="hover:text-white transition-colors">Fees & Finance Agent</button></li>
              <li><button onClick={() => { setActiveTab('chat'); setChatTriggerQuery('What is the highest placement package in CSE?'); }} className="hover:text-white transition-colors">Placement & TPO Cell Agent</button></li>
              <li><button onClick={() => { setActiveTab('chat'); setChatTriggerQuery('Hostel curfew hours and AC room vacancies'); }} className="hover:text-white transition-colors">Hostel & Student Life Agent</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Quick Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveTab('student')} className="hover:text-white transition-colors">Student Timetable & Exams</button></li>
              <li><button onClick={() => setActiveTab('student')} className="hover:text-white transition-colors">Fee Payment & Receipts</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">Admin Console & Telemetry</button></li>
              <li><button onClick={() => setActiveTab('database')} className="hover:text-white transition-colors">PostgreSQL + pgvector DDL</button></li>
              <li><button onClick={() => setActiveTab('help')} className="hover:text-white transition-colors">Department Escalation Directory</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Contact & Emergency
            </h4>
            <div className="flex items-center space-x-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Helpline: +1 (555) 234-8000</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>helpdesk@apex.edu</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>University Circle, Tech Campus, Building 1</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500">
          © 2026 Apex University. All Rights Reserved. Built with React, TypeScript, Express, pgvector, and Google Gemini.
        </div>
      </footer>
    </div>
  );
}
