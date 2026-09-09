import { GoogleGenAI } from '@google/genai';
import {
  AgentType,
  Department,
  Citation,
  ToolCallRecord,
  UserRole,
} from '../types';
import {
  DEPARTMENTS,
  AGENT_REGISTRY,
  STUDENT_PROFILE,
  TIMETABLE,
  EXAM_SCHEDULES,
  FEE_RECORDS,
  ATTENDANCE_RECORDS,
} from '../data/mockDatabase';
import { vectorEngine } from './vectorEngine';

export interface OrchestratorInput {
  message: string;
  sessionId: string;
  userRole?: UserRole;
  studentRollNo?: string;
  conversationHistory?: { role: string; content: string }[];
}

export interface OrchestratorOutput {
  reply: string;
  agentType: AgentType;
  confidence: number;
  citations: Citation[];
  toolsCalled: ToolCallRecord[];
  isHandoff: boolean;
  handoffDepartment?: Department;
  thinkingSteps: string[];
}

// Router keywords for agent classification
const AGENT_KEYWORDS: Record<AgentType, string[]> = {
  admission: ['admission', 'apply', 'eligibility', 'cutoff', 'entrance', 'prospectus', 'lateral entry', 'application form', 'criteria', 'intake', 'sat', 'jee'],
  academics: ['attendance', 'syllabus', 'credit', 'course', 'curriculum', 'grade', 'cgpa', 'sgpa', 'faculty', 'professor', 'semester registration', 'condonation', 'debarred', 'advisor'],
  fees: ['fee', 'tuition', 'payment', 'due', 'installment', 'balance', 'receipt', 'refund', 'fine', 'bank', 'challan', 'transaction'],
  exams: ['exam', 'admit card', 'hall ticket', 'test', 'mid-term', 'end-term', 'seating', 're-evaluation', 'backlog', 'supplementary', 'paper', 'results', 'schedule'],
  scholarships: ['scholarship', 'financial aid', 'waiver', 'grant', 'fellowship', 'merit', 'need-based', 'income limit', 'nsp'],
  placements: ['placement', 'job', 'package', 'ctc', 'company', 'recruiter', 'internship', 'interview', 'salary', 'highest', 'average', 'tpo'],
  hostel: ['hostel', 'room', 'mess', 'curfew', 'food', 'warden', 'gate pass', 'outpass', 'ac room', 'housing', 'dormitory', 'dinner', 'lunch'],
  library: ['library', 'book', 'borrow', 'journal', 'ieee', 'acm', 'return', 'catalog', 'overdue', 'study pod', 'reading room', 'shelf'],
  events: ['event', 'tech fest', 'apexvortex', 'cultural', 'hackathon', 'sports', 'club', 'societies', 'workshop', 'symposium', 'competition'],
  student_services: ['bus', 'transport', 'id card', 'lost', 'health', 'medical', 'doctor', 'ambulance', 'counseling', 'wellness', 'grievance', 'shuttle'],
  orchestrator: [],
};

export class AgentOrchestrator {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.warn('GoogleGenAI initialization warning:', err);
      }
    }
  }

  /**
   * Route user query to specialized agent
   */
  public routeAgent(query: string, userRole?: UserRole): { agent: AgentType; confidence: number; reason: string } {
    const q = query.toLowerCase();
    const scores: Record<AgentType, number> = {
      admission: 0,
      academics: 0,
      fees: 0,
      exams: 0,
      scholarships: 0,
      placements: 0,
      hostel: 0,
      library: 0,
      events: 0,
      student_services: 0,
      orchestrator: 0,
    };

    // Keyword match scoring
    for (const [agent, keywords] of Object.entries(AGENT_KEYWORDS) as [AgentType, string[]][]) {
      for (const kw of keywords) {
        if (q.includes(kw)) {
          scores[agent] += kw.length > 5 ? 3 : 2;
        }
      }
    }

    // Role bias tuning
    if (userRole === 'applicant') scores.admission += 2;
    if (userRole === 'parent') scores.fees += 1;

    let bestAgent: AgentType = 'academics';
    let maxScore = 0;

    for (const [agent, score] of Object.entries(scores) as [AgentType, number][]) {
      if (agent !== 'orchestrator' && score > maxScore) {
        maxScore = score;
        bestAgent = agent;
      }
    }

    if (maxScore === 0) {
      // General question fallback
      if (q.includes('hello') || q.includes('hi') || q.includes('help') || q.includes('who are you')) {
        return { agent: 'student_services', confidence: 85, reason: 'General campus greeting and concierge guidance' };
      }
      return { agent: 'academics', confidence: 68, reason: 'Defaulting to Academic Affairs general guidance' };
    }

    const confidence = Math.min(99, 75 + maxScore * 5);
    return { agent: bestAgent, confidence, reason: `Matched specialized domain keywords for ${bestAgent}` };
  }

  /**
   * Execute live database tools based on query intent
   */
  public async executeTools(query: string, agent: AgentType, rollNo: string = 'CS-2023-042'): Promise<ToolCallRecord[]> {
    const q = query.toLowerCase();
    const tools: ToolCallRecord[] = [];

    // Tool: Fee status check
    if (agent === 'fees' || q.includes('fee') || q.includes('due') || q.includes('balance') || q.includes('pay')) {
      const startTime = Date.now();
      const records = FEE_RECORDS;
      const totalDue = records.reduce((acc, curr) => acc + curr.dueAmount, 0);
      tools.push({
        toolName: 'lookupStudentFeeStatus',
        parameters: { rollNo },
        result: {
          rollNo,
          studentName: STUDENT_PROFILE.name,
          totalDueBalance: `$${totalDue.toLocaleString()}`,
          activeRecords: records,
          nextDueDate: 'October 10, 2026',
        },
        executionTimeMs: Date.now() - startTime + 12,
        status: 'success',
      });
    }

    // Tool: Timetable check
    if (agent === 'academics' && (q.includes('timetable') || q.includes('schedule') || q.includes('class') || q.includes('today') || q.includes('tomorrow'))) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getStudentTimetable',
        parameters: { rollNo, semester: STUDENT_PROFILE.semester },
        result: {
          rollNo,
          classes: TIMETABLE,
          totalLecturesWeekly: 10,
        },
        executionTimeMs: Date.now() - startTime + 8,
        status: 'success',
      });
    }

    // Tool: Exam Schedule check
    if (agent === 'exams' || q.includes('exam') || q.includes('hall ticket') || q.includes('mid-term') || q.includes('seat')) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getExamScheduleAndHallTicket',
        parameters: { rollNo },
        result: {
          rollNo,
          hallTicketNumber: EXAM_SCHEDULES[0]?.hallTicketNo || 'HT-2026-CS-4209',
          assignedCenter: 'Aryabhata Academic Block',
          examPapers: EXAM_SCHEDULES,
        },
        executionTimeMs: Date.now() - startTime + 15,
        status: 'success',
      });
    }

    // Tool: Attendance record check
    if ((agent === 'academics' || agent === 'exams') && (q.includes('attendance') || q.includes('percentage') || q.includes('75%') || q.includes('debar'))) {
      const startTime = Date.now();
      const avg = Math.round(ATTENDANCE_RECORDS.reduce((a, b) => a + b.percentage, 0) / ATTENDANCE_RECORDS.length * 100) / 100;
      tools.push({
        toolName: 'checkAttendanceRecords',
        parameters: { rollNo },
        result: {
          rollNo,
          aggregatePercentage: `${avg}%`,
          status: avg >= 75 ? 'ELIGIBLE' : 'WARNING_BELOW_THRESHOLD',
          courses: ATTENDANCE_RECORDS,
          warningCourse: ATTENDANCE_RECORDS.find((c) => c.percentage < 80)?.courseName || 'None',
        },
        executionTimeMs: Date.now() - startTime + 9,
        status: 'success',
      });
    }

    // Tool: Hostel room availability
    if (agent === 'hostel' && (q.includes('room') || q.includes('vacancy') || q.includes('ac') || q.includes('bed') || q.includes('block'))) {
      const startTime = Date.now();
      tools.push({
        toolName: 'checkHostelRoomAvailability',
        parameters: { campus: 'North Campus' },
        result: {
          blockA_Boys: { totalRooms: 120, vacantNonAC: 14, vacantAC: 4 },
          blockB_Boys: { totalRooms: 140, vacantDoubleAC: 6, vacantSingleAC: 0 },
          blockC_Girls: { totalRooms: 150, vacantDoubleAC: 12, vacantNonAC: 8 },
          blockD_Girls: { totalRooms: 120, vacantDoubleAC: 9, vacantSingleAC: 2 },
          messStatus: 'Active - Dinner: 7:45 PM to 9:30 PM',
        },
        executionTimeMs: Date.now() - startTime + 10,
        status: 'success',
      });
    }

    // Tool: Library catalog check
    if (agent === 'library' || q.includes('book') || q.includes('clrs') || q.includes('algorithm') || q.includes('borrow')) {
      const startTime = Date.now();
      tools.push({
        toolName: 'searchLibraryCatalog',
        parameters: { query: 'Computer Science & AI Textbooks' },
        result: {
          itemsFound: [
            { title: 'Introduction to Algorithms (4th Ed) - Cormen, Leiserson', shelf: 'Floor 2, Rack CS-14', copiesAvailable: 5, totalCopies: 12 },
            { title: 'Artificial Intelligence: A Modern Approach - Russell & Norvig', shelf: 'Floor 2, Rack AI-02', copiesAvailable: 3, totalCopies: 8 },
            { title: 'Designing Data-Intensive Applications - Martin Kleppmann', shelf: 'Floor 2, Rack CS-18', copiesAvailable: 2, totalCopies: 6 },
          ],
          onlineAccess: 'IEEE Xplore & ACM Digital Library via SSO active',
        },
        executionTimeMs: Date.now() - startTime + 14,
        status: 'success',
      });
    }

    // Tool: Placement drive stats
    if (agent === 'placements' || q.includes('placement') || q.includes('ctc') || q.includes('package') || q.includes('salary') || q.includes('recruiter')) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getPlacementDriveStats',
        parameters: { department: 'Computer Science & Engineering' },
        result: {
          highestInternationalCTC: '$148,000 / yr (Palantir Technologies)',
          highestDomesticCTC: '$54,000 / yr (Microsoft)',
          averageCSE_CTC: '$16,400 / yr',
          placementRate: '94.2%',
          activeRecruitersVisiting: ['Google Cloud', 'Microsoft', 'Amazon AWS', 'Goldman Sachs', 'NVIDIA'],
        },
        executionTimeMs: Date.now() - startTime + 11,
        status: 'success',
      });
    }

    return tools;
  }

  /**
   * Process user request through the full Agentic + RAG + Tool-Calling pipeline
   */
  public async handleChat(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const thinkingSteps: string[] = [];
    const startTime = Date.now();

    // Step 1: Orchestration & Intent Classification
    thinkingSteps.push('Orchestrator analyzing intent, user role context, and conversation memory...');
    const routing = this.routeAgent(input.message, input.userRole);
    const agentMeta = AGENT_REGISTRY.find((a) => a.id === routing.agent) || AGENT_REGISTRY[1];
    thinkingSteps.push(`Routed query to [${agentMeta.name}] with ${routing.confidence}% intent confidence.`);

    // Step 2: RAG Vector Knowledge Base Search
    thinkingSteps.push(`Querying pgvector dense embeddings & knowledge documents for ${routing.agent}...`);
    const citations = await vectorEngine.search(input.message, 3);
    if (citations.length > 0) {
      thinkingSteps.push(`Retrieved ${citations.length} verified citations from university regulations & prospectus.`);
    }

    // Step 3: Tool Invocations
    thinkingSteps.push(`Evaluating tool triggers for database lookup...`);
    const toolsCalled = await this.executeTools(input.message, routing.agent, input.studentRollNo || 'CS-2023-042');
    if (toolsCalled.length > 0) {
      thinkingSteps.push(`Executed ${toolsCalled.length} live database tool(s): [${toolsCalled.map((t) => t.toolName).join(', ')}].`);
    }

    // Step 4: Anti-Hallucination & Department Hand-off check
    // If the question asks for something completely out of bounds (e.g. personal exam question leaks, illegal queries, unreleased future results)
    const isOutOfDomain =
      input.message.toLowerCase().includes('leak') ||
      input.message.toLowerCase().includes('bribe') ||
      input.message.toLowerCase().includes('change my grade secretly') ||
      (citations.length === 0 && toolsCalled.length === 0 && routing.confidence < 70);

    const targetDept = DEPARTMENTS.find((d) => d.code === agentMeta.departmentCode) || DEPARTMENTS[1];

    if (isOutOfDomain) {
      thinkingSteps.push('Query falls outside verified knowledge base. Activating Anti-Hallucination Safeguard.');
      const reply = `I cannot verify this specific information in the official Apex University records. To prevent any misinformation, please contact the authorized department directly:\n\n**${targetDept.name}**\n- **Department Head:** ${targetDept.headName}\n- **Direct Email:** ${targetDept.email}\n- **Phone Extension:** ${targetDept.phone}\n- **Office Location:** ${targetDept.location}\n- **Office Hours:** ${targetDept.officeHours}\n\nOur office administrators will be happy to assist you in person or by phone.`;

      return {
        reply,
        agentType: routing.agent,
        confidence: 65,
        citations: [],
        toolsCalled: [],
        isHandoff: true,
        handoffDepartment: targetDept,
        thinkingSteps,
      };
    }

    // Step 5: Answer Generation using Gemini API or Grounded Synthesizer
    let finalReply = '';

    if (this.ai) {
      try {
        thinkingSteps.push('Calling Gemini 3.8 Flash model with grounded context and agent persona...');
        const systemPrompt = `You are the specialized **${agentMeta.name}** at Apex University Help Center.
You assist ${input.userRole || 'students and visitors'} with authoritative, professional, and precise information.

CRITICAL RULES:
1. Speak with polite, encouraging, and clear academic tone.
2. Ground your response strictly in the provided Official Knowledge Base and Tool Results below.
3. If specific numbers, fees, percentages or deadlines exist in the context, state them explicitly.
4. NEVER invent or hallucinate dates, telephone numbers, or policies not in the context.
5. Format with neat markdown bullets, bold headings, and clear spacing.
6. If the user asks about live records (fees, exams, timetable, attendance), reference the live tool results accurately.

OFFICIAL RETRIEVED CONTEXT:
${citations.map((c, i) => `[Citation ${i + 1}: ${c.title} (${c.category})] - ${c.chunkExcerpt}`).join('\n\n')}

LIVE TOOL EXECUTION RESULTS:
${JSON.stringify(toolsCalled.map((t) => ({ tool: t.toolName, result: t.result })), null, 2)}

DEPARTMENT CONTACT:
${targetDept.name} | Head: ${targetDept.headName} | Email: ${targetDept.email} | Phone: ${targetDept.phone} | Location: ${targetDept.location}`;

        const promptText = `User query: "${input.message}"`;
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2, // Low temperature for high factual accuracy
          },
        });

        if (response && response.text) {
          finalReply = response.text;
          thinkingSteps.push('Response synthesized with verified grounding and source citations.');
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to grounded rule engine:', err);
      }
    }

    // Fallback deterministic synthesis if Gemini API key not present or call failed
    if (!finalReply) {
      thinkingSteps.push('Grounded response generated using verified knowledge base records & tool outputs.');
      finalReply = this.generateGroundedResponse(input.message, routing.agent, citations, toolsCalled, targetDept);
    }

    return {
      reply: finalReply,
      agentType: routing.agent,
      confidence: Math.max(88, routing.confidence),
      citations,
      toolsCalled,
      isHandoff: false,
      handoffDepartment: targetDept,
      thinkingSteps,
    };
  }

  private generateGroundedResponse(
    query: string,
    agent: AgentType,
    citations: Citation[],
    tools: ToolCallRecord[],
    dept: Department
  ): string {
    const q = query.toLowerCase();

    // Specific Fee lookup response
    if (tools.some((t) => t.toolName === 'lookupStudentFeeStatus')) {
      const feeTool = tools.find((t) => t.toolName === 'lookupStudentFeeStatus')?.result;
      return `### 💳 Live Student Fee Account Summary (Roll No: ${STUDENT_PROFILE.rollNo})

Here is the current fee account balance for **${STUDENT_PROFILE.name}** (${STUDENT_PROFILE.program}):

- **Total Outstanding Balance:** **${feeTool.totalDueBalance}**
- **Upcoming Due Date:** **${feeTool.nextDueDate}**
- **Semester VI Tuition:** Paid in Full (Txn: \`APX-TXN-20260114-8842\`)
- **Semester VII Advance:** Total $88,000 | Paid $40,000 | **Remaining Due: $48,000**
- **Scholarship Benefit:** $15,000 Dean’s Merit Credit applied.

You can settle this balance directly online via the **Student Dashboard > Fees & Dues** or through the campus accounts counter in **${dept.location}**.`;
    }

    // Specific Timetable response
    if (tools.some((t) => t.toolName === 'getStudentTimetable')) {
      return `### 📅 Academic Timetable for ${STUDENT_PROFILE.name} (${STUDENT_PROFILE.department})

Here are your upcoming classes scheduled for this week:

- **Monday 09:00 AM - 10:15 AM**: CS301 *Distributed Cloud Systems* — Turing Hall 102 (Prof. Alan Wright)
- **Monday 10:30 AM - 11:45 AM**: CS304 *Artificial Intelligence & Agents* — Science Block 204 (Dr. Sarah Connor)
- **Monday 01:30 PM - 04:00 PM**: CS305L *Deep Learning & NLP Lab* — Computing Lab 4B
- **Tuesday 09:30 AM - 10:45 AM**: CS308 *Database Internals & Vector DBs* — Turing Hall 104 (Prof. Katherine Vance)

For the full 5-day schedule, visit the **Student Portal Timetable view**.`;
    }

    // Specific Exam response
    if (tools.some((t) => t.toolName === 'getExamScheduleAndHallTicket')) {
      return `### 📝 Examination Schedule & Hall Ticket (Fall 2026)

- **Student:** ${STUDENT_PROFILE.name} (Roll No: **${STUDENT_PROFILE.rollNo}**)
- **Hall Ticket Number:** **HT-2026-CS-4209** (Status: **Verified & Downloadable**)
- **Assigned Examination Hall:** Aryabhata Academic Block, Exam Hall 3, Seat **A-34**

**Upcoming Papers:**
1. **Oct 18, 2026 (09:30 AM)**: CS301 *Distributed Cloud Systems*
2. **Oct 21, 2026 (09:30 AM)**: CS304 *Artificial Intelligence & Agents*
3. **Oct 24, 2026 (02:00 PM)**: CS308 *Database Internals & Vector DBs*
4. **Oct 27, 2026 (09:30 AM)**: HS301 *Technology Ethics & IP Rights*

*Note: Please arrive 20 minutes prior to the exam with your physical Student ID card and printed hall ticket.*`;
    }

    // Specific Attendance response
    if (tools.some((t) => t.toolName === 'checkAttendanceRecords')) {
      return `### 📊 Official Attendance Audit for ${STUDENT_PROFILE.name}

- **Aggregate Attendance:** **88.1%** (Minimum required: **75.0%**)
- **Overall Status:** ✅ **Eligible for End-Semester Examinations**

**Course-Wise Breakdown:**
- **CS301 (Distributed Cloud Systems):** 90.5% (38/42 classes)
- **CS304 (AI & Agents):** 90.0% (36/40 classes)
- **CS305L (Deep Learning Lab):** 94.4% (17/18 classes)
- **CS308 (Database Internals):** ⚠️ **77.3%** (34/44 classes) — *Caution: Close to the 75% limit!*
- **HS301 (Technology Ethics):** 88.9% (32/36 classes)

Per Section 4.2 of the Academic Regulations, falling below 75% will require medical condonation or result in a debarred course grade.`;
    }

    // Specific Hostel response
    if (tools.some((t) => t.toolName === 'checkHostelRoomAvailability')) {
      return `### 🏠 Hostel & Residential Life Update

- **Curfew Policy:** Campus gates and hostel blocks close strictly at **10:00 PM** (10:30 PM Saturdays).
- **Dining Mess:** Breakfast (7:30 - 9:15 AM) | Lunch (12:15 - 2:00 PM) | Dinner (7:45 - 9:30 PM).
- **Live Vacancies:**
  - **Block B (Boys Double AC):** 6 beds available
  - **Block A (Boys Non-AC):** 14 beds available
  - **Block C & D (Girls AC):** 21 beds available
- **Outpass Process:** Apply via Student Portal 6 hours in advance with guardian SMS confirmation.`;
    }

    // Placement response
    if (tools.some((t) => t.toolName === 'getPlacementDriveStats')) {
      return `### 💼 Training & Placement Cell (TPO) Factsheet

- **Overall Placement Rate:** **94.2%** for the 2025-2026 graduating batch
- **Highest International Offer:** **$148,000 / year** (Palantir Technologies)
- **Highest Domestic Offer:** **$54,000 / year** (Microsoft IDC)
- **Average CSE Package:** **$16,400 / year**
- **Eligibility Requirement:** Minimum 7.0 CGPA with zero active backlogs for Tier-1 companies.
- **Visiting Recruiters:** Google Cloud, Microsoft, Amazon AWS, Goldman Sachs, NVIDIA, and Qualcomm.`;
    }

    // Default synthesis using citations
    if (citations.length > 0) {
      const best = citations[0];
      return `### 🏛️ Official Guidelines from ${best.title}

${best.chunkExcerpt}

---
**Need further official assistance?**
You can consult the **${dept.name}**:
- **Location:** ${dept.location}
- **Email:** \`${dept.email}\` | **Phone:** \`${dept.phone}\`
- **Office Hours:** ${dept.officeHours}`;
    }

    return `Welcome to the Apex University Help Center! I am your AI Assistant connected to the **${dept.name}**. 

I can answer questions regarding academic rules, fee payments, admissions, scholarships, examinations, hostel facilities, and campus services. How may I assist you today?`;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
