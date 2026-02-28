import React, { useState } from 'react';
import { Users, Calendar, BookOpen, BarChart2, Plus, Edit2, Trash2, X, Sparkles, CheckCircle } from 'lucide-react';

const App = () => {
  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([
    { id: '1', num: '01', name: '김학생', memo: '메모 없음' },
    { id: '2', num: '02', name: '이학생', memo: '메모 없음' },
    { id: '3', num: '03', name: '박학생', memo: '메모 없음' },
  ]);
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ num: '', name: '', memo: '' });

  // --- 학생 관리 로직 ---
  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      // 자동 번호 계산
      const nextNum = String(students.length + 1).padStart(2, '0');
      setFormData({ num: nextNum, name: '', memo: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (editingStudent) {
      // 편집
      setStudents(students.map(s => s.id === editingStudent.id ? { ...formData, id: s.id } : s));
    } else {
      // 추가
      setStudents([...students, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // --- UI 구성 ---
  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* 사이드바 */}
      <div className="w-64 bg-white border-r h-screen flex flex-col p-4 space-y-2 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2 text-indigo-600 font-bold text-xl">
          <Sparkles size={24} /> <h1>매직클래스</h1>
        </div>
        {[
          { id: 'students', label: '학생 관리', icon: Users },
          { id: 'attendance', label: '출석 관리', icon: Calendar },
          { id: 'assignments', label: '과제 관리', icon: BookOpen },
          { id: 'status', label: '과제 현황', icon: BarChart2 },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-3 p-3 rounded-xl ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <tab.icon size={20} /> {tab.label}
          </button>
        ))}
      </div>
      
      {/* 메인 화면 */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-800">학생 명단 관리</h2>
          <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-indigo-700">
            <Plus size={20} /> 학생 추가
          </button>
        </div>

        {/* 학생 테이블 */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-10 py-5">번호</th>
                <th className="px-10 py-5">이름</th>
                <th className="px-10 py-5">학생 메모</th>
                <th className="px-10 py-5 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-indigo-50/30">
                  <td className="px-10 py-6 text-gray-400 font-mono text-lg">{s.num}</td>
                  <td className="px-10 py-6 font-bold text-xl text-indigo-600">{s.name}</td>
                  <td className="px-10 py-6 text-gray-600">{s.memo}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openModal(s)} className="p-2 bg-gray-50 hover:bg-indigo-100 rounded-xl"><Edit2 size={18} /></button>
                      <button onClick={() => deleteStudent(s.id)} className="p-2 bg-gray-50 hover:bg-red-100 text-red-500 rounded-xl"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* 💡 학생 추가/편집 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{editingStudent ? '학생 수정' : '학생 추가'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="번호 (예: 01)" value={formData.num} onChange={e => setFormData({...formData, num: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="이름" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" placeholder="메모" value={formData.memo} onChange={e => setFormData({...formData, memo: e.target.value})} className="w-full p-3 border rounded-xl" />
              <button onClick={handleSaveStudent} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold">저장하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
