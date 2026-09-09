import {
  AgentMetadata,
  Department,
  StudentProfile,
  TimetableEntry,
  ExamSchedule,
  FeeRecord,
  AttendanceRecord,
  DocumentItem,
  FaqItem,
  NoticeItem,
  UserProfile,
  AnalyticsData,
} from '../types';

export const AGENT_REGISTRY: AgentMetadata[] = [
  {
    id: 'admission',
    name: 'Admissions & Eligibility Agent',
    shortDescription: 'MHT-CET / JEE Main cutoffs, DTE CAP rounds, eligibility criteria & document verification',
    icon: 'GraduationCap',
    departmentCode: 'ADM',
    themeColor: 'orange',
    capabilities: [
      'B.Tech, M.Tech, MBA, MCA and Polytechnic diploma eligibility criteria',
      'MHT-CET & JEE Main cutoff percentiles and CAP round guidelines',
      'Tuition Fee Waiver Scheme (TFWS) and Institutional Quota counseling',
      'Direct Second Year (DSE) lateral entry admission steps',
    ],
    sampleQuestions: [
      'What is the MHT-CET cutoff for B.Tech Computer Science (CSE) at JDCOEM?',
      'How do I apply for CAP rounds through DTE Maharashtra (Code: 4163)?',
      'What are the eligibility criteria for Direct Second Year (DSE) Engineering?',
      'What documents are needed for physical document verification at the reporting center?',
    ],
  },
  {
    id: 'academics',
    name: 'Academics & Regulations Agent',
    shortDescription: 'Autonomous curriculum, credit system, 75% attendance criteria, syllabus & faculty contacts',
    icon: 'BookOpen',
    departmentCode: 'ACAD',
    themeColor: 'blue',
    capabilities: [
      'Autonomous credit-based curriculum and elective selections',
      'Mandatory 75% attendance regulation and medical condonation rules',
      '10-point CGPA grading structure and SGPA conversion formula',
      'Academic calendar, semester registration and faculty mentor allocations',
    ],
    sampleQuestions: [
      'What is the minimum attendance required to appear for semester end examinations?',
      'How does the Autonomous 10-point CGPA grading scale calculate backlogs?',
      'Where can I download the latest semester syllabus for CSE and AI & Data Science?',
      'What is the process to apply for academic leave on medical grounds?',
    ],
  },
  {
    id: 'fees',
    name: 'Fees & Finance Agent',
    shortDescription: 'Tuition fees, MAHADBT scholarship adjustments, installment approvals & payment receipts',
    icon: 'CreditCard',
    departmentCode: 'FIN',
    themeColor: 'amber',
    capabilities: [
      'Lookup real-time student fee balances, paid vouchers and receipt numbers',
      'Breakdown of Tuition, Development, Lab and University Examination fees',
      'Installment payment plans and online SBI Collect / payment gateway support',
      'Refund procedures and caution money clearance guidelines',
    ],
    sampleQuestions: [
      'Check my fee dues and payment receipt for Roll No JD-2023-CSE-042',
      'What is the annual tuition fee for B.Tech Computer Science at JDCOEM?',
      'How can I pay my remaining semester fee through online banking or UPI?',
      'How does the MAHADBT scholarship discount reflect on my fee ledger?',
    ],
  },
  {
    id: 'exams',
    name: 'Autonomous Examination Agent',
    shortDescription: 'Mid-term & End-term schedules, hall tickets, seating plans & re-evaluation rules',
    icon: 'FileText',
    departmentCode: 'COE',
    themeColor: 'purple',
    capabilities: [
      'View upcoming examination timetable and download verified Admit Cards',
      'Seating plans and examination hall allocations on Kalmeshwar campus',
      'Paper re-assessment, photocopy verification & challenge valuation protocols',
      'Remedial and backlog examination registration deadlines',
    ],
    sampleQuestions: [
      'Show my upcoming autonomous exam timetable and hall ticket number',
      'What is the procedure to apply for answer book re-evaluation or photocopy?',
      'When are backlog examinations conducted for even semesters?',
      'What items are strictly prohibited inside the JDCOEM examination halls?',
    ],
  },
  {
    id: 'scholarships',
    name: 'Scholarships & Welfare Agent',
    shortDescription: 'MAHADBT Post-Matric, EBC, TFWS, Minority scholarships & Dr. Punjabrao Deshmukh scheme',
    icon: 'Award',
    departmentCode: 'SCH',
    themeColor: 'emerald',
    capabilities: [
      'Government of Maharashtra MAHADBT portal application support',
      'Economically Backward Class (EBC) 50% tuition concession rules',
      'Hostel maintenance allowance under Dr. Punjabrao Deshmukh Scheme',
      'Tuition Fee Waiver Scheme (TFWS) requirements and income limits',
    ],
    sampleQuestions: [
      'What is the eligibility criteria for EBC tuition fee concession at JDCOEM?',
      'What documents are required to upload on the MAHADBT portal for renewal?',
      'How does the Dr. Punjabrao Deshmukh Hostel Maintenance Allowance work?',
      'Are there private corporate or merit-based scholarships available for students?',
    ],
  },
  {
    id: 'placements',
    name: 'Training & Placement (TPO) Agent',
    shortDescription: 'Placement drive records, highest package 22.5 LPA, visiting MNCs & internship drives',
    icon: 'Briefcase',
    departmentCode: 'TPO',
    themeColor: 'orange',
    capabilities: [
      'Placement drive statistics (Highest CTC 22.5 LPA, Average 4.5 - 6.5 LPA)',
      'Recruiters: TCS, Infosys, Capgemini, Accenture, Tech Mahindra, Hexaware, Cognizant',
      'Eligibility criteria (minimum 60% with no live backlogs for Tier-1 companies)',
      'Pre-placement training, mock interviews and summer internship partnerships',
    ],
    sampleQuestions: [
      'What is the highest and average placement package offered at JDCOEM Nagpur?',
      'Which top IT and core companies conduct on-campus recruitment drives?',
      'What are the eligibility criteria set by TCS and Infosys for campus placement?',
      'Does the TPO cell assist students with mandatory 6-month industry internships?',
    ],
  },
  {
    id: 'hostel',
    name: 'Hostel & Residential Life Agent',
    shortDescription: 'Campus hostel rooms, mess dining menu, curfew timings & outpass permissions',
    icon: 'Home',
    departmentCode: 'HST',
    themeColor: 'teal',
    capabilities: [
      'Boys and Girls hostel room vacancy (Single, Double & Triple occupancy)',
      'Hygienic vegetarian mess facility, weekly menu & meal timings',
      'Campus curfew hours (8:30 PM) and digital warden outpass procedures',
      'Wi-Fi, 24/7 security surveillance, gym and recreation amenities',
    ],
    sampleQuestions: [
      'What are the hostel room charges and facilities at JDCOEM Kalmeshwar campus?',
      'What is the evening curfew timing for hostel residents and how do I apply for outpass?',
      'Is there Wi-Fi and laundry service available inside the campus hostels?',
      'What is today’s mess dinner schedule and menu?',
    ],
  },
  {
    id: 'library',
    name: 'Central Library & OPAC Agent',
    shortDescription: 'Book issue limits, IEEE / DELNET digital subscriptions, reading room & study cabins',
    icon: 'Library',
    departmentCode: 'LIB',
    themeColor: 'indigo',
    capabilities: [
      'Online Public Access Catalog (OPAC) book search and book bank scheme',
      'Digital library access: IEEE Xplore, DELNET, ScienceDirect and NPTEL',
      'Reference reading hall timings (open until 8:00 PM during exam months)',
      'Book renewal limits (3 books for 14 days) and overdue fine regulations',
    ],
    sampleQuestions: [
      'Search availability for "Introduction to Algorithms" or "Operating Systems" in the library',
      'How can I access IEEE and DELNET e-journals remotely using my student login?',
      'What is the book bank scheme for SC/ST and economically weaker students?',
      'What are the library operating hours during semester examination weeks?',
    ],
  },
  {
    id: 'events',
    name: 'Events & Student Life Agent',
    shortDescription: 'Annual cultural festival "Tarang", tech events, sports tournaments & technical clubs',
    icon: 'Calendar',
    departmentCode: 'EVT',
    themeColor: 'rose',
    capabilities: [
      'Schedule of Annual Cultural Fest "Tarang" and National TechFest',
      'Student technical societies (Coding Club, Robotics Club, AI Society, GDSC)',
      'Inter-collegiate sports tournaments, cricket, badminton & athletics',
      'Official student council events and duty leave sanction guidelines',
    ],
    sampleQuestions: [
      'When is the annual cultural festival "Tarang 2026" being hosted?',
      'How can I register my project for the State Level Technical Paper Presentation?',
      'How do I join the JDCOEM Coding Club or Google Developer Student Club?',
      'Can students get academic attendance concession for representing the college in sports?',
    ],
  },
  {
    id: 'student_services',
    name: 'Campus Services & Transport Agent',
    shortDescription: 'College bus routes across Nagpur city, identity cards, health center & student grievances',
    icon: 'HeartHandshake',
    departmentCode: 'SSV',
    themeColor: 'orange',
    capabilities: [
      'Extensive fleet of buses covering Sitabuldi, Dharampeth, Mankapur, Sadar, Wadi & Katol Road',
      'Smart ID card re-issuance, bonafide certificates and bus pass renewal',
      'Campus health unit, first aid, emergency doctor on call and ambulance',
      'Student grievance redressal cell and anti-ragging committee contacts',
    ],
    sampleQuestions: [
      'What are the bus pickup timings and stops from Sitabuldi and Dharampeth to JDCOEM?',
      'How do I apply for a duplicate student ID card if lost?',
      'What is the procedure to collect a Bonafide Certificate for a bus pass or bank loan?',
      'Who is the nodal officer for the Anti-Ragging and Women Internal Complaints Committee?',
    ],
  },
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'adm',
    name: 'Admission & Counseling Cell',
    code: 'ADM',
    category: 'Admissions',
    headName: 'Dr. P. B. Patil',
    email: 'admissions@jdcoem.ac.in',
    phone: '+91 9011081548 / +91 9011010038',
    location: 'Administrative Wing, Ground Floor, Room AD-04',
    officeHours: 'Mon - Sat: 9:30 AM - 5:00 PM',
    description: 'Directs undergraduate B.Tech, M.Tech, MBA, MCA, and Diploma CAP admissions, document scrutiny, and seat allocations under DTE Code 4163.',
    icon: 'GraduationCap',
  },
  {
    id: 'acad',
    name: 'Dean of Academic Affairs',
    code: 'ACAD',
    category: 'Academics',
    headName: 'Dr. S. V. Sonekar',
    email: 'academics@jdcoem.ac.in',
    phone: '+91 7774041329',
    location: 'Main Academic Building, 1st Floor, Room 102',
    officeHours: 'Mon - Fri: 10:00 AM - 4:30 PM',
    description: 'Oversees autonomous curriculum design, academic calendar, lecture schedules, faculty mentorship, and attendance compliance.',
    icon: 'BookOpen',
  },
  {
    id: 'fin',
    name: 'Accounts & Fee Section',
    code: 'FIN',
    category: 'Finance',
    headName: 'Mr. Rajesh Deshpande',
    email: 'accounts@jdcoem.ac.in',
    phone: '+91 8767261422',
    location: 'Administrative Block, Ground Floor, Counter 2',
    officeHours: 'Mon - Sat: 10:00 AM - 3:30 PM',
    description: 'Manages student fee payments, receipt generation, MAHADBT scholarship disbursements, and no-dues clearance.',
    icon: 'CreditCard',
  },
  {
    id: 'coe',
    name: 'Autonomous Controller of Examinations',
    code: 'COE',
    category: 'Examinations',
    headName: 'Prof. R. M. Kedar',
    email: 'coe@jdcoem.ac.in',
    phone: '+91 7888044606',
    location: 'Autonomous Exam Wing, Room EX-101',
    officeHours: 'Mon - Sat: 9:30 AM - 5:00 PM',
    description: 'Conducts autonomous mid-term and end-term examinations, publishes results, prints grade cards, and processes re-evaluations.',
    icon: 'FileText',
  },
  {
    id: 'tpo',
    name: 'Training & Placement Cell (TPO)',
    code: 'TPO',
    category: 'Placements',
    headName: 'Prof. Amit Sharma',
    email: 'tpo@jdcoem.ac.in',
    phone: '+91 9011081548',
    location: 'TPO Placement Hub, 2nd Floor, Room 205',
    officeHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    description: 'Organizes campus placement drives with top recruiters (TCS, Infosys, Capgemini, Accenture, Persistent), mock tests, and industry internships.',
    icon: 'Briefcase',
  },
  {
    id: 'sch',
    name: 'Scholarship & Welfare Section',
    code: 'SCH',
    category: 'Scholarships',
    headName: 'Mrs. Neha Kulkarni',
    email: 'scholarship@jdcoem.ac.in',
    phone: '+91 9011010038',
    location: 'Student Welfare Counter, Admin Block',
    officeHours: 'Mon - Fri: 10:30 AM - 4:00 PM',
    description: 'Guides students through Maharashtra MAHADBT portal schemes, EBC, TFWS, Minority, and SC/ST fee waiver documentation.',
    icon: 'Award',
  },
  {
    id: 'hst',
    name: 'Campus Hostel Administration',
    code: 'HST',
    category: 'Hostel',
    headName: 'Prof. V. N. Wagh (Chief Warden)',
    email: 'hostel@jdcoem.ac.in',
    phone: '+91 7774041329',
    location: 'Boys Hostel Wing & Girls Residence Office',
    officeHours: 'Available 24/7 (Warden Office: 4 PM - 8 PM)',
    description: 'Coordinates room allotment, mess hygiene, safety surveillance, and warden permissions for campus boarders.',
    icon: 'Home',
  },
  {
    id: 'lib',
    name: 'Central Knowledge Resource Centre (Library)',
    code: 'LIB',
    category: 'Library',
    headName: 'Dr. Sandeep Meshram',
    email: 'library@jdcoem.ac.in',
    phone: '+91 9011081548 (Ext 22)',
    location: 'Knowledge Resource Building, Ground & 1st Floor',
    officeHours: 'Mon - Sat: 8:30 AM - 6:00 PM (Reading Hall till 8:00 PM)',
    description: 'Houses 45,000+ technical volumes, national and international journals, book bank collection, and digital research terminals.',
    icon: 'Library',
  },
  {
    id: 'ssv',
    name: 'Student Support Services & Bus Transport',
    code: 'SSV',
    category: 'Campus Services',
    headName: 'Mr. Manoj Raut (Transport In-Charge)',
    email: 'transport@jdcoem.ac.in',
    phone: '+91 9011081548 / +91 7774041329',
    location: 'Transport & Utility Desk, Gate 1',
    officeHours: 'Mon - Sat: 8:00 AM - 5:30 PM',
    description: 'Manages college bus routes across Nagpur city, bus pass issuance, student ID cards, lost & found, and emergency first aid.',
    icon: 'HeartHandshake',
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'u-student',
    name: 'Vedant Khade',
    role: 'student',
    email: 'vedant.khade@jdcoem.in',
    initials: 'VK',
    studentRollNo: 'JD-2023-CSE-042',
    department: 'Computer Science & Engineering',
    details: 'B.Tech CSE, 6th Semester | CGPA 8.84 | JDCOEM Kalmeshwar Campus',
  },
  {
    id: 'u-parent',
    name: 'Sanjay Khade',
    role: 'parent',
    email: 'sanjay.khade@gmail.com',
    initials: 'SK',
    studentRollNo: 'JD-2023-CSE-042',
    department: 'Guardian of Vedant Khade',
    details: 'Registered Guardian | Roll No: JD-2023-CSE-042',
  },
  {
    id: 'u-applicant',
    name: 'Aarav Deshmukh',
    role: 'applicant',
    email: 'aarav.deshmukh24@gmail.com',
    initials: 'AD',
    details: 'MHT-CET Aspirant for B.Tech CSE / AI & Data Science (DTE 4163)',
  },
  {
    id: 'u-faculty',
    name: 'Prof. S. R. Sharma',
    role: 'faculty',
    email: 'sr.sharma@jdcoem.ac.in',
    initials: 'SS',
    department: 'Department of Computer Science & Engineering',
    designation: 'Associate Professor & Class In-Charge',
    details: 'Academic Mentor for 3rd Year CSE Batch',
  },
  {
    id: 'u-admin',
    name: 'Dr. S. V. Sonekar',
    role: 'admin',
    email: 'principal@jdcoem.ac.in',
    initials: 'SS',
    department: 'Helpdesk Directorate & Administration',
    designation: 'Principal & Head of Autonomous Governing Body',
    details: 'Full Institutional & Knowledge Base Management',
  },
];

export const STUDENT_PROFILE: StudentProfile = {
  id: 'std-001',
  rollNo: 'JD-2023-CSE-042',
  name: 'Vedant Khade',
  email: 'vedant.khade@jdcoem.in',
  department: 'Computer Science & Engineering',
  semester: 6,
  program: 'B.Tech in Computer Science & Engineering (Autonomous)',
  batch: '2023 - 2027',
  cgpa: 8.84,
  phone: '+91 98234 56780',
  hostelRoom: 'Boys Hostel Block A, Room 208, Kalmeshwar Campus',
  busRoute: 'Route 7 (Sitabuldi - Dharampeth - Katol Naka - JDCOEM)',
  advisorName: 'Prof. S. R. Sharma',
};

export const TIMETABLE: TimetableEntry[] = [
  {
    id: 'tt-1',
    studentId: 'std-001',
    day: 'Monday',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    courseCode: 'CS301',
    courseName: 'Distributed Cloud Architecture',
    room: 'Room 204, CSE Wing',
    faculty: 'Prof. S. R. Sharma',
    type: 'Lecture',
  },
  {
    id: 'tt-2',
    studentId: 'std-001',
    day: 'Monday',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    courseCode: 'CS304',
    courseName: 'Artificial Intelligence & Machine Learning',
    room: 'Room 204, CSE Wing',
    faculty: 'Dr. Neeta Dongre',
    type: 'Lecture',
  },
  {
    id: 'tt-3',
    studentId: 'std-001',
    day: 'Monday',
    startTime: '12:00 PM',
    endTime: '02:00 PM',
    courseCode: 'CS305L',
    courseName: 'AI & Deep Learning Practical Lab',
    room: 'Advanced Computing Lab 3',
    faculty: 'Dr. Neeta Dongre',
    type: 'Lab',
  },
  {
    id: 'tt-4',
    studentId: 'std-001',
    day: 'Tuesday',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    courseCode: 'CS302',
    courseName: 'Design & Analysis of Algorithms',
    room: 'Room 204, CSE Wing',
    faculty: 'Prof. Rajesh Kulkarni',
    type: 'Lecture',
  },
  {
    id: 'tt-5',
    studentId: 'std-001',
    day: 'Tuesday',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    courseCode: 'CS303',
    courseName: 'Full Stack Web & Cloud Technologies',
    room: 'Room 204, CSE Wing',
    faculty: 'Prof. Pallavi Shinde',
    type: 'Lecture',
  },
  {
    id: 'tt-6',
    studentId: 'std-001',
    day: 'Wednesday',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    courseCode: 'CS306',
    courseName: 'Cybersecurity & Cryptography',
    room: 'Room 204, CSE Wing',
    faculty: 'Prof. Amit Meshram',
    type: 'Lecture',
  },
  {
    id: 'tt-7',
    studentId: 'std-001',
    day: 'Thursday',
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    courseCode: 'CS307L',
    courseName: 'Full Stack Development Lab',
    room: 'Software Project Lab 1',
    faculty: 'Prof. Pallavi Shinde',
    type: 'Lab',
  },
  {
    id: 'tt-8',
    studentId: 'std-001',
    day: 'Friday',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    courseCode: 'CS308',
    courseName: 'Software Engineering & Agile DevOps',
    room: 'Room 204, CSE Wing',
    faculty: 'Prof. Priya Verma',
    type: 'Lecture',
  },
];

export const EXAM_SCHEDULES: ExamSchedule[] = [
  {
    id: 'ex-1',
    courseCode: 'CS301',
    courseName: 'Distributed Cloud Architecture',
    date: '2026-10-19',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    hall: 'Autonomous Exam Hall A-2',
    seatNo: 'JD-23-CSE-042',
    hallTicketNo: 'HT-JDCOEM-2026-CS-4209',
    status: 'Upcoming',
  },
  {
    id: 'ex-2',
    courseCode: 'CS302',
    courseName: 'Design & Analysis of Algorithms',
    date: '2026-10-22',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    hall: 'Autonomous Exam Hall A-2',
    seatNo: 'JD-23-CSE-042',
    hallTicketNo: 'HT-JDCOEM-2026-CS-4209',
    status: 'Upcoming',
  },
  {
    id: 'ex-3',
    courseCode: 'CS304',
    courseName: 'Artificial Intelligence & Machine Learning',
    date: '2026-10-26',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    hall: 'Autonomous Exam Hall A-2',
    seatNo: 'JD-23-CSE-042',
    hallTicketNo: 'HT-JDCOEM-2026-CS-4209',
    status: 'Upcoming',
  },
  {
    id: 'ex-4',
    courseCode: 'CS306',
    courseName: 'Cybersecurity & Cryptography',
    date: '2026-10-29',
    time: '10:00 AM - 01:00 PM',
    duration: '3 Hours',
    hall: 'Autonomous Exam Hall A-2',
    seatNo: 'JD-23-CSE-042',
    hallTicketNo: 'HT-JDCOEM-2026-CS-4209',
    status: 'Upcoming',
  },
];

export const FEE_RECORDS: FeeRecord[] = [
  {
    id: 'fee-sem6',
    termName: 'Semester VI Tuition & Autonomous Exam Fee',
    academicYear: '2025 - 2026',
    tuitionFee: 75000,
    hostelFee: 28000,
    libraryFee: 2000,
    examFee: 3500,
    scholarshipDiscount: 20000,
    totalAmount: 88500,
    paidAmount: 88500,
    dueAmount: 0,
    dueDate: '2026-01-20',
    status: 'Paid',
    transactionRef: 'JD-PAY-20260114-8842',
  },
  {
    id: 'fee-sem7',
    termName: 'Semester VII Tuition & Campus Development Advance',
    academicYear: '2026 - 2027',
    tuitionFee: 80000,
    hostelFee: 30000,
    libraryFee: 2500,
    examFee: 3500,
    scholarshipDiscount: 22000,
    totalAmount: 94000,
    paidAmount: 50000,
    dueAmount: 44000,
    dueDate: '2026-10-15',
    status: 'Partial',
    transactionRef: 'JD-PAY-20260810-1934',
  },
];

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    courseCode: 'CS301',
    courseName: 'Distributed Cloud Architecture',
    faculty: 'Prof. S. R. Sharma',
    totalClasses: 38,
    attendedClasses: 34,
    percentage: 89.47,
  },
  {
    id: 'att-2',
    courseCode: 'CS304',
    courseName: 'Artificial Intelligence & Machine Learning',
    faculty: 'Dr. Neeta Dongre',
    totalClasses: 42,
    attendedClasses: 38,
    percentage: 90.48,
  },
  {
    id: 'att-3',
    courseCode: 'CS305L',
    courseName: 'AI & Deep Learning Practical Lab',
    faculty: 'Dr. Neeta Dongre',
    totalClasses: 18,
    attendedClasses: 17,
    percentage: 94.44,
  },
  {
    id: 'att-4',
    courseCode: 'CS302',
    courseName: 'Design & Analysis of Algorithms',
    faculty: 'Prof. Rajesh Kulkarni',
    totalClasses: 36,
    attendedClasses: 28,
    percentage: 77.78,
  },
  {
    id: 'att-5',
    courseCode: 'CS306',
    courseName: 'Cybersecurity & Cryptography',
    faculty: 'Prof. Amit Meshram',
    totalClasses: 32,
    attendedClasses: 27,
    percentage: 84.38,
  },
];

export const KNOWLEDGE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-jd-adm',
    title: 'JDCOEM Nagpur B.Tech Admissions & DTE Cutoff Guidelines 2026',
    category: 'Admissions',
    departmentId: 'adm',
    docType: 'Official Prospectus',
    fileName: 'JDCOEM_Admissions_Prospectus_2026.pdf',
    content: `JD College of Engineering and Management (JDCOEM), Nagpur is an Autonomous Engineering and Management institution approved by AICTE New Delhi, Directorate of Technical Education (DTE Code: 4163), Government of Maharashtra, and affiliated to Dr. Babasaheb Ambedkar Technological University (DBATU).

Programs Offered:
1. B.Tech Computer Science and Engineering (CSE) - 180 Seats
2. B.Tech CSE (Artificial Intelligence & Data Science) - 120 Seats
3. B.Tech Information Technology (IT) - 60 Seats
4. B.Tech Electronics & Telecommunication (ETC) - 60 Seats
5. B.Tech Mechanical Engineering - 60 Seats
6. B.Tech Civil Engineering & Electrical Engineering
7. Postgraduate: MBA (120 Seats), MCA (60 Seats), M.Tech in CSE & Mechanical

Eligibility & Entrance Cutoffs:
- Candidates must pass HSC (10+2) with Physics and Mathematics as compulsory subjects along with Chemistry/Biology/Technical Vocational subject, securing at least 45% aggregate (40% for reserved categories).
- Valid score in MHT-CET 2026 or JEE Main Paper-1 is mandatory for Centralized Admission Process (CAP) seats.
- Expected cutoff for B.Tech CSE: 82.5 to 88.0 percentile in MHT-CET. Direct Second Year (DSE) requires a minimum of 60% in relevant Engineering Diploma.
- Institute reporting address: Khandala Valni, Near Hanuman Temple, Kalmeshwar Road, Nagpur - 441501. Helpline: +91 9011081548 / +91 9011010038.`,
    chunksCount: 4,
    updatedAt: '2026-08-15',
    size: '1.4 MB',
    tags: ['Admissions', 'Cutoffs', 'B.Tech', 'MHT-CET', 'DTE 4163', 'Eligibility'],
  },
  {
    id: 'doc-jd-acad',
    title: 'Autonomous Academic Regulations & 75% Attendance By-Laws',
    category: 'Academics',
    departmentId: 'acad',
    docType: 'Academic Regulation',
    fileName: 'JDCOEM_Autonomous_Academic_Regulations.pdf',
    content: `JDCOEM Autonomous Academic Council Regulations for B.Tech and Postgraduate Programs:

1. Attendance Requirement:
Every registered student must maintain a minimum attendance of 75% in every theory course and 80% in every practical laboratory.
- Condonation of up to 10% (bringing threshold down to 65%) may be granted exclusively by the Dean of Academic Affairs upon submission of medical certificates certified by the Civil Hospital or competent medical officer within 7 days of absence.
- Students with aggregate attendance below 65% are strictly DEBARRED from appearing in the Autonomous End-Semester Examination.

2. Grading System:
The college follows a 10-point Grading Scale:
- Grade O (Outstanding): 90-100% (Grade Point 10)
- Grade A+ (Excellent): 80-89% (Grade Point 9)
- Grade A (Very Good): 70-79% (Grade Point 8)
- Grade B+ (Good): 60-69% (Grade Point 7)
- Grade B (Above Average): 55-59% (Grade Point 6)
- Grade C (Average): 50-54% (Grade Point 5)
- Grade P (Pass): 40-49% (Grade Point 4)
- Grade F (Fail): Below 40% (Grade Point 0)
Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) are computed at the close of every evaluation cycle.`,
    chunksCount: 3,
    updatedAt: '2026-07-20',
    size: '880 KB',
    tags: ['Attendance', 'Regulations', 'Grading', 'Autonomous', 'CGPA', 'Debarred'],
  },
  {
    id: 'doc-jd-tpo',
    title: 'Training & Placement Cell Records & Recruiters Directory',
    category: 'Placements',
    departmentId: 'tpo',
    docType: 'Placement Bulletin',
    fileName: 'JDCOEM_Placement_Report_2026.pdf',
    content: `JD College of Engineering and Management (JDCOEM) Training & Placement Cell (TPO) Report:

1. Placement Milestones:
- Highest On-Campus Salary Package: ₹22.50 Lakhs Per Annum (LPA).
- Average Salary Package: ₹4.50 LPA to ₹6.50 LPA across IT & Core Branches.
- Placement Rate: Over 88% of eligible students successfully placed in top tier MNCs and Fortune 500 organizations.

2. Leading Recruiters Visiting Campus:
- IT & Software: Tata Consultancy Services (TCS), Infosys, Capgemini, Accenture, Tech Mahindra, Hexaware Technologies, Cognizant, Persistent Systems, Wipro, Amazon, HCL Technologies.
- Core & Automotive: Bajaj Auto, L&T Infotech, Nagpur Metro Rail Corporation, Dhoot Transmission, Godrej & Boyce.

3. Eligibility Criteria for Placement Drives:
- Tier-1 Companies typically require 60% or 6.5 CGPA in 10th, 12th/Diploma, and all engineering semesters with zero active backlogs.
- TPO Cell conducts compulsory Aptitude, Coding Bootcamp (Python, Java, DSA), and Mock Personal Interviews from 5th semester onwards.`,
    chunksCount: 3,
    updatedAt: '2026-08-30',
    size: '1.8 MB',
    tags: ['TPO', 'Placements', 'Highest Package', 'TCS', 'Infosys', 'Capgemini', '22.5 LPA'],
  },
  {
    id: 'doc-jd-trans',
    title: 'Nagpur City College Bus Routes & Kalmeshwar Campus Transit',
    category: 'Campus Services',
    departmentId: 'ssv',
    docType: 'Transit Guide',
    fileName: 'JDCOEM_Bus_Routes_Schedule.pdf',
    content: `JD College of Engineering & Management operates an extensive fleet of dedicated college buses connecting all major neighborhoods of Nagpur city to the Kalmeshwar Road campus:

Key Bus Routes:
- Route 1 (Sitabuldi - Sadar - Mankapur - JDCOEM): Departs Sitabuldi Metro Station at 08:15 AM, Mankapur Square at 08:35 AM, arrives at campus at 09:10 AM.
- Route 2 (Dharampeth - Law College - Katol Naka - JDCOEM): Departs Dharampeth at 08:20 AM, arrives at campus at 09:10 AM.
- Route 3 (Trimurti Nagar - Pratap Nagar - Wadi - Kalmeshwar Bypass - JDCOEM): Departs Trimurti Nagar at 08:10 AM.
- Route 4 (Nandanvan - Sakkardara - Medical Square - JDCOEM): Departs 08:05 AM.
- Route 5 (Jaripatka - Koradi Naka - Kalmeshwar - JDCOEM): Departs 08:25 AM.

Pass Issuance & Safety:
- Students can collect semester bus passes from the Transport Counter, Gate No. 1.
- All buses are equipped with GPS tracking and emergency first-aid boxes. Transport Helpline: +91 9011081548.`,
    chunksCount: 2,
    updatedAt: '2026-07-15',
    size: '640 KB',
    tags: ['Bus Routes', 'Transport', 'Sitabuldi', 'Dharampeth', 'Kalmeshwar', 'Commute'],
  },
  {
    id: 'doc-jd-sch',
    title: 'Maharashtra MAHADBT Scholarships, EBC & TFWS Policies',
    category: 'Scholarships',
    departmentId: 'sch',
    docType: 'Welfare Policy',
    fileName: 'MAHADBT_Scholarship_Bylaws_JDCOEM.pdf',
    content: `Scholarship Schemes applicable at JD College of Engineering and Management, Nagpur:

1. Economically Backward Class (EBC) Concession:
- Open category students with family annual income up to ₹8.00 Lakhs are entitled to a 50% concession on tuition fees reimbursed through the MAHADBT portal.

2. Dr. Punjabrao Deshmukh Vastigruh Yojna:
- Children of marginal farmers/landless laborers admitted through CAP round are eligible for up to ₹30,000 per annum towards hostel maintenance allowance.

3. Tuition Fee Waiver Scheme (TFWS):
- 5% supernumerary seats in all branches allotted via CAP round are 100% exempt from tuition fees.

4. Reserved Category Freeship & Scholarship (SC / ST / VJNT / OBC / SBC):
- Full or partial tuition and development fee reimbursement as per Social Welfare Department directives.
- Students must submit Domicile Certificate, Non-Creamy Layer (where applicable), and Caste Validity on or before the specified MAHADBT portal deadline.`,
    chunksCount: 2,
    updatedAt: '2026-08-01',
    size: '950 KB',
    tags: ['Scholarship', 'MAHADBT', 'EBC', 'TFWS', 'Punjabrao Deshmukh', 'Fee Waiver'],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the college code for JD College of Engineering and Management in DTE CAP rounds?',
    answer: 'The official Maharashtra State CET Cell / DTE institute code for JDCOEM Nagpur is **4163** (under Dr. Babasaheb Ambedkar Technological University affiliation / Autonomous status).',
    category: 'Admissions',
    departmentId: 'adm',
    views: 1840,
    isVerified: true,
    tags: ['DTE Code', '4163', 'CAP Round', 'Admission'],
  },
  {
    id: 'faq-2',
    question: 'What is the minimum attendance required to appear for semester exams at JDCOEM?',
    answer: 'Under JDCOEM Autonomous regulations, a strict minimum of **75% attendance** is mandatory in every theory course and **80%** in practical lab sessions. Medical condonation down to 65% is only accepted with verified civil surgeon documentation submitted within 7 days.',
    category: 'Academics',
    departmentId: 'acad',
    views: 2420,
    isVerified: true,
    tags: ['Attendance', '75%', 'Autonomous', 'Medical Condonation'],
  },
  {
    id: 'faq-3',
    question: 'What was the highest placement package offered at JD College of Engineering Nagpur?',
    answer: 'The highest on-campus package at JDCOEM has reached **₹22.50 Lakhs Per Annum (LPA)**, with recurring offers in the ₹10 LPA to ₹15 LPA bracket from premier tech organizations. The overall average package spans ₹4.50 to ₹6.50 LPA.',
    category: 'Placements',
    departmentId: 'tpo',
    views: 3105,
    isVerified: true,
    tags: ['Placements', 'Highest Package', '22.5 LPA', 'TCS', 'Infosys'],
  },
  {
    id: 'faq-4',
    question: 'Does JDCOEM provide bus transport facilities across Nagpur city?',
    answer: 'Yes! JDCOEM maintains a college bus fleet operating on multiple designated routes covering Sitabuldi, Dharampeth, Sadar, Mankapur, Wadi, Katol Naka, Trimurti Nagar, and Nandanvan directly to the Kalmeshwar Road campus.',
    category: 'Campus Services',
    departmentId: 'ssv',
    views: 1530,
    isVerified: true,
    tags: ['Bus Routes', 'Transport', 'Sitabuldi', 'Kalmeshwar'],
  },
  {
    id: 'faq-5',
    question: 'How do I check my fee dues and semester payment receipts?',
    answer: 'Students can check real-time fee balances in the Student Portal tab or ask the AI Chatbot with their roll number (e.g., JD-2023-CSE-042). Official receipts and transaction reference IDs are generated instantly upon settling dues.',
    category: 'Finance',
    departmentId: 'fin',
    views: 1980,
    isVerified: true,
    tags: ['Fees', 'Receipt', 'Due Balance', 'Online Payment'],
  },
];

export const NOTICES: NoticeItem[] = [
  {
    id: 'not-1',
    title: 'Autonomous Mid-Term Examination Schedule - Odd Sem 2026',
    category: 'Examinations',
    audience: 'All B.Tech & PG Students',
    content: 'The Autonomous Mid-Semester Examinations for 3rd, 5th, and 7th semester B.Tech will commence on October 19, 2026. Official Hall Tickets are available for download in the Student Portal.',
    date: '2026-09-05',
    isUrgent: true,
    departmentId: 'coe',
  },
  {
    id: 'not-2',
    title: 'Campus Recruitment Drive: Capgemini & Hexaware Technologies',
    category: 'Placements',
    audience: 'Final Year B.Tech (2027 Batch)',
    content: 'Registration is now live for on-campus drives by Capgemini and Hexaware Technologies. Eligible branches: CSE, AI & DS, IT, and ETC. Minimum CGPA threshold is 6.5 with zero active backlogs.',
    date: '2026-09-02',
    isUrgent: true,
    departmentId: 'tpo',
  },
  {
    id: 'not-3',
    title: 'Maharashtra MAHADBT Scholarship Application & Renewal Notice',
    category: 'Scholarships',
    audience: 'EBC, SC, ST, VJNT, OBC Candidates',
    content: 'All eligible students applying for EBC 50% tuition concession and Post-Matric scholarships must complete document scrutiny at the Student Welfare Counter before September 25, 2026.',
    date: '2026-08-28',
    isUrgent: false,
    departmentId: 'sch',
  },
  {
    id: 'not-4',
    title: 'College Bus Pass Renewal for Term 2026-2027',
    category: 'Campus Services',
    audience: 'Day Scholars using College Bus',
    content: 'Bus pass renewal for all routes (Sitabuldi, Dharampeth, Mankapur, Katol Road) is ongoing at Gate 1 Transport Desk. Valid RFID smart passes mandatory from September 15.',
    date: '2026-08-20',
    isUrgent: false,
    departmentId: 'ssv',
  },
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalQueries: 1482,
  averageConfidence: 94.8,
  resolutionRate: 96.2,
  avgLatencyMs: 310,
  activeStudentsToday: 428,
  agentDistribution: [
    { agent: 'admission', name: 'Admissions & Cutoffs', count: 420, percentage: 28, color: '#f97316' },
    { agent: 'academics', name: 'Academics & Attendance', count: 340, percentage: 23, color: '#2563eb' },
    { agent: 'fees', name: 'Fees & Finance', count: 280, percentage: 19, color: '#eab308' },
    { agent: 'placements', name: 'TPO & Placements', count: 210, percentage: 14, color: '#ea580c' },
    { agent: 'exams', name: 'Examinations & Hall Ticket', count: 145, percentage: 10, color: '#9333ea' },
    { agent: 'student_services', name: 'Transport & Services', count: 87, percentage: 6, color: '#0d9488' },
  ],
  topQueries: [
    { query: 'What is the cutoff for B.Tech CSE in MHT-CET?', count: 182, agent: 'admission' },
    { query: 'Check my fee balance and due amount', count: 145, agent: 'fees' },
    { query: 'What are the college bus routes from Sitabuldi?', count: 118, agent: 'student_services' },
    { query: 'What is the highest placement package in CSE?', count: 96, agent: 'placements' },
    { query: 'Download hall ticket for semester exams', count: 84, agent: 'exams' },
  ],
  recentAuditLogs: [
    {
      id: 'log-1',
      timestamp: '2 mins ago',
      query: 'What is the MHT-CET cutoff for CSE at JDCOEM?',
      agent: 'admission',
      confidence: 96,
      userRole: 'applicant',
      latencyMs: 290,
      resolved: true,
    },
    {
      id: 'log-2',
      timestamp: '6 mins ago',
      query: 'Check my fee dues and payment receipt',
      agent: 'fees',
      confidence: 99,
      userRole: 'student',
      latencyMs: 315,
      resolved: true,
    },
    {
      id: 'log-3',
      timestamp: '11 mins ago',
      query: 'Bus pickup timing from Dharampeth and Sitabuldi',
      agent: 'student_services',
      confidence: 92,
      userRole: 'student',
      latencyMs: 280,
      resolved: true,
    },
    {
      id: 'log-4',
      timestamp: '18 mins ago',
      query: 'Highest package and top recruiters visiting campus',
      agent: 'placements',
      confidence: 98,
      userRole: 'student',
      latencyMs: 340,
      resolved: true,
    },
  ],
};
