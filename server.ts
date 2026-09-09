import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { agentOrchestrator } from './src/server/agentOrchestrator';
import { vectorEngine } from './src/server/vectorEngine';
import {
  AGENT_REGISTRY,
  DEPARTMENTS,
  STUDENT_PROFILE,
  TIMETABLE,
  EXAM_SCHEDULES,
  FEE_RECORDS,
  ATTENDANCE_RECORDS,
  NOTICES,
  FAQ_ITEMS,
  KNOWLEDGE_DOCUMENTS,
  INITIAL_ANALYTICS,
} from './src/data/mockDatabase';

dotenv.config();

// In-memory mutable states
let noticesState = [...NOTICES];
let faqState = [...FAQ_ITEMS];
let feeRecordsState = [...FEE_RECORDS];
let documentsState = [...KNOWLEDGE_DOCUMENTS];
let analyticsState = { ...INITIAL_ANALYTICS };

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'JD College of Engineering and Management AI Help Center',
      timestamp: new Date().toISOString(),
      vectorEngine: vectorEngine.getStats(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  // 2. Chatbot Agentic Orchestrator Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, userRole, studentRollNo, conversationHistory } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required' });
      }

      const result = await agentOrchestrator.handleChat({
        message,
        sessionId: sessionId || `session-${Date.now()}`,
        userRole: userRole || 'student',
        studentRollNo: studentRollNo || 'JD-2023-CSE-042',
        conversationHistory,
      });

      // Update analytics stats
      analyticsState.totalQueries += 1;
      analyticsState.recentAuditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        query: message,
        agent: result.agentType,
        confidence: result.confidence,
        userRole: userRole || 'student',
        latencyMs: 340,
        resolved: !result.isHandoff,
      });
      if (analyticsState.recentAuditLogs.length > 20) {
        analyticsState.recentAuditLogs.pop();
      }

      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({
        error: 'Failed to process chat query',
        details: err?.message || String(err),
      });
    }
  });

  // 3. Specialized Agents & Registry
  app.get('/api/agents', (req, res) => {
    res.json(AGENT_REGISTRY);
  });

  // 4. University Departments
  app.get('/api/departments', (req, res) => {
    res.json(DEPARTMENTS);
  });

  // 5. Student Portal APIs
  app.get('/api/student/profile', (req, res) => {
    res.json(STUDENT_PROFILE);
  });

  app.get('/api/student/timetable', (req, res) => {
    res.json(TIMETABLE);
  });

  app.get('/api/student/exams', (req, res) => {
    res.json(EXAM_SCHEDULES);
  });

  app.get('/api/student/fees', (req, res) => {
    res.json(feeRecordsState);
  });

  app.post('/api/student/fees/pay', (req, res) => {
    const { feeId, amount } = req.body;
    const record = feeRecordsState.find((f) => f.id === feeId);
    if (!record) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    const payAmt = Number(amount) || record.dueAmount;
    record.paidAmount += payAmt;
    record.dueAmount = Math.max(0, record.totalAmount - record.paidAmount);
    record.status = record.dueAmount === 0 ? 'Paid' : 'Partial';
    record.transactionRef = `JD-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      message: 'Payment processed successfully',
      updatedRecord: record,
      receiptNumber: record.transactionRef,
    });
  });

  app.get('/api/student/attendance', (req, res) => {
    res.json(ATTENDANCE_RECORDS);
  });

  // 6. Campus Notices & Bulletins
  app.get('/api/notices', (req, res) => {
    const { audience } = req.query;
    if (audience && typeof audience === 'string' && audience !== 'All') {
      return res.json(noticesState.filter((n) => n.audience === 'All' || n.audience.toLowerCase() === audience.toLowerCase()));
    }
    res.json(noticesState);
  });

  app.post('/api/admin/notice', (req, res) => {
    const { title, category, audience, content, isUrgent, departmentId } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newNotice = {
      id: `not-${Date.now()}`,
      title,
      category: category || 'General',
      audience: audience || 'All',
      content,
      date: new Date().toISOString().split('T')[0],
      isUrgent: Boolean(isUrgent),
      departmentId: departmentId || 'acad',
    };
    noticesState.unshift(newNotice);
    res.json({ success: true, notice: newNotice });
  });

  // 7. FAQs
  app.get('/api/faqs', (req, res) => {
    const { search, category } = req.query;
    let results = faqState;
    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
    res.json(results);
  });

  app.post('/api/admin/faq', (req, res) => {
    const { question, answer, category, departmentId, tags } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const newFaq = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category: category || 'General',
      departmentId: departmentId || 'acad',
      views: 0,
      isVerified: true,
      tags: tags || [],
    };
    faqState.unshift(newFaq);
    res.json({ success: true, faq: newFaq });
  });

  app.delete('/api/admin/faq/:id', (req, res) => {
    faqState = faqState.filter((f) => f.id !== req.params.id);
    res.json({ success: true });
  });

  // 8. Documents & RAG Knowledge Base
  app.get('/api/documents', (req, res) => {
    res.json(documentsState);
  });

  app.post('/api/admin/document', (req, res) => {
    const { title, category, departmentId, docType, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newDoc = {
      id: `doc-${Date.now()}`,
      title,
      category: category || 'General',
      departmentId: departmentId || 'acad',
      docType: docType || 'Policy Document',
      fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      content,
      chunksCount: Math.ceil(content.length / 300),
      updatedAt: new Date().toISOString().split('T')[0],
      size: `${(content.length / 1024).toFixed(1)} KB`,
      tags: tags || ['official', 'policy'],
    };
    documentsState.unshift(newDoc);
    vectorEngine.addDocument(newDoc);
    res.json({ success: true, document: newDoc });
  });

  app.post('/api/admin/reindex', (req, res) => {
    vectorEngine.indexKnowledgeDocs(documentsState);
    res.json({ success: true, message: 'Re-indexed vector embeddings successfully', stats: vectorEngine.getStats() });
  });

  // 9. Semantic RAG Search test
  app.post('/api/rag/search', async (req, res) => {
    const { query, limit, category } = req.body;
    const citations = await vectorEngine.search(query || '', limit || 4, category);
    res.json({ citations, count: citations.length });
  });

  // 10. Admin Analytics
  app.get('/api/admin/analytics', (req, res) => {
    res.json(analyticsState);
  });

  // Vite middleware integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JD College of Engineering and Management AI Help Center listening on port ${PORT}`);
  });
}

startServer();
