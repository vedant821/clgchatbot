import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';
import { Header } from './components/Header';
import { HelpCenterHome } from './components/HelpCenterHome';
import { ChatWidget } from './components/ChatWidget';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DEMO_USERS } from './data/mockDatabase';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'help' | 'chat' | 'student' | 'admin'>('help');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Vedant Khade, Student
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [chatTriggerQuery, setChatTriggerQuery] = useState<string>('');

  const handleOpenChatWithQuery = (query: string) => {
    setChatTriggerQuery(query);
    if (activeTab !== 'chat') {
      setIsFloatingChatOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
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
      </main>

      {/* Floating Chatbot Widget (Active on non-chat tabs) */}
      {activeTab !== 'chat' && (
        <>
          {/* Floating trigger button (Black + Vibrant Orange Theme) */}
          {!isFloatingChatOpen && (
            <button
              id="floating-chat-trigger-btn"
              onClick={() => setIsFloatingChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-slate-950 hover:bg-slate-900 hover:scale-105 text-white p-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 transition-all group border border-orange-500/40 ring-4 ring-orange-500/10"
              aria-label="Open AI Help Center Chat"
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
              </div>
              <span className="text-xs font-bold tracking-tight pr-1">Ask JDCOEM AI</span>
              <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
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

      {/* Modern Academic Footer (Black Canvas + Crisp White/Orange Details) */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold font-heading text-base">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                JD
              </div>
              <span>JDCOEM NAGPUR</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              JD College of Engineering and Management — Autonomous Engineering & Management Institution
              accredited by NAAC and approved by AICTE New Delhi.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-[10px] text-orange-400 font-mono">
              <span className="bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800/60">DTE Code: 4163</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">DBATU Affiliated</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Specialized AI Agents
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setChatTriggerQuery('What is the MHT-CET cutoff for B.Tech Computer Science at JDCOEM?');
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Admissions & Eligibility Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setChatTriggerQuery('What is the 75% attendance rule and autonomous exam policy?');
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Academics & Regulations Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setChatTriggerQuery('Check my fee balance and due amount for Vedant Khade');
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Fees & Finance Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setChatTriggerQuery('What is the highest placement package in CSE at JDCOEM?');
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Training & Placement (TPO) Agent
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    setChatTriggerQuery('College bus routes and pickup timings from Sitabuldi and Dharampeth');
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Transport & Campus Services Agent
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Direct Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => setActiveTab('student')} className="hover:text-orange-400 transition-colors">
                  Student Portal (Timetable & Exams)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('student')} className="hover:text-orange-400 transition-colors">
                  Fee Payment & Receipts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-orange-400 transition-colors">
                  Admin Management Console
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('help')} className="hover:text-orange-400 transition-colors">
                  Department Directory & Escalations
                </button>
              </li>
              <li>
                <a
                  href="https://jdcoem.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Official Website (jdcoem.in)</span>
                  <Globe className="w-3 h-3 text-orange-400" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Campus Contact
            </h4>
            <div className="flex items-center space-x-2 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Helpline: +91 9011081548 / +91 9011010038</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>info@jdcoem.ac.in / admissions@jdcoem.ac.in</span>
            </div>
            <div className="flex items-start space-x-2 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
              <span>Khandala Valni, Near Hanuman Temple, Kalmeshwar Road, Nagpur - 441501</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 JD College of Engineering and Management (JDCOEM), Nagpur. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://jdcoem.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
              jdcoem.in
            </a>
            <span>•</span>
            <span>DTE Code: 4163</span>
            <span>•</span>
            <span>Autonomous Help Hub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
