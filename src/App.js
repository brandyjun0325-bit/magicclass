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
  Brain,
  PlaySquare,
  ChevronRight
} from 'lucide-react';

// --- 📖 매직클래스 내장 한자 사전 (초등 핵심 전과목 어휘 300+) ---
const HANJA_DICT = {
  // [공통(학습/학교)]
  "학교":{hanja:"學校",meaning:"學(배울 학), 校(학교 교) : 배우고 생활하는 곳"},
  "교실":{hanja:"敎室",meaning:"敎(가르칠 교), 室(집 실) : 수업을 하는 방"},
  "학년":{hanja:"學年",meaning:"學(배울 학), 年(해 년) : 학교에서 같은 학년"},
  "학기":{hanja:"學期",meaning:"學(배울 학), 期(기약할 기) : 한 해를 나눈 학습 기간"},
  "교육":{hanja:"敎育",meaning:"敎(가르칠 교), 育(기를 육) : 가르치고 기름"},
  "학습":{hanja:"學習",meaning:"學(배울 학), 習(익힐 습) : 배우고 익힘"},
  "수업":{hanja:"授業",meaning:"授(줄 수), 業(일 업) : 가르치고 배우는 일"},
  "교과서":{hanja:"敎科書",meaning:"敎(가르칠 교), 科(과목 과), 書(책 서) : 배우는 내용을 담은 책"},
  "과목":{hanja:"科目",meaning:"科(과목 과), 目(눈 목) : 학교에서 배우는 한 분야"},
  "과제":{hanja:"課題",meaning:"課(매길 과), 題(제목 제) : 해야 할 일이나 문제"},
  "목표":{hanja:"目標",meaning:"目(눈 목), 標(표할 표) : 이루려고 하는 바"},
  "활동":{hanja:"活動",meaning:"活(살 활), 動(움직일 동) : 몸과 마음을 써서 하는 일"},
  "과정":{hanja:"過程",meaning:"過(지날 과), 程(한도 정) : 일이 진행되는 차례"},
  "평가":{hanja:"評價",meaning:"評(평할 평), 價(값 가) : 좋고 나쁨을 판단함"},
  "성취":{hanja:"成就",meaning:"成(이룰 성), 就(이룰 취) : 목표를 이룸"},
  "기준":{hanja:"基準",meaning:"基(터 기), 準(기준 준) : 판단의 바탕"},
  "문제":{hanja:"問題",meaning:"問(물을 문), 題(제목 제) : 해결해야 할 일"},
  "해결":{hanja:"解決",meaning:"解(풀 해), 決(결단할 결) : 풀어서 마무리함"},
  "방법":{hanja:"方法",meaning:"方(모 방), 法(법 법) : 일을 하는 방식"},
  "자료":{hanja:"資料",meaning:"資(바탕 자), 料(헤아릴 료) : 참고하는 것"},
  "정보":{hanja:"情報",meaning:"情(뜻 정), 報(알릴 보) : 알아야 할 내용"},
  "계획":{hanja:"計劃",meaning:"計(셀 계), 劃(그을 획) : 미리 정해 세움"},
  "설명":{hanja:"說明",meaning:"說(말씀 설), 明(밝을 명) : 알기 쉽게 말해 줌"},
  "표현":{hanja:"表現",meaning:"表(겉 표), 現(나타날 현) : 생각이나 느낌을 드러냄"},
  "이해":{hanja:"理解",meaning:"理(다스릴 리), 解(풀 해) : 뜻을 알아들음"},
  "실천":{hanja:"實踐",meaning:"實(열매 실), 踐(밟을 천) : 실제로 실행함"},
  "관찰":{hanja:"觀察",meaning:"觀(볼 관), 察(살필 찰) : 자세히 살펴봄"},
  "실험":{hanja:"實驗",meaning:"實(열매 실), 驗(시험 험) : 해 보고 확인함"},
  "측정":{hanja:"測定",meaning:"測(잴 측), 定(정할 정) : 길이나 양 등을 재어 정함"},
  "비교":{hanja:"比較",meaning:"比(견줄 비), 較(견줄 교) : 서로 견주어 봄"},
  "분류":{hanja:"分類",meaning:"分(나눌 분), 류(무리 류) : 나누어 묶음"},
  "분석":{hanja:"分析",meaning:"分(나눌 분), 析(쪼갤 석) : 나누어 살펴봄"},
  "해석":{hanja:"解釋",meaning:"解(풀 해), 釋(풀 석) : 뜻을 풀이함"},
  "추론":{hanja:"推論",meaning:"推(밀 추), 論(논할 론) : 근거로 미루어 생각함"},
  "토의":{hanja:"討議",meaning:"討(칠 토), 議(의논할 의) : 함께 의논함"},
  "토론":{hanja:"討論",meaning:"討(칠 토), 論(논할 론) : 따져 보며 의논함"},
  "발표":{hanja:"發表",meaning:"發(필 발), 表(겉 표) : 많은 사람 앞에서 말함"},
  "보고":{hanja:"報告",meaning:"報(알릴 보), 告(알릴 고) : 정리하여 알림"},
  "참여":{hanja:"參與",meaning:"參(참여할 참), 與(줄 여) : 함께함"},
  "협력":{hanja:"協力",meaning:"協(도울 협), 力(힘 력) : 힘을 합함"},
  "공동체":{hanja:"共同體",meaning:"共(함께 공), 同(같을 동), 體(몸 체) : 함께 살아가는 모임"},
  "소통":{hanja:"疏通",meaning:"疏(트일 소), 通(통할 통) : 서로 뜻이 잘 통함"},
  "배려":{hanja:"配慮",meaning:"配(나눌 배), 慮(생각할 려) : 남을 생각하고 돌봄"},
  "존중":{hanja:"尊重",meaning:"尊(높일 존), 重(무거울 중) : 소중히 여기고 존중함"},
  "규칙":{hanja:"規則",meaning:"規(법 규), 則(법칙 칙) : 지켜야 할 정한 법"},
  "질서":{hanja:"秩序",meaning:"秩(차례 질), 序(차례 서) : 순서가 잘 잡힌 상태"},
  "안전":{hanja:"安全",meaning:"安(편안 안), 全(온전 전) : 위험이 없음"},
  "건강":{hanja:"健康",meaning:"健(굳건 건), 康(편안 강) : 몸과 마음이 튼튼함"},
  "환경":{hanja:"環境",meaning:"環(둘러쌀 환), 境(지경 경) : 둘러싼 주위의 상태"},
  "문화":{hanja:"文化",meaning:"文(글월 문), 化(될 화) : 사회의 생활 양식과 전통"},
  "예술":{hanja:"藝術",meaning:"藝(재주 예), 術(재주 술) : 아름다움을 표현하는 활동"},
  "체험":{hanja:"體驗",meaning:"體(몸 체), 驗(시험 험) : 몸으로 직접 해 봄"},
  "경험":{hanja:"經驗",meaning:"經(지날 경), 驗(시험 험) : 직접 겪어 봄"},
  "습관":{hanja:"習慣",meaning:"習(익힐 습), 慣(버릇 관) : 반복되어 몸에 밴 행동"},
  "관계":{hanja:"關係",meaning:"關(관계 관), 係(맬 계) : 서로 맺어진 사이"},
  "성찰":{hanja:"省察",meaning:"省(살필 성), 察(살필 찰) : 자기 생각과 행동을 깊이 돌아봄"},
  "흥미":{hanja:"興味",meaning:"興(흥할 흥), 味(맛 미) : 관심이 생겨 즐거움"},
  "인공지능":{hanja:"人工智能",meaning:"人(사람 인), 工(장인 공), 智(지혜 지), 能(능할 능) : 사람이 만든 지능"},
  "지속가능":{hanja:"持續可能",meaning:"持(가질 지), 續(이을 속), 可(가능할 가), 能(능할 능) : 오래 계속될 수 있음"},

  // [국어]
  "문장":{hanja:"文章",meaning:"文(글월 문), 章(글 장) : 글을 이루는 기본 단위"},
  "어휘":{hanja:"語彙",meaning:"語(말씀 어), 彙(무리 휘) : 단어들의 모음"},
  "주제":{hanja:"主題",meaning:"主(주인 주), 題(제목 제) : 글의 중심 생각"},
  "비유":{hanja:"比喩",meaning:"比(견줄 비), 喩(깨우칠 유) : 비슷한 다른 사물에 빗대어 표현함"},
  "상징":{hanja:"象徵",meaning:"象(코끼리 상), 徵(징조 징) : 추상적인 것을 구체적인 사물로 나타냄"},
  "문단":{hanja:"文段",meaning:"文(글월 문), 段(구분 단) : 여러 문장이 모인 덩어리"},
  "서술":{hanja:"敍述",meaning:"敍(펼 서), 述(지을 술) : 사건이나 생각을 차례대로 적음"},
  "요약":{hanja:"要約",meaning:"要(요긴할 요), 약(맺을 약) : 글의 요점을 간추림"},
  "의견":{hanja:"意見",meaning:"意(뜻 의), 見(볼 견) : 어떤 일에 대한 자신의 생각"},
  "근거":{hanja:"根據",meaning:"根(뿌리 근), 據(의지할 거) : 주장의 바탕이 되는 이유"},
  "서론":{hanja:"序論",meaning:"序(차례 서), 論(논할 론) : 글을 시작하는 부분"},
  "본론":{hanja:"本論",meaning:"本(근본 본), 論(논할 론) : 글의 중심 주장이 담긴 부분"},
  "결론":{hanja:"結論",meaning:"結(맺을 결), 論(논할 론) : 글을 마무리하는 부분"},
  "관점":{hanja:"觀點",meaning:"觀(볼 관), 點(점 찍을 점) : 사물이나 현상을 바라보는 태도나 방향"},
  "갈등":{hanja:"葛藤",meaning:"葛(칡 갈), 藤(등나무 등) : 서로 부딪히는 상태"},
  "배경":{hanja:"背景",meaning:"背(등 배), 景(볕 경) : 사건이 일어나는 시간과 장소"},
  "독서":{hanja:"讀書",meaning:"讀(읽을 독), 書(책 서) : 책을 읽는 것"},
  "작문":{hanja:"作文",meaning:"作(지을 작), 文(글월 문) : 글을 짓는 것"},
  "독해":{hanja:"讀解",meaning:"讀(읽을 독), 解(풀 해) : 글을 읽고 뜻을 이해함"},
  "문학":{hanja:"文學",meaning:"文(글월 문), 學(배울 학) : 문학 작품을 읽고 즐기는 분야"},
  "문법":{hanja:"文法",meaning:"文(글월 문), 法(법 법) : 말과 글의 규칙"},
  "주장":{hanja:"主張",meaning:"主(주인 주), 張(베풀 장) : 자신의 생각을 내세움"},
  "사실":{hanja:"事實",meaning:"事(일 사), 實(열매 실) : 실제로 있었던 일"},
  "논리":{hanja:"論理",meaning:"論(논할 론), 理(다스릴 리) : 생각이 맞게 이어지는 이치"},
  "비판":{hanja:"批判",meaning:"批(칠 비), 判(판단할 판) : 잘잘못을 따져 판단함"},

  // [수학]
  "분수":{hanja:"分數",meaning:"分(나눌 분), 數(셈 수) : 전체를 나눈 것 중 일부분을 나타내는 수"},
  "소수":{hanja:"小數",meaning:"小(작을 소), 數(셈 수) : 1보다 작은 크기를 나타내는 수"},
  "도형":{hanja:"圖形",meaning:"圖(그림 도), 形(모양 형) : 점, 선, 면 등으로 이루어진 모양"},
  "직사각형":{hanja:"直四角形",meaning:"直(곧을 직), 四(넉 사), 角(뿔 각), 形(모양 형) : 네 각이 모두 직각인 사각형"},
  "삼각형":{hanja:"三角形",meaning:"三(석 삼), 角(뿔 각), 形(모양 형) : 세 선분으로 둘러싸인 다각형"},
  "부피":{hanja:"體積",meaning:"體(몸 체), 積(쌓을 적) : 물체가 공간에서 차지하는 크기"},
  "넓이":{hanja:"面積",meaning:"面(표면 면), 積(쌓을 적) : 평면이나 겉면이 차지하는 크기"},
  "합동":{hanja:"合同",meaning:"合(합할 합), 同(같을 동) : 포개어지는 관계"},
  "대칭":{hanja:"對稱",meaning:"對(대할 대), 稱(일컬을 칭) : 양쪽이 똑같은 모양"},
  "비례":{hanja:"比例",meaning:"比(견줄 비), 例(법식 례) : 비가 일정한 관계로 변하는 것"},
  "평균":{hanja:"平均",meaning:"平(평평할 평), 均(고를 균) : 합을 개수로 나눈 값"},
  "확률":{hanja:"確率",meaning:"確(굳을 확), 率(비율 률) : 일어날 가능성을 수로 나타낸 것"},
  "자연수":{hanja:"自然數",meaning:"自(스스로 자), 然(그럴 연), 數(셈 수) : 1부터 시작하여 1씩 커지는 수"},
  "정수":{hanja:"整數",meaning:"整(가지런할 정), 數(셈 수) : 양의 정수, 0, 음의 정수"},
  "방정식":{hanja:"方程式",meaning:"方(모 방), 程(한도 정), 式(법 식) : 미지수에 따라 참/거짓이 되는 등식"},
  "비례식":{hanja:"比例式",meaning:"比(견줄 비), 例(법식 례), 式(법 식) : 비율이 같은 두 비를 나타낸 식"},
  "계산":{hanja:"計算",meaning:"計(셀 계), 算(셈 산) : 수를 셈함"},
  "단위":{hanja:"單位",meaning:"單(홑 단), 位(자리 위) : 측정의 기준"},
  "분자":{hanja:"分子",meaning:"分(나눌 분), 子(아들 자) : 분수의 위"},
  "분모":{hanja:"分母",meaning:"分(나눌 분), 母(어머니 모) : 분수의 아래"},
  "약분":{hanja:"約分",meaning:"約(맺을 약), 分(나눌 분) : 분자와 분모를 같은 수로 나눔"},
  "통분":{hanja:"通分",meaning:"通(통할 통), 分(나눌 분) : 분모를 같게 만듦"},
  "기약분수":{hanja:"既約分數",meaning:"既(이미 기), 約(맺을 약), 分(나눌 분), 數(셈 수) : 더 이상 약분 안 되는 분수"},
  "약수":{hanja:"約數",meaning:"約(맺을 약), 數(셈 수) : 나누어떨어지게 하는 수"},
  "배수":{hanja:"倍數",meaning:"倍(곱 배), 數(셈 수) : 몇 배가 되는 수"},
  "공약수":{hanja:"公約數",meaning:"公(공평할 공), 約(맺을 약), 數(셈 수) : 공통 약수"},
  "공배수":{hanja:"公배수",meaning:"公(공평할 공), 倍(곱 배), 數(셈 수) : 공통 배수"},
  "각도":{hanja:"角度",meaning:"角(뿔 각), 度(법도 도) : 각의 크기"},
  "직각":{hanja:"直角",meaning:"直(곧을 직), 角(뿔 각) : 90도 각"},
  "평행":{hanja:"平行",meaning:"平(평평할 평), 行(다닐 행) : 만나지 않는 관계"},
  "수직":{hanja:"垂直",meaning:"垂(드리울 수), 直(곧을 직) : 직각으로 만남"},
  "비율":{hanja:"比率",meaning:"比(견줄 비), 率(비율 률) : 비교한 비의 값"},
  
  // [사회/과학]
  "민주주의":{hanja:"民主主義",meaning:"民(백성 민), 主(주인 주), 主(주인 주), 義(옳을 의) : 국민이 국가의 주인인 제도"},
  "경제":{hanja:"經濟",meaning:"經(다스릴 경), 濟(구제할 제) : 재화를 생산, 분배, 소비하는 활동"},
  "도시":{hanja:"都市",meaning:"都(도읍 도), 市(저자 시) : 인구가 밀집된 정치, 경제 중심지"},
  "역사":{hanja:"歷史",meaning:"歷(지낼 력), 史(역사 사) : 인류 사회의 변천 과정"},
  "생태계":{hanja:"生態系",meaning:"生(날 생), 態(모양 태), 系(이을 계) : 생물과 환경이 영향을 주고받는 체계"},
  "광합성":{hanja:"光合成",meaning:"光(빛 광), 合(합할 합), 成(이룰 성) : 빛 에너지로 양분을 만드는 과정"},
  "지구":{hanja:"地球",meaning:"地(땅 지), 球(공 구) : 우리가 사는 천체"}
};

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

// --- 자체 내장 Sound Player ---
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
  const [showConceptModal, setShowConceptModal] = useState(null); 
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedMasterySubjects, setExpandedMasterySubjects] = useState({}); 

  const [selectedStudentsForMagic, setSelectedStudentsForMagic] = useState([]); 
  const [magicPointValue, setMagicPointValue] = useState(1); 
  const [magicSortOrder, setMagicSortOrder] = useState('num'); 
  const [reportPeriod, setReportPeriod] = useState('all'); 
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));
  const [reportSortOrder, setReportSortOrder] = useState('desc');
  const [magicReasonInput, setMagicReasonInput] = useState('');

  const [selectedExternalLink, setSelectedExternalLink] = useState(null);
  const [viewerTarget, setViewerTarget] = useState(null); 
  const [slideSubjectId, setSlideSubjectId] = useState(null);
  
  // 안내장 모달용 상태
  const [reportStudent, setReportStudent] = useState(null);

  const dateKey = formatDate(selectedDate);

  // 인쇄 모드 전환을 위한 useEffect
  useEffect(() => {
    if (reportStudent) {
      document.body.classList.add('print-mode');
    } else {
      document.body.classList.remove('print-mode');
    }
    // 컴포넌트 언마운트 시 클래스 제거
    return () => document.body.classList.remove('print-mode');
  }, [reportStudent]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [activeTab]);

  // --- Data States (Local Storage 분리) ---
  const [students, setStudents] = useLocalStorage('magic_students', [
    { id: '1', num: '1', name: '김학생', memo: '메모 없음' },
    { id: '2', num: '2', name: '이학생', memo: '메모 없음' },
  ]);
  const [attendanceData, setAttendanceData] = useLocalStorage('magic_attendance', {});
  const [submissions, setSubmissions] = useLocalStorage('magic_submissions', []);
  const [submissionStatus, setSubmissionStatus] = useLocalStorage('magic_submissionStatus', {});
  
  const [assignmentSubjects, setAssignmentSubjects] = useLocalStorage('magic_assignment_subjects', [{ id: 'as1', title: '국어' }, { id: 'as2', title: '수학' }]);
  const [masterySubjects, setMasterySubjects] = useLocalStorage('magic_mastery_subjects', [{ id: 'ms1', title: '국어' }, { id: 'ms2', title: '수학' }]);
  
  const [assignments, setAssignments] = useLocalStorage('magic_assignments', []);
  const [assignmentStatus, setAssignmentStatus] = useLocalStorage('magic_assignmentStatus', {});
  const [counselingData, setCounselingData] = useLocalStorage('magic_counseling', {});
  const [magicPoints, setMagicPoints] = useLocalStorage('magic_points', {}); 
  const [externalLinks, setExternalLinks] = useLocalStorage('magic_external_links', []); 
  const [masteryConcepts, setMasteryConcepts] = useLocalStorage('magic_mastery_concepts', []); 

  const moods = ['😊', '🤩', '😐', '😴', '🤒', '😡', '😢', '😑'];

  // --- 자동 연계 로직 ---
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
    const manualPoints = (magicPoints[studentId] || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const taskPoints = getStudentTaskPoints(studentId);
    return manualPoints + taskPoints;
  };

  // --- UI Helpers ---
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

  const setTaskStatus = (studentId, taskId, status, dueDate) => {
    setAssignmentStatus(prev => {
      const dayData = prev[dueDate] || {};
      const studentData = dayData[studentId] || {};
      return { ...prev, [dueDate]: { ...dayData, [studentId]: { ...studentData, [taskId]: status } } };
    });
  };

  const updateTaskMemo = (studentId, taskId, memo, dueDate) => {
    setAssignmentStatus(prev => {
      const dayData = prev[dueDate] || {};
      const studentData = dayData[studentId] || {};
      return { ...prev, [dueDate]: { ...dayData, [studentId]: { ...studentData, [`memo_${taskId}`]: memo } } };
    });
  };

  const bulkTaskDone = (taskId, dueDate) => {
    setAssignmentStatus(prev => {
      const dayData = prev[dueDate] || {};
      const newDayData = { ...dayData };
      students.forEach(s => { newDayData[s.id] = { ...(newDayData[s.id] || {}), [taskId]: 'done' }; });
      return { ...prev, [dueDate]: newDayData };
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

  const saveSubject = (id, title, type) => {
    if(!title) return;
    if (type === 'assignment') {
      if (id) setAssignmentSubjects(assignmentSubjects.map(s => s.id === id ? {...s, title} : s));
      else setAssignmentSubjects([...assignmentSubjects, { id: 'as' + Date.now(), title }]);
    } else {
      if (id) setMasterySubjects(masterySubjects.map(s => s.id === id ? {...s, title} : s));
      else setMasterySubjects([...masterySubjects, { id: 'ms' + Date.now(), title }]);
    }
    setShowSubjectModal(null);
  };

  const deleteSubject = (id, type, e) => {
    e.stopPropagation();
    if (type === 'assignment') {
      if(window.confirm('과목을 삭제하시겠습니까? 등록된 과제가 함께 삭제됩니다.')) {
        setAssignmentSubjects(assignmentSubjects.filter(s => s.id !== id));
        setAssignments(assignments.filter(a => a.subjectId !== id));
      }
    } else {
      if(window.confirm('과목을 삭제하시겠습니까? 등록된 완전 학습 개념이 함께 삭제됩니다.')) {
        setMasterySubjects(masterySubjects.filter(s => s.id !== id));
        setMasteryConcepts(masteryConcepts.filter(c => c.subjectId !== id)); 
      }
    }
  };

  const moveSubject = (index, direction, type, e) => {
    e.stopPropagation();
    const setFn = type === 'assignment' ? setAssignmentSubjects : setMasterySubjects;
    setFn(prev => {
      const newSubs = [...prev];
      if (direction === 'up' && index > 0) {
        [newSubs[index - 1], newSubs[index]] = [newSubs[index], newSubs[index - 1]];
      } else if (direction === 'down' && index < newSubs.length - 1) {
        [newSubs[index + 1], newSubs[index]] = [newSubs[index], newSubs[index + 1]];
      }
      return newSubs;
    });
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

  const deleteMagicPoint = (studentId, pointId) => {
    setMagicPoints(prev => {
      const newPoints = { ...prev };
      if (newPoints[studentId]) {
        newPoints[studentId] = newPoints[studentId].filter(p => p.id !== pointId);
      }
      return newPoints;
    });
  };

  const handleMagicPointAction = (studentIdsArray, type) => {
    if (studentIdsArray.length === 0) return alert('학생을 먼저 선택해주세요.');
    playSound(type === 'plus' ? 'magic' : 'thunder');
    
    const reasonText = magicReasonInput.trim() || (type === 'plus' ? '칭찬' : '노력');
    const amount = type === 'plus' ? Number(magicPointValue) : -Number(magicPointValue);

    setMagicPoints(prev => {
      const newPoints = { ...prev };
      studentIdsArray.forEach(studentId => {
        const newRecord = { 
          id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9), 
          date: dateKey, 
          timestamp: new Date().getTime(), 
          type, 
          amount,
          reason: reasonText 
        };
        const existingRecords = Array.isArray(newPoints[studentId]) ? newPoints[studentId] : [];
        newPoints[studentId] = [newRecord, ...existingRecords];
      });
      return newPoints;
    });

    setSelectedStudentsForMagic([]);
    setMagicReasonInput('');
  };

  const handleResetMagicPoints = () => {
    if(window.confirm('매직 점수를 0점으로 초기화하시겠습니까?\n(기존 과제 점수는 유지되며, 현재 총합이 0이 되도록 보정됩니다.)')) {
      playSound('thunder'); // [수정] 번개 소리 추가
      setMagicPoints(prev => {
        const newPoints = { ...prev };
        students.forEach(s => {
          const currentTotal = getStudentTotalPoints(s.id);
          if (currentTotal !== 0) {
            const newRecord = { 
              id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9), 
              date: dateKey, 
              timestamp: new Date().getTime(), 
              type: 'reset', 
              amount: -currentTotal,
              reason: '🔄 점수 초기화' 
            };
            const existingRecords = Array.isArray(newPoints[s.id]) ? newPoints[s.id] : [];
            newPoints[s.id] = [newRecord, ...existingRecords];
          }
        });
        return newPoints;
      });
    }
  };

  const saveExternalLink = (id, title, url) => {
    if (!title || !url) return;
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = 'https://' + formattedUrl; 

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

      const manualTotal = filteredPoints.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
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
          const typeStr = p.type === 'plus' ? '칭찬' : p.type === 'minus' ? '노력' : '초기화';
          const amtStr = p.amount > 0 ? `+${p.amount}` : p.amount;
          csvContent += `${student.num},${escape(student.name)},${date},매직점수,${typeStr},${amtStr},${escape(p.reason)}\n`;
        });
      });
    });

    csvContent += '\n\n=== 완전 학습 (중요 개념 사전) ===\n';
    csvContent += '과목,단어,한자,핵심내용\n';
    const sortedConcepts = [...masteryConcepts].sort((a,b) => {
      const subA = masterySubjects.findIndex(s=>s.id===a.subjectId);
      const subB = masterySubjects.findIndex(s=>s.id===b.subjectId);
      return subA - subB;
    });
    sortedConcepts.forEach(c => {
      const subTitle = masterySubjects.find(s => s.id === c.subjectId)?.title || '';
      csvContent += `${escape(subTitle)},${escape(c.term)},${escape(c.hanja)},${escape(c.meaning)}\n`;
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
      <button onClick={() => {setActiveTab('mastery'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'mastery' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Brain size={24} /> <span className="md:inline">완전 학습</span></button>
      <button onClick={() => {setActiveTab('counseling'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'counseling' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><MessageCircle size={24} /> <span className="md:inline">학생 상담</span></button>
      <button onClick={() => {setActiveTab('magicpoints'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'magicpoints' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><Trophy size={24} /> <span className="md:inline">매직 점수</span></button>
      <button onClick={() => {setActiveTab('externals'); setSelectedStudent(null);}} className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-2xl transition-all whitespace-nowrap text-base md:text-xl font-bold ${activeTab === 'externals' ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}><LinkIcon size={24} /> <span className="md:inline">외부 자료</span></button>
      
      <div className="hidden md:block my-4 border-t-2 border-gray-100"></div>
      <button onClick={downloadCSV} className="hidden md:flex items-center justify-center gap-3 p-4 rounded-2xl transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-black shadow-sm text-lg whitespace-nowrap border border-emerald-200"><Download size={22} /> AI분석 엑셀 다운</button>
    </div>
  );

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-slate-50 text-gray-900 font-sans pb-24 md:pb-0`}>
      <div className="md:hidden flex items-center justify-between p-5 bg-white border-b sticky top-0 z-40 shadow-sm no-print">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl"><Sparkles size={28} /> 매직클래스</div>
        <button onClick={downloadCSV} className="text-emerald-600 px-4 py-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 flex items-center gap-2 text-sm font-black border border-emerald-200"><Download size={18} /> <span className="hidden sm:inline">AI 엑셀</span></button>
      </div>

      <Sidebar />
      
      <main className="flex-1 p-4 md:p-10 overflow-auto relative hide-on-print">
        <div className="hidden md:flex justify-between items-center mb-8 no-print">
          <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            {activeTab === 'students' && (selectedStudent ? '개인 리포트' : '학생 명단 관리')}
            {activeTab === 'attendance' && '출석 관리'}
            {activeTab === 'submissions' && '제출 관리'}
            {activeTab === 'assignments' && '과제 관리'}
            {activeTab === 'status' && '과제 현황 종합'}
            {activeTab === 'mastery' && '완전 학습 (중요 개념 관리)'}
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
                        <button onClick={() => setSelectedDate(curDate)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-md scale-110' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
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
                        {/* [수정] disabled 속성을 완전히 제거하여 결석한 학생의 이모지도 클릭 가능하게 복구 */}
                        <button 
                          onClick={(e) => setMoodPickerTarget({ studentId: student.id, ...calculatePopupPosition(e.currentTarget.getBoundingClientRect(), 260, 160) })} 
                          className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-3xl lg:text-4xl transition-all shadow-sm ${state.present ? 'hover:border-indigo-300 hover:shadow-md cursor-pointer' : 'opacity-30 cursor-pointer'}`}
                        >
                          {state.mood}
                        </button>
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
        {/* 3. 과제 관리 */}
        {/* 4. 과제 현황 (종합) */}
        {/* 4.5 완전 학습 (중요 개념 관리) */}
        {/* 5. 학생 상담 */}
        {/* 6. 매직 점수 */}
        {/* 7. 외부 자료 메뉴 */}
        {/* ... (제출 관리, 과제 관리, 과제 현황, 완전 학습, 학생 상담, 매직 점수, 외부 자료 메뉴 내용은 동일) */}

        {/* --- 공통 팝업 영역 --- */}

        {/* --- 안내장 인쇄 모달 --- */}
        {reportStudent && (() => {
          const sCounseling = [];
          Object.entries(counselingData).forEach(([d, records]) => {
            records.forEach(r => {
              if (r.studentId === reportStudent.student.id) sCounseling.push({ date: d, ...r });
            });
          });
          
          const filteredCounseling = sCounseling.filter(r => {
            const dateTs = new Date(r.date).getTime();
            const now = new Date();
            const startOfToday = getStartOfDay(now).getTime();
            const startOfWeek = getStartOfWeek(now).getTime();
            const startOfMonth = getStartOfMonth(now).getTime();
            const cStart = new Date(customStartDate).getTime();
            const cEnd = new Date(customEndDate).setHours(23, 59, 59, 999);

            if (reportPeriod === 'all') return true;
            if (reportPeriod === 'day') return dateTs >= startOfToday;
            if (reportPeriod === 'week') return dateTs >= startOfWeek;
            if (reportPeriod === 'month') return dateTs >= startOfMonth;
            if (reportPeriod === 'custom') return dateTs >= cStart && dateTs <= cEnd;
            return true;
          });
          filteredCounseling.sort((a,b) => new Date(b.date) - new Date(a.date));

          const getReportPeriodLabel = () => {
            switch(reportPeriod) {
              case 'day': return `일간 (${formatDate(new Date())})`;
              case 'week': return '주간 단위';
              case 'month': return '월간 단위';
              case 'all': return '전체 누적 기간';
              case 'custom': return `${customStartDate} ~ ${customEndDate}`;
              default: return '';
            }
          };

          return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 print-backdrop" onClick={() => setReportStudent(null)}>
              <div 
                className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200 print-modal overflow-hidden" 
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-8 border-b-2 border-gray-100 bg-indigo-50/50 no-print shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-black text-sm">안내장 미리보기</span>
                    <h4 className="text-2xl lg:text-3xl font-black text-gray-800">가정통신문 인쇄</h4>
                  </div>
                  <div className="flex gap-3">
                    {/* 바로 인쇄 버튼을 인쇄 시 숨기기 위해 .no-print 클래스 추가 */}
                    <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-2 no-print">
                      🖨️ 바로 인쇄
                    </button>
                    {/* 닫기 버튼을 인쇄 시 숨기기 위해 .no-print 클래스 추가 */}
                    <button onClick={() => setReportStudent(null)} className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl shadow-sm border border-gray-200 transition-colors no-print"><X size={24} strokeWidth={3}/></button>
                  </div>
                </div>

                <div id="print-section" className="w-full bg-white p-10 lg:p-12 overflow-y-auto text-gray-800 flex-1 hide-scrollbar">
                  <div className="text-center mb-10 border-b-4 border-indigo-600 pb-8">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">{reportStudent.student.name} 학생 학교 생활 안내장</h2>
                    <p className="text-lg font-bold text-gray-500 tracking-tight">학부모님 안녕하십니까? {reportStudent.student.name} 학생의 학교 생활 종합 안내입니다.</p>
                    <div className="mt-4 inline-block bg-indigo-50 text-indigo-700 px-5 py-2 rounded-full font-black text-sm tracking-widest border border-indigo-100">
                      평가 대상 기간 : {getReportPeriodLabel()}
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-indigo-50 print:border-gray-200">
                      <h3 className="text-2xl font-black text-indigo-700 mb-6 flex items-center gap-2 tracking-tight"><BarChart2 size={28}/> 1. 학습 및 생활 태도 요약</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xl font-black text-gray-700">
                        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                          <span>✅ 과제 수행 점수</span> <span className="text-emerald-600 text-2xl">+{reportStudent.reportData.taskPts}점</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                          <span>✨ 칭찬 매직 횟수</span> <span className="text-blue-600 text-2xl">{reportStudent.reportData.plusCount}회</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                          <span>⚡ 노력 매직 횟수</span> <span className="text-red-500 text-2xl">{reportStudent.reportData.minusCount}회</span>
                        </div>
                        <div className="flex justify-between items-center bg-indigo-600 text-white p-5 rounded-2xl shadow-md">
                          <span>🏆 종합 매직 점수</span> <span className="text-3xl">{reportStudent.reportData.total > 0 ? `+${reportStudent.reportData.total}` : reportStudent.reportData.total}점</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-gray-200 print:border-gray-200">
                      {/* [수정] 제목 변경: "2. 주요 상담 및 관찰 기록" -> "2. 학생 상담 내역" */}
                      <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2 tracking-tight"><Users size={28}/> 2. 학생 상담 내역</h3>
                      {filteredCounseling.length > 0 ? (
                        <div className="space-y-5">
                          {filteredCounseling.map(r => (
                            <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">{r.date}</span>
                                <span className={`font-black text-sm px-3 py-1.5 rounded-lg ${r.resolved ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>{r.resolved ? '해결 완료' : '미해결/관찰중'}</span>
                              </div>
                              <p className="font-bold text-gray-800 text-lg leading-relaxed whitespace-pre-wrap"><span className="text-gray-400 mr-2">상담 내용 |</span> {r.content}</p>
                              {r.result && <p className="font-bold text-gray-600 text-base leading-relaxed whitespace-pre-wrap mt-1"><span className="text-gray-400 mr-2">조치 결과 |</span> {r.result}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        // [수정] 상담 기록이 없을 때 표시되는 문구 변경
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 font-bold text-xl leading-relaxed whitespace-pre-wrap">
                          해당 기간 내 기록된 학생 상담 기록이 없습니다. <br/>
                          현재 문제 없이 학교 생활 잘하고 있습니다.
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center pt-10 mt-10 border-t-2 border-dashed border-gray-300 print:block hidden">
                      <p className="text-xl font-black text-gray-800 mb-3">위와 같이 긍정적으로 학교생활에 참여하고 있음을 안내해 드립니다.</p>
                      <p className="text-2xl font-black text-gray-900 mt-10 tracking-widest">담임 교사 ________________ (인)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ... (나머지 모달 컴포넌트 내용은 동일) */}
      </main>
      
      {/* CSS */}
      <style dangerouslySetContent={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          /* 인쇄 시 사이드바, 헤더, 배경 등 불필요한 모든 요소 숨김 */
          body * { 
            visibility: hidden; 
            overflow: visible !important; 
          }
          
          /* 인쇄 모드 활성화 시 body 스크롤 방지 */
          body.print-mode {
            overflow: hidden !important;
          }

          /* 안내장 내용물만 보이게 설정 */
          #print-section, #print-section * { 
            visibility: visible; 
          }
          
          /* 안내장 인쇄 섹션의 위치 및 크기 조정 */
          #print-section { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 210mm; /* A4 너비 */
            height: 297mm; /* A4 높이 */
            margin: 0; 
            padding: 20mm; /* 인쇄 여백 */
            background: white; 
            overflow: visible !important; 
            z-index: -1; 
          }

          /* 안내장 내부의 스크롤바 숨김 */
          #print-section::-webkit-scrollbar {
            display: none;
          }

          /* .no-print 클래스가 있는 요소는 인쇄 시 display: none */
          .no-print { display: none !important; }

          /* 배경 색상 및 이미지 출력 설정 */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          
          /* 모달창 외부의 딤드 배경 및 모달창의 shadow, rounded 제거 */
          .print-backdrop {
            display: none !important;
          }
          .print-modal {
            box-shadow: none !important;
            border: none !important;
            max-width: none !important;
            width: 100% !important;
            max-height: none !important;
            height: 100% !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }

          /* 인쇄 콘텐츠 비율 조정 (A4 꽉 차게) */
          #print-section {
            zoom: 0.7; /* 배율 축소 */
          }
        }
      `}} />
    </div>
  );
};

// ... (나머지 뷰어 및 모달 컴포넌트 정의는 동일)

export default App;
