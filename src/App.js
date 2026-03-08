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
  PlaySquare, // [추가] 슬라이드 아이콘
  ChevronRight // [추가] 뷰어 우측 아이콘
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
  "분류":{hanja:"分類",meaning:"分(나눌 분), 類(무리 류) : 나누어 묶음"},
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
  "요약":{hanja:"要約",meaning:"要(요긴할 요), 約(맺을 약) : 글의 요점을 간추림"},
  "의견":{hanja:"意見",meaning:"意(뜻 의), 見(볼 견) : 어떤 일에 대한 자신의 생각"},
  "근거":{hanja:"根據",meaning:"根(뿌리 근), 據(의지할 거) : 주장의 바탕이 되는 이유"},
  "서론":{hanja:"序論",meaning:"序(차례 서), 論(논할 론) : 글을 시작하는 부분"},
  "본론":{hanja:"本論",meaning:"本(근본 본), 論(논할 론) : 글의 중심 주장이 담긴 부분"},
  "결론":{hanja:"結論",meaning:"結(맺을 결), 論(논할 론) : 글을 마무리하는 부분"},
  "관점":{hanja:"觀點",meaning:"觀(볼 관), 點(점 찍을 점) : 사물이나 현상을 바라보는 태도나 방향"},
  "갈등":{hanja:"葛藤",meaning:"葛(칡 갈), 藤(등나무 등) : 목표나 이해관계가 달라 서로 부딪히는 상태"},
  "배경":{hanja:"背景",meaning:"背(등 배), 景(볕 경) : 사건이 일어나는 시간과 장소"},
  "독서":{hanja:"讀書",meaning:"讀(읽을 독), 書(책 서) : 책을 읽는 것"},
  "작문":{hanja:"作文",meaning:"作(지을 작), 文(글월 문) : 글을 짓는 것"},
  "독해":{hanja:"讀解",meaning:"讀(읽을 독), 解(풀 해) : 글을 읽고 뜻을 이해함"},
  "문학":{hanja:"文學",meaning:"文(글월 문), 學(배울 학) : 문학 작품을 읽고 즐기는 분야"},
  "문법":{hanja:"文法",meaning:"文(글월 문), 法(법 법) : 말과 글의 규칙"},
  "주장":{hanja:"主張",meaning:"主(주인 주), 張(베풀 장) : 자신의 생각을 분명히 내세움"},
  "사실":{hanja:"事實",meaning:"事(일 사), 實(열매 실) : 실제로 있었던 일"},
  "논리":{hanja:"論理",meaning:"論(논할 론), 理(다스릴 리) : 생각이 맞게 이어지는 이치"},
  "비판":{hanja:"批判",meaning:"批(칠 비), 判(판단할 판) : 잘잘못을 따져 판단함"},
  "설명문":{hanja:"說明文",meaning:"說(말씀 설), 明(밝을 명), 文(글월 문) : 어떤 것을 설명하는 글"},
  "논설문":{hanja:"論說文",meaning:"論(논할 론), 說(말씀 설), 文(글월 문) : 주장하고 설명하는 글"},
  "인물":{hanja:"人物",meaning:"人(사람 인), 物(만물 물) : 이야기나 글에 나오는 사람"},

  // [수학]
  "분수":{hanja:"分數",meaning:"分(나눌 분), 數(셈 수) : 전체를 나눈 것 중 일부분을 나타내는 수"},
  "소수":{hanja:"小數",meaning:"小(작을 소), 數(셈 수) : 1보다 작은 크기를 나타내는 수"},
  "도형":{hanja:"圖形",meaning:"圖(그림 도), 形(모양 형) : 점, 선, 면 등으로 이루어진 모양"},
  "직사각형":{hanja:"直四角形",meaning:"直(곧을 직), 四(넉 사), 角(뿔 각), 形(모양 형) : 네 각이 모두 직각인 사각형"},
  "삼각형":{hanja:"三角形",meaning:"三(석 삼), 角(뿔 각), 形(모양 형) : 세 개의 선분으로 둘러싸인 다각형"},
  "부피":{hanja:"體積",meaning:"體(몸 체), 積(쌓을 적) : 물체가 공간에서 차지하는 크기"},
  "넓이":{hanja:"面積",meaning:"面(표면 면), 積(쌓을 적) : 평면이나 겉면이 차지하는 크기"},
  "합동":{hanja:"合同",meaning:"合(합할 합), 同(같을 동) : 모양과 크기가 같아 완전히 포개어지는 관계"},
  "대칭":{hanja:"對稱",meaning:"對(대할 대), 稱(일컬을 칭) : 점이나 선을 중심으로 양쪽이 똑같은 모양"},
  "비례":{hanja:"比例",meaning:"比(견줄 비), 例(법식 례) : 두 수량의 비가 일정한 관계로 변하는 것"},
  "평균":{hanja:"平均",meaning:"平(평평할 평), 均(고를 균) : 여러 수의 합을 그 개수로 나눈 값"},
  "확률":{hanja:"確率",meaning:"確(굳을 확), 率(비율 률) : 어떤 일이 일어날 가능성을 수로 나타낸 것"},
  "자연수":{hanja:"自然數",meaning:"自(스스로 자), 然(그럴 연), 數(셈 수) : 1부터 시작하여 1씩 커지는 수"},
  "정수":{hanja:"整數",meaning:"整(가지런할 정), 數(셈 수) : 양의 정수, 0, 음의 정수를 통틀어 이르는 말"},
  "방정식":{hanja:"方程式",meaning:"方(모 방), 程(한도 정), 式(법 식) : 미지수의 값에 따라 참/거짓이 되는 등식"},
  "비례식":{hanja:"比例式",meaning:"比(견줄 비), 例(법식 례), 式(법 식) : 비율이 같은 두 비를 등호로 나타낸 식"},
  "계산":{hanja:"計算",meaning:"計(셀 계), 算(셈 산) : 수를 셈함"},
  "단위":{hanja:"單位",meaning:"單(홑 단), 位(자리 위) : 측정의 기준이 되는 값"},
  "분자":{hanja:"分子",meaning:"分(나눌 분), 子(아들 자) : 분수의 위에 있는 수"},
  "분모":{hanja:"分母",meaning:"分(나눌 분), 母(어머니 모) : 분수의 아래에 있는 수"},
  "약분":{hanja:"約分",meaning:"約(맺을 약), 分(나눌 분) : 분자와 분모를 같은 수로 나눔"},
  "통분":{hanja:"通分",meaning:"通(통할 통), 分(나눌 분) : 분모를 같게 만듦"},
  "기약분수":{hanja:"既約分數",meaning:"既(이미 기), 約(맺을 약), 分(나눌 분), 數(셈 수) : 더 이상 약분되지 않는 분수"},
  "약수":{hanja:"約數",meaning:"約(맺을 약), 數(셈 수) : 어떤 수를 나누어떨어지게 하는 수"},
  "배수":{hanja:"倍數",meaning:"倍(곱 배), 數(셈 수) : 어떤 수의 몇 배가 되는 수"},
  "공약수":{hanja:"公約數",meaning:"公(공평할 공), 約(맺을 약), 數(셈 수) : 둘 이상의 수에 공통으로 되는 약수"},
  "공배수":{hanja:"公倍數",meaning:"公(공평할 공), 倍(곱 배), 數(셈 수) : 둘 이상의 수에 공통으로 되는 배수"},
  "최대공약수":{hanja:"最大公約數",meaning:"最(가장 최), 大(큰 대), 公(공평할 공), 約(맺을 약), 數(셈 수) : 공약수 중 가장 큰 수"},
  "최소공배수":{hanja:"最小公倍數",meaning:"最(가장 최), 小(작을 소), 公(공평할 공), 倍(곱 배), 數(셈 수) : 공배수 중 가장 작은 수"},
  "소인수":{hanja:"素因數",meaning:"素(본디 소), 因(인할 인), 數(셈 수) : 어떤 수를 나누는 소수인 약수"},
  "소인수분해":{hanja:"素因數分解",meaning:"素(본디 소), 因(인할 인), 數(셈 수), 分(나눌 분), 解(풀 해) : 수를 소인수의 곱으로 나타냄"},
  "사칙연산":{hanja:"四則演算",meaning:"四(넉 사), 則(법칙 칙), 演(펼 연), 算(셈 산) : 더하기, 빼기, 곱하기, 나누기"},
  "연산":{hanja:"演算",meaning:"演(펼 연), 算(셈 산) : 계산을 하는 것"},
  "각도":{hanja:"角度",meaning:"角(뿔 각), 度(법도 도) : 각의 크기"},
  "직각":{hanja:"直角",meaning:"直(곧을 직), 角(뿔 각) : 90도로 이루어진 각"},
  "평행":{hanja:"平行",meaning:"平(평평할 평), 行(다닐 행) : 나란하여 만나지 않는 관계"},
  "수직":{hanja:"垂直",meaning:"垂(드리울 수), 直(곧을 직) : 서로 직각으로 만나는 관계"},
  "원주율":{hanja:"圓周率",meaning:"圓(둥글 원), 周(두루 주), 率(비율 률) : 원주를 지름으로 나눈 값"},
  "직경":{hanja:"直徑",meaning:"直(곧을 직), 徑(지름 경) : 원의 가운데를 지나는 지름"},
  "통계":{hanja:"統計",meaning:"統(거느릴 통), 計(셀 계) : 자료를 모아 분석하는 것"},
  "비율":{hanja:"比率",meaning:"比(견줄 비), 率(비율 률) : 비교한 비의 값"},

  // [사회/역사]
  "민주주의":{hanja:"民主主義",meaning:"民(백성 민), 主(주인 주), 主(주인 주), 義(옳을 의) : 국민이 국가의 주인인 제도"},
  "헌법":{hanja:"憲法",meaning:"憲(법 헌), 法(법 법) : 국가의 통치 조직과 기본 원리를 정한 최고의 법"},
  "국회":{hanja:"國會",meaning:"國(나라 국), 會(모일 회) : 국민의 대표들이 모여 법을 만드는 기관"},
  "정부":{hanja:"政府",meaning:"政(정사 정), 府(관청 부) : 국가의 행정을 맡아보는 기관"},
  "법원":{hanja:"法院",meaning:"法(법 법), 院(집 원) : 법에 따라 재판을 하는 기관"},
  "인권":{hanja:"人權",meaning:"人(사람 인), 權(권리 권) : 인간이 마땅히 누려야 할 권리"},
  "경제":{hanja:"經濟",meaning:"經(다스릴 경), 濟(구제할 제) : 생활에 필요한 재화를 생산, 분배, 소비하는 활동"},
  "생산":{hanja:"生産",meaning:"生(날 생), 産(낳을 산) : 사람이 생활하는 데 필요한 물건을 만드는 일"},
  "소비":{hanja:"消費",meaning:"消(사라질 소), 費(쓸 비) : 욕구를 채우기 위해 돈이나 물건을 쓰는 일"},
  "지형":{hanja:"地形",meaning:"地(땅 지), 形(모양 형) : 산, 강, 평야 등 땅의 겉면의 모양"},
  "기후":{hanja:"氣候",meaning:"氣(기운 기), 候(기후 후) : 일정한 지역에서 오랜 기간 걸쳐 나타나는 날씨의 평균 상태"},
  "인구":{hanja:"人口",meaning:"人(사람 인), 口(입 구) : 일정한 지역 안에 사는 사람의 총수"},
  "도시":{hanja:"都市",meaning:"都(도읍 도), 市(저자 시) : 인구가 밀집되어 있고 정치/경제/문화의 중심이 되는 곳"},
  "촌락":{hanja:"村落",meaning:"村(마을 촌), 落(마을 락) : 농업, 어업 등에 종사하는 사람들이 모여 사는 곳"},
  "역사":{hanja:"歷史",meaning:"歷(지낼 력), 史(역사 사) : 인류 사회의 변천과 흥망의 과정, 또는 그 기록"},
  "독립":{hanja:"獨立",meaning:"獨(홀로 독), 立(설 립) : 다른 것에 예속되거나 의존하지 않는 상태"},
  "통일":{hanja:"統一",meaning:"統(거느릴 통), 一(한 일) : 나누어진 것들을 합쳐서 하나가 되게 함"},
  "평등":{hanja:"平等",meaning:"平(평평할 평), 等(무리 등) : 권리, 의무, 자격 등이 차별 없이 고르고 한결같음"},
  "자유":{hanja:"自由",meaning:"自(스스로 자), 由(말미암을 유) : 외부적인 구속이나 무엇에 얽매이지 않고 자기 마음대로 할 수 있는 상태"},
  "권리":{hanja:"權利",meaning:"權(권리 권), 利(이로울 리) : 어떤 일을 하거나 타인에게 요구할 수 있는 정당한 힘"},
  "의무":{hanja:"義務",meaning:"義(옳을 의), 務(힘쓸 무) : 마땅히 해야 할 일"},
  "무역":{hanja:"貿易",meaning:"貿(바꿀 무), 易(바꿀 역) : 나라와 나라 사이에 서로 물건을 사고파는 일"},
  "수출":{hanja:"輸出",meaning:"輸(보낼 수), 出(날 출) : 국내의 상품이나 기술을 외국으로 팔아 내보냄"},
  "수입":{hanja:"輸入",meaning:"輸(보낼 수), 入(들 입) : 외국의 상품이나 기술을 국내로 사들임"},
  "국가":{hanja:"國家",meaning:"國(나라 국), 家(집 가) : 사람들이 함께 살아가는 나라"},
  "국민":{hanja:"國民",meaning:"國(나라 국), 民(백성 민) : 한 나라에 사는 사람들"},
  "주권":{hanja:"主權",meaning:"主(주인 주), 權(권리 권) : 나라의 주인으로서 가지는 권리"},
  "정치":{hanja:"政治",meaning:"政(정사 정), 治(다스릴 치) : 나라를 다스리는 일"},
  "선거":{hanja:"選擧",meaning:"選(가릴 선), 擧(들 거) : 대표를 뽑는 일"},
  "투표":{hanja:"投票",meaning:"投(던질 투), 票(표 표) : 후보에게 표를 던져 선택함"},
  "삼권분립":{hanja:"三權分立",meaning:"三(셋 삼), 權(권리 권), 分(나눌 분), 立(설 립) : 나라 권력을 나누는 원리"},
  "입법":{hanja:"立法",meaning:"立(설 립), 法(법 법) : 법을 만드는 일"},
  "행정":{hanja:"行政",meaning:"行(다닐 행), 政(정사 정) : 나라 일을 실행하는 일"},
  "사법":{hanja:"司法",meaning:"司(맡을 사), 法(법 법) : 재판으로 법을 적용하는 일"},
  "지방자치":{hanja:"地方自治",meaning:"地(땅 지), 方(모 방), 自(스스로 자), 治(다스릴 치) : 지역이 스스로 다스림"},
  "법률":{hanja:"法律",meaning:"法(법 법), 律(법칙 률) : 나라에서 정한 법"},
  "재판":{hanja:"裁判",meaning:"裁(마를 재), 判(판단할 판) : 법에 따라 옳고 그름을 판단함"},
  "국토":{hanja:"國土",meaning:"國(나라 국), 土(흙 토) : 나라의 땅"},
  "지도":{hanja:"地圖",meaning:"地(땅 지), 圖(그림 도) : 땅의 모습을 그린 그림"},
  "문화재":{hanja:"文化財",meaning:"文(글월 문), 化(될 화), 財(재물 재) : 지키고 남겨야 할 문화유산"},
  "전통":{hanja:"傳統",meaning:"傳(전할 전), 統(거느릴 통) : 오래 전해 오는 것"},
  "화폐":{hanja:"貨幣",meaning:"貨(재화 화), 幣(비단 폐) : 돈"},
  "세금":{hanja:"稅金",meaning:"稅(세금 세), 金(쇠 금) : 나라나 공공기관에 내는 돈"},

  // [과학]
  "생태계":{hanja:"生態系",meaning:"生(날 생), 態(모양 태), 系(이을 계) : 생물과 이를 둘러싼 환경이 서로 영향을 주고받는 하나의 체계"},
  "광합성":{hanja:"光合成",meaning:"光(빛 광), 合(합할 합), 成(이룰 성) : 녹색 식물이 빛 에너지를 이용하여 양분을 만드는 과정"},
  "지구":{hanja:"地球",meaning:"地(땅 지), 球(공 구) : 우리가 살고 있는 천체"},
  "우주":{hanja:"宇宙",meaning:"宇(집 우), 宙(집 주) : 무한한 시간과 만물을 포함하고 있는 끝없는 공간"},
  "자전":{hanja:"自轉",meaning:"自(스스로 자), 轉(구를 전) : 천체가 스스로 고정된 축을 중심으로 회전하는 현상"},
  "공전":{hanja:"公轉",meaning:"公(공평할 공), 轉(구를 전) : 한 천체가 다른 천체의 둘레를 주기적으로 도는 현상"},
  "기온":{hanja:"氣溫",meaning:"氣(기운 기), 溫(따뜻할 온) : 대기의 온도"},
  "습도":{hanja:"濕度",meaning:"濕(축축할 습), 度(법도 도) : 공기 중에 수증기가 포함되어 있는 정도"},
  "지진":{hanja:"地震",meaning:"地(땅 지), 震(우레 진) : 지구 내부의 에너지가 밖으로 나와 땅이 갈라지며 흔들리는 현상"},
  "화산":{hanja:"火山",meaning:"火(불 화), 山(뫼 산) : 지하 깊은 곳의 마그마가 지표 밖으로 분출하여 만들어진 산"},
  "퇴적암":{hanja:"堆積岩",meaning:"堆(쌓을 퇴), 積(쌓을 적), 岩(바위 암) : 퇴적물이 굳어져서 만들어진 암석"},
  "화성암":{hanja:"火成岩",meaning:"火(불 화), 成(이룰 성), 岩(바위 암) : 마그마가 식어서 굳어진 암석"},
  "세포":{hanja:"細胞",meaning:"細(가늘 세), 胞(세포 포) : 생물체를 이루는 기본 단위"},
  "유전":{hanja:"遺傳",meaning:"遺(남길 유), 傳(전할 전) : 부모의 성질이 자손에게 전해지는 현상"},
  "물질":{hanja:"物質",meaning:"物(만물 물), 質(바탕 질) : 물체를 이루는 것"},
  "상태":{hanja:"狀態",meaning:"狀(형상 상), 態(모양 태) : 물질의 모습이나 형편"},
  "고체":{hanja:"固體",meaning:"固(굳을 고), 體(몸 체) : 모양이 일정한 상태의 물질"},
  "액체":{hanja:"液體",meaning:"液(진 액), 體(몸 체) : 흐르는 상태의 물질"},
  "기체":{hanja:"氣體",meaning:"氣(기운 기), 體(몸 체) : 공기처럼 퍼지는 상태의 물질"},
  "온도":{hanja:"溫度",meaning:"溫(따뜻할 온), 度(법도 도) : 뜨겁고 차가운 정도"},
  "압력":{hanja:"壓力",meaning:"壓(누를 압), 力(힘 력) : 누르는 힘"},
  "용액":{hanja:"溶液",meaning:"溶(녹을 용), 液(진 액) : 어떤 물질이 녹아 있는 액체"},
  "혼합":{hanja:"混合",meaning:"混(섞일 혼), 合(합할 합) : 여러 물질을 섞음"},
  "분리":{hanja:"分離",meaning:"分(나눌 분), 離(떼어낼 이) : 섞인 것을 따로 나눔"},
  "증발":{hanja:"蒸發",meaning:"蒸(찔 증), 發(필 발) : 액체가 기체로 변함"},
  "응결":{hanja:"凝結",meaning:"凝(엉길 응), 結(맺을 결) : 기체가 액체로 변함"},
  "순환":{hanja:"循環",meaning:"循(돌 순), 環(둘러쌀 환) : 돌아가며 반복됨"},
  "전기":{hanja:"電氣",meaning:"電(번개 전), 氣(기운 기) : 전기의 힘"},
  "전류":{hanja:"電流",meaning:"電(번개 전), 流(흐를 류) : 전기가 흐름"},
  "자석":{hanja:"磁石",meaning:"磁(자석 자), 石(돌 석) : 쇠를 끌어당기는 성질을 가진 돌"},
  "마찰":{hanja:"摩擦",meaning:"摩(갈 마), 擦(문지를 찰) : 서로 비빌 때 생기는 힘"},
  "속도":{hanja:"速度",meaning:"速(빠를 속), 度(법도 도) : 움직이는 빠르기"},
  "태양":{hanja:"太陽",meaning:"太(클 태), 陽(볕 양) : 지구에 빛을 주는 별"},
  "대기":{hanja:"大氣",meaning:"大(큰 대), 氣(기운 기) : 지구를 둘러싼 공기"},
  "암석":{hanja:"岩石",meaning:"岩(바위 암), 石(돌 석) : 지구를 이루는 돌"},
  "침식":{hanja:"侵蝕",meaning:"侵(침노할 침), 蝕(갉아먹을 식) : 물과 바람이 땅을 깎아냄"},
  "풍화":{hanja:"風化",meaning:"風(바람 풍), 化(될 화) : 바람, 비 등으로 바위가 부서짐"},

  // [도덕]
  "도덕":{hanja:"道德",meaning:"道(길 도), 德(덕 덕) : 사람으로서 지켜야 할 바른 마음과 행동"},
  "윤리":{hanja:"倫理",meaning:"倫(인륜 륜), 理(다스릴 리) : 옳고 그름의 기준"},
  "예절":{hanja:"禮節",meaning:"禮(예도 예), 節(마디 절) : 바른 몸가짐과 태도"},
  "정직":{hanja:"正直",meaning:"正(바를 정), 直(곧을 직) : 거짓이 없이 바름"},
  "성실":{hanja:"誠實",meaning:"誠(참 성), 實(열매 실) : 참되고 정성스럽게 행동함"},
  "책임":{hanja:"責任",meaning:"責(꾸짖을 책), 任(맡길 임) : 맡은 일을 해야 할 의무"},
  "자율":{hanja:"自律",meaning:"自(스스로 자), 律(법칙 률) : 스스로 규칙을 지킴"},
  "절제":{hanja:"節制",meaning:"節(마디 절), 制(억제할 제) : 지나치지 않게 조절함"},
  "반성":{hanja:"反省",meaning:"反(돌이킬 반), 省(살필 성) : 자신의 행동을 돌아봄"},
  "협동":{hanja:"協同",meaning:"協(도울 협), 同(같을 동) : 힘을 합쳐 함께함"},
  "양보":{hanja:"讓步",meaning:"讓(양보할 양), 步(걸음 보) : 남에게 먼저 내어 줌"},
  "용서":{hanja:"容恕",meaning:"容(용납할 용), 恕(용서할 서) : 잘못을 이해하고 넘어감"},
  "감사":{hanja:"感謝",meaning:"感(느낄 감), 謝(사례할 사) : 고마움을 느낌"},
  "봉사":{hanja:"奉仕",meaning:"奉(받들 봉), 仕(벼슬 사) : 남을 위해 힘써 일함"},
  "효도":{hanja:"孝道",meaning:"孝(효도 효), 道(길 도) : 부모님을 공경하는 마음과 행동"},

  // [미술]
  "미술":{hanja:"美術",meaning:"美(아름다울 미), 術(재주 술) : 아름다움을 표현하는 활동"},
  "조형":{hanja:"造形",meaning:"造(지을 조), 形(모양 형) : 모양을 만들어 표현함"},
  "색채":{hanja:"色彩",meaning:"色(색 색), 彩(채색 채) : 색의 느낌과 쓰임"},
  "구도":{hanja:"構圖",meaning:"構(얽을 구), 圖(그림 도) : 그림의 화면 구성"},
  "명암":{hanja:"明暗",meaning:"明(밝을 명), 暗(어두울 암) : 밝고 어두움의 대비"},
  "질감":{hanja:"質感",meaning:"質(바탕 질), 感(느낄 감) : 만졌을 때 느껴지는 느낌"},
  "형태":{hanja:"形態",meaning:"形(모양 형), 態(모양 태) : 물체의 모양"},
  "대비":{hanja:"對比",meaning:"對(대할 대), 比(견줄 비) : 차이를 두어 돋보이게 함"},
  "조화":{hanja:"調和",meaning:"調(고를 조), 和(화할 화) : 잘 어울림"},
  "재료":{hanja:"材料",meaning:"材(재목 재), 料(헤아릴 료) : 만드는 데 쓰는 것"},
  "기법":{hanja:"技法",meaning:"技(재주 기), 法(법 법) : 표현하는 방법"},
  "서예":{hanja:"書藝",meaning:"書(글 서), 藝(재주 예) : 붓글씨 예술"},

  // [음악]
  "음악":{hanja:"音樂",meaning:"音(소리 음), 樂(즐길 악) : 소리로 즐기는 예술"},
  "연주":{hanja:"演奏",meaning:"演(펼 연), 奏(아뢸 주) : 악기를 연주함"},
  "감상":{hanja:"鑑賞",meaning:"鑑(거울 감), 賞(상 줄 상) : 보고 듣고 느낌을 나눔"},
  "창작":{hanja:"創作",meaning:"創(비롯할 창), 作(지을 작) : 새로 만듦"},
  "악기":{hanja:"樂器",meaning:"樂(즐길 악), 器(그릇 기) : 음악 소리를 내는 도구"},
  "악보":{hanja:"樂譜",meaning:"樂(즐길 악), 譜(보 보) : 음악을 적어 놓은 것"},
  "선율":{hanja:"旋律",meaning:"旋(돌 선), 律(법칙 률) : 가락의 흐름"},
  "박자":{hanja:"拍子",meaning:"拍(칠 박), 子(아들 자) : 음악의 규칙적인 리듬"},
  "화음":{hanja:"和音",meaning:"和(화할 화), 音(소리 음) : 여러 소리가 어울림"},
  "합창":{hanja:"合唱",meaning:"合(합할 합), 唱(노래 부를 창) : 함께 노래 부름"},
  "합주":{hanja:"合奏",meaning:"合(합할 합), 奏(아뢸 주) : 함께 연주함"},
  "작곡":{hanja:"作曲",meaning:"作(지을 작), 曲(굽을 곡) : 음악을 만듦"},

  // [체육]
  "체육":{hanja:"體育",meaning:"體(몸 체), 育(기를 육) : 몸을 건강하게 기르는 활동"},
  "운동":{hanja:"運動",meaning:"運(옮길 운), 動(움직일 동) : 몸을 움직여 활동함"},
  "체력":{hanja:"體力",meaning:"體(몸 체), 力(힘 력) : 몸의 힘과 지구력"},
  "근력":{hanja:"筋力",meaning:"筋(힘줄 근), 力(힘 력) : 근육의 힘"},
  "지구력":{hanja:"持久力",meaning:"持(가질 지), 久(오래 구), 力(힘 력) : 오래 버티는 힘"},
  "유연성":{hanja:"柔軟性",meaning:"柔(부드러울 유), 軟(부드러울 연), 性(성품 성) : 몸이 잘 구부러지는 성질"},
  "순발력":{hanja:"瞬發力",meaning:"瞬(눈 깜짝할 순), 發(필 발), 力(힘 력) : 순간적으로 힘을 내는 능력"},
  "준비운동":{hanja:"準備運動",meaning:"準(준비할 준), 備(갖출 비), 運(옮길 운), 動(움직일 동) : 운동 전 몸 풀기"},
  "정리운동":{hanja:"整理運動",meaning:"整(가지런할 정), 理(다스릴 리), 運(옮길 운), 動(움직일 동) : 운동 후 몸을 풀어 마무리"},
  "응급처치":{hanja:"應急處置",meaning:"應(응할 응), 急(급할 급), 處(처할 처), 置(둘 치) : 응급 상황에서 하는 도움"},

  // [실과(기술·가정)/정보]
  "실과":{hanja:"實科",meaning:"實(열매 실), 科(과목 과) : 생활에 필요한 것을 배우는 교과"},
  "가정":{hanja:"家庭",meaning:"家(집 가), 庭(뜰 정) : 가족이 함께 생활하는 집"},
  "의식주":{hanja:"衣食住",meaning:"衣(옷 의), 食(먹을 식), 住(살 주) : 옷, 먹을 것, 집"},
  "식생활":{hanja:"食生活",meaning:"食(먹을 식), 生(날 생), 活(살 활) : 먹는 생활"},
  "의생활":{hanja:"衣生活",meaning:"衣(옷 의), 生(날 생), 活(살 활) : 옷을 입는 생활"},
  "주생활":{hanja:"住生活",meaning:"住(살 주), 生(날 생), 活(살 활) : 집에서 생활하는 모습"},
  "위생":{hanja:"衛生",meaning:"衛(지킬 위), 生(날 생) : 건강을 지키는 깨끗한 습관"},
  "절약":{hanja:"節約",meaning:"節(마디 절), 約(맺을 약) : 아껴 씀"},
  "재활용":{hanja:"再活用",meaning:"再(다시 재), 活(살 활), 用(쓸 용) : 다시 사용함"},
  "기술":{hanja:"技術",meaning:"技(재주 기), 術(재주 술) : 일을 할 수 있는 방법과 능력"},
  "진로":{hanja:"進路",meaning:"進(나아갈 진), 路(길 로) : 앞으로 나아갈 길"},
  "직업":{hanja:"職業",meaning:"職(직업 직), 業(일 업) : 일을 하며 생활하는 일"},

  // [영어]
  "영어":{hanja:"英語",meaning:"英(꽃부리 영), 語(말씀 어) : 영어(English)"},
  "발음":{hanja:"發音",meaning:"發(필 발), 音(소리 음) : 소리를 내는 방법"},
  "강세":{hanja:"强勢",meaning:"强(강할 강), 勢(기세 세) : 소리를 강하게 주는 부분"},
  "철자":{hanja:"綴字",meaning:"綴(꿰맬 철), 字(글자 자) : 단어를 이루는 글자"},
  "회화":{hanja:"會話",meaning:"會(모일 회), 話(말씀 화) : 말로 대화함"},
  "의사소통":{hanja:"意思疏通",meaning:"意(뜻 의), 思(생각 사), 疏(트일 소), 通(통할 통) : 뜻과 생각을 서로 나눔"}
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
  const [showConceptModal, setShowConceptModal] = useState(null); 
  
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedMasterySubjects, setExpandedMasterySubjects] = useState({}); 

  // [추가] 완전학습 모달창들 상태
  const [viewerTarget, setViewerTarget] = useState(null); // { subjectId, conceptId }
  const [slideSubjectId, setSlideSubjectId] = useState(null);

  const [selectedStudentsForMagic, setSelectedStudentsForMagic] = useState([]); 
  const [magicPointValue, setMagicPointValue] = useState(1); 
  const [magicSortOrder, setMagicSortOrder] = useState('num'); 
  const [reportPeriod, setReportPeriod] = useState('all'); 
  const [customStartDate, setCustomStartDate] = useState(formatDate(new Date()));
  const [customEndDate, setCustomEndDate] = useState(formatDate(new Date()));
  const [reportSortOrder, setReportSortOrder] = useState('desc');

  const [selectedExternalLink, setSelectedExternalLink] = useState(null);

  const dateKey = formatDate(selectedDate);

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
    const manualPoints = (magicPoints[studentId] || []).reduce((acc, p) => acc + p.amount, 0);
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
      setMasteryConcepts(masteryConcepts.filter(c => c.subjectId !== id)); 
    }
  };

  const moveSubject = (index, direction, e) => {
    e.stopPropagation();
    setSubjects(prev => {
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

  // [핵심] CSV 엑셀 연동 - 완전학습 데이터 포함
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

    // 완전학습 데이터 첨부 (엑셀 맨 하단)
    csvContent += '\n\n=== 완전 학습 (중요 개념 사전) ===\n';
    csvContent += '과목,단어,한자,핵심내용\n';
    const sortedConcepts = [...masteryConcepts].sort((a,b) => {
      const subA = subjects.findIndex(s=>s.id===a.subjectId);
      const subB = subjects.findIndex(s=>s.id===b.subjectId);
      return subA - subB;
    });
    sortedConcepts.forEach(c => {
      const subTitle = subjects.find(s => s.id === c.subjectId)?.title || '';
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
              {subjects.map((sub, idx) => {
                const subAssignments = assignments.filter(a => a.subjectId === sub.id);
                const isExpanded = expandedSubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedSubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-4 lg:gap-6 pr-24 w-full">
                          <BookOpen className="text-indigo-500 shrink-0" size={28} />
                          <span className="font-black text-xl lg:text-3xl text-gray-800 truncate">{sub.title}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="text-gray-400" size={28} /> : <ChevronDown className="text-gray-400" size={28} />}
                      </button>
                      <div className="absolute right-16 lg:right-24 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-gradient-to-l from-white pl-6 transition-opacity">
                        <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm mr-2 overflow-hidden">
                          <button onClick={(e) => moveSubject(idx, 'up', e)} disabled={idx===0} className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 border-b border-gray-100"><ArrowUp size={14} strokeWidth={3}/></button>
                          <button onClick={(e) => moveSubject(idx, 'down', e)} disabled={idx===subjects.length-1} className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"><ArrowDown size={14} strokeWidth={3}/></button>
                        </div>
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
                                <div className="flex items-center gap-3 lg:gap-4 flex-wrap"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="font-black text-lg lg:text-2xl text-gray-800">{a.title}</span><span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200">{a.dueDate}</span></div>
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
                <h3 className="text-3xl lg:text-4xl font-black text-indigo-700 flex items-center gap-3">
                  수업 중 다룬 중요한 단어나 문장을 기록하세요.
                </h3>
                <p className="text-base font-bold text-gray-500 mt-2">등록된 개념은 뷰어와 슬라이드 모드를 통해 반복 학습할 수 있습니다.</p>
              </div>
              <div className="flex gap-3 w-full xl:w-auto shrink-0">
                <button onClick={() => setShowSubjectModal({id: null, title: ''})} className="flex-1 xl:flex-none bg-white text-gray-700 border-2 border-gray-200 px-6 py-3.5 rounded-2xl font-black shadow-sm hover:bg-gray-50 text-base lg:text-lg transition-colors">과목 추가</button>
                <button onClick={() => {if(subjects.length===0)return alert('먼저 과목을 추가해주세요.'); setShowConceptModal({id: null, subjectId: subjects[0].id, term: '', hanja: '', meaning: ''});}} className="flex-1 xl:flex-none bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 text-base lg:text-lg transition-transform active:scale-95">중요 개념 등록</button>
              </div>
            </div>
            
            <div className="space-y-6">
              {subjects.length === 0 && <div className="text-center py-16 text-gray-400 font-bold text-lg bg-white rounded-[40px] border border-gray-100">등록된 과목이 없습니다.</div>}
              {subjects.map((sub, idx) => {
                const subConcepts = masteryConcepts.filter(c => c.subjectId === sub.id);
                const isExpanded = expandedMasterySubjects[sub.id];
                return (
                  <div key={sub.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center group relative">
                      <button onClick={() => setExpandedMasterySubjects(p => ({ ...p, [sub.id]: !p[sub.id] }))} className="flex-1 px-6 lg:px-10 py-6 lg:py-8 flex justify-between items-center hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center gap-4 lg:gap-6 pr-32 w-full">
                          <Brain className="text-indigo-500 shrink-0" size={28} />
                          <span className="font-black text-xl lg:text-3xl text-gray-800 truncate">{sub.title}</span>
                          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg ml-2 shrink-0">{subConcepts.length}개 개념</span>
                        </div>
                        {isExpanded ? <ChevronUp className="text-gray-400" size={28} /> : <ChevronDown className="text-gray-400" size={28} />}
                      </button>
                      <div className="absolute right-16 lg:right-24 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-gradient-to-l from-white pl-6 transition-opacity items-center">
                        {/* [추가] 슬라이드 플레이 버튼 */}
                        <button onClick={(e) => { e.stopPropagation(); setSlideSubjectId(sub.id); }} className="p-3 text-emerald-500 hover:text-white bg-emerald-50 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 mr-2">
                          <PlaySquare size={20} strokeWidth={3}/>
                          <span className="font-black text-sm hidden lg:inline">슬라이드</span>
                        </button>
                        <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm mr-2 overflow-hidden">
                          <button onClick={(e) => moveSubject(idx, 'up', e)} disabled={idx===0} className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 border-b border-gray-100"><ArrowUp size={14} strokeWidth={3}/></button>
                          <button onClick={(e) => moveSubject(idx, 'down', e)} disabled={idx===subjects.length-1} className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30"><ArrowDown size={14} strokeWidth={3}/></button>
                        </div>
                        <button onClick={() => setShowSubjectModal({id: sub.id, title: sub.title})} className="p-3 text-gray-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-100 rounded-xl transition-colors"><Edit2 size={20}/></button>
                        <button onClick={(e) => deleteSubject(sub.id, e)} className="p-3 text-gray-400 hover:text-red-500 bg-slate-100 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={20}/></button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-6 lg:px-10 pb-6 lg:pb-8 space-y-4">
                        {subConcepts.length === 0 ? <p className="text-gray-400 text-base py-4 font-bold text-center bg-slate-50 rounded-2xl">등록된 개념이 없습니다.</p> : 
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {subConcepts.map((c, cIndex) => (
                              <div key={c.id} onClick={() => setViewerTarget({subjectId: sub.id, conceptId: c.id})} className="cursor-pointer bg-slate-50 p-6 rounded-3xl border-2 border-indigo-50 flex flex-col justify-between items-start gap-4 hover:border-indigo-300 hover:shadow-md transition-all relative group">
                                <div className="w-full">
                                  <div className="flex items-end gap-3 mb-3 flex-wrap pr-16">
                                    <h5 className="font-black text-2xl lg:text-3xl text-gray-800">{c.term}</h5>
                                    {c.hanja && <span className="text-lg lg:text-xl font-black text-gray-400 bg-white border border-gray-200 px-3 py-0.5 rounded-xl shadow-sm tracking-widest">{c.hanja}</span>}
                                  </div>
                                  <p className="text-gray-600 font-bold text-base lg:text-lg leading-relaxed whitespace-pre-wrap line-clamp-3">{c.meaning}</p>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); setShowConceptModal(c); }} className="p-2.5 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-gray-100"><Edit2 size={18}/></button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteConcept(c.id); }} className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100"><Trash2 size={18}/></button>
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
                        <button onClick={() => setSelectedDate(curDate)} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${selectedDate.getDate() === d ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}>{d}</button>
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

        {/* 6. 매직 점수 */}
        {activeTab === 'magicpoints' && (
          <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
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

        {/* [추가] 완전 학습 뷰어 모달 (대형 화면) */}
        {viewerTarget && (
          <ConceptViewerModal
            subjectId={viewerTarget.subjectId}
            initialConceptId={viewerTarget.conceptId}
            concepts={masteryConcepts}
            onClose={() => setViewerTarget(null)}
          />
        )}

        {/* [추가] 완전 학습 슬라이드 모달 (전체 화면 4단계) */}
        {slideSubjectId && (
          <ConceptSlideModal
            subjectId={slideSubjectId}
            concepts={masteryConcepts}
            subjects={subjects}
            onClose={() => setSlideSubjectId(null)}
          />
        )}

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

// --- 독립된 뷰어 및 모달 컴포넌트들 ---

// [추가] 대형 뷰어 모달 (좌우 넘기기)
const ConceptViewerModal = ({ subjectId, initialConceptId, concepts, onClose }) => {
  const subjectConcepts = concepts.filter(c => c.subjectId === subjectId);
  const [currentIndex, setCurrentIndex] = useState(() => Math.max(0, subjectConcepts.findIndex(c => c.id === initialConceptId)));

  if(subjectConcepts.length === 0) return null;
  const c = subjectConcepts[currentIndex];

  const goPrev = (e) => { e.stopPropagation(); if(currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const goNext = (e) => { e.stopPropagation(); if(currentIndex < subjectConcepts.length - 1) setCurrentIndex(currentIndex + 1); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10" onClick={onClose}>
      <div className="bg-white rounded-[40px] w-full max-w-5xl h-full max-h-[80vh] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors z-10"><X size={32} strokeWidth={3}/></button>

        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative overflow-y-auto">
          {currentIndex > 0 && <button onClick={goPrev} className="absolute left-4 lg:left-10 p-5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-full transition-all hover:scale-110 active:scale-95"><ChevronLeft size={48} strokeWidth={3}/></button>}
          {currentIndex < subjectConcepts.length - 1 && <button onClick={goNext} className="absolute right-4 lg:right-10 p-5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-full transition-all hover:scale-110 active:scale-95"><ChevronRight size={48} strokeWidth={3}/></button>}

          <h2 className="text-5xl md:text-8xl font-black text-gray-900 mb-6 tracking-tight break-keep-all">{c.term}</h2>
          {c.hanja && <h3 className="text-4xl md:text-6xl font-black text-indigo-600 mb-10 tracking-widest bg-indigo-50 px-8 py-3 rounded-3xl">{c.hanja}</h3>}
          <p className="text-2xl md:text-4xl font-bold text-gray-600 leading-relaxed max-w-3xl whitespace-pre-wrap break-keep-all px-16">{c.meaning}</p>
        </div>
        <div className="text-center pb-8 font-black text-gray-300 text-2xl tracking-widest">{currentIndex + 1} / {subjectConcepts.length}</div>
      </div>
    </div>
  );
};

// [추가] 4단계 슬라이드 모달
const ConceptSlideModal = ({ subjectId, concepts, subjects, onClose }) => {
  const subjectConcepts = concepts.filter(c => c.subjectId === subjectId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const subjectTitle = subjects.find(s=>s.id===subjectId)?.title || '';

  const parseMeaning = (meaningStr) => {
    if (!meaningStr) return { hanjaBreakdown: '', explanation: '' };
    if (meaningStr.includes(' : ')) {
      const parts = meaningStr.split(' : ');
      return { hanjaBreakdown: parts[0], explanation: meaningStr };
    } else if (meaningStr.includes(':')) {
      const parts = meaningStr.split(':');
      return { hanjaBreakdown: parts[0], explanation: meaningStr };
    }
    return { hanjaBreakdown: meaningStr, explanation: meaningStr };
  };

  const advance = (e) => {
    if (e) e.stopPropagation();
    if (step < 4) setStep(step + 1);
    else {
      if (currentIndex < subjectConcepts.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setStep(1);
      } else {
        onClose(); 
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentIndex, subjectConcepts]);

  if (subjectConcepts.length === 0) {
    return (
      <div className="fixed inset-0 z-[300] bg-gray-900 flex items-center justify-center p-10 cursor-pointer" onClick={onClose}>
        <div className="text-white text-3xl font-black">등록된 개념이 없습니다. 클릭하여 닫기</div>
      </div>
    );
  }

  const c = subjectConcepts[currentIndex];
  const parsed = parseMeaning(c.meaning);

  let content = '';
  let subtitle = '';

  if (step === 1) {
    content = c.hanja || c.term;
    subtitle = c.hanja ? "한자" : "단어";
  } else if (step === 2) {
    content = parsed.hanjaBreakdown || c.meaning;
    subtitle = "뜻풀이";
  } else if (step === 3) {
    content = parsed.explanation || c.meaning;
    subtitle = "핵심 의미";
  } else if (step === 4) {
    content = c.term;
    subtitle = "정답 확인";
  }

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-indigo-950 text-white p-4 cursor-pointer select-none animate-in fade-in duration-300" onClick={advance}>
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors z-10"><X size={32} strokeWidth={3}/></button>
      <div className="absolute top-10 left-10 text-2xl font-black text-white/40">{subjectTitle} - 복습 슬라이드 (클릭하여 다음장)</div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl text-center px-10 relative">
        <span className="text-3xl md:text-4xl font-black text-indigo-300 mb-8 tracking-widest">{subtitle}</span>
        <h2 className={`font-black tracking-tight leading-tight ${content.length > 30 ? 'text-5xl md:text-7xl' : 'text-7xl md:text-[140px]'} break-keep-all whitespace-pre-wrap drop-shadow-xl`}>
          {content}
        </h2>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3">
        {subjectConcepts.map((_, idx) => (
          <div key={idx} className={`h-4 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-16 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'w-4 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}

const ConceptEditModal = ({ data, subjects, onClose, onSave }) => {
  const [subjectId, setSubjectId] = useState(data.subjectId || (subjects.length > 0 ? subjects[0].id : ''));
  const [term, setTerm] = useState(data.term || '');
  const [hanja, setHanja] = useState(data.hanja || '');
  const [meaning, setMeaning] = useState(data.meaning || '');

  // [핵심 기능] 한자 사전 자동 완성
  const handleAutoComplete = () => {
    if(!term) return alert('단어를 먼저 입력해주세요.');
    const found = HANJA_DICT[term];
    if (found) {
      setHanja(found.hanja);
      setMeaning(prev => {
        const prefix = found.meaning;
        return prev ? `${prefix}\n\n[추가내용]\n${prev}` : prefix;
      });
      playSound('magic'); // 띠링! 소리 추가
    } else {
      alert('내장 사전에 없는 단어입니다. 직접 한자와 뜻을 입력해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-2xl md:text-3xl font-black text-gray-800">{data.id ? '개념 수정' : '중요 개념 등록'}</h4>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X size={24} strokeWidth={3}/></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">과목 선택</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none font-black text-lg appearance-none text-gray-700 transition-colors cursor-pointer">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">단어 / 문장</label>
            <div className="flex gap-3">
              <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder="예: 민주주의" className="flex-1 w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-lg md:text-xl" />
              <button onClick={handleAutoComplete} className="bg-indigo-50 text-indigo-700 px-6 rounded-2xl font-black text-base hover:bg-indigo-100 transition-transform active:scale-95 shadow-sm border-2 border-indigo-200 flex flex-col items-center justify-center leading-tight whitespace-nowrap"><Sparkles size={20} className="mb-1"/>자동완성</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">한자 (선택)</label>
            <input value={hanja} onChange={(e) => setHanja(e.target.value)} placeholder="예: 民主主義" className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-black text-xl tracking-[0.3em]" />
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">핵심 내용</label>
            <textarea value={meaning} onChange={(e) => setMeaning(e.target.value)} rows={5} placeholder="개념의 뜻이나 중요한 설명을 적어주세요." className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-lg resize-none leading-relaxed" />
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
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 px-6 py-5 rounded-2xl font-black text-lg text-gray-700 outline-none transition-colors cursor-pointer" />
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
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl outline-none font-black text-lg appearance-none text-gray-700 transition-colors cursor-pointer">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-black text-gray-500 mb-2 ml-1">마감 기한</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-slate-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white px-6 py-5 rounded-2xl font-black text-lg text-gray-700 outline-none transition-colors cursor-pointer" />
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
