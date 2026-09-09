import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  Wrench,
  Maximize2,
  Minimize2,
  X,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, AgentType, UserProfile, Citation, ToolCallRecord } from '../types';
import { AGENT_REGISTRY, DEPARTMENTS } from '../data/mockDatabase';

interface ChatWidgetProps {
  mode: 'floating' | 'fullscreen';
  isOpen?: boolean;
  onClose?: () => void;
  currentUser: UserProfile;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  mode,
  isOpen = true,
  onClose,
  currentUser,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThinking, setCurrentThinking] = useState<string[]>([]);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<AgentType | 'all'>('all');
  const [expandedThinkingMap, setExpandedThinkingMap] = useState<Record<string, boolean>>({});
  const [expandedToolsMap, setExpandedToolsMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcoming message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sessionId: 'default',
          sender: 'assistant',
          content: `Welcome to the **Apex University Autonomous Help Center**! 🎓

I am your unified **AI Agentic Orchestrator**. When you ask a question, I analyze your query, consult our **pgvector knowledge base** (regulations, fees, handbooks), execute real-time database tools, and dynamically route you to one of our **10 specialized campus agents**:

* 🎓 **Admissions Agent** (Eligibility, Cutoffs & Prospectus)
* 📚 **Academics Agent** (Syllabus, 75% Attendance & Grading)
* 💳 **Fees & Finance Agent** (Due Balances & Online Receipts)
* 📝 **Examinations Agent** (Timetables & Hall Tickets)
* 🏆 **Scholarships Agent** (Dean’s Merit & Financial Aid)
* 💼 **Placements Agent** (Salary Packages & Tech Drives)
* 🏠 **Hostel Agent** (Room Allocation, Curfew & Mess Menus)
* 📖 **Library Agent** (OPAC Search & Digital Journals)
* 🎪 **Events Agent** (ApexVortex Fest & Hackathons)
* 🤝 **Student Services Agent** (Bus Transit & Campus ID)

How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentType: 'orchestrator',
          confidence: 100,
        },
      ]);
    }
  }, []);

  // Handle external query trigger (e.g. from search bar or category card)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sessionId: 'default',
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setCurrentThinking([
      'Orchestrator received query...',
      'Matching user intent against 10 specialized agent domains...',
    ]);

    try {
      // Small simulated steps for smooth UX
      const thinkingTimer = setTimeout(() => {
        setCurrentThinking((prev) => [
          ...prev,
          'Querying pgvector dense vector embeddings (768-dim)...',
        ]);
      }, 350);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userRole: currentUser.role,
          studentRollNo: currentUser.studentRollNo || 'CS-2023-042',
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.sender,
            content: m.content,
          })),
        }),
      });

      clearTimeout(thinkingTimer);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sessionId: 'default',
        sender: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: data.agentType,
        confidence: data.confidence,
        citations: data.citations,
        toolsCalled: data.toolsCalled,
        isHandoff: data.isHandoff,
        handoffDepartment: data.handoffDepartment,
        thinkingSteps: data.thinkingSteps,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackDept = DEPARTMENTS[1];
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sessionId: 'default',
        sender: 'assistant',
        content: `I encountered a communication issue reaching the knowledge database. To ensure you receive accurate and verified assistance, please contact the department directly:\n\n**${fallbackDept.name}**\n- Email: ${fallbackDept.email}\n- Phone: ${fallbackDept.phone}\n- Location: ${fallbackDept.location}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: 'academics',
        confidence: 60,
        isHandoff: true,
        handoffDepartment: fallbackDept,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setCurrentThinking([]);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );
  };

  const getAgentMeta = (agentType?: AgentType) => {
    if (!agentType) return AGENT_REGISTRY[0];
    return AGENT_REGISTRY.find((a) => a.id === agentType) || AGENT_REGISTRY[0];
  };

  // Quick preset queries based on persona
  const getRolePresets = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          'Check my fee dues and payment deadline',
          'Show my upcoming exam schedule and hall ticket',
          'What is my current attendance percentage?',
          'Is Introduction to Algorithms available in the library?',
        ];
      case 'parent':
        return [
          'What are the hostel curfew hours and visitor rules?',
          'Can my child pay tuition fees in installments?',
          'What are the campus placement packages for CSE?',
          'How can I get emergency medical contact for my ward?',
        ];
      case 'applicant':
        return [
          'What are the eligibility criteria for B.Tech CSE 2026?',
          'What entrance exams and cutoff ranks are accepted?',
          'Are there scholarships for top rankers in admissions?',
          'When is the deadline for Fall 2026 applications?',
        ];
      case 'faculty':
        return [
          'What is the academic policy for medical attendance condonation?',
          'How do students apply for Dean Merit scholarships?',
          'What are the central library off-campus IEEE access credentials?',
        ];
      default:
        return [
          'What are the highest placement packages this year?',
          'How do I apply for B.Tech admission 2026?',
          'Are double-seater AC hostel rooms available?',
          'Check fee payment options and installments',
        ];
    }
  };

  if (mode === 'floating' && !isOpen) return null;

  return (
    <div
      className={
        mode === 'fullscreen'
          ? 'max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4 sm:p-6 min-h-[calc(100vh-140px)]'
          : 'fixed bottom-5 right-5 w-96 sm:w-[420px] h-[600px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200'
      }
    >
      {/* Fullscreen Sidebar: Agent Switcher & Role Presets */}
      {mode === 'fullscreen' && (
        <div className="w-full md:w-80 shrink-0 space-y-4">
          {/* Agent Directory Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Active Specialized Agents</h2>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                10 Online
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Queries are automatically routed, or you can click an agent to ask directly.
            </p>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {AGENT_REGISTRY.map((agent) => (
                <button
                  key={agent.id}
                  id={`agent-btn-${agent.id}`}
                  onClick={() => {
                    setSelectedAgentFilter(agent.id);
                    handleSendMessage(agent.sampleQuestions[0]);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600">
                      {agent.name}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Persona Prompt Suggestions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Recommended for You
              </span>
              <span className="text-[10px] font-bold bg-blue-200/60 text-blue-800 px-1.5 py-0.5 rounded">
                {currentUser.role}
              </span>
            </div>
            <div className="space-y-2 mt-3">
              {getRolePresets().map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset)}
                  className="w-full text-left text-xs bg-white hover:bg-blue-600 hover:text-white text-slate-700 p-2.5 rounded-lg border border-blue-200/70 shadow-2xs transition-all font-medium flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{preset}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1 text-slate-400 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-[640px] md:h-full">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-white">
                  Campus Agent Orchestrator
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-emerald-500/40">
                  RAG + Tools Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounding against official policies • Zero Hallucination Mode
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `welcome-${Date.now()}`,
                    sessionId: 'default',
                    sender: 'assistant',
                    content: 'Conversation history reset. How may I assist you now?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    agentType: 'orchestrator',
                    confidence: 100,
                  },
                ]);
              }}
              title="Reset Chat"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {mode === 'floating' && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const agentMeta = getAgentMeta(msg.agentType);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                {/* Agent Persona Badge */}
                {!isUser && msg.agentType && (
                  <div className="flex items-center space-x-2 mb-1.5 px-1">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      <Bot className="w-3 h-3 text-blue-600" />
                      <span>{agentMeta.name}</span>
                    </span>
                    {msg.confidence !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          msg.confidence >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {msg.confidence}% Confidence
                      </span>
                    )}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`relative p-3.5 rounded-2xl text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] ${
                    isUser
                      ? 'bg-blue-700 text-white rounded-br-xs shadow-xs font-normal'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="prose prose-sm max-w-none prose-slate">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Thinking Steps Dropdown */}
                  {!isUser && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() =>
                          setExpandedThinkingMap((prev) => ({
                            ...prev,
                            [msg.id]: !prev[msg.id],
                          }))
                        }
                        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>
                          {expandedThinkingMap[msg.id] ? 'Hide' : 'Show'} Orchestrator Reasoning (
                          {msg.thinkingSteps.length} steps)
                        </span>
                        {expandedThinkingMap[msg.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedThinkingMap[msg.id] && (
                        <div className="mt-2 space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
                          {msg.thinkingSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <span className="text-blue-500 font-bold shrink-0">{idx + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Live Tools Called Accordion */}
                  {!isUser && msg.toolsCalled && msg.toolsCalled.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() =>
                          setExpandedToolsMap((prev) => ({
                            ...prev,
                            [msg.id]: !prev[msg.id],
                          }))
                        }
                        className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {expandedToolsMap[msg.id] ? 'Hide' : 'Inspect'} Live Database Tool Output (
                          {msg.toolsCalled.length})
                        </span>
                        {expandedToolsMap[msg.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedToolsMap[msg.id] && (
                        <div className="mt-2 space-y-2">
                          {msg.toolsCalled.map((t, idx) => (
                            <div
                              key={idx}
                              className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 text-xs"
                            >
                              <div className="flex items-center justify-between font-mono font-bold text-emerald-900 mb-1">
                                <span>⚡ {t.toolName}()</span>
                                <span className="text-[10px] text-emerald-700">
                                  {t.executionTimeMs}ms
                                </span>
                              </div>
                              <pre className="text-[11px] bg-white/80 p-2 rounded border border-emerald-100 text-slate-700 overflow-x-auto font-mono">
                                {JSON.stringify(t.result, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* RAG Citations Tags */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Verified Sources & Citations
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cit, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveCitation(cit)}
                            className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="font-medium truncate max-w-[190px]">{cit.title}</span>
                            <span className="text-[10px] text-slate-400">
                              ({Math.round(cit.score * 100)}%)
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Department Hand-Off Card (Anti-Hallucination Safe Mode) */}
                  {!isUser && msg.isHandoff && msg.handoffDepartment && (
                    <div className="mt-3 bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs mb-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Official Department Escalation Hand-off</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-700">
                        <p className="font-bold text-slate-900">{msg.handoffDepartment.name}</p>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Head: {msg.handoffDepartment.headName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`tel:${msg.handoffDepartment.phone}`}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {msg.handoffDepartment.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`mailto:${msg.handoffDepartment.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {msg.handoffDepartment.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{msg.handoffDepartment.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{msg.handoffDepartment.officeHours}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions & Timestamp */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80 text-[11px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          title="Copy response"
                          className="p-1 hover:text-slate-700 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-1 transition-colors ${
                            msg.feedback === 'up' ? 'text-emerald-600 font-bold' : 'hover:text-slate-700'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-1 transition-colors ${
                            msg.feedback === 'down' ? 'text-rose-600 font-bold' : 'hover:text-slate-700'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Real-time Thinking & Routing Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2 p-3 bg-white border border-blue-200 rounded-2xl shadow-xs max-w-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900">Agentic Orchestrator Active</p>
                <div className="mt-1 space-y-1">
                  {currentThinking.map((step, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-blue-700 flex items-center space-x-1.5 font-mono"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                      <span>{step}</span>
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask admissions, fees, timetable, hostel, placement..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center space-x-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.8 Flash + pgvector RAG</span>
            <span>Role Context: {currentUser.role}</span>
          </div>
        </div>
      </div>

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{activeCitation.title}</h3>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-blue-600">{activeCitation.category}</span>
                <span>Match Score: {Math.round(activeCitation.score * 100)}%</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans max-h-64 overflow-y-auto">
                {activeCitation.chunkExcerpt}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCitation(null)}
                className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close Excerpt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
