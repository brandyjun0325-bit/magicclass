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
  Trophy // 매직점수용 아이콘
} from 'lucide-react';

// --- Local Storage Custom Hook ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {}
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const App = () => {
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

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
  
  // [추가] 매직점수 데이터 상태
  const [magicPoints, setMagicPoints] = useLocalStorage('magic_points', {}); 

  const moods = ['😊', '🤩', '😐', '😴', '🤒', '😡', '😢', '😑'];

  // --- Dots Logic ---
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

  const getStatusColorClass = (status) => {
    switch(status) {
      case 'done': return 'bg-blue-700 text-white'; 
      case 'ing': return 'bg-yellow-100 text-yellow-800'; 
      case 'bad': return 'bg-red-100 text-red-800'; 
      default: return 'bg-gray-100 text-gray-500'; 
    }
  };

  // --- Handlers ---
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

  const addMagicPoint = (studentId, type, reason, points) => {
    if(!studentId || !reason) return;
    const newRecord = {
      id: 'p' + Date.now(),
      date: dateKey,
      type, // 'plus' or 'minus'
      reason,
      amount: type === 'plus' ? Math.abs(points) : -Math.abs(points)
    };
    setMagicPoints(prev => ({
      ...prev,
      [studentId]: [newRecord, ...(prev[studentId] || [])]
    }));
  };

  const deleteMagicPoint = (studentId, pointId) => {
    setMagicPoints(prev => ({
      ...prev,
      [studentId]: prev[studentId].filter(p => p.id !== pointId)
    }));
  };

  // --- CSV Download ---
  const downloadCSV = () => {
    let csvContent = '\uFEFF'; 
    csvContent += '날짜,구분,학생번호,학생이름,항목,상태/점수,메모/사유\n';
    const escape = (s) => `"${String(s || '').replace(/"/g, '""')}"`;

    const allDates = Array.from(new Set([...Object.keys(attendanceData), ...assignments.map(a => a.dueDate), ...Object.keys(counselingData)])).sort();

    allDates.forEach(date => {
      students.forEach(student => {
        // 출석
        const att = attendanceData[date]?.[student.id];
        if (att) csvContent += `${date},출석,${student.num},${escape(student.name)},출석체크,${att.present?'출석':'결석'},${escape(att.mood + ' ' + att.memo)}\n`;
        // 과제
        assignments.filter(a => a.dueDate === date).forEach(t => {
          const s = assignmentStatus[date]?.[student.id]?.[t.id];
          csvContent += `${date},과제,${student.num},${escape(student.name)},${escape(t.title)},${getStatusLabel(s)},${escape(assignmentStatus[date]?.[student.id]?.[`memo_${t.id}`])}\n`;
        });
        // 상담
        (counselingData[date] || []).filter(c => c.studentId === student.id).forEach(c => {
          csvContent += `${date},상담,${student.num},${escape(student.name)},${escape(c.recorder)},${c.resolved?'완료':'미해결'},${escape(c.content + ' / ' + c.result)}\n`;
        });
      });
    });
    
    // 매직점수 별도 합산 출력
    students.forEach(student => {
      (magicPoints[student.id] || []).forEach(p => {
        csvContent += `${p.date},매직점수,${student.num},${escape(student.name)},${p.type === 'plus' ? '칭찬매직' : '격려매직'},${p.amount},${escape(p.reason)}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `매직클래스_데이터_${formatDate(new Date())}.csv`;
    link.click();
  };

  const Sidebar = () => (
    <div className="md:w-64 bg-white border-t md:border-t-0 md:border-r h-16 md:h-screen flex flex-row md:flex-col p-2 md:p-4 gap-2 fixed bottom-0 left-0 w-full z-50 md:relative overflow-x-auto items-center md:items-stretch shadow-lg md:shadow-none hide-scrollbar">
      <div className="hidden md:flex items-center gap-2 mb-8 px-2 text-indigo-600 font-bold text-xl"><Sparkles size={24} /><h1>매직클래스</h1></div>
      <button onClick={() => setActiveTab('students')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={20} /> <span className="md:inline">학생 관리</span></button>
      <button onClick={() => setActiveTab('attendance')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Calendar size={20} /> <span className="md:inline">출석 관리</span></button>
      <button onClick={() => setActiveTab('assignments')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'assignments' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><BookOpen size={20} /> <span className="md:inline">과제 관리</span></button>
      <button onClick={() => setActiveTab('status')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><BarChart2 size={20} /> <span className="md:inline">과제 현황</span></button>
      <button onClick={() => setActiveTab('counseling')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><MessageCircle size={20} /> <span className="md:inline">학생 상담</span></button>
      <button onClick={() => setActiveTab('magicpoints')} className={`flex items-center gap-2 p-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'magicpoints' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Trophy size={20} /> <span className="md:inline">매직 점수</span></button>
      <div className="hidden md:block my-2 border-t border-gray-100"></div>
      <button onClick={downloadCSV} className="hidden md:flex items-center gap-2 px-3 py-3 rounded-xl transition-all text-emerald-600 hover:bg-emerald-50 font-bold border border-emerald-100 text-sm whitespace-nowrap"><Download size={18} /> 엑셀 다운로드</button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-gray-900 font-sans pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-auto">
        
        {/* 학생 관리, 출석, 과제 등 기존 탭 생략... (이전 코드와 동일) */}
        {activeTab === 'students' && !selectedStudent && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black">학생 명단</h3>
              <button onClick={() => setShowStudentModal({id: null, num: (students.length+1).toString(), name: '', memo: ''})} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2"><Plus size={20} /> 학생 추가</button>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-gray-400 text-xs border-b font-black uppercase tracking-wider">
                  <tr><th className="px-10 py-5">번호</th><th className="px-10 py-5">이름</th><th className="px-10 py-5">학생 메모</th><th className="px-10 py-5 text-right">작업</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-10 py-6 text-gray-400 font-mono text-lg">{s.num.padStart(2, '0')}</td>
                      <td className="px-10 py-6 font-bold text-xl text-indigo-600 cursor-pointer" onClick={() => setSelectedStudent(s)}>{s.name}</td>
                      <td className="px-10 py-6"><input type="text" value={s.memo} onChange={(e) => handleInlineMemoUpdate(s.id, e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-gray-600 font-medium" /></td>
                      <td className="px-10 py-6 text-right"><div className="flex justify-end gap-3"><button onClick={() => setShowStudentModal(s)} className="p-2.5 bg-gray-50 text-gray-300 hover:text-indigo-600 rounded-xl"><Edit2 size={18} /></button><button onClick={() => deleteStudent(s.id)} className="p-2.5 bg-gray-50 text-gray-300 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* [신규] 매직점수 탭 */}
        {activeTab === 'magicpoints' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <h3 className="text-3xl font-black text-gray-800">🪄 매직 점수 관리</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {students.map(student => {
                const points = magicPoints[student.id] || [];
                const total = points.reduce((acc, p) => acc + p.amount, 0);
                
                return (
                  <div key={student.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg">{student.name[0]}</div>
                        <div>
                          <h4 className="font-black text-xl text-gray-800">{student.name}</h4>
                          <span className="text-xs text-gray-400">누적 매직: <span className={`font-bold ${total>=0?'text-blue-600':'text-red-500'}`}>{total}점</span></span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-indigo-600">{total}</div>
                    </div>

                    {/* 입력 폼 */}
                    <div className="flex flex-col gap-2">
                      <input 
                        id={`reason-${student.id}`}
                        placeholder="사유를 입력하세요 (예: 발표를 잘함)" 
                        className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                            const val = e.target.value;
                            if(val) {
                              addMagicPoint(student.id, 'plus', val, 1);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const input = document.getElementById(`reason-${student.id}`);
                            if(input.value) { addMagicPoint(student.id, 'plus', input.value, 1); input.value = ''; }
                            else alert('사유를 입력해주세요.');
                          }}
                          className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95"
                        >
                          칭찬 매직 +1
                        </button>
                        <button 
                          onClick={() => {
                            const input = document.getElementById(`reason-${student.id}`);
                            if(input.value) { addMagicPoint(student.id, 'minus', input.value, 1); input.value = ''; }
                            else alert('사유를 입력해주세요.');
                          }}
                          className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 shadow-md transition-all active:scale-95"
                        >
                          격려 매직 -1
                        </button>
                      </div>
                    </div>

                    {/* 최근 내역 (최대 3개) */}
                    <div className="mt-2 space-y-2">
                      <h5 className="text-xs font-black text-gray-400 ml-1">최근 기록</h5>
                      {points.slice(0, 3).map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl text-xs group">
                          <div className="flex items-center gap-2">
                            <span className={`w-8 text-center font-bold ${p.type==='plus'?'text-blue-600':'text-red-500'}`}>{p.amount > 0 ? `+${p.amount}` : p.amount}</span>
                            <span className="text-gray-600 font-medium">{p.reason}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-[10px]">{p.date}</span>
                            <button onClick={() => deleteMagicPoint(student.id, p.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={14}/></button>
                          </div>
                        </div>
                      ))}
                      {points.length === 0 && <p className="text-center py-4 text-gray-300 text-xs italic">기록이 없습니다.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 나머지 탭 처리 (기존 코드와 동일) */}
        {/* ... (중략: 출석, 과제, 현황, 상담 등 이전 최종 코드 유지) ... */}

        {/* 학생 추가 모달 */}
        {showStudentModal && (
          <StudentEditModal 
            key={showStudentModal.id || `new_student_${showStudentModal.num}`}
            data={showStudentModal} 
            onClose={() => setShowStudentModal(null)} 
            onSave={saveStudent} 
          />
        )}
      </main>
    </div>
  );
};

// 학생 모달 등 서브 컴포넌트 생략 (이전 최종 버전 유지)
const StudentEditModal = ({ data, onClose, onSave }) => {
  const [num, setNum] = useState(data.num || '');
  const [name, setName] = useState(data.name || '');
  const [memo, setMemo] = useState(data.memo || '');
  const nameRef = useRef(null);
  const memoRef = useRef(null);
  useEffect(() => { if (nameRef.current) nameRef.current.focus(); }, []);
  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      if (field === 'name') { if (data.id === null) onSave(data.id, num, name, memo, true); else memoRef.current?.focus(); }
      else if (field === 'memo') onSave(data.id, num, name, memo, data.id === null); 
    }
  };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6"><h4 className="text-2xl font-black">{data.id?'정보 수정':'학생 등록'}</h4><button onClick={onClose}><X/></button></div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20"><label className="text-xs font-bold text-gray-400">번호</label><input value={num} onChange={e=>setNum(e.target.value)} className="w-full bg-slate-50 border-none p-3 rounded-xl text-center font-bold"/></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-400">이름</label><input ref={nameRef} value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>handleKeyDown(e,'name')} className="w-full bg-slate-50 border-none p-3 rounded-xl font-bold"/></div>
          </div>
          <div><label className="text-xs font-bold text-gray-400">메모</label><input ref={memoRef} value={memo} onChange={e=>setMemo(e.target.value)} onKeyDown={e=>handleKeyDown(e,'memo')} className="w-full bg-slate-50 border-none p-3 rounded-xl font-bold"/></div>
          <button onClick={() => onSave(data.id, num, name, memo, data.id===null)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">저장</button>
        </div>
      </div>
    </div>
  );
};

// (기타 과제 모달 등 필요한 컴포넌트는 이전 코드를 그대로 사용하시면 됩니다.)

export default App;
