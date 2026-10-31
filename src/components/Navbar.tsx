/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Plus, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

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
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
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
              className="text-base sm:text-xl font-bold tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span>{t('appTitle')}</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectTab('generator')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'generator'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {t('navGenerator')}
            </button>
            <button
              onClick={() => onSelectTab('library')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'library'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {t('navLibrary')}
            </button>
            <button
              onClick={() => onSelectTab('saved')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'saved'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {t('navSaved')}
            </button>
            <button
              onClick={() => onSelectTab('curriculum')}
              className={`hover:text-white transition-all whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'border-sky-400 text-sky-300 font-semibold shadow-xs'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {t('navCurriculum')}
            </button>
          </nav>

          {/* Zone 3: Actions - Language Toggle & Add Lesson */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher Button for Egyptian Language Schools */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 hover:border-sky-500/50 transition-all cursor-pointer shadow-xs active:scale-95"
              title={
                language === 'ar'
                  ? 'تحويل الأداة بالكامل للغة الإنجليزية لمدارس اللغات (Switch to English for Language Schools)'
                  : 'Switch application to Arabic (التحويل للغة العربية)'
              }
              aria-label={t('langAria')}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-medium">{t('langToggle')}</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-sky-500/20 text-sky-200 uppercase font-mono font-bold tracking-wider">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Primary Action: Add Lesson */}
            <button
              onClick={onOpenNewLessonModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-gradient-to-r from-sky-300 via-sky-400 to-indigo-300 hover:from-sky-200 hover:to-indigo-200 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm shadow-sky-500/20 cursor-pointer"
              title={t('navAddLesson')}
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">{t('navAddLesson')}</span>
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
            {t('navGenerator')}
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'library'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('navLibrary')}
          </button>
          <button
            onClick={() => onSelectTab('saved')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'saved'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('navSaved')}
          </button>
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'curriculum'
                ? 'bg-sky-500/20 text-sky-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('navCurriculum')}
          </button>
        </div>
      </div>
    </header>
  );
};
