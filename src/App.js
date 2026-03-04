import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart2, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  CheckCircle,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Download,
  MessageCircle,
  Trophy,
  Filter,
  RotateCcw // 초기화 아이콘 추가
} from 'lucide-react';

// --- Local Storage Custom Hook ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("로컬 스토리지 읽기 에러:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("로컬 스토리지 저장 에러:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// --- Sound Player (마법 & 천둥 소리) ---
const playSound = (type) => {
  try {
    if (type === 'magic') {
      new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82e55eb.mp3').play().catch(()=>{});
    } else if (type === 'thunder') {
      new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_3415eb6740.mp3').play().catch(()=>{});
    }
  } catch(e) {}
};

const App = () => {
  // --- Helpers ---
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getStartOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const getStartOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };
  const getStartOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

  // --- States ---
  const [activeTab, setActiveTab] = useState('students'); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  
  const [assignmentDetailStudent, setAssignmentDetailStudent] = useState(null);
  const [assignmentFilter, setAssignmentFilter] = useState('all'); 
  const [statusPickerTarget, setStatusPickerTarget] = useState(null); 
  const [moodPickerTarget, setMoodPickerTarget] = useState(null); 

  const [showSubjectModal, setShowSubjectModal] = useState(null); 
  const [showAssignmentModal, setShowAssignmentModal] = useState(null); 
  const [showStudentModal, setShowStudentModal] = useState(null); 
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // 매직 점수 전용 상태
  const [selectedStudentsForMagic, setSelectedStudentsForMagic] = useState([]); 
  const [magicPointValue, setMagicPointValue] = useState(1); 
  const [magicSortOrder, setMagicSortOrder] = useState('num'); 
  const [reportPeriod, setReportPeriod] = useState('all'); 
  // [추가] 리포트 기간 직접 지정 상태
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));

  const dateKey = formatDate(selectedDate);

  // --- Data States (Local Storage) ---
  const [students, setStudents] = useLocalStorage('magic_students', [
    { id: '1', num: '1', name: '김학생', memo: '메모 없음' },
    { id: '2', num: '2', name: '이학생', memo: '메모 없음' },
  ]);
  const [attendanceData, setAttendanceData] = useLocalStorage('magic_attendance', {});
  const [subjects, setSubjects] = useLocalStorage('magic_subjects', [{ id: 's1', title: '국어' }, { id: 's2', title: '수학' }]);
  const [assignments, setAssignments] = useLocalStorage('magic_assignments', []);
  const [assignmentStatus, setAssignmentStatus] = useLocalStorage('magic_assignmentStatus', {});
  const [counselingData, setCounselingData] = useLocalStorage('magic_counseling', {});
  const [magicPoints, setMagicPoints] = useLocalStorage('magic_points', {}); 

  const moods = ['😊', '🤩', '😐', '😴', '🤒', '😡', '😢', '😑'];

  // --- 자동 연계 로직: 과제 점수 전체 계산 ---
  const getStudentTaskPoints = (studentId) => {
    let taskPts = 0;
    Object.values(assignmentStatus || {}).forEach(dayData => {
      const sData = dayData[studentId] || {};
      Object.entries(sData).forEach(([k, v]) => {
        if (!k.startsWith('memo_')) {
          if (v === 'done') taskPts += 3;
          else if (v === 'ing') taskPts += 2;
          else if (v === 'bad') taskPts += 1;
        }
      });
    });
    return taskPts;
  };

  const getStudentTotalPoints = (studentId) => {
    const manualPoints = (magicPoints[studentId] || []).reduce((acc, p) => acc + p.amount, 0);
    const taskPoints = getStudentTaskPoints(studentId);
    return manualPoints + taskPoints;
  };

  // --- 달력 점 표시 로직 ---
  const getAttendanceDot = (date) => {
    const key = formatDate(date);
    const dayData = attendanceData[key];
    if (!dayData || students.length === 0) return null;
    return students.every(s => dayData[s.id]?.present === true) ? 'bg-green-500' : 'bg-red-500';
  };

  const getAssignmentDot = (date) => {
    const key = formatDate(date);
    const dayStatus = assignmentStatus[key];
    const dayTasks = assignments.filter(a => a.dueDate === key);
    if (dayTasks.length === 0) return null;
    if (!dayStatus || students.length === 0) return 'bg-red-500'; 
    return students.every(s => dayTasks.every(t => dayStatus[s.id]?.[t.id] === 'done' || dayStatus[s.id]?.[t.id] === 'ing')) ? 'bg-green-500' : 'bg-red-500';
  };

  const getCounselingDot = (date) => {
    const key = formatDate(date);
    const dayData = counselingData[key];
    if (!dayData || dayData.length === 0) return null;
    return dayData.some(r => !r.resolved) ? 'bg-red-500' : 'bg-blue-500';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return '◎';
      case 'ing': return '○';
      case 'bad': return '△';
      default: return '-';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'done': return '매우잘함(+3점)';
      case 'ing': return '잘함(+2점)';
      case 'bad': return '미흡(+1점)';
      default: return '미완료(0점)';
    }
  };

  const getStatusColorClass = (status) => {
    switch(status) {
      case 'done': return 'bg-blue-700 text-white'; 
      case 'ing': return 'bg-yellow-100 text-yellow-800'; 
      case 'bad': return 'bg-red-100 text-red-800'; 
      default: return 'bg-gray-100 text-gray-500'; 
    }
  };

  // --- Handlers ---
  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => {
      const currentDay = prev[dateKey] || {};
      const state = currentDay[studentId] || { present: false, mood: '😊', memo: '' };
      return { ...prev, [dateKey]: { ...currentDay, [studentId]: { ...state, present: !state.present } } };
    });
  };

  const setTaskStatus = (studentId, taskId, status, date = dateKey) => {
    setAssignmentStatus(prev => {
      const dayData = prev[date] || {};
      const studentData = dayData[studentId] || {};
      return { ...prev, [date]: { ...dayData, [studentId]: { ...studentData, [taskId]: status } } };
    });
    setStatusPickerTarget(null);
  };

  const updateTaskMemo = (studentId, taskId, memo, date = dateKey) => {
    setAssignmentStatus(prev => {
      const dayData = prev[date] || {};
      const studentData = dayData[studentId] || {};
      return { ...prev, [date]: { ...dayData, [studentId]: { ...studentData, [`memo_${taskId}`]: memo } } };
    });
  };

  const bulkTaskDone = (taskId) => {
    setAssignmentStatus(prev => {
      const dayData = prev[dateKey] || {};
      const newDayData = { ...dayData };
      students.forEach(s => {
        newDayData[s.id] = { ...(newDayData[s.id] || {}), [taskId]: 'done' };
      });
      return { ...prev, [dateKey]: newDayData };
    });
  };

  const saveStudent = (id, num, name, memo, isContinuous = false) => {
    if(!name || !num) return;
    let newStudents = [...students];
    if(id) newStudents = newStudents.map(s => s.id === id ? { ...s, num, name, memo } : s);
    else newStudents.push({ id: 'st' + Date.now(), num, name, memo });
    newStudents.sort((a, b) => parseInt(a.num) - parseInt(b.num));
    setStudents(newStudents);
    if (isContinuous) setShowStudentModal({id: null, num: (parseInt(num) + 1).toString(), name: '', memo: ''});
    else setShowStudentModal(null);
  };

  const handleInlineMemoUpdate = (id, newMemo) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, memo: newMemo } : s));
  };

  const deleteStudent = (id) => {
    if(window.confirm('정말로 이 학생을 삭제하시겠습니까? 관련 기록이 함께 지워질 수 있습니다.')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveSubject = (id, title) => {
    if(!title) return;
    if (id) setSubjects(subjects.map(s => s.id === id ? {...s, title} : s));
    else setSubjects([...subjects, { id: 's' + Date.now(), title }]);
    setShowSubjectModal(null);
  };

  const deleteSubject = (id, e) => {
    e.stopPropagation();
    if(window.confirm('과목을 삭제하시겠습니까? 등록된 과제도 함께 삭제됩니다.')) {
      setSubjects(subjects.filter(s => s.id !== id));
      setAssignments(assignments.filter(a => a.subjectId !== id));
    }
  };

  const deleteAssignment = (id) => {
    if(window.confirm('정말로 이 과제를 삭제하시겠습니까?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const addCounselingRecord = (date) => {
    const newRecord = { id: 'c' + Date.now(), recorder: '', studentId: '', content: '', result: '', resolved: false };
    setCounselingData(prev => ({ ...prev, [date]: [newRecord, ...(prev[date] || [])] }));
  };

  const updateCounselingRecord = (date, id, field, value) => {
    setCounselingData(prev => ({ ...prev, [date]: prev[date].map(r => r.id === id ? { ...r, [field]: value } : r) }));
  };

  const deleteCounselingRecord = (date, id) => {
    if(window.confirm('이 상담 기록을 삭제하시겠습니까?')) {
      setCounselingData(prev => ({ ...prev, [date]: prev[date].filter(r => r.id !== id) }));
    }
  };

  // 매직 점수 부여
  const handleMagicPointAction = (studentIdsArray, type) => {
    if (studentIdsArray.length === 0) return alert('학생을 먼저 선택해주세요.');
    
    playSound(type === 'plus' ? 'magic' : 'thunder');

    setMagicPoints(prev => {
      const newPoints = { ...prev };
      const amount = type === 'plus' ? magicPointValue : -magicPointValue;
      
      studentIdsArray.forEach(studentId => {
        const newRecord = {
          id: 'p' + Date.now() + Math.random(),
          date: dateKey,
          timestamp: new Date().getTime(),
          type,
          amount
        };
        newPoints[studentId] = [newRecord, ...(newPoints[studentId] || [])];
      });
      return newPoints;
    });
  };

  // [추가] 매직 점수 초기화
  const handleResetMagicPoints = () => {
    if(window.confirm('모든 학생의 [수동 부여 매직 점수]를 완전히 초기화하시겠습니까? (과제 연동 점수는 유지됩니다)\n이 작업은 되돌릴 수 없습니다.')) {
      setMagicPoints({});
    }
  };

  // [수정] 학생 리포트 통계 계산기 (과제 점수도 기간별로 필터링)
  const calculateReportData = () => {
    const now = new Date();
    const startOfToday = getStartOfDay(now).getTime();
    const startOfWeek = getStartOfWeek(now).getTime();
    const startOfMonth = getStartOfMonth(now).getTime();
    const cStart = new Date(customStartDate).getTime();
    const cEnd = new Date(customEndDate).setHours(23, 59, 59, 999);

    return students.map(student => {
      // 1. 수동 부여 매직 점수 계산
      const points = magicPoints[student.id] || [];
      const filteredPoints = points.filter(p => {
        if (reportPeriod === 'all') return true;
        if (!p.timestamp) return true; 
        if (reportPeriod === 'day') return p.timestamp >= startOfToday;
        if (reportPeriod === 'week') return p.timestamp >= startOfWeek;
        if (reportPeriod === 'month') return p.timestamp >= startOfMonth;
        if (reportPeriod === 'custom') return p.timestamp >= cStart && p.timestamp <= cEnd;
        return true;
      });

      const manualTotal = filteredPoints.reduce((acc, curr) => acc + curr.amount, 0);
      const plusCount = filteredPoints.filter(p => p.type === 'plus').length;
      const minusCount = filteredPoints.filter(p => p.type === 'minus').length;

      // 2. 과제 연동 점수 기간별 계산
      let taskPts = 0;
      Object.entries(assignmentStatus || {}).forEach(([dateStr, dayData]) => {
        const dateTs = new Date(dateStr).getTime();
        let include = false;
        if (reportPeriod === 'all') include = true;
        else if (reportPeriod === 'day' && dateTs >= startOfToday) include = true;
        else if (reportPeriod === 'week' && dateTs >= startOfWeek) include = true;
        else if (reportPeriod === 'month' && dateTs >= startOfMonth) include = true;
        else if (reportPeriod === 'custom' && dateTs >= cStart && dateTs <= cEnd) include = true;

        if (include) {
          const sData = dayData[student.id] || {};
          Object.entries(sData).forEach(([k, v]) => {
            if (!k.startsWith('memo_')) {
              if (v === 'done') taskPts += 3;
              else if (v === 'ing') taskPts += 2;
              else if (v === 'bad') taskPts += 1;
            }
          });
        }
      });

      const total = manualTotal + taskPts;

      return { ...student, total, plusCount, minusCount, taskPts };
    }).sort((a, b) => b.total - a.total); 
  };

  // 매직 탭 학생 정렬
  const sortedStudentsForMagic = [...students].sort((a, b) => {
    if (magicSortOrder === 'desc') return getStudentTotalPoints(b.id) - getStudentTotalPoints(a.id);
    if (magicSortOrder === 'asc') return getStudentTotalPoints(a.id) - getStudentTotalPoints(b.id);
    return parseInt(a.num) - parseInt(b.num);
  });

  // --- CSV Download ---
  const downloadCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += '날짜,구분,학생번호,학생이름,항목,상태/점수,메모\n';
    const escape = (s) => `"${String(s || '').replace(/"/g, '""')}"`;

    const allDates = Array.from(new Set([...Object.keys(attendanceData), ...assignments.map(a => a.dueDate), ...Object.keys(counselingData)])).sort();

    allDates.forEach(date => {
      students.forEach(student => {
        const att = attendanceData[date]?.[student.id];
        if (att) csvContent += `${date},출석,${student.num},${escape(student.name)},출석체크,${att.present?'출석':'결석'},${escape(att.mood + ' ' + att.memo)}\n`;
        assignments.filter(a => a.dueDate === date).forEach(t => {
          const s = assignmentStatus[date]?.[student.id]?.[t.id];
          csvContent += `${date},과제,${student.num},${escape(student.name)},${escape(t.title)},${getStatusLabel(s)},${escape(assignmentStatus[date]?.[student.id]?.[`memo_${t.id}`])}\n`;
        });
        (counselingData[date] || []).filter(c => c.studentId === student.id).forEach(c => {
          csvContent += `${date},상담,${student.num},${escape(student.name)},${escape(c.recorder)},${c.resolved?'완료':'미해결'},${escape(c.content + ' / ' + c.result)}\n`;
        });
      });
    });
    
    students.forEach(student => {
      (magicPoints[student.id] || []).forEach(p => {
        csvContent += `${p.date},매직점수,${student.num},${escape(student.name)},${p.type === 'plus' ? '칭찬매직' : '노력매직'},${p.amount},\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `매직클래스_데이터_${formatDate(new Date())}.csv`;
    link.click();
  };

  const calculatePopupPosition = (rect, expectedWidth = 200, expectedHeight = 150) => {
    let posX = rect.right + 10;
    let posY = rect.top - 10;
    if (posX + expectedWidth > window.innerWidth) posX = window.innerWidth - expectedWidth - 10;
    if (posY + expectedHeight > window.innerHeight) posY = window.innerHeight - expectedHeight - 20;
    return { x: posX, y: posY };
  };

  const Sidebar = () => (
    <div className="md:w-64 bg-white border-t md:border-t-0 md:border-r h-16 md:h-screen flex flex-row md:flex-col p-2 md:p-4 gap-2 fixed bottom-0 left-0 w-full z-50 md:relative overflow-x-auto items-center md:items-stretch shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none hide-scrollbar">
      <div className="hidden md:flex items-center gap-2 mb-8 px-2 text-indigo-600 font-bold text-xl"><Sparkles size={24} /><h1>매직클래스</h1></div>
      <button onClick={() => {setActiveTab('students'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={20} /> <span className="md:inline">학생 관리</span></button>
      <button onClick={() => {setActiveTab('attendance'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Calendar size={20} /> <span className="md:inline">출석 관리</span></button>
      <button onClick={() => {setActiveTab('assignments'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><BookOpen size={20} /> <span className="md:inline">과제 관리</span></button>
      <button onClick={() => {setActiveTab('status'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><BarChart2 size={20} /> <span className="md:inline">과제 현황</span></button>
      <button onClick={() => {setActiveTab('counseling'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><MessageCircle size={20} /> <span className="md:inline">학생 상담</span></button>
      <button onClick={() => {setActiveTab('magicpoints'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'magicpoints' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Trophy size={20} /> <span className="md:inline">매직 점수</span></button>
      
      <div className="hidden md:block my-2 border-t border-gray-100"></div>
      <button onClick={downloadCSV} className="hidden md:flex items-center gap-2 px-3 py-3 rounded-xl transition-all text-emerald-600 hover:bg-emerald-50 font-bold shadow-sm border border-emerald-100 text-sm whitespace-nowrap"><Download size={18} /> 엑셀 다운로드 (AI용)</button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-gray-900 font-sans pb-20 md:pb-0">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl"><Sparkles size={24} /> 매직클래스</div>
        <button onClick={downloadCSV} className="text-emerald-600 p-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-1 text-xs font-bold"><Download size={16} /> <span className="hidden sm:inline">엑셀 백업</span></button>
      </div>

      <Sidebar />
      
      <main className="flex-1 p-4 md:p-10 overflow-auto print-container relative">
        <div className="hidden md:flex justify-between items-center mb-8 no-print">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {activeTab === 'students' && (selectedStudent ? '개인 리포트' : '학생 명단 관리')}
            {activeTab === 'attendance' && '출석 관리'}
            {activeTab === 'assignments' && '과제 관리'}
            {activeTab === 'status' && '과제 현황 종합'}
            {activeTab === 'counseling' && '학생 상담 기록'}
            {activeTab === 'magicpoints' && '매직 점수 관리'}
          </h2>
        </div>

        {/* 1. 학생 관리 */}
        {activeTab === 'students' && !selectedStudent && (
          <div className="space-y-4 md:space-y-6 no-print">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">학생 명단</h3>
              <button onClick={() => setShowStudentModal({id: null, num: (students.length > 0 ? Math.max(...students.map(s => parseInt(s.num) || 0)) + 1 : 1).toString(), name: '', memo: ''})} className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg hover:bg-indigo-700 text-sm md:text-base"><Plus size={20} /> 학생 추가</button>
            </div>
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[500px] table-fixed">
                <thead className="bg-slate-50 text-gray-400 text-xs border-b font-black uppercase tracking-wider">
                  <tr><th className="px-6 md:px-10 py-4 md:py-5 w-24">번호</th><th className="px-6 md:px-10 py-4 md:py-5 w-48">이름</th><th className="px-6 md:px-10 py-4 md:py-5">학생 메모</th><th className="px-6 md:px-10 py-4 md:py-5 text-right w-32">작업</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.length === 0 && <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-bold">등록된 학생이 없습니다.</td></tr>}
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 md:px-10 py-4 md:py-6 text-gray-400 font-mono text-base md:text-lg truncate">{s.num.padStart(2, '0')}</td>
                      <td onClick={() => setSelectedStudent(s)} className="px-6 md:px-10 py-4 md:py-6 font-black text-xl md:text-2xl text-indigo-600 cursor-pointer hover:underline truncate whitespace-nowrap overflow-hidden text-ellipsis">{s.name}</td>
                      <td className="px-6 md:px-10 py-4 md:py-6 truncate"><input type="text" value={s.memo} onChange={e => handleInlineMemoUpdate(s.id, e.target.value)} placeholder="메모 입력" className="w-full bg-transparent border-none focus:ring-0 text-gray-600 font-medium truncate" /></td>
                      <td className="px-6 md:px-10 py-4 md:py-6 text-right"><div className="flex justify-end gap-2 md:gap-3"><button onClick={() => setShowStudentModal(s)} className="p-2 md:p-2.5 bg-gray-50 text-gray-300 hover:text-indigo-600 rounded-xl"><Edit2 size={18} /></button><button onClick={() => deleteStudent(s.id)} className="p-2 md:p-2.5 bg-gray-50 text-gray-300 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. 출석 관리 */}
        {activeTab === 'attendance' && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 no-print">
            <div className="shrink-0 w-full lg:w-80">
              <div className="bg-white p-5 lg:p-6 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                <div className="grid grid-cols-7 gap-y-2 text-center mb-2 font-semibold text-xs">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d} className="text-gray-300">{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getAttendanceDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 lg:p-8 min-w-0">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 lg:gap-3"><Calendar className="text-indigo-600" size={24} /><span>{dateKey} 출석부</span></h3>
                <button onClick={() => setAttendanceData(prev => ({...prev, [dateKey]: students.reduce((acc, s) => ({...acc, [s.id]: { ...(prev[dateKey]?.[s.id] || { mood: '😊', memo: '' }), present: true }}), prev[dateKey] || {})}))} className="bg-green-50 text-green-600 px-3 lg:px-4 py-2 rounded-xl font-bold hover:bg-green-100 flex items-center gap-1 text-xs lg:text-sm"><Check size={14} /> 전원 출석</button>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {students.length === 0 && <p className="text-gray-400 text-sm">먼저 학생 명단에서 학생을 추가해주세요.</p>}
                {students.map(student => {
                  const state = attendanceData[dateKey]?.[student.id] || { present: false, mood: '😊', memo: '' };
                  return (
                    <div key={student.id} className="flex items-center gap-3 lg:gap-4">
                      <button onClick={() => toggleAttendance(student.id)} className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${state.present ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}><CheckCircle size={20} className="lg:w-6 lg:h-6" /></button>
                      <div className="w-20 lg:w-24 font-black text-xl lg:text-2xl text-gray-700 shrink-0 truncate whitespace-nowrap">{student.name}</div>
                      <div className="relative shrink-0">
                        <button disabled={!state.present} onClick={(e) => setMoodPickerTarget({ studentId: student.id, ...calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 220, 120) })} className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-50 border-2 border-transparent flex items-center justify-center text-xl lg:text-2xl transition-all ${state.present ? 'hover:border-indigo-100' : 'opacity-30'}`}>{state.mood}</button>
                      </div>
                      <div className="flex-1"><input value={state.memo} onChange={(e) => setAttendanceData(p => ({...p, [dateKey]: {...p[dateKey], [student.id]: {...state, memo: e.target.value}}}))} placeholder="비고 입력..." className="w-full bg-slate-50 border-none px-4 lg:px-6 py-2.5 lg:py-3.5 rounded-2xl focus:ring-2 focus:ring-indigo-100 text-xs lg:text-sm font-medium" /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. 과제 관리 */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 no-print">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl lg:text-2xl font-bold">과목 및 과제 관리</h3>
                <div className="flex flex-wrap gap-2 lg:gap-4 text-xs font-bold mt-1">
                  <span className="flex items-center gap-1"><span className="text-blue-700 text-lg">◎</span> 매우잘함(+3점)</span><span className="flex items-center gap-1"><span className="text-yellow-600 text-lg">○</span> 잘함(+2점)</span><span className="flex items-center gap-1"><span className="text-red-500 text-lg">△</span> 미흡(+1점)</span><span className="flex items-center gap-1"><span className="text-gray-400 text-lg">-</span> 미완료(0점)</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setShowSubjectModal({id: null, title: ''})} className="flex-1 md:flex-none bg-white text-gray-600 border border-gray-200 px-4 py-2.5 rounded-2xl font-semibold shadow-sm hover:bg-gray-50 text-sm">과목 추가</button>
                <button onClick={() => {if(subjects.length===0)return alert('먼저 과목을 추가해주세요.'); setShowAssignmentModal({id: null, title: '', subjectId: subjects[0].id, dueDate: dateKey});}} className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-md hover:bg-indigo-700 text-sm">새 과제</button>
              </div>
            </div>
            
            <div className="space-y-4">
              {subjects.length === 0 && <div className="text-center py-10 text-gray-400 font-bold bg-white rounded-3xl">등록된 과목이 없습니다.</div>}
              {subjects.map(sub => {
                const subAssignments = assignments.filter(a => a.subjectId === sub.id);
                const isExpanded = expandedSubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-5 lg:px-8 py-5 lg:py-6 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-3 lg:gap-4 pr-16"><BookOpen className="text-indigo-400 shrink-0" size={20} /><span className="font-bold text-lg lg:text-xl text-gray-700 truncate">{sub.title}</span></div>
                        {isExpanded ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
                      </button>
                      <div className="absolute right-12 lg:right-20 flex gap-2 lg:gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-gradient-to-l from-white pl-4">
                        <Edit2 onClick={() => setShowSubjectModal({id: sub.id, title: sub.title})} size={18} className="text-gray-300 hover:text-indigo-600 cursor-pointer" />
                        <Trash2 onClick={(e) => deleteSubject(sub.id, e)} size={18} className="text-gray-300 hover:text-red-500 cursor-pointer" />
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-4 lg:px-8 pb-4 lg:pb-6 space-y-3">
                        {subAssignments.length === 0 ? <p className="text-gray-300 text-sm py-2 italic text-center">등록된 과제가 없습니다.</p> : 
                          subAssignments.map(a => (
                            <div key={a.id} className="border-t border-gray-50 pt-3">
                              <div onClick={() => setExpandedTask(expandedTask === a.id ? null : a.id)} className={`p-3 lg:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-all ${expandedTask === a.id ? 'bg-indigo-50/50' : 'bg-slate-50 hover:bg-indigo-50/30'}`}>
                                <div className="flex items-center gap-2 lg:gap-3 flex-wrap"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /><span className="font-bold text-sm lg:text-base text-gray-700">{a.title}</span><span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">{a.dueDate}</span></div>
                                <div className="flex items-center justify-end gap-1 text-xs text-indigo-400 font-bold">
                                  <button onClick={(e) => { e.stopPropagation(); setShowAssignmentModal(a); }} className="p-2 hover:bg-indigo-100 text-indigo-500 rounded-xl"><Edit2 size={16} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteAssignment(a.id); }} className="p-2 hover:bg-red-100 text-red-500 rounded-xl"><Trash2 size={16} /></button>
                                  <div className="ml-1 lg:ml-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-50 shadow-sm">{expandedTask === a.id ? '접기' : '현황 보기'}</div>
                                </div>
                              </div>
                              {expandedTask === a.id && (
                                <div className="mt-2 lg:mt-3 p-4 lg:p-6 bg-white border border-indigo-100 rounded-3xl">
                                  <div className="flex justify-between items-center mb-4 lg:mb-6"><h5 className="font-bold text-indigo-600 text-xs lg:text-sm">성취도 기록 (매직 점수 자동 연계)</h5><button onClick={() => bulkTaskDone(a.id)} className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700">전원 ◎ 완료</button></div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                    {students.map(s => {
                                      const status = assignmentStatus[dateKey]?.[s.id]?.[a.id] || null;
                                      return (
                                        <div key={s.id} className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 border border-gray-100 relative">
                                          {/* 상태 클릭 시 팝업 띄우기 */}
                                          <div onClick={(e) => setStatusPickerTarget({ studentId: s.id, taskId: a.id, date: dateKey, ...calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 160, 160) })} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border shadow-sm hover:scale-[1.02] ${getStatusColorClass(status)}`}>
                                            <span className="font-black text-lg truncate pr-2 whitespace-nowrap">{s.name}</span>
                                            <div className="flex flex-col items-end">
                                              <span className="font-black text-2xl">{getStatusIcon(status)}</span>
                                              <span className="text-[10px] opacity-70">클릭하여 평가</span>
                                            </div>
                                          </div>
                                          <input value={assignmentStatus[dateKey]?.[s.id]?.[`memo_${a.id}`] || ''} onChange={(e) => updateTaskMemo(s.id, a.id, e.target.value)} placeholder="메모..." className="w-full bg-white border border-gray-100 px-3 py-2 rounded-lg outline-none text-[11px] lg:text-xs font-medium" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. 과제 현황 */}
        {activeTab === 'status' && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 no-print">
            <div className="shrink-0 w-full lg:w-80">
              <div className="bg-white p-5 lg:p-6 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                <div className="grid grid-cols-7 gap-y-2 text-center mb-2 font-semibold text-xs">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d} className="text-gray-300">{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getAssignmentDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-2 mb-4 lg:mb-6">
                <h3 className="text-xl font-bold">{dateKey} 과제 진행 종합</h3><span className="text-xs text-gray-400 font-bold bg-white px-3 py-1.5 rounded-lg">학생을 클릭하면 개별 현황을 확인할 수 있습니다.</span>
              </div>
              {students.length === 0 && <div className="text-center py-10 text-gray-400 font-bold bg-white rounded-[32px]">등록된 학생이 없습니다.</div>}
              {students.map(student => {
                const tasks = assignments.filter(a => a.dueDate === dateKey);
                const status = assignmentStatus[dateKey]?.[student.id] || {};
                const done = Object.entries(status).filter(([k, v]) => !k.startsWith('memo_') && (v === 'done' || v === 'ing')).length;
                const total = tasks.length;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={student.id} onClick={() => setAssignmentDetailStudent(student)} className="bg-white p-5 lg:p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 lg:gap-8 hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-14 lg:w-20 font-black text-xl lg:text-2xl text-center text-gray-700 group-hover:text-indigo-600 truncate">{student.name}</div>
                    <div className="flex-1">
                      <div className="relative h-2 lg:h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5 lg:mb-2">
                        <div className={`absolute top-0 left-0 h-full transition-all duration-700 ${percent === 100 ? 'bg-indigo-600' : 'bg-indigo-400'}`} style={{ width: `${percent}%` }} />
                      </div>
                      <div className="text-[10px] lg:text-[11px] font-bold text-gray-400">{done} / {total} 완료 (◎, ○ 포함)</div>
                    </div>
                    <div className={`w-12 lg:w-20 text-right text-lg lg:text-xl font-black shrink-0 ${percent === 100 ? 'text-indigo-600' : 'text-slate-300'}`}>{percent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 학생 상담 */}
        {activeTab === 'counseling' && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 no-print overflow-hidden">
            <div className="shrink-0 w-full lg:w-80">
              <div className="bg-white p-5 lg:p-6 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                <div className="grid grid-cols-7 gap-y-2 text-center mb-2 font-semibold text-xs">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d} className="text-gray-300">{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getCounselingDot(curDate); 
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 lg:p-8 min-w-0 flex flex-col lg:h-[calc(100vh-6rem)]">
              <div className="flex items-center justify-between mb-4 lg:mb-6 shrink-0">
                <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 lg:gap-3 shrink-0"><MessageCircle className="text-indigo-600" size={24} /><span>{dateKey} 학생 상담</span></h3>
                <button onClick={() => addCounselingRecord(dateKey)} className="bg-indigo-600 text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-1 lg:gap-2 text-xs lg:text-sm shadow-md transition-all"><Plus size={16} /> <span className="hidden sm:inline">상담 추가</span></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 lg:pr-2 hide-scrollbar">
                {(counselingData[dateKey] || []).map((record) => (
                  <div key={record.id} className="bg-slate-50 p-4 lg:p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-4 relative group">
                    <button onClick={() => deleteCounselingRecord(dateKey, record.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"><Trash2 size={16} /></button>
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pr-8 lg:pr-10">
                      <div className="w-full sm:w-1/3"><label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">작성자</label><input value={record.recorder} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'recorder', e.target.value)} className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl outline-none text-xs lg:text-sm font-bold transition-all" placeholder="예: 담임" /></div>
                      <div className="w-full sm:w-1/3"><label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">학생 선택</label><select value={record.studentId} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'studentId', e.target.value)} className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl outline-none text-xs lg:text-sm font-bold appearance-none transition-all"><option value="" disabled>선택하세요</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}<option value="other">기타 (타반 등)</option></select></div>
                      <div className="w-full sm:w-1/3 flex sm:flex-col justify-end pb-0 sm:pb-1"><label className="flex items-center gap-2 cursor-pointer p-1.5 lg:p-2 rounded-xl hover:bg-gray-100 transition-colors w-fit"><input type="checkbox" checked={record.resolved} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'resolved', e.target.checked)} className="w-4 h-4 lg:w-5 lg:h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" /><span className={`font-black text-xs lg:text-sm ${record.resolved ? 'text-blue-600' : 'text-red-500'}`}>{record.resolved ? '해결 완료' : '미해결 상태'}</span></label></div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                      <div className="flex-1"><label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">상담 내용</label><textarea value={record.content} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'content', e.target.value)} rows={3} className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl outline-none text-xs lg:text-sm font-medium resize-none transition-all leading-relaxed" placeholder="상담 내용을 기록하세요..." /></div>
                      <div className="flex-1"><label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">상담 결과</label><textarea value={record.result} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'result', e.target.value)} rows={3} className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl outline-none text-xs lg:text-sm font-medium resize-none transition-all leading-relaxed" placeholder="조치 사항을 기록하세요..." /></div>
                    </div>
                  </div>
                ))}
                {(!counselingData[dateKey] || counselingData[dateKey].length === 0) && <div className="text-center py-16 lg:py-20 text-gray-300 font-bold flex flex-col items-center gap-3"><MessageCircle size={40} className="text-gray-200" /><p className="text-sm">기록된 상담 내용이 없습니다.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* 6. 매직 점수 */}
        {activeTab === 'magicpoints' && (
          <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* 상단 컨트롤 패널 */}
            <div className="bg-white p-6 rounded-[32px] border border-indigo-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2 mb-2"><Trophy className="text-indigo-600"/> 매직 점수 관리</h3>
                <p className="text-sm text-gray-500 font-medium mb-4">학생을 선택하고 한 번에 점수를 부여하세요. (소리 지원 🔊)</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setSelectedStudentsForMagic(students.length === selectedStudentsForMagic.length ? [] : students.map(s => s.id))} className="px-4 py-2 bg-slate-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                    {students.length > 0 && students.length === selectedStudentsForMagic.length ? '전체 해제' : '전체 선택'}
                  </button>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{selectedStudentsForMagic.length}명 선택됨</span>
                  
                  {/* 정렬 & 초기화 버튼 */}
                  <div className="flex items-center gap-2 ml-0 sm:ml-4">
                    <Filter size={16} className="text-gray-400"/>
                    <select value={magicSortOrder} onChange={(e)=>setMagicSortOrder(e.target.value)} className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer">
                      <option value="num">번호순 정렬</option>
                      <option value="desc">점수 높은 순</option>
                      <option value="asc">점수 낮은 순</option>
                    </select>
                    {/* [추가] 매직 점수 완전 초기화 버튼 */}
                    <button onClick={handleResetMagicPoints} className="ml-2 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                      <RotateCcw size={14} /> 초기화
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto p-4 bg-slate-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500 whitespace-nowrap">부여 점수:</span>
                  <select 
                    value={magicPointValue} 
                    onChange={(e) => setMagicPointValue(Number(e.target.value))}
                    className="w-20 bg-white border border-gray-200 px-3 py-2.5 rounded-xl font-bold text-center appearance-none focus:border-indigo-500 outline-none"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}점</option>)}
                  </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => handleMagicPointAction(selectedStudentsForMagic, 'plus')} className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 whitespace-nowrap">✨ 칭찬 (+)</button>
                  <button onClick={() => handleMagicPointAction(selectedStudentsForMagic, 'minus')} className="flex-1 sm:flex-none bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 shadow-md transition-all active:scale-95 whitespace-nowrap">⚡ 노력 (-)</button>
                </div>
              </div>
            </div>

            {/* 학생 개별 그리드 (1줄 5명) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedStudentsForMagic.map(student => {
                const total = getStudentTotalPoints(student.id);
                const isSelected = selectedStudentsForMagic.includes(student.id);
                
                return (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudentsForMagic(p => p.includes(student.id) ? p.filter(id => id !== student.id) : [...p, student.id])}
                    className={`bg-white rounded-[32px] p-5 md:p-6 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-between min-h-[220px] ${isSelected ? 'border-indigo-500 bg-indigo-50/20' : 'border-transparent'}`}
                  >
                    <div className="w-full flex justify-between items-start mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    
                    {/* 이름 1줄 고정 & 폰트 크기 확대 */}
                    <div className="text-2xl md:text-3xl font-black text-gray-800 text-center w-full truncate px-2 whitespace-nowrap">
                      {student.num}. {student.name}
                    </div>
                    
                    {/* 점수 크기 대폭 확대 */}
                    <div className={`text-5xl md:text-6xl font-black my-4 transition-all ${total > 0 ? 'text-blue-600' : total < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {total > 0 ? `+${total}` : total}
                    </div>

                    <div className="flex gap-2 w-full mt-2">
                      <button onClick={(e) => { e.stopPropagation(); handleMagicPointAction([student.id], 'plus'); }} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black py-2.5 rounded-xl transition-colors">칭찬</button>
                      <button onClick={(e) => { e.stopPropagation(); handleMagicPointAction([student.id], 'minus'); }} className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-black py-2.5 rounded-xl transition-colors">노력</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 학생 리포트 (통계 영역 - 기간 직접 지정 추가) */}
            <div className="mt-12 bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b pb-6 mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2"><BarChart2 className="text-indigo-600"/> 매직 점수 종합 리포트</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">과제 점수(+3, +2, +1)와 수동 매직 점수가 지정된 기간에 맞춰 필터링됩니다.</p>
                </div>
                
                {/* [추가] 기간 선택 및 직접 지정 입력란 */}
                <div className="flex flex-col lg:flex-row bg-slate-100 p-1.5 rounded-2xl w-full xl:w-auto gap-2">
                  <div className="flex w-full lg:w-auto">
                    <button onClick={() => setReportPeriod('day')} className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportPeriod === 'day' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>일간</button>
                    <button onClick={() => setReportPeriod('week')} className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportPeriod === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>주간</button>
                    <button onClick={() => setReportPeriod('month')} className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportPeriod === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>월간</button>
                    <button onClick={() => setReportPeriod('all')} className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportPeriod === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>전체</button>
                    <button onClick={() => setReportPeriod('custom')} className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${reportPeriod === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>직접지정</button>
                  </div>
                  {/* 기간 직접 지정 모드일 때만 달력 표시 */}
                  {reportPeriod === 'custom' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 justify-center">
                      <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-600 outline-none shadow-sm" />
                      <span className="text-gray-400 font-bold text-xs">~</span>
                      <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-600 outline-none shadow-sm" />
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 text-gray-500 text-xs uppercase font-black">
                    <tr>
                      <th className="px-6 py-4 rounded-l-2xl">순위</th>
                      <th className="px-6 py-4">학생 이름</th>
                      <th className="px-6 py-4 text-blue-600">수동 칭찬 (+)</th>
                      <th className="px-6 py-4 text-red-500">수동 노력 (-)</th>
                      <th className="px-6 py-4 text-emerald-600">과제 점수 연동</th>
                      <th className="px-6 py-4 text-right rounded-r-2xl">최종 종합 점수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {calculateReportData().map((student, index) => (
                      <tr key={student.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="px-6 py-5 font-bold text-gray-400">{index + 1}</td>
                        <td className="px-6 py-5 font-black text-lg text-gray-700">{student.num}. {student.name}</td>
                        <td className="px-6 py-5 font-bold text-blue-600">{student.plusCount}건</td>
                        <td className="px-6 py-5 font-bold text-red-500">{student.minusCount}건</td>
                        <td className="px-6 py-5 font-bold text-emerald-600">+{student.taskPts}점</td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-block px-4 py-1.5 rounded-xl font-black text-xl ${student.total > 0 ? 'bg-blue-50 text-blue-600' : student.total < 0 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                            {student.total > 0 ? `+${student.total}` : student.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 공통 팝업 영역 --- */}

        {/* 과제 성취도 평가 팝업 */}
        {statusPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setStatusPickerTarget(null)}>
            <div 
              className="absolute bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-1 w-40 animate-in zoom-in-95 duration-150"
              style={{ left: statusPickerTarget.x, top: statusPickerTarget.y }}
              onClick={e => e.stopPropagation()}
            >
              {[
                { s: 'done', l: '매우잘함 (+3점)' },
                { s: 'ing', l: '잘함 (+2점)' },
                { s: 'bad', l: '미흡 (+1점)' },
                { s: null, l: '미완료 (0점)' }
              ].map(item => (
                <button 
                  key={item.l}
                  onClick={() => {
                    playSound('magic'); 
                    setTaskStatus(statusPickerTarget.studentId, statusPickerTarget.taskId, item.s, statusPickerTarget.date);
                  }}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-xs font-bold transition-all ${getStatusColorClass(item.s)} hover:scale-[1.02]`}
                >
                  <span className="text-lg">{getStatusIcon(item.s)}</span>
                  <span>{item.l}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 출석 이모지 팝업 */}
        {moodPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setMoodPickerTarget(null)}>
            <div 
              className="absolute bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 grid grid-cols-4 gap-2 w-52 animate-in zoom-in-95 duration-150"
              style={{ left: moodPickerTarget.x, top: moodPickerTarget.y }}
              onClick={e => e.stopPropagation()}
            >
              {moods.map(m => (
                <button 
                  key={m} 
                  onClick={() => {
                    setAttendanceData(p => ({...p, [dateKey]: {...p[dateKey], [moodPickerTarget.studentId]: {...p[dateKey]?.[moodPickerTarget.studentId], mood: m}}}));
                    setMoodPickerTarget(null);
                  }} 
                  className="w-10 h-10 text-2xl hover:bg-slate-100 rounded-xl transition-colors hover:scale-110"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 개별 학생 상세 현황 모달 */}
        {assignmentDetailStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 p-4 md:p-6 pb-20 md:pb-6">
            <div className="bg-white rounded-[32px] md:rounded-[40px] w-full max-w-4xl h-[85vh] md:max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-5 md:p-8 border-b border-gray-50 flex justify-between items-start shrink-0 bg-indigo-50/30">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <span className="bg-indigo-600 text-white text-[10px] md:text-xs px-2 py-1 rounded-md font-bold">학생 상세 현황</span>
                    <h4 className="text-xl md:text-3xl font-black text-gray-800">{assignmentDetailStudent.name}</h4>
                  </div>
                  <p className="text-gray-400 font-bold text-xs md:text-sm">과제별 성취도 확인 (아이콘 클릭 시 변경 가능)</p>
                </div>
                <button onClick={() => {setAssignmentDetailStudent(null); setAssignmentFilter('all');}} className="p-2 md:p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-xl md:rounded-2xl shadow-sm transition-all"><X size={20} className="md:w-6 md:h-6" /></button>
              </div>

              <div className="px-5 md:px-8 py-3 md:py-4 bg-white border-b border-gray-100 flex gap-2 shrink-0 overflow-x-auto hide-scrollbar">
                <button onClick={() => setAssignmentFilter('all')} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${assignmentFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-gray-400 hover:bg-slate-100'}`}>전체보기</button>
                <button onClick={() => setAssignmentFilter('incomplete')} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${assignmentFilter === 'incomplete' ? 'bg-red-500 text-white' : 'bg-slate-50 text-gray-400 hover:bg-slate-100'}`}>미완료 (△, -)</button>
                <button onClick={() => setAssignmentFilter('complete')} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${assignmentFilter === 'complete' ? 'bg-green-600 text-white' : 'bg-slate-50 text-gray-400 hover:bg-slate-100'}`}>완료 (◎, ○)</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-3 md:space-y-4 bg-slate-50/30">
                {assignments
                  .filter(a => {
                    const status = assignmentStatus[a.dueDate]?.[assignmentDetailStudent.id]?.[a.id] || null;
                    if (assignmentFilter === 'complete') return status === 'done' || status === 'ing';
                    if (assignmentFilter === 'incomplete') return status !== 'done' && status !== 'ing';
                    return true;
                  })
                  .map(a => {
                    const status = assignmentStatus[a.dueDate]?.[assignmentDetailStudent.id]?.[a.id] || null;
                    const memo = assignmentStatus[a.dueDate]?.[assignmentDetailStudent.id]?.[`memo_${a.id}`] || '';
                    const subject = subjects.find(s => s.id === a.subjectId);
                    
                    return (
                      <div key={a.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <button 
                            onClick={(e) => {
                              const coords = calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 160, 150);
                              setStatusPickerTarget({ studentId: assignmentDetailStudent.id, taskId: a.id, date: a.dueDate, x: coords.x, y: coords.y });
                            }}
                            className={`shrink-0 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl border font-black text-xl md:text-2xl transition-all hover:scale-105 active:scale-95 ${getStatusColorClass(status)}`}
                          >
                            {getStatusIcon(status)}
                          </button>
                          <div className="flex-1 md:hidden">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-black px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded">{subject?.title || '기타'}</span>
                              <span className="text-[10px] font-bold text-gray-300">{a.dueDate}</span>
                            </div>
                            <h5 className="font-bold text-gray-700 text-sm">{a.title}</h5>
                          </div>
                        </div>
                        
                        <div className="hidden md:block flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded uppercase">{subject?.title || '기타'}</span>
                            <span className="text-xs font-bold text-gray-300">{a.dueDate}</span>
                          </div>
                          <h5 className="font-bold text-gray-700 text-lg">{a.title}</h5>
                          <p className={`text-xs font-bold mt-1 ${status === 'done' || status === 'ing' ? 'text-blue-600' : 'text-gray-400'}`}>
                            상태: {getStatusLabel(status)}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-72 shrink-0">
                          <input 
                            value={memo} 
                            onChange={(e) => updateTaskMemo(assignmentDetailStudent.id, a.id, e.target.value, a.dueDate)}
                            placeholder="개별 메모 입력..." 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-medium transition-all"
                          />
                        </div>
                      </div>
                    );
                  })
                }
                {assignments.length === 0 && <div className="text-center py-20 text-gray-300 font-bold text-sm">할당된 과제가 없습니다.</div>}
              </div>
            </div>
          </div>
        )}

        {/* 과목 관리 모달 */}
        {showSubjectModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
            <div className="bg-white rounded-[32px] p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl md:text-2xl font-bold">{showSubjectModal.id ? '과목 수정' : '새 과목 생성'}</h4>
                <button onClick={() => setShowSubjectModal(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-4 md:space-y-6">
                <input id="sub_input" autoFocus defaultValue={showSubjectModal.title} onKeyDown={(e) => {if(e.key==='Enter') saveSubject(showSubjectModal.id, e.target.value)}} className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base" placeholder="과목명을 입력하세요" />
                <button onClick={() => saveSubject(showSubjectModal.id, document.getElementById('sub_input').value)} className="w-full bg-indigo-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg">저장</button>
              </div>
            </div>
          </div>
        )}

        {/* --- Missing Modals Restored Here --- */}
        {showStudentModal && (
          <StudentEditModal 
            key={showStudentModal.id || `new_student_${showStudentModal.num}`}
            data={showStudentModal} 
            onClose={() => setShowStudentModal(null)} 
            onSave={saveStudent} 
          />
        )}

        {showAssignmentModal && (
          <AssignmentEditModal 
            key={showAssignmentModal.id || 'new_assignment'}
            data={showAssignmentModal}
            subjects={subjects}
            onClose={() => setShowAssignmentModal(null)}
            onSave={(id, title, subId, date) => {
              if(!title) return;
              if (id) {
                setAssignments(prev => prev.map(a => a.id === id ? { ...a, title, subjectId: subId, dueDate: date } : a));
              } else {
                setAssignments(prev => [{ id: 'a' + Date.now(), subjectId: subId, title, dueDate: date }, ...prev]);
              }
              setShowAssignmentModal(null);
            }}
          />
        )}

      </main>
      
      {/* CSS */}
      <style dangerouslySetContent={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

// --- 독립된 모달 컴포넌트들 ---
const AssignmentEditModal = ({ data, subjects, onClose, onSave }) => {
  const [title, setTitle] = useState(data.title || '');
  const [subjectId, setSubjectId] = useState(data.subjectId || '');
  const [dueDate, setDueDate] = useState(data.dueDate || '');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[32px] p-6 md:p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h4 className="text-xl md:text-2xl font-bold">{data.id ? '과제 수정' : '새 과제 등록'}</h4>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1.5 md:mb-2 ml-1">과제 제목</label>
            <input 
              autoFocus 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  e.preventDefault();
                  onSave(data.id, title, subjectId, dueDate);
                }
              }}
              placeholder="예: 국어활동 12쪽 풀기"
              className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base" 
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1.5 md:mb-2 ml-1">과목 선택</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none font-bold appearance-none text-sm md:text-base">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1.5 md:mb-2 ml-1">마감 기한</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base" />
          </div>
          <button onClick={() => onSave(data.id, title, subjectId, dueDate)} className="w-full bg-indigo-600 text-white py-3 md:py-4 mt-2 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:bg-indigo-700 transition-all">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentEditModal = ({ data, onClose, onSave }) => {
  const [num, setNum] = useState(data.num || '');
  const [name, setName] = useState(data.name || '');
  const [memo, setMemo] = useState(data.memo || '');
  const nameRef = useRef(null);
  const memoRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentField === 'name') {
        if (data.id === null) onSave(data.id, num, name, memo, true);
        else memoRef.current?.focus(); 
      } else if (currentField === 'memo') {
        onSave(data.id, num, name, memo, data.id === null); 
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[32px] p-6 md:p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h4 className="text-xl md:text-2xl font-black text-gray-800">{data.id ? '학생 정보 수정' : '신규 학생 등록'}</h4>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-4 md:space-y-6">
          <div className="flex gap-3 md:gap-4">
            <div className="w-20 md:w-24">
              <label className="block text-xs font-black text-gray-400 mb-1.5 md:mb-2 ml-1">번호</label>
              <input value={num} onChange={(e) => setNum(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white px-3 md:px-4 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-center text-sm md:text-base" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-black text-gray-400 mb-1.5 md:mb-2 ml-1">이름</label>
              <input 
                ref={nameRef} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                onKeyDown={(e) => handleKeyDown(e, 'name')} 
                placeholder="학생 이름"
                className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 mb-1.5 md:mb-2 ml-1">메모 (선택사항)</label>
            <input 
              ref={memoRef} 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'memo')} 
              placeholder="참고사항 입력"
              className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-500 focus:bg-white px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-sm md:text-base" 
            />
          </div>
          <button onClick={() => onSave(data.id, num, name, memo, data.id === null)} className="w-full bg-indigo-600 text-white py-3 md:py-4 mt-2 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg hover:bg-indigo-700 transition-all">
            {data.id ? '수정 완료' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
