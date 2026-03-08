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
  RotateCcw,
  CheckSquare,
  Link as LinkIcon,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Brain // [추가] 완전 학습용 아이콘
} from 'lucide-react';

// --- Local Storage Custom Hook (데이터 영구 누적 저장) ---
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

// --- 자체 내장 Sound Player (끊김 없고 소리 크게) ---
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'magic') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); 
      gain.gain.setValueAtTime(1, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); 
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'thunder') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(1, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch(e) {
    console.log("오디오 재생 오류:", e);
  }
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
  const [expandedSubmission, setExpandedSubmission] = useState(null); 
  
  const [assignmentDetailStudent, setAssignmentDetailStudent] = useState(null);
  const [assignmentFilter, setAssignmentFilter] = useState('all'); 
  const [statusPickerTarget, setStatusPickerTarget] = useState(null); 
  const [moodPickerTarget, setMoodPickerTarget] = useState(null); 

  const [showSubjectModal, setShowSubjectModal] = useState(null); 
  const [showAssignmentModal, setShowAssignmentModal] = useState(null); 
  const [showSubmissionModal, setShowSubmissionModal] = useState(null); 
  const [showStudentModal, setShowStudentModal] = useState(null); 
  const [showLinkModal, setShowLinkModal] = useState(null); 
  const [showConceptModal, setShowConceptModal] = useState(null); // [추가] 완전 학습 개념 모달
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedMasterySubjects, setExpandedMasterySubjects] = useState({}); // [추가] 완전학습 아코디언

  // 매직 점수 및 리포트 전용 상태
  const [selectedStudentsForMagic, setSelectedStudentsForMagic] = useState([]); 
  const [magicPointValue, setMagicPointValue] = useState(1); 
  const [magicSortOrder, setMagicSortOrder] = useState('num'); 
  const [reportPeriod, setReportPeriod] = useState('all'); 
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));
  const [reportSortOrder, setReportSortOrder] = useState('desc');

  // 외부 자료 전용 상태
  const [selectedExternalLink, setSelectedExternalLink] = useState(null);

  const dateKey = formatDate(selectedDate);

  // 탭 이동 시 날짜 현행화
  useEffect(() => {
    setSelectedDate(new Date());
  }, [activeTab]);

  // --- Data States (Local Storage) ---
  const [students, setStudents] = useLocalStorage('magic_students', [
    { id: '1', num: '1', name: '김학생', memo: '메모 없음' },
    { id: '2', num: '2', name: '이학생', memo: '메모 없음' },
  ]);
  const [attendanceData, setAttendanceData] = useLocalStorage('magic_attendance', {});
  const [submissions, setSubmissions] = useLocalStorage('magic_submissions', []);
  const [submissionStatus, setSubmissionStatus] = useLocalStorage('magic_submissionStatus', {});
  const [subjects, setSubjects] = useLocalStorage('magic_subjects', [{ id: 's1', title: '국어' }, { id: 's2', title: '수학' }]);
  const [assignments, setAssignments] = useLocalStorage('magic_assignments', []);
  const [assignmentStatus, setAssignmentStatus] = useLocalStorage('magic_assignmentStatus', {});
  const [counselingData, setCounselingData] = useLocalStorage('magic_counseling', {});
  const [magicPoints, setMagicPoints] = useLocalStorage('magic_points', {}); 
  const [externalLinks, setExternalLinks] = useLocalStorage('magic_external_links', []); 
  const [masteryConcepts, setMasteryConcepts] = useLocalStorage('magic_mastery_concepts', []); // [추가] 완전학습 데이터

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

  const toggleSubmissionStatus = (submissionId, studentId) => {
    setSubmissionStatus(prev => {
      const currentSubStatus = prev[submissionId] || {};
      const isSubmitted = currentSubStatus[studentId] || false;
      return { ...prev, [submissionId]: { ...currentSubStatus, [studentId]: !isSubmitted } };
    });
  };

  const bulkCompleteSubmission = (submissionId) => {
    setSubmissionStatus(prev => {
      const newStatus = { ...(prev[submissionId] || {}) };
      students.forEach(s => { newStatus[s.id] = true; });
      return { ...prev, [submissionId]: newStatus };
    });
  };

  const deleteSubmissionItem = (id) => {
    if(window.confirm('이 제출물을 삭제하시겠습니까?')) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
    }
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
      students.forEach(s => { newDayData[s.id] = { ...(newDayData[s.id] || {}), [taskId]: 'done' }; });
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
    if(window.confirm('과목을 삭제하시겠습니까? 등록된 과제와 완전 학습 개념이 함께 삭제됩니다.')) {
      setSubjects(subjects.filter(s => s.id !== id));
      setAssignments(assignments.filter(a => a.subjectId !== id));
      setMasteryConcepts(masteryConcepts.filter(c => c.subjectId !== id)); // 연계 삭제
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

  // 완전 학습 핸들러 [추가]
  const saveConcept = (id, subjectId, term, hanja, meaning) => {
    if(!term || !subjectId) return;
    if (id) {
      setMasteryConcepts(prev => prev.map(c => c.id === id ? { ...c, subjectId, term, hanja, meaning } : c));
    } else {
      setMasteryConcepts(prev => [{ id: 'mc' + Date.now(), subjectId, term, hanja, meaning }, ...prev]);
    }
    setShowConceptModal(null);
  };

  const deleteConcept = (id) => {
    if(window.confirm('이 중요 개념을 삭제하시겠습니까?')) {
      setMasteryConcepts(prev => prev.filter(c => c.id !== id));
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
        const newRecord = { id: 'p' + Date.now() + Math.random(), date: dateKey, timestamp: new Date().getTime(), type, amount };
        newPoints[studentId] = [newRecord, ...(newPoints[studentId] || [])];
      });
      return newPoints;
    });
  };

  const handleResetMagicPoints = () => {
    if(window.confirm('모든 학생의 [수동 부여 매직 점수]를 완전히 초기화하시겠습니까? (과제 연동 점수는 유지됩니다)\n이 작업은 되돌릴 수 없습니다.')) {
      setMagicPoints({});
    }
  };

  // 외부 자료 핸들러
  const saveExternalLink = (id, title, url) => {
    if (!title || !url) return;
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl; 
    }

    if (id) {
      setExternalLinks(prev => prev.map(l => l.id === id ? { ...l, title, url: formattedUrl } : l));
      if (selectedExternalLink?.id === id) setSelectedExternalLink({ id, title, url: formattedUrl });
    } else {
      setExternalLinks(prev => [...prev, { id: 'l' + Date.now(), title, url: formattedUrl }]);
    }
    setShowLinkModal(null);
  };

  const deleteExternalLink = (id) => {
    if (window.confirm('이 링크를 삭제하시겠습니까?')) {
      setExternalLinks(prev => prev.filter(l => l.id !== id));
      if (selectedExternalLink?.id === id) setSelectedExternalLink(null);
    }
  };

  const moveExternalLink = (index, direction) => {
    setExternalLinks(prev => {
      const newLinks = [...prev];
      if (direction === 'up' && index > 0) {
        [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
      } else if (direction === 'down' && index < newLinks.length - 1) {
        [newLinks[index + 1], newLinks[index]] = [newLinks[index], newLinks[index + 1]];
      }
      return newLinks;
    });
  };

  // 학생 리포트 통계 계산 및 정렬
  const calculateReportData = () => {
    const now = new Date();
    const startOfToday = getStartOfDay(now).getTime();
    const startOfWeek = getStartOfWeek(now).getTime();
    const startOfMonth = getStartOfMonth(now).getTime();
    const cStart = new Date(customStartDate).getTime();
    const cEnd = new Date(customEndDate).setHours(23, 59, 59, 999);

    const reportData = students.map(student => {
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
    });

    return reportData.sort((a, b) => {
      if (reportSortOrder === 'desc') return b.total - a.total;
      if (reportSortOrder === 'asc') return a.total - b.total;
      return parseInt(a.num) - parseInt(b.num); 
    });
  };

  const sortedStudentsForMagic = [...students].sort((a, b) => {
    if (magicSortOrder === 'desc') return getStudentTotalPoints(b.id) - getStudentTotalPoints(a.id);
    if (magicSortOrder === 'asc') return getStudentTotalPoints(a.id) - getStudentTotalPoints(b.id);
    return parseInt(a.num) - parseInt(b.num);
  });

  const downloadCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += '학생번호,학생이름,날짜,기록분류,세부항목,상태_및_점수,비고_및_메모\n';
    const escape = (s) => `"${String(s || '').replace(/"/g, '""')}"`;

    const sortedExportStudents = [...students].sort((a, b) => parseInt(a.num) - parseInt(b.num));
    const allDates = Array.from(new Set([
      ...Object.keys(attendanceData),
      ...assignments.map(a => a.dueDate),
      ...Object.keys(counselingData),
      ...submissions.map(s => s.date),
      ...Object.values(magicPoints).flat().map(p => p.date)
    ])).sort();

    sortedExportStudents.forEach(student => {
      allDates.forEach(date => {
        const att = attendanceData[date]?.[student.id];
        if (att) {
          const emojiStr = att.mood !== '😊' ? att.mood : '';
          csvContent += `${student.num},${escape(student.name)},${date},출석,일일출결,${att.present?'출석':'결석'},${escape(emojiStr + ' ' + att.memo)}\n`;
        }
        
        submissions.filter(s => s.date === date).forEach(subm => {
          const isSubm = submissionStatus[subm.id]?.[student.id];
          csvContent += `${student.num},${escape(student.name)},${date},제출물,${escape(subm.title)},${isSubm?'제출완료':'미제출'},\n`;
        });

        assignments.filter(a => a.dueDate === date).forEach(t => {
          const s = assignmentStatus[date]?.[student.id]?.[t.id];
          if(s !== undefined && s !== null) { 
            csvContent += `${student.num},${escape(student.name)},${date},과제,${escape(t.title)},${getStatusLabel(s)},${escape(assignmentStatus[date]?.[student.id]?.[`memo_${t.id}`])}\n`;
          }
        });
        
        (counselingData[date] || []).filter(c => c.studentId === student.id).forEach(c => {
          csvContent += `${student.num},${escape(student.name)},${date},상담기록,${escape('작성:'+c.recorder)},${c.resolved?'해결완료':'미해결'},${escape('내용:'+c.content + ' / 조치:' + c.result)}\n`;
        });

        (magicPoints[student.id] || []).filter(p => p.date === date).forEach(p => {
          csvContent += `${student.num},${escape(student.name)},${date},매직점수,${p.type === 'plus' ? '칭찬' : '노력'},${p.amount > 0 ? '+'+p.amount : p.amount},\n`;
        });
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `매직클래스_AI분석용데이터_${formatDate(new Date())}.csv`;
    link.click();
  };

  const calculatePopupPosition = (rect, expectedWidth = 240, expectedHeight = 200) => {
    let posX = rect.right + 10;
    let posY = rect.top - 10;
    if (posX + expectedWidth > window.innerWidth) posX = window.innerWidth - expectedWidth - 10;
    if (posY + expectedHeight > window.innerHeight) posY = window.innerHeight - expectedHeight - 20;
    return { x: posX, y: posY };
  };

  const Sidebar = () => (
    <div className="md:w-72 bg-white border-t md:border-t-0 md:border-r h-16 md:h-screen flex flex-row md:flex-col p-2 md:p-6 gap-2 fixed bottom-0 left-0 w-full z-50 md:relative overflow-x-auto items-center md:items-stretch shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-none hide-scrollbar">
      <div className="hidden md:flex items-center gap-3 mb-10 px-2 text-indigo-600 font-black text-3xl tracking-tight">
        <Sparkles size={32} strokeWidth={2.5} /><h1>매직클래스</h1>
      </div>
      <button onClick={() => {setActiveTab('students'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Users size={24} /> <span className="md:inline">학생 관리</span></button>
      <button onClick={() => {setActiveTab('attendance'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Calendar size={24} /> <span className="md:inline">출석 관리</span></button>
      <button onClick={() => {setActiveTab('submissions'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'submissions' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><CheckSquare size={24} /> <span className="md:inline">제출 관리</span></button>
      <button onClick={() => {setActiveTab('assignments'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><BookOpen size={24} /> <span className="md:inline">과제 관리</span></button>
      <button onClick={() => {setActiveTab('status'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><BarChart2 size={24} /> <span className="md:inline">과제 현황</span></button>
      {/* [추가] 완전 학습 탭 버튼 */}
      <button onClick={() => {setActiveTab('mastery'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'mastery' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Brain size={24} /> <span className="md:inline">완전 학습</span></button>
      <button onClick={() => {setActiveTab('counseling'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><MessageCircle size={24} /> <span className="md:inline">학생 상담</span></button>
      <button onClick={() => {setActiveTab('magicpoints'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'magicpoints' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Trophy size={24} /> <span className="md:inline">매직 점수</span></button>
      <button onClick={() => {setActiveTab('externals'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'externals' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><LinkIcon size={24} /> <span className="md:inline">외부 자료</span></button>
      
      <div className="hidden md:block my-4 border-t-2 border-gray-100"></div>
      <button onClick={downloadCSV} className="hidden md:flex items-center justify-center gap-3 p-4 rounded-2xl transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-black shadow-sm text-lg whitespace-nowrap border border-emerald-200"><Download size={22} /> AI분석 엑셀 다운</button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-gray-900 font-sans pb-24 md:pb-0">
      <div className="md:hidden flex items-center justify-between p-5 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl"><Sparkles size={28} /> 매직클래스</div>
        <button onClick={downloadCSV} className="text-emerald-600 px-4 py-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-2 text-sm font-black border border-emerald-200"><Download size={18} /> <span className="hidden sm:inline">AI 엑셀</span></button>
      </div>

      <Sidebar />
      
      <main className="flex-1 p-4 md:p-10 overflow-auto print-container relative">
        <div className="hidden md:flex justify-between items-center mb-8 no-print">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            {activeTab === 'students' && (selectedStudent ? '개인 리포트' : '학생 명단 관리')}
            {activeTab === 'attendance' && '출석 관리'}
            {activeTab === 'submissions' && '제출 관리'}
            {activeTab === 'assignments' && '과제 관리'}
            {activeTab === 'status' && '과제 현황 종합'}
            {activeTab === 'mastery' && '완전 학습 (중요 개념)'}
            {activeTab === 'counseling' && '학생 상담 기록'}
            {activeTab === 'magicpoints' && '매직 점수 관리'}
            {activeTab === 'externals' && '외부 자료 관리'}
          </h2>
        </div>

        {/* 1. 학생 관리 */}
        {activeTab === 'students' && !selectedStudent && (
          <div className="space-y-6 md:space-y-8 no-print">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">학생 명단</h3>
              <button onClick={() => setShowStudentModal({id: null, num: (students.length > 0 ? Math.max(...students.map(s => parseInt(s.num) || 0)) + 1 : 1).toString(), name: '', memo: ''})} className="bg-indigo-600 text-white px-5 md:px-8 py-3 md:py-4 rounded-2xl flex items-center gap-2 font-black shadow-lg hover:bg-indigo-700 text-base md:text-lg transition-transform active:scale-95"><Plus size={24} /> 학생 추가</button>
            </div>
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[600px] table-fixed">
                <thead className="bg-slate-50 text-gray-500 text-sm md:text-base border-b-2 font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-4 md:px-8 py-5 md:py-6 w-20 md:w-32 text-center">번호</th>
                    <th className="px-6 md:px-10 py-5 md:py-6 w-48 md:w-64">이름</th>
                    <th className="px-6 md:px-10 py-5 md:py-6">학생 메모</th>
                    <th className="px-6 md:px-10 py-5 md:py-6 text-right w-32 md:w-48">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.length === 0 && <tr><td colSpan="4" className="text-center py-16 text-gray-400 font-bold text-lg">등록된 학생이 없습니다.</td></tr>}
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-4 md:px-8 py-6 md:py-8 text-gray-700 font-black text-xl md:text-2xl text-center whitespace-nowrap">{s.num}</td>
                      <td onClick={() => setSelectedStudent(s)} className="px-6 md:px-10 py-6 md:py-8 font-black text-2xl md:text-3xl text-indigo-600 cursor-pointer hover:underline truncate whitespace-nowrap overflow-hidden text-ellipsis">{s.name}</td>
                      <td className="px-6 md:px-10 py-6 md:py-8 truncate">
                        <input type="text" value={s.memo} onChange={e => handleInlineMemoUpdate(s.id, e.target.value)} placeholder="메모 입력" className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-bold text-lg md:text-xl truncate placeholder-gray-300" />
                      </td>
                      <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-3 md:gap-4">
                          <button onClick={() => setShowStudentModal(s)} className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"><Edit2 size={22} /></button>
                          <button onClick={() => deleteStudent(s.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={22} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. 출석 관리 */}
        {activeTab === 'attendance' && (
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-10 no-print">
            <div className="shrink-0 w-full xl:w-96">
              <div className="bg-white p-6 lg:p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-2xl text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                  <button onClick={() => setSelectedDate(new Date())} className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black hover:bg-indigo-100 transition-colors">오늘</button>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center mb-2 font-black text-sm text-gray-400">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getAttendanceDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 w-2 h-2 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm p-6 lg:p-10 min-w-0">
              <div className="flex items-center justify-between mb-8 lg:mb-10 border-b pb-6">
                <h3 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-gray-800"><Calendar className="text-indigo-600" size={32} /><span>{dateKey} 출석부</span></h3>
                <button onClick={() => setAttendanceData(prev => ({...prev, [dateKey]: students.reduce((acc, s) => ({...acc, [s.id]: { ...(prev[dateKey]?.[s.id] || { mood: '😊', memo: '' }), present: true }}), prev[dateKey] || {})}))} className="bg-green-50 text-green-600 px-5 py-3 rounded-2xl font-black hover:bg-green-100 flex items-center gap-2 text-base lg:text-lg transition-transform active:scale-95"><Check size={20} strokeWidth={3} /> 전원 출석</button>
              </div>
              <div className="space-y-4 lg:space-y-6">
                {students.length === 0 && <p className="text-gray-400 text-lg font-bold text-center py-10">먼저 학생 명단에서 학생을 추가해주세요.</p>}
                {students.map(student => {
                  const state = attendanceData[dateKey]?.[student.id] || { present: false, mood: '😊', memo: '' };
                  return (
                    <div key={student.id} className="flex items-center gap-4 lg:gap-6 bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-indigo-100 transition-colors">
                      <button onClick={() => toggleAttendance(student.id)} className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all shrink-0 ${state.present ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-gray-200 text-white'}`}><CheckCircle size={28} strokeWidth={3} /></button>
                      <div className="w-24 lg:w-32 font-black text-2xl lg:text-3xl text-gray-800 shrink-0 truncate whitespace-nowrap">{student.name}</div>
                      <div className="relative shrink-0">
                        <button disabled={!state.present} onClick={(e) => setMoodPickerTarget({ studentId: student.id, ...calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 260, 160) })} className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-3xl lg:text-4xl transition-all shadow-sm ${state.present ? 'hover:border-indigo-300 hover:shadow-md' : 'opacity-30'}`}>{state.mood}</button>
                      </div>
                      <div className="flex-1"><input value={state.memo} onChange={(e) => setAttendanceData(p => ({...p, [dateKey]: {...p[dateKey], [student.id]: {...state, memo: e.target.value}}}))} placeholder="비고 입력 (선택)" className="w-full bg-white border border-gray-100 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none text-base lg:text-lg font-bold text-gray-700 shadow-sm" /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2.5 제출 관리 */}
        {activeTab === 'submissions' && (
          <div className="space-y-6 lg:space-y-8 no-print">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2 border-b pb-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-gray-800"><CheckSquare className="text-indigo-600" size={32}/> 제출물 관리</h3>
                <span className="text-sm font-bold text-gray-500 ml-1">가정통신문, 동의서 등 단순 O/X 확인용</span>
              </div>
              <button onClick={() => setShowSubmissionModal({id: null, title: '', date: dateKey})} className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 text-base lg:text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                <Plus size={22}/> 새 제출물
              </button>
            </div>
            
            <div className="space-y-5">
              {submissions.length === 0 && <div className="text-center py-16 text-gray-400 font-bold text-lg bg-white rounded-[40px] border border-gray-100">등록된 제출물이 없습니다.</div>}
              {submissions.map(subm => {
                const isExpanded = expandedSubmission === subm.id;
                const submittedCount = students.filter(s => submissionStatus[subm.id]?.[s.id]).length;
                const percent = students.length > 0 ? Math.round((submittedCount / students.length) * 100) : 0;
                
                return (
                  <div key={subm.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedSubmission(p => p === subm.id ? null : subm.id)} className="flex-1 px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-4 lg:gap-6 pr-16 w-full">
                          <CheckSquare className={`shrink-0 ${percent === 100 ? 'text-green-500' : 'text-indigo-400'}`} size={28} strokeWidth={2.5} />
                          <span className="font-black text-xl lg:text-2xl text-gray-800 truncate">{subm.title}</span>
                          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shrink-0">{subm.date}</span>
                          
                          <div className="hidden md:flex flex-1 items-center gap-4 ml-6 max-w-md">
                            <div className="h-3.5 flex-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div className={`h-full transition-all duration-700 ${percent === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${percent}%`}}></div>
                            </div>
                            <span className="text-base font-black text-gray-500 w-16 text-right">{submittedCount}/{students.length}</span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="text-gray-400" size={24} /> : <ChevronDown className="text-gray-400" size={24} />}
                      </button>
                      <div className="absolute right-16 lg:right-24 flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-gradient-to-l from-white pl-6 transition-opacity">
                        <button onClick={() => setShowSubmissionModal(subm)} className="p-3 text-gray-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-100 rounded-xl transition-colors"><Edit2 size={20}/></button>
                        <button onClick={() => deleteSubmissionItem(subm.id)} className="p-3 text-gray-400 hover:text-red-500 bg-slate-100 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={20}/></button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-6 lg:px-10 pb-6 lg:pb-8">
                        <div className="p-6 lg:p-8 bg-slate-50 border border-indigo-100 rounded-[32px]">
                          <div className="flex justify-between items-center mb-6">
                            <h5 className="font-black text-indigo-600 text-base lg:text-lg">제출 현황 체크 (클릭하여 상태 변경)</h5>
                            <button onClick={() => bulkCompleteSubmission(subm.id)} className="text-sm bg-green-500 text-white px-5 py-2.5 rounded-xl font-black hover:bg-green-600 shadow-md transition-transform active:scale-95">전원 제출 완료</button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
                            {students.map(s => {
                              const isSubm = submissionStatus[subm.id]?.[s.id] || false;
                              return (
                                <button 
                                  key={s.id} 
                                  onClick={() => toggleSubmissionStatus(subm.id, s.id)}
                                  className={`p-4 rounded-2xl border-2 font-black text-lg lg:text-xl transition-all flex justify-between items-center shadow-sm ${isSubm ? 'border-green-500 bg-green-50 text-green-700 scale-[1.02]' : 'border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-600'}`}
                                >
                                  <span className="truncate">{s.num}. {s.name}</span>
                                  {isSubm ? <CheckCircle size={24} strokeWidth={3} /> : <X size={24} className="opacity-30" strokeWidth={3} />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. 과제 관리 */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 lg:space-y-8 no-print">
            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6 mb-4 border-b pb-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-800 flex items-center gap-3"><BookOpen className="text-indigo-600" size={32}/> 과목 및 과제 관리</h3>
                <div className="flex flex-wrap gap-3 lg:gap-5 text-sm font-black mt-2 bg-slate-100 p-3 rounded-xl w-fit">
                  <span className="flex items-center gap-1.5 text-blue-700"><span className="text-2xl">◎</span> 매우잘함(+3)</span>
                  <span className="flex items-center gap-1.5 text-yellow-600"><span className="text-2xl">○</span> 잘함(+2)</span>
                  <span className="flex items-center gap-1.5 text-red-500"><span className="text-2xl">△</span> 미흡(+1)</span>
                  <span className="flex items-center gap-1.5 text-gray-500"><span className="text-2xl">-</span> 미완료(0)</span>
                </div>
              </div>
              <div className="flex gap-3 w-full xl:w-auto">
                <button onClick={() => setShowSubjectModal({id: null, title: ''})} className="flex-1 xl:flex-none bg-white text-gray-700 border-2 border-gray-200 px-6 py-3.5 rounded-2xl font-black shadow-sm hover:bg-gray-50 text-base lg:text-lg transition-colors">과목 추가</button>
                <button onClick={() => {if(subjects.length===0)return alert('먼저 과목을 추가해주세요.'); setShowAssignmentModal({id: null, title: '', subjectId: subjects[0].id, dueDate: dateKey});}} className="flex-1 xl:flex-none bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 text-base lg:text-lg transition-transform active:scale-95">새 과제 등록</button>
              </div>
            </div>
            
            <div className="space-y-6">
              {subjects.length === 0 && <div className="text-center py-16 text-gray-400 font-bold text-lg bg-white rounded-[40px] border border-gray-100">등록된 과목이 없습니다.</div>}
              {subjects.map(sub => {
                const subAssignments = assignments.filter(a => a.subjectId === sub.id);
                const isExpanded = expandedSubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-4 lg:gap-6 pr-16"><BookOpen className="text-indigo-500 shrink-0" size={28} /><span className="font-black text-xl lg:text-3xl text-gray-800 truncate">{sub.title}</span></div>
                        {isExpanded ? <ChevronUp className="text-gray-400" size={28} /> : <ChevronDown className="text-gray-400" size={28} />}
                      </button>
                      <div className="absolute right-16 lg:right-24 flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-gradient-to-l from-white pl-6 transition-opacity">
                        <button onClick={() => setShowSubjectModal({id: sub.id, title: sub.title})} className="p-3 text-gray-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-100 rounded-xl transition-colors"><Edit2 size={20} /></button>
                        <button onClick={(e) => deleteSubject(sub.id, e)} className="p-3 text-gray-400 hover:text-red-500 bg-slate-100 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={20} /></button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-6 lg:px-10 pb-6 lg:pb-8 space-y-4">
                        {subAssignments.length === 0 ? <p className="text-gray-400 text-base py-4 font-bold text-center bg-slate-50 rounded-2xl">등록된 과제가 없습니다.</p> : 
                          subAssignments.map(a => (
                            <div key={a.id} className="border-2 border-indigo-50 rounded-3xl p-2 bg-white">
                              <div onClick={() => setExpandedTask(expandedTask === a.id ? null : a.id)} className={`p-4 lg:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all ${expandedTask === a.id ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
                                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                  <span className="font-black text-lg lg:text-2xl text-gray-800">{a.title}</span>
                                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200">{a.dueDate}</span>
                                </div>
                                <div className="flex items-center justify-end gap-2 shrink-0">
                                  <button onClick={(e) => { e.stopPropagation(); setShowAssignmentModal(a); }} className="p-3 bg-white hover:bg-indigo-100 text-gray-400 hover:text-indigo-600 border border-gray-100 rounded-xl shadow-sm transition-colors"><Edit2 size={18} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteAssignment(a.id); }} className="p-3 bg-white hover:bg-red-100 text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl shadow-sm transition-colors"><Trash2 size={18} /></button>
                                  <div className="ml-2 bg-indigo-600 text-white font-black px-5 py-3 rounded-xl shadow-md text-sm lg:text-base transition-transform active:scale-95">{expandedTask === a.id ? '평가 접기' : '평가 하기'}</div>
                                </div>
                              </div>
                              {expandedTask === a.id && (
                                <div className="mt-2 p-5 lg:p-8 bg-slate-50 border-t-2 border-indigo-100 rounded-b-2xl">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                                    <h5 className="font-black text-indigo-700 text-base lg:text-lg flex items-center gap-2"><Sparkles size={18}/> 성취도 기록 (매직 점수 자동 연계)</h5>
                                    <button onClick={() => bulkTaskDone(a.id)} className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black shadow-md hover:bg-blue-700 transition-transform active:scale-95">전원 ◎ 완료</button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                                    {students.map(s => {
                                      const status = assignmentStatus[dateKey]?.[s.id]?.[a.id] || null;
                                      return (
                                        <div key={s.id} className="flex flex-col gap-3 p-4 lg:p-5 rounded-[24px] bg-white border-2 border-gray-100 shadow-sm relative hover:border-indigo-200 transition-colors">
                                          <div onClick={(e) => setStatusPickerTarget({ studentId: s.id, taskId: a.id, date: dateKey, ...calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 200, 220) })} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 shadow-sm hover:scale-[1.03] active:scale-95 ${getStatusColorClass(status)}`}>
                                            <span className="font-black text-xl truncate pr-2 whitespace-nowrap">{s.num}. {s.name}</span>
                                            <div className="flex flex-col items-end">
                                              <span className="font-black text-3xl leading-none">{getStatusIcon(status)}</span>
                                              <span className="text-[10px] opacity-80 font-bold mt-1">클릭하여 변경</span>
                                            </div>
                                          </div>
                                          <input value={assignmentStatus[dateKey]?.[s.id]?.[`memo_${a.id}`] || ''} onChange={(e) => updateTaskMemo(s.id, a.id, e.target.value)} placeholder="개별 메모 입력" className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-indigo-400 focus:bg-white text-sm font-bold text-gray-700 transition-all" />
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

        {/* 4. 과제 현황 (종합) */}
        {activeTab === 'status' && (
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-10 no-print">
            <div className="shrink-0 w-full xl:w-96">
              <div className="bg-white p-6 lg:p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-2xl text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                  <button onClick={() => setSelectedDate(new Date())} className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black hover:bg-indigo-100 transition-colors">오늘</button>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center mb-2 font-black text-sm text-gray-400">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getAssignmentDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 w-2 h-2 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-5">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-3 mb-6 lg:mb-8 border-b pb-6">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-800 flex items-center gap-3"><BarChart2 className="text-indigo-600" size={32}/> {dateKey} 과제 달성률</h3>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">학생을 클릭하면 상세 내역을 봅니다.</span>
              </div>
              {students.length === 0 && <div className="text-center py-16 text-gray-400 font-bold text-lg bg-white rounded-[40px] border border-gray-100">등록된 학생이 없습니다.</div>}
              {students.map(student => {
                const tasks = assignments.filter(a => a.dueDate === dateKey);
                const status = assignmentStatus[dateKey]?.[student.id] || {};
                const done = Object.entries(status).filter(([k, v]) => !k.startsWith('memo_') && (v === 'done' || v === 'ing')).length;
                const total = tasks.length;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={student.id} onClick={() => setAssignmentDetailStudent(student)} className="bg-white p-6 lg:p-8 rounded-[32px] border-2 border-gray-100 shadow-sm flex items-center gap-6 lg:gap-10 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-20 lg:w-28 font-black text-2xl lg:text-3xl text-gray-800 group-hover:text-indigo-600 truncate whitespace-nowrap text-right">{student.name}</div>
                    <div className="flex-1">
                      <div className="relative h-3 lg:h-4 bg-slate-100 rounded-full overflow-hidden mb-2 lg:mb-3 shadow-inner">
                        <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }} />
                      </div>
                      <div className="text-xs lg:text-sm font-black text-gray-400 pl-1">{done} / {total} 개 완료 (◎, ○ 포함)</div>
                    </div>
                    <div className={`w-16 lg:w-24 text-right text-2xl lg:text-4xl font-black shrink-0 ${percent === 100 ? 'text-green-500' : 'text-gray-300'}`}>{percent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4.5 [신규] 완전 학습 (중요 개념 관리) */}
        {activeTab === 'mastery' && (
          <div className="space-y-6 lg:space-y-8 no-print">
            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6 mb-4 border-b pb-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-800 flex items-center gap-3"><Brain className="text-indigo-600" size={32}/> 완전 학습 (중요 개념)</h3>
                <p className="text-sm font-bold text-gray-500 mt-2">수업 중 다룬 중요한 단어나 문장을 누적하여 기록하세요.</p>
              </div>
              <div className="flex gap-3 w-full xl:w-auto">
                <button onClick={() => setShowSubjectModal({id: null, title: ''})} className="flex-1 xl:flex-none bg-white text-gray-700 border-2 border-gray-200 px-6 py-3.5 rounded-2xl font-black shadow-sm hover:bg-gray-50 text-base lg:text-lg transition-colors">과목 추가</button>
                <button onClick={() => {if(subjects.length===0)return alert('먼저 과목을 추가해주세요.'); setShowConceptModal({id: null, subjectId: subjects[0].id, term: '', hanja: '', meaning: ''});}} className="flex-1 xl:flex-none bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 text-base lg:text-lg transition-transform active:scale-95">중요 개념 등록</button>
              </div>
            </div>
            
            <div className="space-y-6">
              {subjects.length === 0 && <div className="text-center py-16 text-gray-400 font-bold text-lg bg-white rounded-[40px] border border-gray-100">등록된 과목이 없습니다.</div>}
              {subjects.map(sub => {
                const subConcepts = masteryConcepts.filter(c => c.subjectId === sub.id);
                const isExpanded = expandedMasterySubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedMasterySubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-4 lg:gap-6 pr-16">
                          <Brain className="text-indigo-500 shrink-0" size={28} />
                          <span className="font-black text-xl lg:text-3xl text-gray-800 truncate">{sub.title}</span>
                          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg ml-2">{subConcepts.length}개 개념</span>
                        </div>
                        {isExpanded ? <ChevronUp className="text-gray-400" size={28} /> : <ChevronDown className="text-gray-400" size={28} />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-6 lg:px-10 pb-6 lg:pb-8 space-y-4">
                        {subConcepts.length === 0 ? <p className="text-gray-400 text-base py-4 font-bold text-center bg-slate-50 rounded-2xl">등록된 개념이 없습니다.</p> : 
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {subConcepts.map(c => (
                              <div key={c.id} className="bg-slate-50 p-6 rounded-3xl border-2 border-indigo-50 flex flex-col justify-between items-start gap-4 hover:border-indigo-200 transition-colors relative group">
                                <div className="w-full">
                                  <div className="flex items-end gap-3 mb-3 flex-wrap">
                                    <h5 className="font-black text-2xl lg:text-3xl text-gray-800">{c.term}</h5>
                                    {c.hanja && <span className="text-lg lg:text-xl font-black text-gray-400 bg-white border border-gray-200 px-3 py-0.5 rounded-xl shadow-sm">{c.hanja}</span>}
                                  </div>
                                  <p className="text-gray-600 font-bold text-base lg:text-lg leading-relaxed whitespace-pre-wrap">{c.meaning}</p>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setShowConceptModal(c)} className="p-2.5 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-gray-100"><Edit2 size={18}/></button>
                                  <button onClick={() => deleteConcept(c.id)} className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100"><Trash2 size={18}/></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. 학생 상담 */}
        {activeTab === 'counseling' && (
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-10 no-print overflow-hidden h-full min-h-[80vh]">
            <div className="shrink-0 w-full xl:w-96">
              <div className="bg-white p-6 lg:p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-2xl text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                  <button onClick={() => setSelectedDate(new Date())} className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black hover:bg-indigo-100 transition-colors">오늘</button>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center mb-2 font-black text-sm text-gray-400">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const dotColor = getCounselingDot(curDate); 
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 w-2 h-2 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm p-6 lg:p-10 min-w-0 flex flex-col">
              <div className="flex items-center justify-between mb-6 lg:mb-8 border-b pb-6 shrink-0">
                <h3 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-gray-800 shrink-0"><MessageCircle className="text-indigo-600" size={32} /><span>{dateKey} 상담 기록</span></h3>
                <button onClick={() => addCounselingRecord(dateKey)} className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-700 flex items-center gap-2 text-base lg:text-lg shadow-lg transition-transform active:scale-95"><Plus size={22} /> <span className="hidden sm:inline">상담 추가</span></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 hide-scrollbar">
                {(counselingData[dateKey] || []).map((record) => (
                  <div key={record.id} className="bg-slate-50 p-6 lg:p-8 rounded-[32px] border-2 border-gray-100 shadow-sm flex flex-col gap-6 relative group transition-colors hover:border-indigo-100">
                    <button onClick={() => deleteCounselingRecord(dateKey, record.id)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 bg-white hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm"><Trash2 size={20} /></button>
                    
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pr-12 lg:pr-16">
                      <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-black text-gray-500 mb-2 ml-1">작성자</label>
                        <input value={record.recorder} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'recorder', e.target.value)} className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-5 py-3.5 rounded-2xl outline-none text-base lg:text-lg font-bold transition-all" placeholder="예: 담임교사" />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-black text-gray-500 mb-2 ml-1">학생 선택</label>
                        <select value={record.studentId} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'studentId', e.target.value)} className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-5 py-3.5 rounded-2xl outline-none text-base lg:text-lg font-bold appearance-none transition-all cursor-pointer">
                          <option value="" disabled>선택하세요</option>
                          {students.map(s => <option key={s.id} value={s.id}>{s.num}. {s.name}</option>)}
                          <option value="other">기타 (타반 등)</option>
                        </select>
                      </div>
                      <div className="w-full sm:w-1/3 flex sm:flex-col justify-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors w-full h-[56px]">
                          <input type="checkbox" checked={record.resolved} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'resolved', e.target.checked)} className="w-6 h-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                          <span className={`font-black text-base lg:text-lg ${record.resolved ? 'text-blue-600' : 'text-red-500'}`}>{record.resolved ? '해결 완료' : '미해결 상태'}</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-black text-gray-500 mb-2 ml-1">상담 내용 및 관찰 사항</label>
                        <textarea value={record.content} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'content', e.target.value)} rows={4} className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-5 py-4 rounded-2xl outline-none text-base lg:text-lg font-medium resize-none transition-all leading-relaxed" placeholder="상세 내용을 기록하세요..." />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-black text-gray-500 mb-2 ml-1">조치 결과</label>
                        <textarea value={record.result} onChange={(e) => updateCounselingRecord(dateKey, record.id, 'result', e.target.value)} rows={4} className="w-full bg-white border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-5 py-4 rounded-2xl outline-none text-base lg:text-lg font-medium resize-none transition-all leading-relaxed" placeholder="이후 조치 사항을 기록하세요..." />
                      </div>
                    </div>
                  </div>
                ))}
                {(!counselingData[dateKey] || counselingData[dateKey].length === 0) && <div className="text-center py-20 text-gray-400 font-bold flex flex-col items-center gap-4 border-2 border-dashed border-gray-200 rounded-[32px] bg-white"><MessageCircle size={48} className="text-gray-300" /><p className="text-lg">기록된 상담 내용이 없습니다.<br/>상단 버튼을 눌러 기록을 시작하세요.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* 6. 매직 점수 (1줄 5명, 폰트 확대) */}
        {activeTab === 'magicpoints' && (
          <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* 상단 컨트롤 패널 */}
            <div className="bg-white p-6 lg:p-8 rounded-[40px] border border-indigo-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black text-gray-800 flex items-center gap-3 mb-3"><Trophy className="text-indigo-600" size={32}/> 매직 점수 관리</h3>
                <p className="text-base text-gray-500 font-bold mb-5">학생을 다중 선택하고 한 번에 점수를 부여하세요. (🔊 소리 지원)</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setSelectedStudentsForMagic(students.length === selectedStudentsForMagic.length ? [] : students.map(s => s.id))} className="px-5 py-3 bg-slate-100 text-gray-700 rounded-xl text-base font-black hover:bg-slate-200 transition-colors shadow-sm">
                    {students.length > 0 && students.length === selectedStudentsForMagic.length ? '전체 해제' : '전체 선택'}
                  </button>
                  <span className="text-base font-black text-indigo-700 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">{selectedStudentsForMagic.length}명 선택됨</span>
                  
                  <div className="flex items-center gap-3 ml-0 sm:ml-6 bg-slate-50 p-1.5 rounded-xl border border-gray-200">
                    <Filter size={20} className="text-gray-400 ml-2"/>
                    <select value={magicSortOrder} onChange={(e)=>setMagicSortOrder(e.target.value)} className="bg-transparent text-base font-black text-gray-700 outline-none cursor-pointer py-1.5 pr-2">
                      <option value="num">번호순 정렬</option>
                      <option value="desc">점수 높은 순</option>
                      <option value="asc">점수 낮은 순</option>
                    </select>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button onClick={handleResetMagicPoints} className="px-4 py-2 bg-white text-red-500 hover:bg-red-50 border border-red-100 rounded-lg text-sm font-black transition-colors flex items-center gap-1.5 shadow-sm">
                      <RotateCcw size={16} strokeWidth={3} /> 초기화
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto p-5 bg-slate-50 rounded-3xl border border-gray-200 shadow-inner">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-base font-black text-gray-600 whitespace-nowrap">부여 점수</span>
                  <select 
                    value={magicPointValue} 
                    onChange={(e) => setMagicPointValue(Number(e.target.value))}
                    className="w-20 bg-transparent text-xl font-black text-indigo-700 text-center appearance-none outline-none cursor-pointer"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}점</option>)}
                  </select>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => handleMagicPointAction(selectedStudentsForMagic, 'plus')} className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg transition-transform active:scale-95 text-lg whitespace-nowrap flex items-center justify-center gap-2">✨ 칭찬 (+)</button>
                  <button onClick={() => handleMagicPointAction(selectedStudentsForMagic, 'minus')} className="flex-1 sm:flex-none bg-red-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-red-600 shadow-lg transition-transform active:scale-95 text-lg whitespace-nowrap flex items-center justify-center gap-2">⚡ 노력 (-)</button>
                </div>
              </div>
            </div>

            {/* 학생 개별 그리드 (1줄 5명: xl:grid-cols-5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {sortedStudentsForMagic.map(student => {
                const total = getStudentTotalPoints(student.id);
                const isSelected = selectedStudentsForMagic.includes(student.id);
                
                return (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudentsForMagic(p => p.includes(student.id) ? p.filter(id => id !== student.id) : [...p, student.id])}
                    className={`bg-white rounded-[32px] p-6 shadow-sm border-4 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center justify-between min-h-[240px] ${isSelected ? 'border-indigo-500 bg-indigo-50/30 transform scale-[1.02]' : 'border-transparent hover:border-indigo-200'}`}
                  >
                    <div className="w-full flex justify-between items-start mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-200 bg-gray-50'}`}>
                        {isSelected && <Check size={18} strokeWidth={4} />}
                      </div>
                    </div>
                    
                    <div className="text-3xl font-black text-gray-800 text-center w-full truncate px-2 whitespace-nowrap tracking-tight">
                      {student.num}. {student.name}
                    </div>
                    
                    <div className={`text-7xl font-black my-5 transition-all ${total > 0 ? 'text-blue-600 drop-shadow-sm' : total < 0 ? 'text-red-500 drop-shadow-sm' : 'text-gray-300'}`}>
                      {total > 0 ? `+${total}` : total}
                    </div>

                    <div className="flex gap-3 w-full mt-2">
                      <button onClick={(e) => { e.stopPropagation(); handleMagicPointAction([student.id], 'plus'); }} className="flex-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-black py-3.5 rounded-2xl transition-colors text-lg border border-blue-100 shadow-sm">칭찬</button>
                      <button onClick={(e) => { e.stopPropagation(); handleMagicPointAction([student.id], 'minus'); }} className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-black py-3.5 rounded-2xl transition-colors text-lg border border-red-100 shadow-sm">노력</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 학생 리포트 */}
            <div className="mt-16 bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b-2 pb-8 mb-8 gap-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black flex items-center gap-3 text-gray-800"><BarChart2 className="text-indigo-600" size={32}/> 매직 점수 종합 리포트</h3>
                  <p className="text-base text-gray-500 font-bold mt-2">과제 점수(+3, +2, +1)와 수동 매직 점수가 지정된 기간에 맞춰 필터링됩니다.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row bg-slate-100 p-2 rounded-3xl w-full xl:w-auto gap-2 items-center shadow-inner border border-gray-200">
                  <div className="flex w-full lg:w-auto gap-1">
                    <button onClick={() => setReportPeriod('day')} className={`flex-1 lg:flex-none px-5 py-3 rounded-2xl text-base font-black transition-all ${reportPeriod === 'day' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200'}`}>일간</button>
                    <button onClick={() => setReportPeriod('week')} className={`flex-1 lg:flex-none px-5 py-3 rounded-2xl text-base font-black transition-all ${reportPeriod === 'week' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200'}`}>주간</button>
                    <button onClick={() => setReportPeriod('month')} className={`flex-1 lg:flex-none px-5 py-3 rounded-2xl text-base font-black transition-all ${reportPeriod === 'month' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200'}`}>월간</button>
                    <button onClick={() => setReportPeriod('all')} className={`flex-1 lg:flex-none px-5 py-3 rounded-2xl text-base font-black transition-all ${reportPeriod === 'all' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200'}`}>전체</button>
                    <button onClick={() => setReportPeriod('custom')} className={`flex-1 lg:flex-none px-5 py-3 rounded-2xl text-base font-black transition-all ${reportPeriod === 'custom' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200'}`}>직접지정</button>
                  </div>
                  {reportPeriod === 'custom' && (
                    <div className="flex items-center gap-2 px-3 py-1 justify-center w-full lg:w-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                      <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-transparent border-none px-2 py-2 text-sm font-black text-gray-700 outline-none cursor-pointer" />
                      <span className="text-gray-400 font-black text-sm">~</span>
                      <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-transparent border-none px-2 py-2 text-sm font-black text-gray-700 outline-none cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-3 bg-slate-50 border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm">
                  <Filter size={20} className="text-gray-500"/>
                  <select value={reportSortOrder} onChange={(e)=>setReportSortOrder(e.target.value)} className="bg-transparent text-base font-black text-gray-700 outline-none cursor-pointer pr-4">
                    <option value="desc">종합 점수 높은 순 ▼</option>
                    <option value="asc">종합 점수 낮은 순 ▲</option>
                    <option value="num">학생 번호순 ▤</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-100 text-gray-500 text-sm uppercase font-black border-b-2 border-gray-200">
                    <tr>
                      <th className="px-8 py-6 w-24 text-center">순위</th>
                      <th className="px-8 py-6">학생 이름</th>
                      <th className="px-8 py-6 text-blue-600 text-center">수동 칭찬 (+)</th>
                      <th className="px-8 py-6 text-red-500 text-center">수동 노력 (-)</th>
                      <th className="px-8 py-6 text-emerald-600 text-center">과제 연동</th>
                      <th className="px-8 py-6 text-right w-48">최종 종합 점수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {calculateReportData().map((student, index) => (
                      <tr key={student.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="px-8 py-6 font-black text-xl text-gray-400 text-center">{index + 1}</td>
                        <td className="px-8 py-6 font-black text-2xl text-gray-800">{student.num}. {student.name}</td>
                        <td className="px-8 py-6 font-black text-xl text-blue-600 text-center bg-blue-50/30">{student.plusCount}건</td>
                        <td className="px-8 py-6 font-black text-xl text-red-500 text-center bg-red-50/30">{student.minusCount}건</td>
                        <td className="px-8 py-6 font-black text-xl text-emerald-600 text-center bg-emerald-50/30">+{student.taskPts}점</td>
                        <td className="px-8 py-6 text-right">
                          <span className={`inline-flex items-center justify-center min-w-[80px] px-5 py-2.5 rounded-2xl font-black text-3xl shadow-sm border ${student.total > 0 ? 'bg-blue-50 text-blue-600 border-blue-200' : student.total < 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
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

        {/* 7. 외부 자료 메뉴 */}
        {activeTab === 'externals' && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 no-print h-full min-h-[80vh]">
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black flex items-center gap-3 text-gray-800"><LinkIcon className="text-indigo-600" size={28}/> 외부 자료</h3>
                <button onClick={() => setShowLinkModal({id: null, title: '', url: ''})} className="bg-indigo-600 text-white p-3.5 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"><Plus size={24} strokeWidth={3}/></button>
              </div>
              <div className="flex-1 bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-gray-100 overflow-y-auto space-y-4">
                {externalLinks.length === 0 && <p className="text-center py-16 text-gray-400 text-lg font-bold">등록된 외부 자료가 없습니다.</p>}
                {externalLinks.map((link, idx) => (
                  <div key={link.id} className={`p-5 md:p-6 rounded-3xl border-2 transition-all flex items-center justify-between group cursor-pointer ${selectedExternalLink?.id === link.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-100 bg-white hover:border-indigo-300'}`}>
                    <div className="flex-1 truncate mr-4" onClick={() => setSelectedExternalLink(link)}>
                      <h4 className="font-black text-xl text-gray-800 truncate">{link.title}</h4>
                      <p className="text-xs font-bold text-gray-400 truncate mt-1.5">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm mr-1 overflow-hidden">
                        <button onClick={() => moveExternalLink(idx, 'up')} disabled={idx===0} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 border-b border-gray-100 transition-colors"><ArrowUp size={16} strokeWidth={3}/></button>
                        <button onClick={() => moveExternalLink(idx, 'down')} disabled={idx===externalLinks.length-1} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-colors"><ArrowDown size={16} strokeWidth={3}/></button>
                      </div>
                      <button onClick={() => setShowLinkModal(link)} className="p-3 text-gray-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-100 rounded-xl transition-colors"><Edit2 size={18} strokeWidth={3}/></button>
                      <button onClick={() => deleteExternalLink(link.id)} className="p-3 text-gray-400 hover:text-red-500 bg-slate-100 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={18} strokeWidth={3}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] lg:min-h-0 relative">
              {selectedExternalLink ? (
                <>
                  <div className="p-6 md:p-8 border-b-2 border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 shrink-0 z-10 gap-4">
                    <div className="flex items-center gap-4 truncate pr-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm"><LinkIcon size={28} strokeWidth={2.5}/></div>
                      <div>
                        <h3 className="font-black text-gray-800 truncate text-2xl">{selectedExternalLink.title}</h3>
                        <p className="text-sm font-bold text-gray-500 mt-1 truncate">{selectedExternalLink.url}</p>
                      </div>
                    </div>
                    <button onClick={() => window.open(selectedExternalLink.url, '_blank')} className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-base font-black hover:bg-indigo-700 shadow-lg transition-transform active:scale-95 shrink-0 whitespace-nowrap">
                      새 창 열기 <ExternalLink size={20} strokeWidth={3}/>
                    </button>
                  </div>
                  
                  <div className="flex-1 w-full bg-gray-100 relative flex flex-col">
                    <div className="bg-yellow-50 text-yellow-800 text-sm font-black py-3 px-6 text-center border-b border-yellow-200 shrink-0">
                      💡 네이버, 구글 등 일부 사이트는 보안상 화면에 보이지 않을 수 있습니다. 회색 화면이 나타나면 [새 창 열기]를 이용해 주세요.
                    </div>
                    <iframe key={selectedExternalLink.id} src={selectedExternalLink.url} title={selectedExternalLink.title} className="flex-1 w-full h-full border-none bg-white" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-6 p-10 text-center">
                  <div className="p-8 bg-slate-50 rounded-full shadow-inner border-4 border-white"><LinkIcon size={64} className="text-indigo-200" strokeWidth={2} /></div>
                  <div>
                    <p className="font-black text-2xl text-gray-400 mb-3">왼쪽에서 자료를 선택해주세요.</p>
                    <p className="text-base font-bold opacity-60">이곳에 웹페이지가 표시됩니다.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 공통 팝업 영역 --- */}

        {statusPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setStatusPickerTarget(null)}>
            <div 
              className="absolute bg-white rounded-3xl shadow-2xl border-2 border-indigo-100 p-3 flex flex-col gap-2 w-52 animate-in zoom-in-95 duration-150"
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
                  className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-black transition-all border ${getStatusColorClass(item.s)} hover:scale-[1.03] active:scale-95`}
                >
                  <span className="text-2xl font-black">{getStatusIcon(item.s)}</span>
                  <span>{item.l}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {moodPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setMoodPickerTarget(null)}>
            <div 
              className="absolute bg-white p-5 rounded-[32px] shadow-2xl border-2 border-gray-100 grid grid-cols-4 gap-3 w-64 animate-in zoom-in-95 duration-150"
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
                  className="w-12 h-12 text-3xl hover:bg-slate-100 rounded-2xl transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- 개별 모달 --- */}
        {showLinkModal && (
          <LinkEditModal 
            key={showLinkModal.id || 'new_link'}
            data={showLinkModal}
            onClose={() => setShowLinkModal(null)}
            onSave={saveExternalLink}
          />
        )}

        {showConceptModal && (
          <ConceptEditModal
            data={showConceptModal}
            subjects={subjects}
            onClose={() => setShowConceptModal(null)}
            onSave={saveConcept}
          />
        )}

        {showSubmissionModal && (
          <SubmissionEditModal 
            key={showSubmissionModal.id || 'new_submission'}
            data={showSubmissionModal}
            onClose={() => setShowSubmissionModal(null)}
            onSave={(id, title, date) => {
              if(!title) return;
              if (id) setSubmissions(prev => prev.map(s => s.id === id ? { ...s, title, date } : s));
              else setSubmissions(prev => [{ id: 'sm' + Date.now(), title, date }, ...prev]);
              setShowSubmissionModal(null);
            }}
          />
        )}

        {assignmentDetailStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md px-4 p-4 md:p-6 pb-20 md:pb-6">
            <div className="bg-white rounded-[40px] w-full max-w-4xl h-[85vh] md:max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 md:p-10 border-b-2 border-gray-100 flex justify-between items-start shrink-0 bg-indigo-50/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg font-black tracking-wide">학생 상세 현황</span>
                    <h4 className="text-3xl md:text-4xl font-black text-gray-800">{assignmentDetailStudent.num}. {assignmentDetailStudent.name}</h4>
                  </div>
                  <p className="text-gray-500 font-bold text-sm md:text-base ml-1">과제별 성취도 확인 (상태 아이콘 클릭 시 변경 가능)</p>
                </div>
                <button onClick={() => {setAssignmentDetailStudent(null); setAssignmentFilter('all');}} className="p-3 md:p-4 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl shadow-sm border border-gray-200 transition-colors"><X size={24} strokeWidth={3} /></button>
              </div>

              <div className="px-6 md:px-10 py-4 md:py-5 bg-white border-b border-gray-100 flex gap-3 shrink-0 overflow-x-auto hide-scrollbar">
                <button onClick={() => setAssignmentFilter('all')} className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-black transition-all whitespace-nowrap ${assignmentFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}>전체보기</button>
                <button onClick={() => setAssignmentFilter('incomplete')} className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-black transition-all whitespace-nowrap ${assignmentFilter === 'incomplete' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}>미완료 (△, -)</button>
                <button onClick={() => setAssignmentFilter('complete')} className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-black transition-all whitespace-nowrap ${assignmentFilter === 'complete' ? 'bg-green-500 text-white shadow-md' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}>완료 (◎, ○)</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4 md:space-y-6 bg-slate-50/50">
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
                      <div key={a.id} className="bg-white p-5 md:p-8 rounded-3xl border-2 border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                          <button 
                            onClick={(e) => {
                              const coords = calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 240, 200);
                              setStatusPickerTarget({ studentId: assignmentDetailStudent.id, taskId: a.id, date: a.dueDate, x: coords.x, y: coords.y });
                            }}
                            className={`shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 font-black text-3xl md:text-4xl transition-transform hover:scale-105 active:scale-95 shadow-sm ${getStatusColorClass(status)}`}
                          >
                            {getStatusIcon(status)}
                          </button>
                          <div className="flex-1 md:hidden">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-black px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">{subject?.title || '기타'}</span>
                              <span className="text-xs font-bold text-gray-400">{a.dueDate}</span>
                            </div>
                            <h5 className="font-black text-gray-800 text-lg truncate">{a.title}</h5>
                          </div>
                        </div>
                        
                        <div className="hidden md:block flex-1 overflow-hidden pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-black px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md uppercase">{subject?.title || '기타'}</span>
                            <span className="text-sm font-bold text-gray-400">{a.dueDate}</span>
                          </div>
                          <h5 className="font-black text-gray-800 text-2xl truncate">{a.title}</h5>
                          <p className={`text-sm font-black mt-2 ${status === 'done' || status === 'ing' ? 'text-blue-600' : 'text-gray-400'}`}>
                            상태: {getStatusLabel(status)}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-80 shrink-0">
                          <input 
                            value={memo} 
                            onChange={(e) => updateTaskMemo(assignmentDetailStudent.id, a.id, e.target.value, a.dueDate)}
                            placeholder="개별 메모 입력 (선택)" 
                            className="w-full bg-slate-50 border-2 border-gray-100 focus:border-indigo-400 focus:bg-white px-5 py-4 rounded-2xl outline-none text-base font-bold text-gray-700 transition-colors"
                          />
                        </div>
                      </div>
                    );
                  })
                }
                {assignments.length === 0 && <div className="text-center py-20 text-gray-400 font-bold text-lg">할당된 과제가 없습니다.</div>}
              </div>
            </div>
          </div>
        )}

        {showSubjectModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl md:text-3xl font-black text-gray-800">{showSubjectModal.id ? '과목 수정' : '새 과목 생성'}</h4>
                <button onClick={() => setShowSubjectModal(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
              </div>
              <div className="space-y-6">
                <input id="sub_input" autoFocus defaultValue={showSubjectModal.title} onKeyDown={(e) => {if(e.key==='Enter') saveSubject(showSubjectModal.id, e.target.value)}} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" placeholder="과목명 (예: 국어)" />
                <button onClick={() => saveSubject(showSubjectModal.id, document.getElementById('sub_input').value)} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">저장 완료</button>
              </div>
            </div>
          </div>
        )}

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
              if (id) setAssignments(prev => prev.map(a => a.id === id ? { ...a, title, subjectId: subId, dueDate: date } : a));
              else setAssignments(prev => [{ id: 'a' + Date.now(), subjectId: subId, title, dueDate: date }, ...prev]);
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

const ConceptEditModal = ({ data, subjects, onClose, onSave }) => {
  const [subjectId, setSubjectId] = useState(data.subjectId || (subjects.length > 0 ? subjects[0].id : ''));
  const [term, setTerm] = useState(data.term || '');
  const [hanja, setHanja] = useState(data.hanja || '');
  const [meaning, setMeaning] = useState(data.meaning || '');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '개념 수정' : '중요 개념 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">과목 선택</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none font-black text-lg appearance-none text-gray-700 transition-colors">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-black text-gray-500 mb-2 ml-1">단어 / 문장</label>
              <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder="예: 민주주의" className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-black text-gray-500 mb-2 ml-1">한자 (선택)</label>
              <input value={hanja} onChange={(e) => setHanja(e.target.value)} placeholder="예: 民主主義" className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-4 py-5 rounded-2xl outline-none transition-all font-black text-lg text-center" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">핵심 내용</label>
            <textarea value={meaning} onChange={(e) => setMeaning(e.target.value)} rows={4} placeholder="개념의 뜻이나 중요한 설명을 적어주세요." className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg resize-none" />
          </div>
          <button onClick={() => onSave(data.id, subjectId, term, hanja, meaning)} className="w-full bg-indigo-600 text-white py-5 mt-4 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            저장 완료
          </button>
        </div>
      </div>
    </div>
  );
};

const LinkEditModal = ({ data, onClose, onSave }) => {
  const [title, setTitle] = useState(data.title || '');
  const [url, setUrl] = useState(data.url || '');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '외부 자료 수정' : '새 외부 자료 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">자료 이름</label>
            <input 
              autoFocus 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="예: 디지털 교과서, 아이스크림"
              className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">웹사이트 주소 (URL)</label>
            <input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  e.preventDefault();
                  onSave(data.id, title, url);
                }
              }}
              placeholder="예: www.naver.com"
              className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" 
            />
          </div>
          <button onClick={() => onSave(data.id, title, url)} className="w-full bg-indigo-600 text-white py-5 mt-4 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            저장 완료
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmissionEditModal = ({ data, onClose, onSave }) => {
  const [title, setTitle] = useState(data.title || '');
  const [date, setDate] = useState(data.date || '');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '제출물 수정' : '새 제출물 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">제출물 제목</label>
            <input 
              autoFocus 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  e.preventDefault();
                  onSave(data.id, title, date);
                }
              }}
              placeholder="예: 현장체험학습 동의서"
              className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">날짜 지정</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 px-6 py-5 rounded-2xl font-black text-lg text-gray-700 outline-none transition-colors" />
          </div>
          <button onClick={() => onSave(data.id, title, date)} className="w-full bg-indigo-600 text-white py-5 mt-4 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            저장 완료
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignmentEditModal = ({ data, subjects, onClose, onSave }) => {
  const [title, setTitle] = useState(data.title || '');
  const [subjectId, setSubjectId] = useState(data.subjectId || '');
  const [dueDate, setDueDate] = useState(data.dueDate || '');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '과제 수정' : '새 과제 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">과제 제목</label>
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
              className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">과목 선택</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none font-black text-lg appearance-none text-gray-700 transition-colors">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">마감 기한</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl font-black text-lg text-gray-700 outline-none transition-colors" />
          </div>
          <button onClick={() => onSave(data.id, title, subjectId, dueDate)} className="w-full bg-indigo-600 text-white py-5 mt-4 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            저장 완료
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
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '학생 정보 수정' : '신규 학생 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-24 md:w-32">
              <label className="block text-sm font-black text-gray-500 mb-2 ml-1">번호</label>
              <input value={num} onChange={(e) => setNum(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-4 py-5 rounded-2xl outline-none transition-all font-black text-center text-lg md:text-xl" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-black text-gray-500 mb-2 ml-1">이름</label>
              <input 
                ref={nameRef} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                onKeyDown={(e) => handleKeyDown(e, 'name')} 
                placeholder="이름 입력"
                className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg md:text-xl" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">학생 메모 (선택)</label>
            <input 
              ref={memoRef} 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'memo')} 
              placeholder="참고사항 입력"
              className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg text-gray-700" 
            />
          </div>
          <button onClick={() => onSave(data.id, num, name, memo, data.id === null)} className="w-full bg-indigo-600 text-white py-5 mt-4 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
            {data.id ? '수정 완료' : '학생 등록'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
