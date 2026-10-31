/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Chapter, Lesson, QuestionType, ThinkingLevel } from '../types.ts';
import { Sparkles, BookOpen, CheckCircle2, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface QuestionGeneratorProps {
  chapters: Chapter[];
  lessons: Lesson[];
  selectedChapterId: string;
  selectedLessonId: string;
  selectedType: QuestionType;
  selectedLevel: ThinkingLevel;
  isGenerating: boolean;
  engineStatus: { connected: boolean; hasApiKey: boolean; model: string };
  onSelectChapter: (id: string) => void;
  onSelectLesson: (id: string) => void;
  onSelectType: (type: QuestionType) => void;
  onSelectLevel: (level: ThinkingLevel) => void;
  onGenerateBatch: () => void;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  chapters,
  lessons,
  selectedChapterId,
  selectedLessonId,
  selectedType,
  selectedLevel,
  isGenerating,
  engineStatus,
  onSelectChapter,
  onSelectLesson,
  onSelectType,
  onSelectLevel,
  onGenerateBatch,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isEn = language === 'en';

  // Lessons matching selected chapter
  const filteredLessons = lessons.filter(
    (l) => selectedChapterId === 'all' || l.chapterId === selectedChapterId
  );

  const activeLesson = lessons.find((l) => l.id === selectedLessonId);

  const questionTypesList: { id: QuestionType; label: string; desc: string }[] = isEn
    ? [
        { id: 'all', label: 'Balanced Mix (All Types)', desc: 'Generates a balanced batch following official exam specifications' },
        { id: 'mcq', label: 'Multiple Choice Questions (MCQ)', desc: 'Four distinct options with one indisputable correct answer' },
        { id: 'true_false', label: 'True or False with Justification', desc: 'Assesses conceptual clarity with scientific justification' },
        { id: 'short_answer', label: 'Essay & Scenario Questions', desc: 'Real-world problem solving and technical analysis tasks' },
      ]
    : [
        { id: 'all', label: 'مزيج شامل لكافة الأنماط', desc: 'توليد باقة تجمع كافة الأنماط الامتحانية الرسمية' },
        { id: 'mcq', label: 'اختيار من متعدد (MCQ)', desc: 'أسئلة بأربعة بدائل وخيار وحيد صحيح' },
        { id: 'true_false', label: 'صواب / خطأ مع التعليل', desc: 'قياس دقة المفاهيم مع تبرير علمي' },
        { id: 'short_answer', label: 'أسئلة مقالية وتطبيقية', desc: 'تحليل سيناريوهات واقعية وتطبيقات المنهج' },
      ];

  const thinkingLevelsList: { id: ThinkingLevel; label: string; desc: string }[] = isEn
    ? [
        { id: 'all', label: 'Progressive (All Levels)', desc: 'Covers Bloom’s taxonomy levels comprehensively' },
        { id: 'remembering', label: 'Remembering & Understanding', desc: 'Recalling fundamental concepts, standards, and terminology' },
        { id: 'applying', label: 'Applying & Analysis', desc: 'Analyzing scenarios, protocols, and architectural trade-offs' },
        { id: 'evaluating', label: 'Evaluating & Innovation', desc: 'Critiquing models, auditing security vulnerabilities, and problem solving' },
      ]
    : [
        { id: 'all', label: 'مستويات متدرجة وشاملة', desc: 'مزيج يغطي تدرج مستويات بلوم القياسية' },
        { id: 'remembering', label: 'التذكر والفهم', desc: 'استرجاع المصطلحات والمفاهيم النظرية' },
        { id: 'applying', label: 'التطبيق والتحليل', desc: 'تحليل السيناريوهات التكنولوجية والحلول التطبيقية' },
        { id: 'evaluating', label: 'التقويم والابتكار', desc: 'نقد النماذج الذكية وحل المشكلات واتخاذ القرار' },
      ];

  return (
    <section className="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-sm transition-all print:hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('generatorCardTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-2">
              <span>{isEn ? 'Programming and Artificial Intelligence — 2nd Secondary Grade' : 'مخصص لمادة البرمجة والذكاء الاصطناعي — الصف الثاني الثانوي'}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-sky-100 text-indigo-950 border border-indigo-200 font-bold text-xs shadow-xs">
                {t('teacherAttribution')}
              </span>
            </p>
          </div>
        </div>

        {/* Engine Transparency Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 self-start md:self-auto shadow-2xs">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-medium text-slate-500">{isEn ? 'Engine:' : 'المحرك الأكاديمي:'}</span>
          {engineStatus.hasApiKey ? (
            <span className="font-bold text-indigo-700">Gemini 3.8 Flash ({isEn ? 'Active' : 'نشط'})</span>
          ) : (
            <span className="font-semibold text-slate-700">{isEn ? 'Curriculum Bank + Fallback' : 'بنك المنهج المعتمد + ذكاء احتياطي'}</span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* 1. اختيار الفصل والدرس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px] flex items-center justify-center font-bold">1</span>
              <span>{t('unitLabel')}</span>
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => {
                const newChapterId = e.target.value;
                onSelectChapter(newChapterId);
                // Auto select first lesson in new chapter
                const firstLesson = lessons.find(
                  (l) => newChapterId === 'all' || l.chapterId === newChapterId
                );
                if (firstLesson) {
                  onSelectLesson(firstLesson.id);
                }
              }}
              className="w-full bg-slate-50/80 hover:bg-white border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all font-medium cursor-pointer"
            >
              <option value="all">{t('allUnits')}</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {isEn && ch.titleEn ? ch.titleEn : ch.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 font-mono text-[10px] flex items-center justify-center font-bold">2</span>
              <span>{t('lessonLabel')}</span>
            </label>
            <select
              value={selectedLessonId}
              onChange={(e) => onSelectLesson(e.target.value)}
              className="w-full bg-slate-50/80 hover:bg-white border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 transition-all font-medium cursor-pointer"
            >
              <option value="all">{t('allLessons')}</option>
              {filteredLessons.map((les) => (
                <option key={les.id} value={les.id}>
                  {isEn && les.titleEn ? les.titleEn : les.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Lesson Snippet Preview */}
        {activeLesson && selectedLessonId !== 'all' && (
          <div className="bg-gradient-to-r from-sky-50/80 to-indigo-50/50 border border-sky-100/90 rounded-xl p-4 text-xs text-slate-700 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sky-950 mb-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>{isEn ? 'Lesson Summary:' : 'ملخص محتوى الدرس:'}</span>
              <span className="text-slate-800 font-semibold">{isEn && activeLesson.titleEn ? activeLesson.titleEn : activeLesson.title}</span>
            </div>
            <p className="line-clamp-2 text-slate-600 leading-relaxed font-normal">
              {activeLesson.content}
            </p>
            {activeLesson.keyConcepts && activeLesson.keyConcepts.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-slate-500">
                <span className="font-semibold text-slate-800">{isEn ? 'Key Concepts:' : 'المفاهيم المحورية:'}</span>
                {activeLesson.keyConcepts.map((concept, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-indigo-800 font-medium">{concept}</span>
                    {idx < activeLesson.keyConcepts.length - 1 && <span className="text-slate-300">·</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. اختيار نوع الأسئلة ومستوى التفكير */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Question Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px] flex items-center justify-center font-bold">3</span>
              <span>{t('typeLabel')}</span>
            </label>
            <div className="space-y-2">
              {questionTypesList.map((qType) => (
                <button
                  key={qType.id}
                  type="button"
                  onClick={() => onSelectType(qType.id)}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3.5 py-2.5 rounded-xl border text-xs transition-all flex items-start justify-between cursor-pointer ${
                    selectedType === qType.id
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50/90 to-sky-50/60 text-indigo-950 font-medium shadow-xs ring-1 ring-indigo-400/40'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{qType.label}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{qType.desc}</div>
                  </div>
                  {selectedType === qType.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Thinking Level Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px] flex items-center justify-center font-bold">4</span>
              <span>{t('levelLabel')}</span>
            </label>
            <div className="space-y-2">
              {thinkingLevelsList.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3.5 py-2.5 rounded-xl border text-xs transition-all flex items-start justify-between cursor-pointer ${
                    selectedLevel === lvl.id
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50/90 to-sky-50/60 text-indigo-950 font-medium shadow-xs ring-1 ring-indigo-400/40'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{lvl.label}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{lvl.desc}</div>
                  </div>
                  {selectedLevel === lvl.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. الزر الرئيسي: إنشاء دفعة جديدة من الأسئلة */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGenerateBatch}
            disabled={isGenerating}
            className="w-full relative group overflow-hidden py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:from-indigo-500 hover:via-sky-500 hover:to-indigo-600 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-base">{t('generatingBtn')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-sky-200 group-hover:scale-110 transition-transform" />
                <span className="text-base font-bold">{t('generateBtn')}</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2.5">
            {isEn
              ? 'Complete balanced examination batch automatically generated adhering to Egyptian Ministry specifications'
              : 'يتم توليد دفعة متكاملة ومتوازنة تلقائياً وفق المعايير الوزارية المصرية ونماذج الذكاء الاصطناعي'}
          </p>
        </div>
      </div>
    </section>
  );
};
