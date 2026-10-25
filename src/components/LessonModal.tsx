/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Chapter, Lesson } from '../types.ts';
import { X, Save, BookOpen, Code2, Tag, AlertCircle, Sparkles } from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: {
    title: string;
    chapterId: string;
    chapterTitle: string;
    content: string;
    keyConcepts: string[];
    codeExample?: string;
  }) => void;
  editingLesson?: Lesson | null;
  chapters: Chapter[];
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLesson,
  chapters,
}) => {
  const [title, setTitle] = useState('');
  const [chapterId, setChapterId] = useState(chapters[0]?.id || 'ch-1');
  const [content, setContent] = useState('');
  const [keyConceptsStr, setKeyConceptsStr] = useState('');
  const [codeExample, setCodeExample] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLesson) {
      setTitle(editingLesson.title);
      setChapterId(editingLesson.chapterId);
      setContent(editingLesson.content);
      setKeyConceptsStr(editingLesson.keyConcepts?.join(', ') || '');
      setCodeExample(editingLesson.codeExample || '');
    } else {
      setTitle('');
      setChapterId(chapters[0]?.id || 'ch-1');
      setContent('');
      setKeyConceptsStr('');
      setCodeExample('');
    }
    setError(null);
  }, [editingLesson, isOpen, chapters]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان الدرس');
      return;
    }
    if (!content.trim()) {
      setError('يرجى كتابة نص ومحتوى الدرس');
      return;
    }

    const selectedChapter = chapters.find((c) => c.id === chapterId);
    const chapterTitle = selectedChapter ? selectedChapter.title : 'فصل مخصص';

    const keyConcepts = keyConceptsStr
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onSave({
      title: title.trim(),
      chapterId,
      chapterTitle,
      content: content.trim(),
      keyConcepts,
      codeExample: codeExample.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {editingLesson ? 'تعديل بيانات الدرس' : 'إضافة درس جديد إلى المكتبة'}
              </h3>
              <p className="text-xs text-slate-500">
                يتم حفظ الدرس محلياً وربطه بمولد الأسئلة ونظام التدريب فورياً
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Lesson Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              عنوان الدرس <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: الخوارزميات التكرارية وحساب التعقيد الزمني في بايثون"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              required
            />
          </div>

          {/* Chapter Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              تصنيف الدرس حسب الفصل <span className="text-rose-500">*</span>
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Text / Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              نص ومحتوى الدرس والشرح الأكاديمي <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="اكتب المفاهيم والقواعد البرمجية ونظريات الذكاء الاصطناعي التي يشملها هذا الدرس ليتم توليد الأسئلة استناداً إليها..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all leading-relaxed"
              required
            />
          </div>

          {/* Key Concepts */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              المفاهيم المحورية والكلمات المفتاحية (افصل بينها بفواصل)
            </label>
            <input
              type="text"
              placeholder="مثال: Loops, Time Complexity, Lists, Big-O"
              value={keyConceptsStr}
              onChange={(e) => setKeyConceptsStr(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Code Example (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>كود بايثون توضيحي (اختياري)</span>
              <span className="text-indigo-600 font-mono text-[11px]">Python 3</span>
            </label>
            <textarea
              rows={3}
              placeholder="# مقطع برمجي يوضح فكرة الدرس
for i in range(5):
    print('AI Step:', i)"
              value={codeExample}
              onChange={(e) => setCodeExample(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              dir="ltr"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 rounded-xl transition-all shadow-sm hover:shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingLesson ? 'حفظ التعديلات' : 'حفظ الدرس في المكتبة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
