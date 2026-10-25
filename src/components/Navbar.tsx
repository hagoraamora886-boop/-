/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Sparkles, Layers, FileText, Plus } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'library' | 'saved' | 'curriculum';
  onSelectTab: (tab: 'generator' | 'library' | 'saved' | 'curriculum') => void;
  onOpenNewLessonModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewLessonModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-teal-400 p-0.5 shadow-sm shadow-sky-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-sky-400">
                <Sparkles className="w-4 h-4 text-sky-300" />
              </div>
            </div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('generator');
              }}
              className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span>مساعد البرمجة والذكاء الاصطناعي</span>
            </a>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectTab('generator')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'generator'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              مولد الأسئلة
            </button>
            <button
              onClick={() => onSelectTab('library')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'library'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              مكتبة الدروس
            </button>
            <button
              onClick={() => onSelectTab('saved')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'saved'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              النماذج المحفوظة
            </button>
            <button
              onClick={() => onSelectTab('curriculum')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'curriculum'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              دليل المنهج
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewLessonModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-gradient-to-r from-sky-300 via-sky-400 to-indigo-300 hover:from-sky-200 hover:to-indigo-200 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm shadow-sky-500/20"
              title="إضافة درس جديد لمكتبتك وحفظه"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>إضافة درس جديد</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-800 py-2 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('generator')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'generator'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            مولد الأسئلة
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'library'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            مكتبة الدروس
          </button>
          <button
            onClick={() => onSelectTab('saved')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'saved'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            النماذج المحفوظة
          </button>
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'curriculum'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            دليل المنهج
          </button>
        </div>
      </div>
    </header>
  );
};
