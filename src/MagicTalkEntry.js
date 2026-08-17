import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquareText, X } from 'lucide-react';

/**
 * STEP 1: 기존 App.js를 건드리지 않고 Magic TALK 진입점만 추가한다.
 * 기존 메뉴/데이터/localStorage 로직과 완전히 분리되어 있어 제거도 쉽다.
 */
export default function MagicTalkEntry() {
  const [sidebar, setSidebar] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const findSidebar = () => {
      const brand = Array.from(document.querySelectorAll('h1')).find(
        (el) => el.textContent?.trim() === '매직클래스'
      );
      const candidate = brand?.parentElement?.parentElement || null;
      if (candidate) setSidebar(candidate);
    };

    findSidebar();
    const observer = new MutationObserver(findSidebar);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {sidebar && createPortal(
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden md:flex items-center gap-4 p-4 rounded-2xl transition-all whitespace-nowrap text-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          aria-label="Magic TALK 열기"
        >
          <MessageSquareText size={24} />
          <span>Magic TALK</span>
        </button>,
        sidebar
      )}

      {open && createPortal(
        <div className="fixed inset-0 z-[10020] bg-slate-50 flex flex-col">
          <header className="bg-white border-b px-5 md:px-10 py-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <MessageSquareText size={26} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800">Magic TALK</h2>
                <p className="text-sm md:text-base font-bold text-gray-500">우리 반 실시간 소통</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-200 transition-colors"
              aria-label="Magic TALK 닫기"
            >
              <X size={24} />
            </button>
          </header>

          <main className="flex-1 p-5 md:p-10 flex items-center justify-center">
            <section className="w-full max-w-3xl bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-14 text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-7">
                <MessageSquareText size={40} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">Magic TALK</h3>
              <p className="text-lg md:text-xl font-bold text-gray-500 leading-relaxed">
                학생들과 실시간으로 이야기하고 수업 활동을 함께할 수 있는 공간입니다.
              </p>
              <div className="mt-9 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-black border border-indigo-100">
                🚧 준비 중입니다.
              </div>
            </section>
          </main>
        </div>,
        document.body
      )}
    </>
  );
}
