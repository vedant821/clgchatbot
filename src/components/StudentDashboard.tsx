import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  User,
  Download,
  Printer,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
  X,
  Send,
} from 'lucide-react';
import {
  StudentProfile,
  TimetableEntry,
  ExamSchedule,
  FeeRecord,
  AttendanceRecord,
  NoticeItem,
} from '../types';
import {
  STUDENT_PROFILE,
  TIMETABLE,
  EXAM_SCHEDULES,
  FEE_RECORDS,
  ATTENDANCE_RECORDS,
  NOTICES,
} from '../data/mockDatabase';

interface StudentDashboardProps {
  onAskChatbot: (query: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onAskChatbot }) => {
  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'exams' | 'fees' | 'attendance' | 'notices'>('timetable');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [feesList, setFeesList] = useState<FeeRecord[]>(FEE_RECORDS);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<FeeRecord | null>(null);
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [latestTxnReceipt, setLatestTxnReceipt] = useState<string>('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayClasses = TIMETABLE.filter((t) => t.day.toLowerCase() === selectedDay.toLowerCase());

  const handlePayFee = (fee: FeeRecord) => {
    setSelectedFeeForPay(fee);
    setIsPayModalOpen(true);
    setIsPaidSuccess(false);
  };

  const processPayment = async () => {
    if (!selectedFeeForPay) return;
    try {
      const res = await fetch('/api/student/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: selectedFeeForPay.id,
          amount: selectedFeeForPay.dueAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeesList((prev) =>
          prev.map((f) => (f.id === selectedFeeForPay.id ? data.updatedRecord : f))
        );
        setLatestTxnReceipt(data.receiptNumber);
        setIsPaidSuccess(true);
      }
    } catch (e) {
      // Local fallback
      setFeesList((prev) =>
        prev.map((f) =>
          f.id === selectedFeeForPay.id
            ? {
                ...f,
                paidAmount: f.totalAmount,
                dueAmount: 0,
                status: 'Paid',
                transactionRef: `APX-PAY-${Date.now()}`,
              }
            : f
        )
      );
      setLatestTxnReceipt(`APX-PAY-${Date.now()}`);
      setIsPaidSuccess(true);
    }
  };

  // Calculate overall attendance aggregate
  const overallAttendance = Math.round(
    (ATTENDANCE_RECORDS.reduce((acc, c) => acc + c.percentage, 0) / ATTENDANCE_RECORDS.length) * 10
  ) / 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Student Profile Overview Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 font-extrabold text-xl shadow-inner">
              AJ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{STUDENT_PROFILE.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Enrolled Regular
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Roll No: {STUDENT_PROFILE.rollNo} • {STUDENT_PROFILE.program}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300 mt-2">
                <span>Semester: <strong>{STUDENT_PROFILE.semester}th Sem</strong></span>
                <span>•</span>
                <span>Advisor: <strong>{STUDENT_PROFILE.advisorName}</strong></span>
                <span>•</span>
                <span>Hostel: <strong>{STUDENT_PROFILE.hostelRoom}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cumulative CGPA</span>
              <p className="text-xl font-extrabold text-amber-400">{STUDENT_PROFILE.cgpa}</p>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400">Aggregate Attn</span>
              <p className="text-xl font-extrabold text-emerald-400">{overallAttendance}%</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Fee Status</span>
              <p className="text-sm font-bold text-amber-300">
                {feesList.some((f) => f.dueAmount > 0) ? 'Partial Due' : 'All Clear'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'timetable'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Timetable</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'exams'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Exams & Hall Ticket</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'fees'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fees & Online Payment</span>
          {feesList.some((f) => f.dueAmount > 0) && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'attendance'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Attendance Audit</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'notices'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Student Circulars</span>
        </button>
      </div>

      {/* 1. Timetable Tab */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDay === day
                      ? 'bg-white text-blue-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <button
              onClick={() => onAskChatbot(`Summarize my academic schedule for ${selectedDay}`)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Ask AI about {selectedDay}'s classes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayClasses.length > 0 ? (
              dayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {cls.courseCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {cls.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {cls.courseName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{cls.faculty}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{cls.startTime} - {cls.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cls.room}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No lectures or labs scheduled for {selectedDay}. Enjoy your independent study period!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Exams & Hall Ticket Tab */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Hall Ticket (Admit Card) Released & Verified
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Hall Ticket No: <strong className="font-mono text-blue-900">HT-2026-CS-4209</strong> • Center: Aryabhata Academic Complex, Hall 3
              </p>
            </div>
            <button
              onClick={() => setIsHallTicketModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Hall Ticket</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fall 2026 End-Semester Theory Paper Schedule
            </div>
            <div className="divide-y divide-slate-100">
              {EXAM_SCHEDULES.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {exam.courseCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{exam.courseName}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Date: <strong className="text-slate-800">{exam.date}</strong></span>
                      <span>•</span>
                      <span>Timing: <strong className="text-slate-800">{exam.time}</strong></span>
                      <span>•</span>
                      <span>Duration: {exam.duration}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className="text-xs font-bold text-slate-800">{exam.hall}</span>
                    <span className="text-xs text-blue-700 font-mono">Assigned Seat: <strong>{exam.seatNo}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Fees & Online Payment Tab */}
      {activeSubTab === 'fees' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feesList.map((fee) => (
              <div
                key={fee.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">{fee.termName}</h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        fee.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span>Tuition & Instructional Fee:</span>
                      <span className="font-semibold text-slate-800">${fee.tuitionFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hostel & Mess Utilities:</span>
                      <span className="font-semibold text-slate-800">${fee.hostelFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Examination & Library Dues:</span>
                      <span className="font-semibold text-slate-800">${(fee.libraryFee + fee.examFee).toLocaleString()}</span>
                    </div>
                    {fee.scholarshipDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Dean's Merit Scholarship Deduction:</span>
                        <span>- ${fee.scholarshipDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 text-sm">
                      <span>Net Total:</span>
                      <span>${fee.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Paid to Date:</span>
                      <span className="text-emerald-600 font-semibold">${fee.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Remaining Balance:</span>
                      <span className={fee.dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        ${fee.dueAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Due Date: {fee.dueDate}</span>
                      {fee.transactionRef && (
                        <span className="font-mono">Ref: {fee.transactionRef}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {fee.dueAmount > 0 ? (
                    <button
                      onClick={() => handlePayFee(fee)}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Remaining Balance (${fee.dueAmount.toLocaleString()})</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>All Dues Settled</span>
                      </span>
                      <button
                        onClick={() => {
                          alert(`Downloading Official Payment Receipt for ${fee.termName}...\nTxn: ${fee.transactionRef || 'APX-TXN-2026-PAID'}`);
                        }}
                        className="text-blue-700 hover:underline text-[11px] font-bold flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Attendance Tracker Tab */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Regulatory Minimum Attendance Requirement: 75.0%
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic Regulation Code §4.2: Falling below 75% debars candidate from writing end-term examination papers.
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                Overall Aggregate: {overallAttendance}%
              </span>
            </div>

            <div className="space-y-4">
              {ATTENDANCE_RECORDS.map((att) => {
                const isBelowThreshold = att.percentage < 75;
                const isCloseToThreshold = att.percentage >= 75 && att.percentage < 80;

                return (
                  <div key={att.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{att.courseCode}</span>
                        <span className="text-slate-600 ml-2">{att.courseName}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="text-slate-500">
                          {att.attendedClasses}/{att.totalClasses} classes
                        </span>
                        <span
                          className={`font-bold ${
                            isBelowThreshold
                              ? 'text-rose-600'
                              : isCloseToThreshold
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isBelowThreshold
                            ? 'bg-rose-500'
                            : isCloseToThreshold
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, att.percentage)}%` }}
                      ></div>
                    </div>

                    {isCloseToThreshold && (
                      <p className="text-[11px] text-amber-700 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Caution: Close to the 75% limit. Missing the next lecture will drop you below threshold.</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Student Notices Tab */}
      {activeSubTab === 'notices' && (
        <div className="space-y-3">
          {NOTICES.filter((n) => n.audience === 'All' || n.audience === 'Student').map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{notice.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{notice.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onAskChatbot(`Explain this student notice: "${notice.title}"`)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>Inquire with AI Agent</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Online Payment Modal */}
      {isPayModalOpen && selectedFeeForPay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Apex University Payment Gateway</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isPaidSuccess ? (
              <div className="my-4 space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{selectedFeeForPay.termName}</p>
                  <p className="text-slate-500">Student: {STUDENT_PROFILE.name} ({STUDENT_PROFILE.rollNo})</p>
                  <div className="flex justify-between font-bold text-sm text-blue-900 pt-2 border-t border-slate-200">
                    <span>Payable Amount:</span>
                    <span>${selectedFeeForPay.dueAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2.5 border-2 border-blue-600 bg-blue-50/50 rounded-lg text-left font-bold text-blue-900">
                      💳 Credit/Debit Card
                    </button>
                    <button className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-left font-medium text-slate-700">
                      🏦 Net Banking
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-600 font-medium">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242"
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-600 font-medium">Expires</label>
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 font-medium">CVC</label>
                      <input
                        type="text"
                        readOnly
                        value="882"
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-xs"
                >
                  Authorize Payment of ${selectedFeeForPay.dueAmount.toLocaleString()}
                </button>
              </div>
            ) : (
              <div className="my-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Payment Authorized Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Receipt Reference: {latestTxnReceipt}</p>
                  <p className="text-xs text-emerald-700 mt-2 font-medium">
                    Your fee status has been updated to PAID. The exam hall ticket has been unlocked.
                  </p>
                </div>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Hall Ticket Modal */}
      {isHallTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Document Preview
              </span>
              <button
                onClick={() => setIsHallTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 border-2 border-slate-900 p-5 rounded-xl space-y-4 bg-white font-serif">
              <div className="text-center border-b border-slate-300 pb-3">
                <h3 className="text-base font-black tracking-tight uppercase text-slate-900 font-heading">
                  APEX UNIVERSITY • CONTROLLER OF EXAMINATIONS
                </h3>
                <p className="text-xs text-slate-600 italic">
                  End-Semester Examination Admit Card (Fall Session 2026)
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-sans">
                <div className="space-y-1">
                  <p><strong>Candidate Name:</strong> {STUDENT_PROFILE.name}</p>
                  <p><strong>Roll Number:</strong> {STUDENT_PROFILE.rollNo}</p>
                  <p><strong>Program:</strong> {STUDENT_PROFILE.program}</p>
                  <p><strong>Exam Center:</strong> Aryabhata Academic Block, Hall 3</p>
                </div>
                <div className="border border-slate-300 p-2 text-center rounded bg-slate-50">
                  <QrCode className="w-14 h-14 mx-auto text-slate-800" />
                  <span className="text-[9px] font-mono text-slate-500">HT-2026-CS-4209</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden text-[11px] font-sans">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Code</th>
                      <th className="p-2">Course Title</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EXAM_SCHEDULES.map((e) => (
                      <tr key={e.id}>
                        <td className="p-2 font-mono font-bold">{e.courseCode}</td>
                        <td className="p-2">{e.courseName}</td>
                        <td className="p-2">{e.date}</td>
                        <td className="p-2 font-bold">{e.seatNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Must be printed and presented with student ID</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
