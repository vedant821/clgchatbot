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
  const [testQuery, setTestQuery] = useState('attendance condonation rules');
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

  const handleDeleteFaq = async (id: string) => {
    try {
      await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    } catch {}
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
        id: `not-${Date.now()}`,
        title: newNoticeTitle,
        category: newNoticeCategory,
        audience: newNoticeAudience,
        content: newNoticeContent,
        date: new Date().toISOString().split('T')[0],
        isUrgent: newNoticeUrgent,
        departmentId: 'acad',
      };
      setNotices([localNotice, ...notices]);
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setIsAddingNotice(false);
    }
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
          docType: 'Official Regulations PDF',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocs([data.document, ...docs]);
        setNewDocTitle('');
        setNewDocContent('');
        setIsAddingDoc(false);
      }
    } catch {}
  };

  const handleReindexVectors = async () => {
    try {
      const res = await fetch('/api/admin/reindex', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReindexSuccess(true);
        setTimeout(() => setReindexSuccess(false), 3000);
      }
    } catch {}
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
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">
              Apex University AI Admin & Knowledge Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervise RAG vector embeddings, conversational telemetry, notices & FAQ curation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReindexVectors}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            {reindexSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Indexed pgvector (768-dim)</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-index Knowledge Base</span>
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
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'faqs'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Knowledge Manager ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'documents'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>RAG Documents & PDFs ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'notices'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Circulars Publisher ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vectorTest')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'vectorTest'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-500" />
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
              <p className="text-2xl font-extrabold text-blue-600 mt-2">
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
              <p className="text-2xl font-extrabold text-purple-600 mt-2">
                {analytics.avgLatencyMs} ms
              </p>
              <span className="text-xs text-slate-400 mt-2 block">
                Embedding + Tool lookup time
              </span>
            </div>
          </div>

          {/* Routing Distribution & Top Queries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Agentic Routing Distribution
                  </h3>
                </div>
                <span className="text-xs text-slate-400">10 Specialized Agents</span>
              </div>

              <div className="space-y-3">
                {analytics.agentDistribution.map((agent) => (
                  <div key={agent.agent} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700 capitalize">{agent.agent} Agent</span>
                      <span className="font-mono text-slate-500">
                        {agent.count} queries ({agent.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${agent.percentage * 3.5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Inquiries Leaderboard */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Most Frequently Asked Queries
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Past 30 Days</span>
              </div>

              <div className="space-y-2.5">
                {analytics.topQueries.map((tq, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{tq.query}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {tq.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Chatbot Audit & Routing Telemetry
              </span>
              <span className="text-xs text-slate-400">Simulated pgvector query log</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto font-mono text-xs">
              {analytics.recentAuditLogs.map((log) => (
                <div key={log.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      {log.agent}
                    </span>
                    <span className="text-slate-800 font-sans truncate max-w-sm">{log.query}</span>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 text-[11px]">
                    <span className="text-emerald-700 font-bold">{log.confidence}% match</span>
                    <span className="text-slate-500">{log.latencyMs}ms</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        log.resolved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {log.resolved ? 'RESOLVED' : 'HANDOFF'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FAQ Knowledge Manager Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Curated Knowledge Base FAQs ({faqs.length})
            </h3>
            <button
              onClick={() => setIsAddingFaq(!isAddingFaq)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingFaq ? 'Close Form' : 'Add Verified FAQ'}</span>
            </button>
          </div>

          {/* Add FAQ Form */}
          {isAddingFaq && (
            <form
              onSubmit={handleCreateFaq}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-900 uppercase">Create New Knowledge FAQ</h4>
              <div>
                <label className="text-xs font-semibold text-slate-700">Question</label>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="e.g., What is the deadline for fee payment without late fine?"
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Fees">Fees</option>
                    <option value="Exams">Exams</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Placements">Placements</option>
                    <option value="Library">Library</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Authoritative Answer</label>
                <textarea
                  rows={3}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Enter the official approved answer..."
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFaq(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Publish & Index FAQ
                </button>
              </div>
            </form>
          )}

          {/* FAQs List */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {faq.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{faq.question}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-1">
                    <span>Indexed in pgvector</span>
                    <span>•</span>
                    <span>{faq.views} views</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Documents & RAG Knowledge Base Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Indexed Official Handbooks & Regulatory PDFs
              </h3>
              <p className="text-xs text-slate-500">
                Documents are chunked into 300-char paragraphs and vectorized using pgvector.
              </p>
            </div>
            <button
              onClick={() => setIsAddingDoc(!isAddingDoc)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingDoc ? 'Close' : 'Index New Policy'}</span>
            </button>
          </div>

          {/* Upload Doc Form */}
          {isAddingDoc && (
            <form
              onSubmit={handleCreateDoc}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-900 uppercase">Upload & Index Document</h4>
              <div>
                <label className="text-xs font-semibold text-slate-700">Document Title</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g., Campus Electric Vehicle & Parking Regulation 2026"
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Official Text Content</label>
                <textarea
                  rows={4}
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Paste regulations, policies, fees, or course rules here to index..."
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Chunk & Vectorize Document
                </button>
              </div>
            </form>
          )}

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{doc.size}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{doc.fileName}</p>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                    {doc.content}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{doc.chunksCount} pgvector chunks</span>
                  <span className="text-blue-600 font-medium">{doc.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Circulars & Notices Publisher Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Campus Bulletins & Circulars ({notices.length})
            </h3>
            <button
              onClick={() => setIsAddingNotice(!isAddingNotice)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingNotice ? 'Close' : 'Broadcast New Notice'}</span>
            </button>
          </div>

          {/* Broadcast Form */}
          {isAddingNotice && (
            <form
              onSubmit={handleCreateNotice}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-900 uppercase">Publish Campus Notice</h4>
              <div>
                <label className="text-xs font-semibold text-slate-700">Notice Title</label>
                <input
                  type="text"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g., Rescheduling of Lab Assessment Due to Power Grid Maintenance"
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Audience</label>
                  <select
                    value={newNoticeAudience}
                    onChange={(e: any) => setNewNoticeAudience(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="All">All Campus</option>
                    <option value="Student">Students Only</option>
                    <option value="Parent">Parents Only</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Applicant">Applicants Only</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoticeUrgent}
                      onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Flag as High Priority / Urgent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Notice Text</label>
                <textarea
                  rows={3}
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Details of the circular..."
                  className="w-full mt-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNotice(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          )}

          {/* Notices Grid */}
          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          n.isUrgent
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {n.category}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        Audience: {n.audience}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{n.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Vector Search Playground Tab */}
      {activeTab === 'vectorTest' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              pgvector Semantic Dense Retrieval Tester
            </h3>
            <p className="text-xs text-slate-500">
              Test queries directly against the 768-dimensional hybrid cosine + keyword vector store.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter query to inspect vector citations..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleTestVectorSearch}
                disabled={isSearchingVector}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                {isSearchingVector ? 'Computing...' : 'Test Vector Search'}
              </button>
            </div>
          </div>

          {/* Citation Results */}
          <div className="space-y-3">
            {testCitations.length > 0 ? (
              testCitations.map((cit, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700">{cit.title}</span>
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      Similarity Score: {Math.round(cit.score * 1000) / 10}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-sans">
                    {cit.chunkExcerpt}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                Click "Test Vector Search" above to inspect nearest neighbor semantic chunk matches.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
