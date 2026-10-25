/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuestionBatch } from '../types.ts';
import { FileCheck, Trash2, ArrowRight, BookmarkCheck } from 'lucide-react';

interface SavedBatchesViewProps {
  savedBatches: QuestionBatch[];
  onLoadBatch: (batch: QuestionBatch) => void;
  onDeleteBatch: (id: string) => void;
}

export const SavedBatchesView: React.FC<SavedBatchesViewProps> = ({
  savedBatches,
  onLoadBatch,
  onDeleteBatch,
}) => {

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <BookmarkCheck className="w-4 h-4" />
          <span>الأرشيف التعليمي للنماذج</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          سجل النماذج والدفعات الامتحانية المحفوظة
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          مستودع بالدفعات التي تم توليدها مسبقاً لمراجعتها، وحلها تفاعلياً مع الطلاب، وطباعتها وتصديرها كـ PDF مباشرة
        </p>
      </div>

      {savedBatches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 mx-auto mb-3">
            <FileCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">لا توجد نماذج محفوظة بعد</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            عند إنشاء أي دفعة أسئلة في مولد الأسئلة، اضغط على زر «حفظ في النماذج» للرجوع إليها هنا في أي وقت
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedBatches.map((batch) => (
            <article
              key={batch.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                {/* Clean unboxed metadata with separators (Anti-slop rule) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    {batch.chapterTitle}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(batch.timestamp).toLocaleDateString('ar-EG')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {batch.questions.length} أسئلة
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {batch.lessonTitle}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {batch.engineNotice || 'دفعة أسئلة منهجية مخصصة للثانوية العامة'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">

                <button
                  type="button"
                  onClick={() => onLoadBatch(batch)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 rounded-xl transition-all shadow-xs"
                >
                  <span>عرض وحل تفاعلي</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل ترغب في حذف هذا النموذج من السجل؟')) {
                      onDeleteBatch(batch.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="حذف النموذج"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
