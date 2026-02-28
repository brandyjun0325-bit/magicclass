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
  MessageCircle
} from 'lucide-react';

// --- Local Storage Custom Hook (자동 저장 마법사) ---
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

const App = () => {
  // --- Helpers ---
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // --- State (일반 상태) ---
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

  const dateKey = formatDate(selectedDate);

  // --- State (자동 저장 상태 - Local Storage) ---
  const [students, setStudents] = useLocalStorage('magic_students', [
    { id: '1', num: '1', name: '김학생', memo: '메모 없음', avatarColor: 'bg-indigo-600' },
    { id: '2', num: '2', name: '이학생', memo: '메모 없음', avatarColor: 'bg-indigo-600' },
  ]);

  const [attendanceData, setAttendanceData] = useLocalStorage('magic_attendance', {
    [dateKey]: {
      '1': { present: true, mood: '😊', memo: '' },
      '2': { present: true, mood: '😊', memo: '' },
    }
  });

  const [subjects, setSubjects] = useLocalStorage('magic_subjects', [
    { id: 's1', title: '국어' },
    { id: 's2', title: '수학' },
    { id: 's3', title: '통합교과' },
  ]);

  const [assignments, setAssignments] = useLocalStorage('magic_assignments', []);
  const [assignmentStatus, setAssignmentStatus] = useLocalStorage('magic_assignmentStatus', {});
  const [counselingData, setCounselingData] = useLocalStorage('magic_counseling', {});

  const moods = ['😊', '🤩', '😐', '😴', '🤒', '😡', '😢', '😑'];

  // --- 달력 점 표시 로직 ---
  const getAttendanceDot = (date) => {
    const key = formatDate(date);
    const dayData = attendanceData[key];
    if (!dayData || students.length === 0) return null;
    const isAllPresent = students.every(s => dayData[s.id]?.present === true);
    return isAllPresent ? 'bg-green-500' : 'bg-red-500';
  };

  const getAssignmentDot = (date) => {
    const key = formatDate(date);
    const dayStatus = assignmentStatus[key];
    const dayTasks = assignments.filter(a => a.dueDate === key);
    
    if (dayTasks.length === 0) return null;
    if (!dayStatus || students.length === 0) return 'bg-red-500'; 
    
    const isAllDone = students.every(student => 
      dayTasks.every(task => {
        const s = dayStatus[student.id]?.[task.id];
        return s === 'done' || s === 'ing';
      })
    );
    return isAllDone ? 'bg-green-500' : 'bg-red-500';
  };

  const getCounselingDot = (date) => {
    const key = formatDate(date);
    const dayData = counselingData[key];
    if (!dayData || dayData.length === 0) return null;
    
    const hasUnresolved = dayData.some(record => !record.resolved);
    return hasUnresolved ? 'bg-red-500' : 'bg-blue-500';
  };

  // --- UI 매핑 ---
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
      case 'done': return '매우잘함';
      case 'ing': return '잘함';
      case 'bad': return '미흡';
      default: return '미완료';
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
    if(id) {
      newStudents = newStudents.map(s => s.id === id ? { ...s, num, name, memo } : s);
    } else {
      newStudents.push({ id: 'st' + Date.now(), num, name, memo, avatarColor: 'bg-indigo-600' });
    }
    newStudents.sort((a, b) => parseInt(a.num) - parseInt(b.num));
    setStudents(newStudents);
    
    if (isContinuous) {
      const nextNum = (parseInt(num) + 1).toString();
      setShowStudentModal({id: null, num: nextNum, name: '', memo: ''});
    } else {
      setShowStudentModal(null);
    }
  };

  const handleInlineMemoUpdate = (id, newMemo) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, memo: newMemo } : s));
  };

  const deleteStudent = (id) => {
    if(window.confirm('정말로 이 학생을 삭제하시겠습니까? 관련 출석/과제 기록이 함께 지워질 수 있습니다.')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveSubject = (id, title) => {
    if(!title) return;
    if (id) {
      setSubjects(subjects.map(s => s.id === id ? {...s, title} : s));
    } else {
      setSubjects([...subjects, { id: 's' + Date.now(), title }]);
    }
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
    const newRecord = { 
      id: 'c' + Date.now(), 
      recorder: '', 
      studentId: '', 
      content: '', 
      result: '', 
      resolved: false 
    };
    setCounselingData(prev => ({ 
      ...prev, 
      [date]: [newRecord, ...(prev[date] || [])] 
    }));
  };

  const updateCounselingRecord = (date, id, field, value) => {
    setCounselingData(prev => ({
      ...prev,
      [date]: prev[date].map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const deleteCounselingRecord = (date, id) => {
    if(window.confirm('이 상담 기록을 삭제하시겠습니까?')) {
      setCounselingData(prev => ({
        ...prev,
        [date]: prev[date].filter(r => r.id !== id)
      }));
    }
  };

  // --- 엑셀(CSV) 다운로드 기능 ---
  const downloadCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += '날짜,구분,학생번호,학생이름,항목,상태,기분,메모\n';
    const escapeCSV = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    const allDates = Array.from(new Set([
      ...Object.keys(attendanceData),
      ...assignments.map(a => a.dueDate),
      ...Object.keys(counselingData) 
    ])).sort();

    allDates.forEach(date => {
      students.forEach(student => {
        const attDay = attendanceData[date] || {};
        const sAtt = attDay[student.id];
        if (sAtt) {
          const presentStr = sAtt.present ? '출석' : '결석';
          csvContent += `${date},출석,${student.num},${escapeCSV(student.name)},출석체크,${presentStr},${sAtt.mood || ''},${escapeCSV(sAtt.memo)}\n`;
        }

        const dayAssignments = assignments.filter(a => a.dueDate === date);
        const taskDay = assignmentStatus[date] || {};
        const sTask = taskDay[student.id] || {};

        dayAssignments.forEach(task => {
          const status = sTask[task.id] || null;
          const statusStr = getStatusLabel(status);
          const memo = sTask[`memo_${task.id}`] || '';
          const subject = subjects.find(s => s.id === task.subjectId)?.title || '기타';
          const itemStr = `[${subject}] ${task.title}`;

          csvContent += `${date},과제,${student.num},${escapeCSV(student.name)},${escapeCSV(itemStr)},${statusStr},-,${escapeCSV(memo)}\n`;
        });
      });

      const dayCounseling = counselingData[date] || [];
      dayCounseling.forEach(c => {
        const resolvedStr = c.resolved ? '해결완료' : '미해결';
        const combinedMemo = `내용: ${c.content} / 결과: ${c.result}`;
        let sNum = '-';
        let sName = '기타(타반 등)';
        
        if (c.studentId && c.studentId !== 'other') {
          const matchedStudent = students.find(s => s.id === c.studentId);
          if (matchedStudent) {
            sNum = matchedStudent.num;
            sName = matchedStudent.name;
          }
        }
        csvContent += `${date},상담,${sNum},${escapeCSV(sName)},${escapeCSV("작성자: " + c.recorder)},${resolvedStr},-,${escapeCSV(combinedMemo)}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `매직클래스_데이터백업_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 화면 이탈 방지 좌표 계산기 ---
  const calculatePopupPosition = (rect, expectedWidth = 180, expectedHeight = 150) => {
    let posX = rect.right + 10;
    let posY = rect.top - 10;

    // 모바일 등에서 오른쪽으로 튀어나갈 경우 왼쪽으로 당김
    if (posX + expectedWidth > window.innerWidth) {
      posX = window.innerWidth - expectedWidth - 10;
    }
    // 아래로 튀어나갈 경우 위로 끌어올림
    if (posY + expectedHeight > window.innerHeight) {
      posY = window.innerHeight - expectedHeight - 20;
    }
    return { x: posX, y: posY };
  };

  return (
    // [반응형 UI] 컨테이너를 모바일에서는 column, PC에서는 row로 배치. 모바일은 하단 여백(pb-20) 확보
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-gray-900 font-sans pb-20 md:pb-0">
      
      {/* --- 모바일 전용 상단 헤더 --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Sparkles size={24} /> 매직클래스
        </div>
        <button onClick={downloadCSV} className="text-emerald-600 p-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-1 text-xs font-bold transition-colors">
          <Download size={16} /> <span className="hidden sm:inline">엑셀 백업</span>
        </button>
      </div>

      {/* --- 사이드바 & 모바일 하단 네비게이션 --- */}
      <div className="md:w-64 bg-white border-t md:border-t-0 md:border-r h-16 md:h-screen flex flex-row md:flex-col p-2 md:p-4 gap-2 md:space-y-2 shrink-0 fixed bottom-0 left-0 w-full z-50 md:relative overflow-x-auto justify-start items-center md:items-stretch shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none hide-scrollbar">
        
        {/* PC용 로고 (모바일 숨김) */}
        <div className="hidden md:flex items-center gap-2 mb-8 px-2 text-indigo-600 font-bold text-xl">
          <div className="p-2 bg-indigo-600 rounded-lg text-white"><Sparkles size={24} /></div>
          <h1>매직클래스</h1>
        </div>

        <button onClick={() => {setActiveTab('students'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={20} /> <span className="md:inline">학생 관리</span></button>
        <button onClick={() => {setActiveTab('attendance'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Calendar size={20} /> <span className="md:inline">출석 관리</span></button>
        <button onClick={() => {setActiveTab('assignments'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><BookOpen size={20} /> <span className="md:inline">과제 관리</span></button>
        <button onClick={() => {setActiveTab('status'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><BarChart2 size={20} /> <span className="md:inline">과제 현황</span></button>
        <button onClick={() => {setActiveTab('counseling'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-3 p-3 md:p-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><MessageCircle size={20} /> <span className="md:inline">학생 상담</span></button>
        
        <div className="hidden md:block my-2 border-t border-gray-100"></div>
        {/* PC용 다운로드 버튼 (모바일 숨김) */}
        <button onClick={downloadCSV} className="hidden md:flex items-center gap-2 px-3 py-3 rounded-xl transition-all text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold shadow-sm border border-emerald-100 text-sm whitespace-nowrap">
          <Download size={18} className="shrink-0" /> 엑셀 다운로드 (AI용)
        </button>
      </div>
      
      {/* --- Main Content --- */}
      <main className="flex-1 p-4 md:p-10 overflow-auto print-container relative">
        <div className="hidden md:flex justify-between items-center mb-8 no-print">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {activeTab === 'students' && (selectedStudent ? '개인 리포트' : '학생 명단 관리')}
            {activeTab === 'attendance' && '출석 관리'}
            {activeTab === 'assignments' && '과제 관리'}
            {activeTab === 'status' && '과제 현황'}
            {activeTab === 'counseling' && '학생 상담 기록'}
          </h2>
        </div>

        {/* 1. 학생 관리 */}
        {activeTab === 'students' && !selectedStudent && (
          <div className="space-y-4 md:space-y-6 no-print">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl md:text-3xl font-black text-gray-800">학생 명단</h3>
              <button onClick={() => {
                const lastNum = students.length > 0 ? Math.max(...students.map(s => parseInt(s.num) || 0)) : 0;
                setShowStudentModal({id: null, num: (lastNum + 1).toString(), name: '', memo: ''});
              }} className="bg-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg hover:bg-indigo-700 transition-all text-sm md:text-base">
                <Plus size={20} /> 학생 추가
              </button>
            </div>
            {/* 반응형: 테이블이 잘리지 않게 가로 스크롤 허용 */}
            <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 text-gray-400 text-xs border-b font-black uppercase tracking-wider">
                  <tr>
                    <th className="px-6 md:px-10 py-4 md:py-5 w-16">번호</th>
                    <th className="px-6 md:px-10 py-4 md:py-5 w-32">이름</th>
                    <th className="px-6 md:px-10 py-4 md:py-5">학생 메모</th>
                    <th className="px-6 md:px-10 py-4 md:py-5 text-right w-24">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-bold">등록된 학생이 없습니다.</td></tr>
                  )}
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 md:px-10 py-4 md:py-6 text-gray-400 font-mono text-base md:text-lg">{s.num.padStart(2, '0')}</td>
                      <td onClick={() => setSelectedStudent(s)} className="px-6 md:px-10 py-4 md:py-6 font-bold text-lg md:text-xl text-indigo-600 cursor-pointer hover:underline underline-offset-4 whitespace-nowrap">{s.name}</td>
                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <input 
                          type="text" 
                          value={s.memo} 
                          onChange={(e) => handleInlineMemoUpdate(s.id, e.target.value)}
                          placeholder="메모를 입력하세요"
                          className="w-full bg-transparent border-none focus:ring-0 focus:bg-white focus:shadow-inner rounded-lg px-2 py-2 text-gray-600 font-medium transition-all"
                        />
                      </td>
                      <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                        <div className="flex justify-end gap-2 md:gap-3">
                          <button onClick={() => setShowStudentModal(s)} className="p-2 md:p-2.5 bg-gray-50 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                          <button onClick={() => deleteStudent(s.id)} className="p-2 md:p-2.5 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 no-print overflow-hidden">
            {/* 달력 영역 (모바일에서는 위, PC에서는 왼쪽) */}
            <div className="shrink-0 w-full lg:w-80">
              <div className="bg-white p-5 lg:p-6 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</h3>
                <div className="grid grid-cols-7 gap-y-2 text-center mb-2 font-semibold text-xs">
                  {['일','월','화','수','목','금','토'].map(d => <div key={d} className="text-gray-300">{d}</div>)}
                  {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const d = i + 1;
                    const curDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const isSelected = selectedDate.getDate() === d;
                    const dotColor = getAttendanceDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 lg:p-8 min-w-0">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 lg:gap-3 shrink-0">
                  <Calendar className="text-indigo-600" size={24} />
                  <span>{dateKey} 출석부</span>
                </h3>
                <button onClick={() => {
                  setAttendanceData(prev => ({
                    ...prev, [dateKey]: students.reduce((acc, s) => ({...acc, [s.id]: { ...(prev[dateKey]?.[s.id] || { mood: '😊', memo: '' }), present: true }}), prev[dateKey] || {})
                  }));
                }} className="bg-green-50 text-green-600 px-3 lg:px-4 py-2 rounded-xl font-bold hover:bg-green-100 flex items-center gap-1 text-xs lg:text-sm"><Check size={14} /> 전원 출석</button>
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                {students.length === 0 && <p className="text-gray-400 text-sm">먼저 학생 명단에서 학생을 추가해주세요.</p>}
                {students.map(student => {
                  const state = attendanceData[dateKey]?.[student.id] || { present: false, mood: '😊', memo: '' };
                  return (
                    <div key={student.id} className="flex items-center gap-3 lg:gap-4">
                      <button onClick={() => toggleAttendance(student.id)} className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${state.present ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}>
                        <CheckCircle size={20} className="lg:w-6 lg:h-6" />
                      </button>
                      <div className="w-16 lg:w-20 font-bold text-base lg:text-lg text-gray-700 shrink-0 truncate">{student.name}</div>
                      
                      <div className="relative shrink-0">
                        <button 
                          disabled={!state.present}
                          onClick={(e) => {
                            const coords = calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 180, 120);
                            setMoodPickerTarget({ studentId: student.id, x: coords.x, y: coords.y });
                          }} 
                          className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-50 border-2 border-transparent flex items-center justify-center text-xl lg:text-2xl transition-all ${state.present ? 'hover:border-indigo-100 opacity-100' : 'opacity-30'}`}
                        >
                          {state.mood}
                        </button>
                      </div>

                      <div className="flex-1">
                        <input value={state.memo} onChange={(e) => {
                          const val = e.target.value;
                          setAttendanceData(p => ({...p, [dateKey]: {...p[dateKey], [student.id]: {...state, memo: val}}}));
                        }} placeholder="비고 입력..." className="w-full bg-slate-50 border-none px-4 lg:px-6 py-2.5 lg:py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 text-xs lg:text-sm font-medium" />
                      </div>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl lg:text-2xl font-bold">과목 및 과제 관리</h3>
                <div className="flex flex-wrap gap-2 lg:gap-4 text-xs font-bold mt-1">
                  <span className="flex items-center gap-1"><span className="text-blue-700 text-lg">◎</span> 매우잘함</span>
                  <span className="flex items-center gap-1"><span className="text-yellow-600 text-lg">○</span> 잘함</span>
                  <span className="flex items-center gap-1"><span className="text-red-500 text-lg">△</span> 미흡</span>
                  <span className="flex items-center gap-1"><span className="text-gray-400 text-lg">-</span> 미완료</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setShowSubjectModal({id: null, title: ''})} className="flex-1 md:flex-none bg-white text-gray-600 border border-gray-200 px-4 py-2.5 rounded-2xl flex justify-center items-center gap-2 font-semibold shadow-sm hover:bg-gray-50 transition-all text-sm">과목 추가</button>
                <button onClick={() => {
                  if(subjects.length === 0) return alert('먼저 과목을 추가해주세요.');
                  setShowAssignmentModal({id: null, title: '', subjectId: subjects[0]?.id || '', dueDate: dateKey});
                }} className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2.5 rounded-2xl flex justify-center items-center gap-2 font-semibold shadow-md hover:bg-indigo-700 transition-all text-sm">새 과제</button>
              </div>
            </div>
            
            <div className="space-y-4">
              {subjects.length === 0 && <div className="text-center py-10 text-gray-400 font-bold bg-white rounded-3xl">등록된 과목이 없습니다. 과목을 먼저 추가하세요.</div>}
              {subjects.map(sub => {
                const subAssignments = assignments.filter(a => a.subjectId === sub.id);
                const isExpanded = expandedSubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-5 lg:px-8 py-5 lg:py-6 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-3 lg:gap-4 pr-16">
                          <BookOpen className="text-indigo-400 shrink-0" size={20} />
                          <span className="font-bold text-lg lg:text-xl text-gray-700 truncate">{sub.title}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="text-gray-300 shrink-0" /> : <ChevronDown className="text-gray-300 shrink-0" />}
                      </button>
                      <div className="absolute right-12 lg:right-20 flex gap-2 lg:gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white pl-4">
                        <Edit2 onClick={() => setShowSubjectModal({id: sub.id, title: sub.title})} size={18} className="text-gray-300 hover:text-indigo-600 cursor-pointer" />
                        <Trash2 onClick={(e) => deleteSubject(sub.id, e)} size={18} className="text-gray-300 hover:text-red-500 cursor-pointer" />
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-4 lg:px-8 pb-4 lg:pb-6 space-y-3">
                        {subAssignments.length === 0 ? <p className="text-gray-300 text-sm py-2 italic text-center">등록된 과제가 없습니다.</p> : 
                          subAssignments.map(a => (
                            <div key={a.id} className="border-t border-gray-50 pt-3">
                              {/* 반응형 과제 헤더 */}
                              <div onClick={() => setExpandedTask(expandedTask === a.id ? null : a.id)} className={`p-3 lg:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-all ${expandedTask === a.id ? 'bg-indigo-50/50' : 'bg-slate-50 hover:bg-indigo-50/30'}`}>
                                <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                  <span className="font-bold text-sm lg:text-base text-gray-700">{a.title}</span>
                                  <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">{a.dueDate}</span>
                                </div>
                                <div className="flex items-center justify-end gap-1 text-xs text-indigo-400 font-bold shrink-0">
                                  <button onClick={(e) => { e.stopPropagation(); setShowAssignmentModal(a); }} className="p-2 hover:bg-indigo-100 text-indigo-500 rounded-xl transition-colors"><Edit2 size={16} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteAssignment(a.id); }} className="p-2 hover:bg-red-100 text-red-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                  <div className="ml-1 lg:ml-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-50 shadow-sm text-indigo-600">
                                    {expandedTask === a.id ? '접기' : '현황 보기'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* 성취도 기록 패널 */}
                              {expandedTask === a.id && (
                                <div className="mt-2 lg:mt-3 p-4 lg:p-6 bg-white border border-indigo-100 rounded-3xl">
                                  <div className="flex justify-between items-center mb-4 lg:mb-6">
                                    <h5 className="font-bold text-indigo-600 text-xs lg:text-sm">성취도 기록</h5>
                                    <button onClick={() => bulkTaskDone(a.id)} className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700">전원 ◎ 완료</button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                    {students.map(s => {
                                      const status = assignmentStatus[dateKey]?.[s.id]?.[a.id] || null;
                                      const memo = assignmentStatus[dateKey]?.[s.id]?.[`memo_${a.id}`] || '';
                                      return (
                                        <div key={s.id} className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 border border-gray-100 relative">
                                          <div 
                                            onClick={(e) => {
                                              const coords = calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 160, 150);
                                              setStatusPickerTarget({ studentId: s.id, taskId: a.id, date: dateKey, x: coords.x, y: coords.y });
                                            }} 
                                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${getStatusColorClass(status)}`}
                                          >
                                            <span className="font-bold text-sm truncate pr-2">{s.name}</span>
                                            <span className="font-black text-lg shrink-0">{getStatusIcon(status)}</span>
                                          </div>
                                          <input 
                                            value={memo} 
                                            onChange={(e) => updateTaskMemo(s.id, a.id, e.target.value)}
                                            placeholder="메모..." 
                                            className="w-full bg-white border border-gray-100 px-3 py-2 rounded-lg outline-none text-[11px] lg:text-xs font-medium"
                                          />
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

        {/* 4. 과제 현황 (종합 뷰) */}
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
                    const isSelected = selectedDate.getDate() === d;
                    const dotColor = getAssignmentDot(curDate);
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-2 mb-4 lg:mb-6">
                <h3 className="text-xl font-bold">{dateKey} 과제 진행 종합</h3>
                <span className="text-xs text-gray-400 font-bold bg-white px-3 py-1.5 rounded-lg">학생을 클릭하면 개별 현황을 확인할 수 있습니다.</span>
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
                    <div className="w-14 lg:w-16 font-bold text-lg lg:text-xl text-center text-gray-700 group-hover:text-indigo-600 truncate">{student.name}</div>
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

        {/* 5. 학생 상담 기능 */}
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
                    const isSelected = selectedDate.getDate() === d;
                    const dotColor = getCounselingDot(curDate); 
                    return (
                      <div key={d} className="relative flex flex-col items-center">
                        <button onClick={() => setSelectedDate(curDate)} className={`w-9 h-9 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
                        {dotColor && <div className={`absolute bottom-0 lg:bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 lg:p-8 min-w-0 flex flex-col lg:h-[calc(100vh-6rem)]">
              <div className="flex items-center justify-between mb-4 lg:mb-6 shrink-0">
                <h3 className="text-lg lg:text-xl font-bold flex items-center gap-2 lg:gap-3 shrink-0">
                  <MessageCircle className="text-indigo-600" size={24} />
                  <span>{dateKey} 학생 상담</span>
                </h3>
                <button 
                  onClick={() => addCounselingRecord(dateKey)} 
                  className="bg-indigo-600 text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-1 lg:gap-2 text-xs lg:text-sm shadow-md transition-all"
                >
                  <Plus size={16} /> <span className="hidden sm:inline">상담 추가</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 lg:pr-2 hide-scrollbar">
                {(counselingData[dateKey] || []).map((record) => (
                  <div key={record.id} className="bg-slate-50 p-4 lg:p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-4 relative group">
                    <button 
                      onClick={() => deleteCounselingRecord(dateKey, record.id)} 
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    {/* 모바일에서는 세로 배치, PC에서는 가로 배치 */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pr-8 lg:pr-10">
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">작성자</label>
                        <input 
                          value={record.recorder} 
                          onChange={(e) => updateCounselingRecord(dateKey, record.id, 'recorder', e.target.value)} 
                          className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl outline-none text-xs lg:text-sm font-bold transition-all" 
                          placeholder="예: 담임" 
                        />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">학생 선택</label>
                        <select 
                          value={record.studentId} 
                          onChange={(e) => updateCounselingRecord(dateKey, record.id, 'studentId', e.target.value)} 
                          className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl outline-none text-xs lg:text-sm font-bold appearance-none transition-all"
                        >
                          <option value="" disabled>선택하세요</option>
                          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          <option value="other">기타 (타반 등)</option>
                        </select>
                      </div>
                      <div className="w-full sm:w-1/3 flex sm:flex-col justify-end pb-0 sm:pb-1">
                        <label className="flex items-center gap-2 cursor-pointer p-1.5 lg:p-2 rounded-xl hover:bg-gray-100 transition-colors w-fit">
                          <input 
                            type="checkbox" 
                            checked={record.resolved} 
                            onChange={(e) => updateCounselingRecord(dateKey, record.id, 'resolved', e.target.checked)} 
                            className="w-4 h-4 lg:w-5 lg:h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className={`font-black text-xs lg:text-sm ${record.resolved ? 'text-blue-600' : 'text-red-500'}`}>
                            {record.resolved ? '해결 완료' : '미해결 상태'}
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                      <div className="flex-1">
                        <label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">상담 내용</label>
                        <textarea 
                          value={record.content} 
                          onChange={(e) => updateCounselingRecord(dateKey, record.id, 'content', e.target.value)} 
                          rows={3} 
                          className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl outline-none text-xs lg:text-sm font-medium resize-none transition-all leading-relaxed" 
                          placeholder="학생과의 상담 내용을 기록하세요..." 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] lg:text-xs font-black text-gray-400 mb-1 ml-1">상담 결과</label>
                        <textarea 
                          value={record.result} 
                          onChange={(e) => updateCounselingRecord(dateKey, record.id, 'result', e.target.value)} 
                          rows={3} 
                          className="w-full bg-white border border-gray-100 focus:border-indigo-400 px-3 lg:px-4 py-2.5 lg:py-3 rounded-2xl outline-none text-xs lg:text-sm font-medium resize-none transition-all leading-relaxed" 
                          placeholder="상담 후 조치 사항을 기록하세요..." 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!counselingData[dateKey] || counselingData[dateKey].length === 0) && (
                  <div className="text-center py-16 lg:py-20 text-gray-300 font-bold flex flex-col items-center gap-3">
                    <MessageCircle size={40} className="text-gray-200" />
                    <p className="text-sm">기록된 상담 내용이 없습니다.<br/>[상담 추가] 버튼을 눌러 기록을 시작하세요.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. 개인 리포트 (학생 이름 클릭 시) */}
        {selectedStudent && (
          <div className="space-y-4 md:space-y-6">
            <button onClick={() => setSelectedStudent(null)} className="no-print flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors mb-2 md:mb-4 font-bold text-sm md:text-base"><ChevronLeft size={20} /> 목록으로 돌아가기</button>
            <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-gray-100 shadow-sm print-container">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-10 border-b pb-6 md:pb-10 border-dashed">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] bg-indigo-600 text-white flex items-center justify-center text-3xl md:text-4xl font-black shadow-xl md:shadow-2xl shadow-indigo-200 shrink-0">{selectedStudent.name[0]}</div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-black text-gray-800 mb-2">{selectedStudent.name} 학생 개인 리포트</h3>
                  <div className="flex gap-4">
                    <p className="text-gray-400 font-bold text-sm md:text-base">분석 기간: {selectedDate.getFullYear()}.{String(selectedDate.getMonth() + 1).padStart(2, '0')}.01 - {dateKey}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-10 bg-indigo-50/20 rounded-[24px] md:rounded-[40px] border border-indigo-50/50 min-h-[150px] leading-relaxed text-gray-600 text-sm md:text-lg font-medium">
                학습 현황 데이터를 기반으로 작성된 리포트입니다. [엑셀 다운로드] 버튼을 통해 데이터를 제미나이에게 전달하면 상세한 리포트를 얻을 수 있습니다.
              </div>
            </div>
          </div>
        )}

        {/* --- Modals (공통 팝업 영역) --- */}
        
        {/* 상태 선택 팝업 (성취도) */}
        {statusPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setStatusPickerTarget(null)}>
            <div 
              className="absolute bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-1 w-32 animate-in zoom-in-95 duration-150"
              style={{ left: statusPickerTarget.x, top: statusPickerTarget.y }}
              onClick={e => e.stopPropagation()}
            >
              {[
                { s: 'done', l: '매우잘함' },
                { s: 'ing', l: '잘함' },
                { s: 'bad', l: '미흡' },
                { s: null, l: '미완료' }
              ].map(item => (
                <button 
                  key={item.l}
                  onClick={() => setTaskStatus(statusPickerTarget.studentId, statusPickerTarget.taskId, item.s, statusPickerTarget.date)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${getStatusColorClass(item.s)} hover:scale-[1.02]`}
                >
                  <span>{getStatusIcon(item.s)}</span>
                  <span>{item.l}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 기분 이모지 팝업 */}
        {moodPickerTarget && (
          <div className="fixed inset-0 z-[200]" onClick={() => setMoodPickerTarget(null)}>
            <div 
              className="absolute bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-4 gap-2 w-44 animate-in zoom-in-95 duration-150"
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
                  className="w-9 h-9 text-xl hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 과제 현황 상세 뷰 모달 (개인별) */}
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

        {/* 학생 추가/수정 모달 */}
        {showStudentModal && (
          <StudentEditModal 
            key={showStudentModal.id || `new_student_${showStudentModal.num}`}
            data={showStudentModal} 
            onClose={() => setShowStudentModal(null)} 
            onSave={saveStudent} 
          />
        )}

        {/* 과제 추가/수정 모달 */}
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
      
      {/* CSS for hiding scrollbars on specific elements */}
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
        if (data.id === null) {
          onSave(data.id, num, name, memo, true); // 신규일 땐 바로 저장하고 다음으로
        } else {
          memoRef.current?.focus(); // 수정일 땐 메모칸으로 이동
        }
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
