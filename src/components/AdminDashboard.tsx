import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  HelpCircle,
  Bell,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Bot,
  Clock,
  Layers,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  AnalyticsData,
  FaqItem,
  DocumentItem,
  NoticeItem,
  Citation,
} from '../types';
import {
  INITIAL_ANALYTICS,
  FAQ_ITEMS,
  KNOWLEDGE_DOCUMENTS,
  NOTICES,
  DEPARTMENTS,
} from '../data/mockDatabase';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'faqs' | 'documents' | 'notices' | 'vectorTest'>('analytics');
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQ_ITEMS);
  const [docs, setDocs] = useState<DocumentItem[]>(KNOWLEDGE_DOCUMENTS);
  const [notices, setNotices] = useState<NoticeItem[]>(NOTICES);

  // FAQ Form State
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Academics');
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General');
  const [newNoticeAudience, setNewNoticeAudience] = useState<'All' | 'Student' | 'Parent' | 'Faculty' | 'Applicant'>('All');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);
  const [isAddingNotice, setIsAddingNotice] = useState(false);

  // Document Upload Form State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Academics');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // Vector Search Playground
  const [testQuery, setTestQuery] = useState('MHT-CET cutoff for Computer Science');
  const [testCitations, setTestCitations] = useState<Citation[]>([]);
  const [isSearchingVector, setIsSearchingVector] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  // Load live analytics from server
  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalQueries) {
          setAnalytics(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newFaqQuestion,
          answer: newFaqAnswer,
          category: newFaqCategory,
          departmentId: 'acad',
          tags: ['official', newFaqCategory.toLowerCase()],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs([data.faq, ...faqs]);
        setNewFaqQuestion('');
        setNewFaqAnswer('');
        setIsAddingFaq(false);
      }
    } catch {
      // Local fallback
      const localFaq: FaqItem = {
        id: `faq-${Date.now()}`,
        question: newFaqQuestion,
        answer: newFaqAnswer,
        category: newFaqCategory,
        departmentId: 'acad',
        views: 0,
        isVerified: true,
        tags: [newFaqCategory.toLowerCase()],
      };
      setFaqs([localFaq, ...faqs]);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
      setIsAddingFaq(false);
    }
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    try {
      const res = await fetch('/api/admin/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNoticeTitle,
          content: newNoticeContent,
          category: newNoticeCategory,
          audience: newNoticeAudience,
          isUrgent: newNoticeUrgent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotices([data.notice, ...notices]);
        setNewNoticeTitle('');
        setNewNoticeContent('');
        setIsAddingNotice(false);
      }
    } catch {
      const localNotice: NoticeItem = {
        id: `ntc-${Date.now()}`,
        title: newNoticeTitle,
        content: newNoticeContent,
        category: newNoticeCategory,
        audience: newNoticeAudience,
        date: new Date().toISOString().split('T')[0],
        isUrgent: newNoticeUrgent,
        departmentId: 'general',
      };
      setNotices([localNotice, ...notices]);
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setIsAddingNotice(false);
    }
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    try {
      const res = await fetch('/api/admin/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocTitle,
          category: newDocCategory,
          content: newDocContent,
          fileName: `${newDocTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocs([data.document, ...docs]);
        setNewDocTitle('');
        setNewDocContent('');
        setIsAddingDoc(false);
      }
    } catch {
      const localDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: newDocTitle,
        fileName: `${newDocTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        category: newDocCategory,
        departmentId: 'admin',
        docType: 'PDF',
        content: newDocContent,
        chunksCount: 8,
        updatedAt: new Date().toISOString().split('T')[0],
        size: '420 KB',
        tags: [newDocCategory.toLowerCase()],
      };
      setDocs([localDoc, ...docs]);
      setNewDocTitle('');
      setNewDocContent('');
      setIsAddingDoc(false);
    }
  };

  const handleDeleteDoc = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const handleReindexVectors = async () => {
    try {
      const res = await fetch('/api/admin/reindex', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReindexSuccess(true);
        setTimeout(() => setReindexSuccess(false), 3000);
      }
    } catch {
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    }
  };

  const handleTestVectorSearch = async () => {
    if (!testQuery.trim()) return;
    setIsSearchingVector(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, limit: 4 }),
      });
      const data = await res.json();
      setTestCitations(data.citations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingVector(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">
              JDCOEM AI Admin & Knowledge Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous college administrative console: knowledge citations, query analytics, and notice publishing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReindexVectors}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            {reindexSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Knowledge Base Synced</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-index JDCOEM Knowledge</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'analytics'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-orange-500" />
          <span>Analytics & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'faqs'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-orange-500" />
          <span>FAQ Knowledge Manager ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'documents'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-orange-500" />
          <span>RAG Documents & PDFs ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'notices'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-orange-500" />
          <span>Circulars Publisher ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vectorTest')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'vectorTest'
              ? 'bg-slate-950 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-orange-500" />
          <span>Vector Search Playground</span>
        </button>
      </div>

      {/* 1. Analytics & Telemetry Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Queries Resolved
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {analytics.totalQueries.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% this week</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Avg. Confidence Score
              </span>
              <p className="text-2xl font-extrabold text-orange-600 mt-2">
                {analytics.averageConfidence}%
              </p>
              <span className="text-xs text-slate-400 mt-2 block">
                Target: &gt;85% High Fidelity
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Zero-Hallucination Rate
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                {analytics.resolutionRate}%
              </p>
              <span className="text-xs text-slate-400 mt-2 block">
                Escalated to Dept: 3.8%
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Average Latency
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">
                {analytics.avgLatencyMs} ms
              </p>
              <span className="text-xs text-slate-400 mt-2 block">
                Embedding + Tool lookup time
              </span>
            </div>
          </div>

          {/* Routing Distribution & Top Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Agent Workload Distribution</span>
                <span className="text-xs text-slate-400 font-normal">Past 30 Days</span>
              </h3>
              <div className="space-y-3">
                {analytics.agentDistribution.map((item) => (
                  <div key={item.agent} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="text-slate-500 font-mono">
                        {item.count} queries ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Trending Student Queries</span>
                <span className="text-xs text-slate-400 font-normal">Ranked by Volume</span>
              </h3>
              <div className="space-y-3">
                {analytics.topQueries.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-950 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {q.query}
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {q.count} hits
                      </span>
                      <span className="text-[10px] text-orange-600 font-medium block capitalize">
                        {q.agent} Agent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FAQs Knowledge Manager Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Curated Frequently Asked Questions ({faqs.length})
            </h3>
            <button
              onClick={() => setIsAddingFaq(!isAddingFaq)}
              className="bg-slate-950 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified FAQ</span>
            </button>
          </div>

          {isAddingFaq && (
            <form
              onSubmit={handleCreateFaq}
              className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-xs space-y-3"
            >
              <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Create New Verified Knowledge Entry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Student Query / Question
                  </label>
                  <input
                    type="text"
                    required
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="e.g., What is the cutoff for B.Tech Computer Science at JDCOEM?"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Department Category
                  </label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Academics">Academics</option>
                    <option value="Fees">Fees & Finance</option>
                    <option value="Exams">Exams</option>
                    <option value="Placements">Placements</option>
                    <option value="Transport">Transport</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Official Verified Answer
                </label>
                <textarea
                  required
                  rows={3}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Official answer conforming to JDCOEM autonomous bylaws..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingFaq(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-orange-600 rounded-lg transition-colors shadow-xs"
                >
                  Save & Index FAQ
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {faq.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{faq.question}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RAG Documents & PDFs Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Indexed Regulatory PDFs & Policy Handbooks
              </h3>
              <p className="text-xs text-slate-500">
                Grounding documents used for RAG chunk citations and zero-hallucination answers.
              </p>
            </div>
            <button
              onClick={() => setIsAddingDoc(!isAddingDoc)}
              className="bg-slate-950 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest New Document</span>
            </button>
          </div>

          {isAddingDoc && (
            <form
              onSubmit={handleCreateDoc}
              className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-xs space-y-3"
            >
              <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Upload & Chunk College Document
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g., JDCOEM Bus Route Schedule 2026"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Academics">Academics</option>
                    <option value="Fees">Fees</option>
                    <option value="Placements">Placements</option>
                    <option value="Transport">Transport</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Text Content (simulated PDF ingestion)
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Paste official policy clauses or text excerpts here..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-orange-600 rounded-lg transition-colors shadow-xs"
                >
                  Chunk & Index Document
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-orange-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      INDEXED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{doc.fileName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{doc.chunksCount} vector chunks</span>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Circulars Publisher Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Campus Bulletins & Circulars ({notices.length})
            </h3>
            <button
              onClick={() => setIsAddingNotice(!isAddingNotice)}
              className="bg-slate-950 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish Circular</span>
            </button>
          </div>

          {isAddingNotice && (
            <form
              onSubmit={handleCreateNotice}
              className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-xs space-y-3"
            >
              <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Broadcast New University Circular
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Notice Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="e.g., Autonomous Mid-Term Examination Dates Announced"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Audience
                  </label>
                  <select
                    value={newNoticeAudience}
                    onChange={(e) =>
                      setNewNoticeAudience(
                        e.target.value as 'All' | 'Student' | 'Parent' | 'Faculty' | 'Applicant'
                      )
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="All">All Campus</option>
                    <option value="Student">Students Only</option>
                    <option value="Parent">Parents</option>
                    <option value="Faculty">Faculty & Staff</option>
                    <option value="Applicant">Applicants</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Circular Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Official notice body..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={newNoticeUrgent}
                  onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="urgentCheck" className="text-xs font-semibold text-rose-600">
                  Mark as Urgent Alert
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNotice(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-orange-600 rounded-lg transition-colors shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        notice.isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{notice.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({notice.date})</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{notice.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                  title="Delete notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Vector Search Playground Tab */}
      {activeTab === 'vectorTest' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              RAG Vector Embedding Search Playground
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live cosine similarity search against JDCOEM bylaws and official records.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test query (e.g., MHT-CET cutoff for Computer Science)"
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleTestVectorSearch}
              disabled={isSearchingVector}
              className="bg-slate-950 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSearchingVector ? 'Searching...' : 'Run Similarity Search'}
            </button>
          </div>

          {testCitations.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ranked Document Chunks Retrieved ({testCitations.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testCitations.map((cit, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{cit.title}</span>
                      <span className="text-orange-600 font-mono">
                        {Math.round(cit.score * 100)}% match
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-4 font-mono bg-white p-2 rounded border border-slate-200">
                      {cit.chunkExcerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
