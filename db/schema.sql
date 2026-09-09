-- ====================================================================
-- APEX UNIVERSITY AI HELP CENTER - DATABASE SCHEMA
-- PostgreSQL 15+ with pgvector extension
-- ====================================================================

-- 1. Enable pgvector extension for dense embeddings
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    head_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    location VARCHAR(128) NOT NULL,
    office_hours VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Knowledge Base Documents Table
CREATE TABLE IF NOT EXISTS knowledge_docs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL,
    doc_type VARCHAR(32) DEFAULT 'policy', -- 'policy', 'notice', 'handbook', 'faq', 'curriculum'
    file_name VARCHAR(256),
    source_url VARCHAR(512),
    version VARCHAR(32) DEFAULT '2026.1',
    author VARCHAR(128) DEFAULT 'Academic Registrar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Document Chunks & pgvector Embeddings (768-dimensional for Gemini embedding model)
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(64) PRIMARY KEY,
    doc_id VARCHAR(64) REFERENCES knowledge_docs(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Vector Index for fast approximate nearest neighbor similarity search
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Full-text search index for hybrid lexical + vector search
CREATE INDEX IF NOT EXISTS idx_document_chunks_fts 
ON document_chunks 
USING gin (to_tsvector('english', content));

-- 5. FAQs Table
CREATE TABLE IF NOT EXISTS faq_items (
    id VARCHAR(64) PRIMARY KEY,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    views_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Campus Notices & Bulletins
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL,
    audience VARCHAR(32) DEFAULT 'All', -- 'All', 'Student', 'Faculty', 'Applicant', 'Parent'
    content TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    attachment_url VARCHAR(512),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 7. Students Profile
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    roll_no VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    department VARCHAR(64) NOT NULL,
    semester INT NOT NULL,
    program VARCHAR(64) DEFAULT 'B.Tech Computer Science & Engineering',
    batch_year VARCHAR(16) DEFAULT '2023-2027',
    cgpa NUMERIC(4,2) DEFAULT 8.75,
    hostel_room VARCHAR(32),
    bus_route VARCHAR(32),
    phone VARCHAR(32),
    parent_name VARCHAR(128),
    parent_phone VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Timetable Schedule
CREATE TABLE IF NOT EXISTS timetable_entries (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    day_of_week VARCHAR(16) NOT NULL, -- 'Monday', 'Tuesday', ...
    start_time VARCHAR(16) NOT NULL,  -- '09:00 AM'
    end_time VARCHAR(16) NOT NULL,    -- '10:15 AM'
    course_code VARCHAR(32) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    room_no VARCHAR(64) NOT NULL,
    faculty_name VARCHAR(128) NOT NULL,
    class_type VARCHAR(32) DEFAULT 'Lecture' -- 'Lecture', 'Lab', 'Tutorial'
);

-- 9. Exam Schedule & Hall Tickets
CREATE TABLE IF NOT EXISTS exam_schedules (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(32) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    exam_date DATE NOT NULL,
    start_time VARCHAR(16) NOT NULL,
    duration_minutes INT DEFAULT 180,
    exam_hall VARCHAR(64) NOT NULL,
    seat_number VARCHAR(32) NOT NULL,
    hall_ticket_number VARCHAR(64) NOT NULL,
    exam_type VARCHAR(32) DEFAULT 'End-Semester Theory'
);

-- 10. Fee Records
CREATE TABLE IF NOT EXISTS fee_records (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    term_name VARCHAR(64) NOT NULL,
    academic_year VARCHAR(32) NOT NULL,
    tuition_fee NUMERIC(10,2) NOT NULL,
    hostel_fee NUMERIC(10,2) DEFAULT 0.00,
    library_fee NUMERIC(10,2) DEFAULT 0.00,
    exam_fee NUMERIC(10,2) DEFAULT 0.00,
    scholarship_discount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) DEFAULT 0.00,
    due_amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_status VARCHAR(32) DEFAULT 'Due', -- 'Paid', 'Partial', 'Due', 'Overdue'
    last_payment_date TIMESTAMP WITH TIME ZONE,
    transaction_ref VARCHAR(64)
);

-- 11. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(32) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    faculty_name VARCHAR(128),
    total_classes INT NOT NULL,
    attended_classes INT NOT NULL,
    percentage NUMERIC(5,2) GENERATED ALWAYS AS (ROUND((attended_classes::numeric / NULLIF(total_classes, 0)::numeric) * 100, 2)) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Chat Sessions & Conversation Memory
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_role VARCHAR(32) DEFAULT 'visitor',
    title VARCHAR(256) DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Chat Messages with Agent Routing & Citations
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(16) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    agent_type VARCHAR(64),       -- 'admission', 'academics', 'fees', 'exams', etc.
    confidence_score INT,        -- 0 - 100
    is_handoff BOOLEAN DEFAULT FALSE,
    handoff_department VARCHAR(64),
    tools_called JSONB DEFAULT '[]'::jsonb,
    citations JSONB DEFAULT '[]'::jsonb,
    feedback VARCHAR(16),         -- 'up', 'down', null
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Analytics & Agent Orchestrator Audit Log
CREATE TABLE IF NOT EXISTS agent_analytics (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64),
    user_role VARCHAR(32),
    query TEXT NOT NULL,
    routed_agent VARCHAR(64) NOT NULL,
    confidence_score INT NOT NULL,
    latency_ms INT NOT NULL,
    was_resolved BOOLEAN DEFAULT TRUE,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_timetable_student ON timetable_entries(student_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_student ON fee_records(student_id);
