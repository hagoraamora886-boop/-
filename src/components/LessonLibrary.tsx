/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chapter, Lesson } from '../types.ts';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Code2,
  FileText,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Globe,
  Layout,
  Layers,
} from 'lucide-react';

interface LessonLibraryProps {
  chapters: Chapter[];
  lessons: Lesson[];
  onOpenNewLessonModal: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  onResetLessons: () => void;
  onSelectLessonForGeneration: (chapterId: string, lessonId: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  notificationMessage: string | null;
}

export const LessonLibrary: React.FC<LessonLibraryProps> = ({
  chapters,
  lessons,
  onOpenNewLessonModal,
  onEditLesson,
  onDeleteLesson,
  onResetLessons,
  onSelectLessonForGeneration,
  onExportData,
  onImportData,
  notificationMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');

  const filteredLessons = lessons.filter((les) => {
    const matchChapter =
      selectedChapterFilter === 'all' || les.chapterId === selectedChapterFilter;
    const matchSearch =
      searchTerm.trim() === '' ||
      les.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      les.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      les.keyConcepts?.some((k) =>
        k.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchChapter && matchSearch;
  });

  const getChapterBadge = (chapterId: string) => {
    switch (chapterId) {
      case 'ch1':
        return {
          icon: Cpu,
          badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
          accentBorder: 'hover:border-indigo-400',
        };
      case 'ch2':
        return {
          icon: ShieldCheck,
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          accentBorder: 'hover:border-emerald-400',
        };
      case 'ch3':
        return {
          icon: Globe,
          badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
          accentBorder: 'hover:border-sky-400',
        };
      case 'ch4':
        return {
          icon: Layout,
          badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
          accentBorder: 'hover:border-purple-400',
        };
      default:
        return {
          icon: BookOpen,
          badgeColor: 'text-slate-700 bg-slate-50 border-slate-200',
          accentBorder: 'hover:border-slate-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification */}
      {notificationMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl p-3.5 flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>المحتوى الرقمي والتطبيقي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              مكتبة الدروس والبرمجة التفاعلية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              استكشف دروس المقرر، راجع المفاهيم والأكواد البرمجية، أو أضف دروسك الخاصة
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenNewLessonModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 rounded-xl transition-all shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة درس جديد</span>
            </button>

            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              title="تصدير مكتبة الدروس كملف JSON للنسخ الاحتياطي"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>تصدير نسخة</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>استيراد</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'هل ترغب في استعادة الدروس الافتراضية لمنهج البكالوريا؟ ستظل الدروس الأصلية متوفرة.'
                  )
                ) {
                  onResetLessons();
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
              title="استعادة دروس المنهج الرسمية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في عناوين ونصوص الدروس، المفاهيم، وسيناريوهات التطبيق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedChapterFilter}
              onChange={(e) => setSelectedChapterFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            >
              <option value="all">كافة الفصول ({lessons.length} درس)</option>
              {chapters.map((ch) => {
                const count = lessons.filter((l) => l.chapterId === ch.id).length;
                return (
                  <option key={ch.id} value={ch.id}>
                    {ch.title} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List Grid */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800">لم يتم العثور على أي دروس مطابقة</p>
          <p className="text-xs text-slate-400 mt-1">
            جرب تعديل كلمات البحث أو اضغط على «إضافة درس جديد» لإدراج درسك الخاص
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLessons.map((les) => {
            const chapterBadge = getChapterBadge(les.chapterId);
            const ChapterIcon = chapterBadge.icon;

            return (
              <article
                key={les.id}
                className={`group bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${chapterBadge.accentBorder}`}
              >
                <div>
                  {/* Clean unboxed metadata with separators (Anti-slop rule) */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${chapterBadge.badgeColor}`}>
                        <ChapterIcon className="w-3 h-3" />
                        <span>{les.chapterTitle}</span>
                      </span>
                      {les.isCustom && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                            درس مخصص
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditLesson(les)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="تعديل محتوى الدرس"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {les.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الدرس «${les.title}»؟`)) {
                              onDeleteLesson(les.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف الدرس"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors leading-snug">
                    {les.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {les.content}
                  </p>

                  {/* Key Concepts */}
                  {les.keyConcepts && les.keyConcepts.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 text-[11px]">المفاهيم:</span>
                      {les.keyConcepts.map((k, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Code snippet indicator with macOS-like bar */}
                  {les.codeExample && (
                    <div className="mt-3.5 rounded-xl border border-slate-800/80 bg-slate-900 text-slate-200 overflow-hidden text-xs">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-slate-700/50">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">script</span>
                      </div>
                      <div className="p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                        <span className="truncate block">{les.codeExample.split('\n')[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Card Action: Generate Questions from this Lesson */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    تم التحديث: {new Date(les.updatedAt).toLocaleDateString('ar-EG')}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectLessonForGeneration(les.chapterId, les.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all hover:shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>توليد وتدريب للدرس</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
