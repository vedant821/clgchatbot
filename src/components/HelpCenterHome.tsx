import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bot,
  GraduationCap,
  BookOpen,
  CreditCard,
  FileText,
  Award,
  Briefcase,
  Home,
  Library,
  Calendar,
  HeartHandshake,
  ArrowRight,
  HelpCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  Bus,
} from 'lucide-react';
import { AgentMetadata, Department, FaqItem, NoticeItem, UserProfile } from '../types';
import { AGENT_REGISTRY, DEPARTMENTS, FAQ_ITEMS, NOTICES } from '../data/mockDatabase';

interface HelpCenterHomeProps {
  currentUser: UserProfile;
  onOpenChatWithQuery: (query: string) => void;
  onNavigateTab: (tab: 'help' | 'chat' | 'student' | 'admin') => void;
}

export const HelpCenterHome: React.FC<HelpCenterHomeProps> = ({
  currentUser,
  onOpenChatWithQuery,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenChatWithQuery(searchQuery.trim());
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'admission':
        return <GraduationCap className="w-5 h-5 text-orange-600" />;
      case 'academics':
        return <BookOpen className="w-5 h-5 text-slate-900" />;
      case 'fees':
        return <CreditCard className="w-5 h-5 text-orange-600" />;
      case 'exams':
        return <FileText className="w-5 h-5 text-slate-900" />;
      case 'scholarships':
        return <Award className="w-5 h-5 text-orange-600" />;
      case 'placements':
        return <Briefcase className="w-5 h-5 text-slate-900" />;
      case 'hostel':
        return <Home className="w-5 h-5 text-orange-600" />;
      case 'library':
        return <Library className="w-5 h-5 text-slate-900" />;
      case 'events':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'student_services':
        return <HeartHandshake className="w-5 h-5 text-slate-900" />;
      default:
        return <Bot className="w-5 h-5 text-orange-600" />;
    }
  };

  const categories = ['All', 'Admissions', 'Academics', 'Fees', 'Placements', 'Transport', 'Hostel'];
  const filteredFaqs =
    selectedFaqCategory === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category.toLowerCase() === selectedFaqCategory.toLowerCase());

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section: Black Canvas + Crisp Typography + Orange Accents */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-orange-950/70 border border-orange-700/60 px-3.5 py-1 rounded-full text-xs font-semibold text-orange-300">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>JDCOEM Autonomous Campus • 10 Specialized Help AI Agents</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-heading text-white">
            How Can We Assist You at <span className="text-orange-500">JDCOEM</span> Today?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get instant, verified guidance for JD College of Engineering and Management, Nagpur. Backed by official autonomous regulations, verified fee schedules, MHT-CET admissions, and campus bus routes.
          </p>

          {/* AI Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-white p-2 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about MHT-CET cutoff, semester fees, bus routes, exam rules..."
                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-slate-950 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 shrink-0"
              >
                <span>Ask AI Agent</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </form>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Queries:</span>
            {[
              'Check fee balance for JD-2023-CSE-042',
              'MHT-CET cutoff for Computer Science & Engineering',
              '75% minimum attendance rule for Autonomous exams',
              'Highest placement package at JDCOEM (TPO)',
              'College bus timings from Sitabuldi & Dharampeth',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => onOpenChatWithQuery(q)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-orange-300 px-3 py-1 rounded-full border border-slate-700 transition-colors text-[11px] font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Specialized Agent Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight font-heading">
                Specialized JDCOEM AI Agents
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Each agent is grounded in official JDCOEM autonomous bylaws, verified syllabus, and student services.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('chat')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>Open Autonomous Chat Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {AGENT_REGISTRY.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-orange-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  {getAgentIcon(agent.id)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                  {agent.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => onOpenChatWithQuery(agent.sampleQuestions[0])}
                  className="w-full text-left text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center justify-between group-hover:translate-x-0.5 transition-transform"
                >
                  <span className="truncate">{agent.sampleQuestions[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Bulletins & Urgent Circulars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-400 animate-bounce" />
              <h2 className="text-base font-bold text-white tracking-tight">
                JDCOEM Campus Circulars & Autonomous Notices
              </h2>
            </div>
            <span className="text-xs text-orange-400 font-mono">DTE 4163 Live Notice Board</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NOTICES.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-orange-500/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        notice.isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() =>
                      onOpenChatWithQuery(`Tell me more about the notice: "${notice.title}"`)
                    }
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Ask AI Agent</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Verified Knowledge Base</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight font-heading">
            Frequently Asked JDCOEM Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Curated answers reviewed by JDCOEM Admissions In-Charge, Controller of Examinations, and Student Section.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFaqCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFaqCategory === cat
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-orange-200"
              >
                <button
                  onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-700 leading-relaxed">{faq.answer}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                      <span>Verified by JDCOEM Administration</span>
                      <button
                        onClick={() => onOpenChatWithQuery(faq.question)}
                        className="text-orange-600 hover:text-orange-700 font-semibold flex items-center space-x-1"
                      >
                        <span>Discuss with AI Agent</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Department Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-extrabold text-slate-950 font-heading">
                  JDCOEM Department Directory & Escalation Contacts
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical office locations and direct helpline numbers at Kalmeshwar Road Campus, Nagpur.
              </p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              10 Divisions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.slice(0, 6).map((dept) => (
              <div
                key={dept.id}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="truncate">{dept.name}</span>
                  <span className="text-[10px] bg-slate-900 text-orange-400 px-1.5 py-0.5 rounded font-mono">
                    {dept.code}
                  </span>
                </div>
                <p className="text-slate-500 font-medium">Head: {dept.headName}</p>
                <div className="space-y-1 text-slate-600 text-[11px] pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3 h-3 text-orange-500 shrink-0" />
                    <span className="text-slate-800">{dept.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    <span className="truncate">{dept.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
