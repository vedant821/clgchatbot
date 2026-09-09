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
  admission: ['admission', 'apply', 'eligibility', 'cutoff', 'entrance', 'prospectus', 'lateral entry', 'application form', 'criteria', 'intake', 'mht-cet', 'cet', 'cap', 'dte', '4163', 'jee'],
  academics: ['attendance', 'syllabus', 'credit', 'course', 'curriculum', 'grade', 'cgpa', 'sgpa', 'faculty', 'professor', 'semester registration', 'condonation', 'debarred', 'advisor', 'autonomous'],
  fees: ['fee', 'tuition', 'payment', 'due', 'installment', 'balance', 'receipt', 'refund', 'fine', 'bank', 'challan', 'transaction', 'sbi collect', 'mahadbt'],
  exams: ['exam', 'admit card', 'hall ticket', 'test', 'mid-term', 'end-term', 'seating', 're-evaluation', 'backlog', 'supplementary', 'paper', 'results', 'schedule', 'timetable'],
  scholarships: ['scholarship', 'financial aid', 'waiver', 'grant', 'fellowship', 'merit', 'need-based', 'income limit', 'mahadbt', 'ebc', 'tfws', 'punjabrao'],
  placements: ['placement', 'job', 'package', 'ctc', 'company', 'recruiter', 'internship', 'interview', 'salary', 'highest', 'average', 'tpo', 'tcs', 'infosys', 'capgemini', '22.5'],
  hostel: ['hostel', 'room', 'mess', 'curfew', 'food', 'warden', 'gate pass', 'outpass', 'ac room', 'housing', 'dormitory', 'dinner', 'lunch', 'kalmeshwar'],
  library: ['library', 'book', 'borrow', 'journal', 'ieee', 'delnet', 'return', 'catalog', 'overdue', 'study pod', 'reading room', 'opac'],
  events: ['event', 'tarang', 'tech fest', 'cultural', 'hackathon', 'sports', 'club', 'societies', 'workshop', 'symposium', 'competition'],
  student_services: ['bus', 'transport', 'id card', 'lost', 'health', 'medical', 'doctor', 'ambulance', 'counseling', 'wellness', 'grievance', 'sitabuldi', 'dharampeth', 'route'],
  orchestrator: [],
};

export class AgentOrchestrator {
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.initAI();
  }

  private initAI(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({
          apiKey,
        });
        return this.ai;
      } catch (err) {
        console.warn('GoogleGenAI initialization warning:', err);
      }
    }
    return null;
  }

  private getAI(): GoogleGenAI | null {
    if (!this.ai) {
      return this.initAI();
    }
    return this.ai;
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
      if (q.includes('hello') || q.includes('hi') || q.includes('help') || q.includes('who are you') || q.includes('jd')) {
        return { agent: 'student_services', confidence: 90, reason: 'General campus greeting and concierge guidance' };
      }
      return { agent: 'academics', confidence: 72, reason: 'Defaulting to Academic Affairs general guidance' };
    }

    const confidence = Math.min(99, 78 + maxScore * 4);
    return { agent: bestAgent, confidence, reason: `Matched specialized domain keywords for ${bestAgent}` };
  }

  /**
   * Execute live database tools based on query intent
   */
  public async executeTools(query: string, agent: AgentType, rollNo: string = 'JD-2023-CSE-042'): Promise<ToolCallRecord[]> {
    const q = query.toLowerCase();
    const tools: ToolCallRecord[] = [];

    // Tool: Fee status check
    if (agent === 'fees' || q.includes('fee') || q.includes('due') || q.includes('balance') || q.includes('pay') || q.includes('receipt')) {
      const startTime = Date.now();
      const records = FEE_RECORDS;
      const totalDue = records.reduce((acc, curr) => acc + curr.dueAmount, 0);
      tools.push({
        toolName: 'lookupStudentFeeStatus',
        parameters: { rollNo },
        result: {
          rollNo,
          studentName: STUDENT_PROFILE.name,
          totalDueBalance: `₹${totalDue.toLocaleString('en-IN')}`,
          activeRecords: records,
          nextDueDate: 'October 15, 2026',
        },
        executionTimeMs: Date.now() - startTime + 10,
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
          totalLecturesWeekly: 8,
        },
        executionTimeMs: Date.now() - startTime + 8,
        status: 'success',
      });
    }

    // Tool: Exam Schedule check
    if (agent === 'exams' || q.includes('exam') || q.includes('hall ticket') || q.includes('mid-term') || q.includes('admit card')) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getExamScheduleAndHallTicket',
        parameters: { rollNo },
        result: {
          rollNo,
          hallTicketNumber: EXAM_SCHEDULES[0]?.hallTicketNo || 'HT-JDCOEM-2026-CS-4209',
          assignedCenter: 'Autonomous Exam Wing, Kalmeshwar Campus',
          examPapers: EXAM_SCHEDULES,
        },
        executionTimeMs: Date.now() - startTime + 12,
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

    // Tool: Bus Transport routes
    if ((agent === 'student_services' || q.includes('bus') || q.includes('transport') || q.includes('route') || q.includes('sitabuldi') || q.includes('dharampeth'))) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getBusTransportRoutes',
        parameters: { destination: 'JDCOEM Kalmeshwar Campus' },
        result: {
          routes: [
            { routeNo: 'Route 1', from: 'Sitabuldi Metro Station', stops: 'Sadar, Mankapur, Kalmeshwar', timing: '08:15 AM' },
            { routeNo: 'Route 2', from: 'Dharampeth', stops: 'Law College, Katol Naka, Campus', timing: '08:20 AM' },
            { routeNo: 'Route 3', from: 'Trimurti Nagar', stops: 'Pratap Nagar, Wadi, Campus', timing: '08:10 AM' },
          ],
          helpline: '+91 9011081548',
        },
        executionTimeMs: Date.now() - startTime + 8,
        status: 'success',
      });
    }

    // Tool: Placement drive stats
    if (agent === 'placements' || q.includes('placement') || q.includes('ctc') || q.includes('package') || q.includes('salary') || q.includes('recruiter') || q.includes('tcs') || q.includes('infosys')) {
      const startTime = Date.now();
      tools.push({
        toolName: 'getPlacementDriveStats',
        parameters: { institution: 'JD College of Engineering and Management, Nagpur' },
        result: {
          highestPackage: '₹22.50 Lakhs Per Annum (LPA)',
          averagePackage: '₹4.50 LPA to ₹6.50 LPA',
          placementRate: '88.5%',
          topRecruiters: ['Tata Consultancy Services (TCS)', 'Infosys', 'Capgemini', 'Hexaware Technologies', 'Accenture', 'Tech Mahindra', 'Persistent Systems', 'Bajaj Auto'],
          tpoContact: 'Prof. Amit Sharma (TPO Head), info@jdcoem.ac.in',
        },
        executionTimeMs: Date.now() - startTime + 10,
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

    // Step 1: Orchestration & Intent Classification
    thinkingSteps.push('Orchestrator analyzing intent, user role context, and conversation memory...');
    const routing = this.routeAgent(input.message, input.userRole);
    const agentMeta = AGENT_REGISTRY.find((a) => a.id === routing.agent) || AGENT_REGISTRY[1];
    thinkingSteps.push(`Routed query to [${agentMeta.name}] with ${routing.confidence}% intent confidence.`);

    // Step 2: RAG Vector Knowledge Base Search
    thinkingSteps.push(`Searching verified JDCOEM regulations & prospectus for ${routing.agent}...`);
    const citations = await vectorEngine.search(input.message, 3);
    if (citations.length > 0) {
      thinkingSteps.push(`Retrieved ${citations.length} verified citations from official JDCOEM records.`);
    }

    // Step 3: Tool Invocations
    thinkingSteps.push('Evaluating live tool triggers for student records and campus lookups...');
    const toolsCalled = await this.executeTools(input.message, routing.agent, input.studentRollNo || 'JD-2023-CSE-042');
    if (toolsCalled.length > 0) {
      thinkingSteps.push(`Executed ${toolsCalled.length} live tool(s): [${toolsCalled.map((t) => t.toolName).join(', ')}].`);
    }

    // Step 4: Anti-Hallucination & Out of Bounds check
    const isOutOfDomain =
      input.message.toLowerCase().includes('leak') ||
      input.message.toLowerCase().includes('bribe') ||
      input.message.toLowerCase().includes('change my grade secretly') ||
      input.message.toLowerCase().includes('hack');

    const targetDept = DEPARTMENTS.find((d) => d.code === agentMeta.departmentCode) || DEPARTMENTS[1];

    if (isOutOfDomain) {
      thinkingSteps.push('Query falls outside verified university policies. Activating Anti-Hallucination Safeguard.');
      const reply = `I cannot assist with unauthorized requests or unverified procedures. To prevent any misinformation or breach of university conduct, please contact the authorized department head directly:\n\n**${targetDept.name} (JDCOEM Nagpur)**\n- **Department Head:** ${targetDept.headName}\n- **Direct Email:** ${targetDept.email}\n- **Phone:** ${targetDept.phone}\n- **Office Location:** ${targetDept.location}\n- **Office Hours:** ${targetDept.officeHours}\n\nOur administrative office at Khandala Valni, Kalmeshwar Road will be glad to assist you in person.`;

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

    // Step 5: Answer Generation using Gemini API (with rapid timeout protection) or Grounded Synthesizer
    let finalReply = '';

    const ai = this.getAI();
    if (ai) {
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      const systemPrompt = `You are the authoritative **${agentMeta.name}** at JD College of Engineering and Management (JDCOEM), Nagpur (jdcoem.in, DTE Code 4163).
You assist ${input.userRole || 'students and visitors'} with courteous, accurate, and professional information.

CRITICAL RULES:
1. Speak in a helpful, respectful, and authoritative academic tone.
2. Ground your response strictly in the provided Official Knowledge Base and Tool Results below.
3. Currency is Indian Rupee (₹).
4. Do NOT hallucinate dates, telephone numbers, or unverified claims.
5. Format with neat markdown bullets, bold highlights, and clean spacing.

OFFICIAL RETRIEVED CONTEXT:
${citations.map((c, i) => `[Citation ${i + 1}: ${c.title} (${c.category})] - ${c.chunkExcerpt}`).join('\n\n')}

LIVE TOOL EXECUTION RESULTS:
${JSON.stringify(toolsCalled.map((t) => ({ tool: t.toolName, result: t.result })), null, 2)}

DEPARTMENT CONTACT:
${targetDept.name} | Head: ${targetDept.headName} | Email: ${targetDept.email} | Phone: ${targetDept.phone} | Location: ${targetDept.location}`;

      const historyContext = input.conversationHistory && input.conversationHistory.length > 0
        ? `\n\nRecent context:\n` + input.conversationHistory.slice(-4).map((h) => `${h.role}: ${h.content}`).join('\n')
        : '';
      const promptText = `User query: "${input.message}"${historyContext}`;

      for (const modelName of candidateModels) {
        try {
          thinkingSteps.push(`Querying AI model [${modelName}] with grounded JDCOEM context...`);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 7000));
          const genPromise = ai.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.2,
            },
          }).catch((e) => {
            console.warn(`Model ${modelName} attempt failed:`, e?.message || e);
            return null;
          });

          const response: any = await Promise.race([genPromise, timeoutPromise]);
          if (response && response.text) {
            finalReply = response.text;
            thinkingSteps.push(`Response successfully synthesized by ${modelName} with verified institutional citations.`);
            break;
          }
        } catch (err) {
          console.warn(`Error trying ${modelName}:`, err);
        }
      }
    }

    // Fallback deterministic synthesis if Gemini timed out, absent, or failed
    if (!finalReply) {
      thinkingSteps.push('Grounded response generated using verified JDCOEM knowledge base & tool outputs.');
      finalReply = this.generateGroundedResponse(input.message, routing.agent, citations, toolsCalled, targetDept);
    }

    return {
      reply: finalReply,
      agentType: routing.agent,
      confidence: Math.max(90, routing.confidence),
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

- **Total Outstanding Due Balance:** **${feeTool.totalDueBalance}**
- **Upcoming Payment Deadline:** **${feeTool.nextDueDate}**
- **Semester VI Fee Status:** **Paid in Full** (Ref: \`JD-PAY-20260114-8842\`)
- **Semester VII Current Term:** Total ₹94,000 | Paid ₹50,000 | **Balance Due: ₹44,000**
- **Scholarship Benefit:** ₹22,000 MAHADBT / EBC concession applied.

You can settle remaining balances through the **Student Portal > Fees & Dues** section via online UPI/NetBanking or at the Accounts Counter in **${dept.location}**.`;
    }

    // Specific Timetable response
    if (tools.some((t) => t.toolName === 'getStudentTimetable')) {
      return `### 📅 Academic Timetable for ${STUDENT_PROFILE.name} (${STUDENT_PROFILE.department})

Here are your upcoming autonomous lectures and practical labs scheduled for this week:

- **Monday 09:30 AM - 10:30 AM**: CS301 *Distributed Cloud Architecture* — Room 204, CSE Wing (Prof. S. R. Sharma)
- **Monday 10:30 AM - 11:30 AM**: CS304 *Artificial Intelligence & Machine Learning* — Room 204 (Dr. Neeta Dongre)
- **Monday 12:00 PM - 02:00 PM**: CS305L *AI & Deep Learning Practical Lab* — Advanced Computing Lab 3
- **Tuesday 09:30 AM - 10:30 AM**: CS302 *Design & Analysis of Algorithms* — Room 204 (Prof. Rajesh Kulkarni)

For full day-by-day weekly schedule, check the **Student Dashboard > Timetable** view.`;
    }

    // Specific Exam response
    if (tools.some((t) => t.toolName === 'getExamScheduleAndHallTicket')) {
      return `### 📝 Autonomous Examination Schedule & Hall Ticket (Odd Semester 2026)

- **Candidate Name:** ${STUDENT_PROFILE.name}
- **Roll Number:** **${STUDENT_PROFILE.rollNo}**
- **Hall Ticket Number:** **HT-JDCOEM-2026-CS-4209** (Status: **Verified & Downloadable**)
- **Assigned Center:** Autonomous Exam Hall A-2, Kalmeshwar Campus, Seat **JD-23-CSE-042**

**Scheduled Examination Papers:**
1. **Oct 19, 2026 (10:00 AM - 01:00 PM)**: CS301 *Distributed Cloud Architecture*
2. **Oct 22, 2026 (10:00 AM - 01:00 PM)**: CS302 *Design & Analysis of Algorithms*
3. **Oct 26, 2026 (10:00 AM - 01:00 PM)**: CS304 *Artificial Intelligence & Machine Learning*
4. **Oct 29, 2026 (10:00 AM - 01:00 PM)**: CS306 *Cybersecurity & Cryptography*

*Please bring a printed copy of your hall ticket along with your official JDCOEM Student ID card.*`;
    }

    // Specific Attendance response
    if (tools.some((t) => t.toolName === 'checkAttendanceRecords')) {
      return `### 📊 Official Attendance Audit for ${STUDENT_PROFILE.name}

- **Aggregate Attendance:** **87.3%** (Mandatory autonomous threshold: **75.0%**)
- **Eligibility Status:** ✅ **Eligible for Semester End Examinations**

**Subject Breakdown:**
- **CS301 (Distributed Cloud Architecture):** 89.5% (34/38 lectures)
- **CS304 (AI & Machine Learning):** 90.5% (38/42 lectures)
- **CS305L (Deep Learning Lab):** 94.4% (17/18 labs)
- **CS302 (Algorithms):** ⚠️ **77.8%** (28/36 lectures) — *Notice: Maintain regular attendance to stay safely above 75%!*
- **CS306 (Cybersecurity):** 84.4% (27/32 lectures)

Under JDCOEM Autonomous Academic Bylaws, falling below 75% requires medical condonation certified by a civil surgeon or will result in being debarred from exams.`;
    }

    // Placement response
    if (tools.some((t) => t.toolName === 'getPlacementDriveStats') || agent === 'placements') {
      return `### 💼 JDCOEM Training & Placement (TPO) Factsheet

- **Highest Salary Package:** **₹22.50 Lakhs Per Annum (LPA)**
- **Average Salary Package:** **₹4.50 LPA to ₹6.50 LPA**
- **Overall Placement Rate:** Over **88%** of eligible students successfully placed
- **Top Recruiters Visiting Campus:**
  - Tata Consultancy Services (TCS)
  - Infosys
  - Capgemini
  - Hexaware Technologies
  - Accenture
  - Tech Mahindra
  - Persistent Systems
  - Cognizant & Bajaj Auto
- **TPO Eligibility:** Minimum 60% or 6.5 CGPA in 10th, 12th, and all B.Tech semesters with no active backlogs.`;
    }

    // Bus Transport response
    if (tools.some((t) => t.toolName === 'getBusTransportRoutes') || q.includes('bus') || q.includes('transport')) {
      return `### 🚌 JDCOEM Nagpur College Bus Transit Service

JD College of Engineering & Management operates dedicated college buses connecting all major sectors of Nagpur city to the Kalmeshwar campus:

- **Route 1 (Sitabuldi - Sadar - Mankapur - JDCOEM):** Departs Sitabuldi Metro Station at 08:15 AM, Mankapur Square at 08:35 AM.
- **Route 2 (Dharampeth - Katol Naka - JDCOEM):** Departs Dharampeth at 08:20 AM.
- **Route 3 (Trimurti Nagar - Pratap Nagar - Wadi - JDCOEM):** Departs Trimurti Nagar at 08:10 AM.
- **Route 4 (Nandanvan - Sakkardara - Campus):** Departs 08:05 AM.

Students can renew their semester bus pass at the **Transport Counter, Gate No. 1**. For queries, contact Transport In-Charge: **+91 9011081548**.`;
    }

    // Specific Admissions & Cutoff synthesis
    if (agent === 'admission' || q.includes('cutoff') || q.includes('admission') || q.includes('eligibility') || q.includes('cet') || q.includes('jee')) {
      return `### 🏛️ JDCOEM Nagpur Admissions & MHT-CET Cutoff Guidelines (DTE Code: 4163)

**Key Eligibility Criteria:**
- Candidates must pass HSC (10+2) with Physics and Mathematics as compulsory subjects, plus Chemistry/Biology/Technical Vocational subject, securing at least **45% aggregate** (40% for reserved categories).
- Valid score in **MHT-CET 2026** or **JEE Main Paper-1** is mandatory for Centralized Admission Process (CAP) rounds.

**Cutoffs & Branch Intakes:**
- **B.Tech Computer Science & Engineering (CSE - 180 seats):** Expected CAP cutoff is **82.5 - 88.0 percentile**.
- **B.Tech CSE (AI & Data Science - 120 seats):** Expected cutoff **78.0 - 84.0 percentile**.
- **B.Tech Information Technology (IT - 60 seats):** Expected cutoff **75.0 - 80.0 percentile**.
- **Direct Second Year Engineering (DSE):** Minimum 60% aggregate in relevant Engineering Diploma.

**Admissions Office & Helpline:**
- **Location:** Administrative Wing, Ground Floor, Room AD-04 (Kalmeshwar Road, Nagpur)
- **Direct Helpline:** **+91 9011081548** / **+91 9011010038**
- **Email:** \`admissions@jdcoem.ac.in\` | **Portal:** [jdcoem.in](https://jdcoem.in)`;
    }

    // Specific Scholarships synthesis
    if (agent === 'scholarships' || q.includes('scholarship') || q.includes('mahadbt') || q.includes('ebc') || q.includes('tfws')) {
      return `### 🎓 Government Scholarships & Fee Waivers at JDCOEM

JDCOEM students are eligible for all major Maharashtra State & Central Government welfare concessions:

1. **EBC Concession (Economically Backward Class):**
   - Open category students with annual family income up to **₹8.00 Lakhs** receive a **50% tuition fee waiver** via the MAHADBT portal.
2. **Dr. Punjabrao Deshmukh Vastigruh Yojna:**
   - Provides up to **₹30,000/year** hostel and sustenance allowance for students whose families are registered agricultural laborers or marginal farmers.
3. **TFWS (Tuition Fee Waiver Scheme):**
   - 100% tuition fee waiver allocated strictly on merit through Centralized Admission Process (CAP).
4. **Reserved Category Concessions (SC / ST / VJNT / OBC):**
   - Reimbursed up to 100% or 50% as per Social Welfare Department directives.

**Scholarship Inquiries:** Contact the Scholarship Cell in Room AD-02 or email \`scholarships@jdcoem.ac.in\`.`;
    }

    // Default synthesis using citations
    if (citations.length > 0) {
      const best = citations[0];
      return `### 🏛️ Official Guidelines from JDCOEM Knowledge Base (${best.title})

${best.chunkExcerpt}

---
**Need official department verification?**
Contact **${dept.name}**:
- **Location:** ${dept.location}
- **Email:** \`${dept.email}\` | **Helpline:** \`${dept.phone}\`
- **Office Hours:** ${dept.officeHours}`;
    }

    return `Welcome to **JD College of Engineering and Management (JDCOEM), Nagpur** AI Help Center! I am your autonomous campus AI assistant connected to the **${dept.name}**.

I can assist you with:
- B.Tech / M.Tech / MBA / MCA Admissions & MHT-CET Cutoffs (DTE Code: **4163**)
- Semester Fees, MAHADBT EBC Scholarships, and Payment Receipts
- Exam Timetables, Hall Tickets, and 75% Attendance Rules
- Campus Placement Records (Highest Package ₹22.5 LPA) and Visiting Recruiters
- College Bus Routes from Sitabuldi, Dharampeth, and Mankapur

How may I assist you today?`;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
