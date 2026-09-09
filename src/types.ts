/**
 * JD College of Engineering and Management (JDCOEM Nagpur) AI Help Center - Global Types & Data Contracts
 */

export type UserRole = 'student' | 'parent' | 'applicant' | 'faculty' | 'visitor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  initials?: string;
  studentRollNo?: string;
  department?: string;
  designation?: string;
  details?: string;
}

export type AgentType =
  | 'admission'
  | 'academics'
  | 'fees'
  | 'exams'
  | 'scholarships'
  | 'placements'
  | 'hostel'
  | 'library'
  | 'events'
  | 'student_services'
  | 'orchestrator';

export interface AgentMetadata {
  id: AgentType;
  name: string;
  shortDescription: string;
  icon: string;
  departmentCode: string;
  capabilities: string[];
  sampleQuestions: string[];
  themeColor: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  category: string;
  headName: string;
  email: string;
  phone: string;
  location: string;
  officeHours: string;
  description: string;
  icon: string;
}

export interface Citation {
  title: string;
  category: string;
  documentId: string;
  chunkExcerpt: string;
  score: number;
  docType?: string;
}

export interface ToolCallRecord {
  toolName: string;
  parameters: Record<string, any>;
  result: any;
  executionTimeMs: number;
  status: 'success' | 'error';
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentType?: AgentType;
  confidence?: number;
  isHandoff?: boolean;
  handoffDepartment?: Department;
  citations?: Citation[];
  toolsCalled?: ToolCallRecord[];
  thinkingSteps?: string[];
  feedback?: 'up' | 'down';
}

export interface ChatSession {
  id: string;
  title: string;
  userRole: UserRole;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  departmentId: string;
  docType: string;
  fileName: string;
  content: string;
  chunksCount: number;
  updatedAt: string;
  size: string;
  tags: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  departmentId: string;
  views: number;
  isVerified: boolean;
  tags: string[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: string;
  audience: string;
  content: string;
  date: string;
  isUrgent: boolean;
  departmentId: string;
  attachmentUrl?: string;
}

export interface StudentProfile {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  program: string;
  batch: string;
  cgpa: number;
  phone: string;
  hostelRoom: string;
  busRoute: string;
  advisorName: string;
}

export interface TimetableEntry {
  id: string;
  studentId: string;
  day: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  room: string;
  faculty: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface ExamSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  duration: string;
  hall: string;
  seatNo: string;
  hallTicketNo: string;
  status: 'Scheduled' | 'Completed' | 'Upcoming';
}

export interface FeeRecord {
  id: string;
  termName: string;
  academicYear: string;
  tuitionFee: number;
  hostelFee: number;
  libraryFee: number;
  examFee: number;
  scholarshipDiscount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Due' | 'Overdue';
  transactionRef?: string;
}

export interface AttendanceRecord {
  id: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface AnalyticsData {
  totalQueries: number;
  averageConfidence: number;
  resolutionRate: number;
  avgLatencyMs: number;
  activeStudentsToday: number;
  agentDistribution: {
    agent: AgentType;
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  topQueries: {
    query: string;
    count: number;
    agent: AgentType;
  }[];
  recentAuditLogs: {
    id: string;
    timestamp: string;
    query: string;
    agent: AgentType;
    confidence: number;
    userRole: UserRole;
    latencyMs: number;
    resolved: boolean;
  }[];
}
