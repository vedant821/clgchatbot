import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Layers,
  Sparkles,
  Shield,
  Code2,
  ExternalLink,
  Cpu,
} from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const schemaSnippet = `-- ==========================================================
-- APEX UNIVERSITY AI HELP CENTER POSTGRESQL + PGVECTOR DDL
-- ==========================================================

-- 1. Enable pgvector extension for high-dimensional embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Departments table
CREATE TABLE departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    head_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    location VARCHAR(255) NOT NULL,
    office_hours VARCHAR(128) NOT NULL
);

-- 3. Document Knowledge Chunks with 768-dim Vector Embeddings
CREATE TABLE knowledge_chunks (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    department_id VARCHAR(64) REFERENCES departments(id),
    chunk_index INT NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding vector(768), -- Gemini / Dense vector embedding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HNSW Vector Index for millisecond Approximate Nearest Neighbor (ANN) search
CREATE INDEX idx_knowledge_chunks_embedding_hnsw 
ON knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 5. Chatbot Sessions & Agent Routing Telemetry
CREATE TABLE chat_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_role VARCHAR(32) NOT NULL,
    user_roll_no VARCHAR(64),
    routed_agent VARCHAR(64) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    is_handoff BOOLEAN DEFAULT FALSE,
    handoff_dept_id VARCHAR(64) REFERENCES departments(id),
    latency_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Student Records (Timetable, Exams, Fees, Attendance)
CREATE TABLE student_fees (
    id VARCHAR(64) PRIMARY KEY,
    student_roll_no VARCHAR(64) NOT NULL,
    term_name VARCHAR(64) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL,
    due_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL,
    due_date DATE NOT NULL,
    transaction_ref VARCHAR(128)
);`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">
              PostgreSQL & pgvector Production Architecture
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise database design supporting hybrid dense vector embeddings, HNSW indexes, role access, and student transactional data.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(schemaSnippet, 'ddl')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5"
          >
            {copiedSection === 'ddl' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied DDL!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy schema.sql</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Architecture Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">768-Dim Dense Vectors</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All university regulations, fee bylaws, and exam policies are chunked and embedded into 768-dimensional float vectors for sub-second semantic retrieval.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">HNSW Vector Indexing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Utilizes Hierarchical Navigable Small World (<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">hnsw</code>) indexing with cosine distance metric for near-instant nearest neighbor matching.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Anti-Hallucination Guardrails</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Confidence threshold verification (&gt;75%). When queries fall outside official regulations, the system automatically redirects to authorized department contacts.
          </p>
        </div>
      </div>

      {/* Interactive SQL DDL Code View */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>db/schema.sql (Full PostgreSQL DDL)</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            pgvector v0.5+ Compatible
          </span>
        </div>
        <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-400/90 bg-slate-950">
          {schemaSnippet}
        </pre>
      </div>

      {/* Deployment & Environment Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Database Connection Environment Variables</h3>
        <p className="text-xs text-slate-600">
          To connect this application to a real external PostgreSQL instance with pgvector, specify the standard connection string in your environment:
        </p>
        <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs">
          DATABASE_URL=postgresql://postgres:password@localhost:5432/apex_university?sslmode=disable
        </div>
        <p className="text-[11px] text-slate-500">
          The app includes built-in in-memory vector fallback so all multi-agent routing, RAG search, tool calling, and student services work immediately out-of-the-box in the preview container.
        </p>
      </div>
    </div>
  );
};
