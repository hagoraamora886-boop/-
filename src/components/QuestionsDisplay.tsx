/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuestionItem } from '../types.ts';
import {
  Copy,
  Printer,
  Eye,
  EyeOff,
  Check,
  FileCheck,
  Code2,
  HelpCircle,
  Award,
  Sparkles,
  BookOpen,
  GraduationCap,
  RotateCcw,
  PenLine,
  Send,
  Star,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

interface QuestionsDisplayProps {
  questions: QuestionItem[];
  generationSource?: 'gemini-3.8-flash' | 'curriculum_bank';
  engineNotice?: string;
  lessonTitle: string;
  chapterTitle: string;
  onSaveToSavedBatches?: () => void;
  isSaved?: boolean;
}

export const QuestionsDisplay: React.FC<QuestionsDisplayProps> = ({
  questions,
  generationSource,
  engineNotice,
  lessonTitle,
  chapterTitle,
  onSaveToSavedBatches,
  isSaved,
}) => {
  const [viewMode, setViewMode] = useState<'teacher' | 'student' | 'exam'>('teacher');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>(
    // Default open in teacher mode
    () => questions.reduce((acc, q) => ({ ...acc, [q.id]: true }), {})
  );
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [submittedEssays, setSubmittedEssays] = useState<Record<string, boolean>>({});
  const [selfRatings, setSelfRatings] = useState<Record<string, 'excellent' | 'good' | 'review'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleSelectStudentAnswer = (questionId: string, option: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleEssayChange = (questionId: string, text: string) => {
    setEssayAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmitEssay = (questionId: string) => {
    if (!essayAnswers[questionId] || !essayAnswers[questionId].trim()) return;
    setSubmittedEssays((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleEditEssay = (questionId: string) => {
    setSubmittedEssays((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const handleSelfRating = (questionId: string, rating: 'excellent' | 'good' | 'review') => {
    setSelfRatings((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleResetStudentQuiz = () => {
    setStudentAnswers({});
    setEssayAnswers({});
    setSubmittedEssays({});
    setSelfRatings({});
  };

  // Score & Progress calculations
  const mcqCorrectCount = questions.filter(
    (q) => q.options && q.options.length > 0 && studentAnswers[q.id] && studentAnswers[q.id] === q.correctAnswer
  ).length;
  const essayPositiveCount = Object.keys(selfRatings).filter(
    (k) => selfRatings[k] === 'excellent' || selfRatings[k] === 'good'
  ).length;
  const totalCorrectCount = mcqCorrectCount + essayPositiveCount;

  const mcqAnsweredCount = Object.keys(studentAnswers).length;
  const essaySubmittedCount = Object.keys(submittedEssays).filter((k) => submittedEssays[k]).length;
  const totalAnsweredCount = mcqAnsweredCount + essaySubmittedCount;

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllExplanations = () => {
    const allOpen = Object.values(expandedExplanations).every(Boolean);
    const updated = questions.reduce(
      (acc, q) => ({ ...acc, [q.id]: !allOpen }),
      {}
    );
    setExpandedExplanations(updated);
  };

  const handleCopyQuestion = (q: QuestionItem) => {
    let text = `${q.question}\n`;
    if (q.codeSnippet) {
      text += `\nالكود البرمجي:\n${q.codeSnippet}\n`;
    }
    if (q.options) {
      text += `\nالخيارات:\n${q.options.map((opt, i) => `${i + 1}) ${opt}`).join('\n')}\n`;
    }
    if (essayAnswers[q.id]?.trim()) {
      text += `\nإجابة الطالب: ${essayAnswers[q.id]}\n`;
    }
    if (viewMode === 'teacher') {
      text += `\nالإجابة الصحيحة: ${q.correctAnswer}\nالتفسير التربوي: ${q.explanation}\nمعيار التقييم: ${q.rubricCriteria}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllQuestions = () => {
    let fullText = `اختبار مادة البرمجة والذكاء الاصطناعي - الصف الثاني بالبكالوريا المصرية\n`;
    fullText += `الفصل: ${chapterTitle}\nالدرس: ${lessonTitle}\nعدد الأسئلة: ${questions.length}\n`;
    fullText += `==============================================\n\n`;

    questions.forEach((q, idx) => {
      fullText += `السؤال ${idx + 1}: ${q.question}\n`;
      if (q.codeSnippet) {
        fullText += `\nالكود البرمجي:\n${q.codeSnippet}\n`;
      }
      if (q.options) {
        fullText += `الخيارات:\n${q.options.map((opt, i) => `(${i + 1}) ${opt}`).join('\n')}\n`;
      }
      if (essayAnswers[q.id]?.trim()) {
        fullText += `إجابة الطالب: ${essayAnswers[q.id]}\n`;
      }
      if (viewMode === 'teacher') {
        fullText += `الإجابة النموذجية: ${q.correctAnswer}\n`;
        fullText += `التفسير العلمي: ${q.explanation}\n`;
        fullText += `معيار الدرجة: ${q.rubricCriteria}\n`;
      }
      fullText += `\n----------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(fullText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  const getTypeLabel = (type: QuestionItem['type']) => {
    switch (type) {
      case 'mcq':
        return 'اختيار من متعدد';
      case 'true_false':
        return 'صواب أو خطأ';
      case 'code_trace':
        return 'تتبع كود وتصحيح أخطاء';
      case 'short_answer':
        return 'سؤال مقالي وتحليلي';
      default:
        return 'سؤال منهجي';
    }
  };

  const getLevelLabel = (level: QuestionItem['thinkingLevel']) => {
    switch (level) {
      case 'remembering':
        return 'مستوى التذكر والفهم';
      case 'applying':
        return 'مستوى التطبيق والتحليل';
      case 'evaluating':
        return 'مستوى التقويم والابتكار';
      default:
        return 'مستوى شامل';
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs print:p-0 print:border-none print:shadow-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/90 gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-indigo-700">{chapterTitle}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">{lessonTitle}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-bold text-sky-700 tabular-nums">
              {questions.length} أسئلة بالدفعة
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            دفعة الأسئلة الحالية ونموذج الإجابة والتفسيرات
          </h3>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Mode Control with 3 Modes */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'teacher'
                  ? 'bg-white text-indigo-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>نمط المعلم</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>تدريب تفاعلي للطلاب</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('exam')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'exam'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>ورقة الاختبار</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleCopyAllQuestions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="نسخ كافة الأسئلة إلى الحافظة"
          >
            {allCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الدفعة</span>
              </>
            )}
          </button>

          {/* زر طباعة الأسئلة */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-colors active:scale-95"
            title="طباعة الأسئلة على الورق مباشرة"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>طباعة الأسئلة</span>
          </button>


          {viewMode === 'teacher' && (
            <button
              type="button"
              onClick={toggleAllExplanations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="إخفاء أو إظهار كافة التفسيرات"
            >
              {Object.values(expandedExplanations).every(Boolean) ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>طي التفسيرات</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>توسيع التفسيرات</span>
                </>
              )}
            </button>
          )}

          {onSaveToSavedBatches && (
            <button
              type="button"
              onClick={onSaveToSavedBatches}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isSaved ? 'محفوظ في النماذج' : 'حفظ في النماذج'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Student Practice Banner */}
      {viewMode === 'student' && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/80 to-emerald-50/70 border border-indigo-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-500/20 shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>نمط التدريب والمذاكرة التفاعلية للطلاب</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-white/90 border border-indigo-200 px-2 py-0.5 rounded-full shadow-2xs">
                  تقييم فوري وتشجيعي
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                حل الأسئلة التفاعلية واكتب تحليلك في الأسئلة المقالية لتكتشف التقييم الفوري ونموذج التصحيح المعتمد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-3.5 py-1.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-medium">النتيجة والتقدم</div>
              <div className="text-sm font-bold text-indigo-700 font-mono tabular-nums">
                {totalCorrectCount} / {totalAnsweredCount > 0 ? totalAnsweredCount : questions.length} {totalAnsweredCount > 0 ? 'مكتملة' : 'سؤال'}
              </div>
            </div>

            {totalAnsweredCount > 0 && (
              <button
                type="button"
                onClick={handleResetStudentQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                title="إعادة بدء الاختبار التفاعلي ومسح الإجابات"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        </div>
      )}


      {/* Generation Engine Banner */}
      {engineNotice && (
        <div className="mt-3 text-xs bg-slate-50/80 border border-slate-200/90 rounded-xl p-2.5 flex items-center justify-between text-slate-600 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{engineNotice}</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 shrink-0">
            {generationSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Official Curriculum'}
          </span>
        </div>
      )}

      {/* Printable Official Exam Header (Visible ONLY during print) */}
      <div className="hidden print:block pb-4 mb-6 border-b-2 border-slate-900 text-slate-900">
        <div className="flex justify-between items-start text-xs pb-3 mb-3 border-b border-slate-300">
          <div className="text-right space-y-0.5">
            <p className="font-bold text-sm">جمهورية مصر العربية</p>
            <p className="font-semibold text-xs text-slate-800">وزارة التربية والتعليم والتعليم الفني</p>
            <p className="text-[11px] text-slate-600">قطاع التعليم العام — مادة البرمجة والذكاء الاصطناعي</p>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-base font-bold tracking-tight">ورقة تقييم مادة البرمجة والذكاء الاصطناعي</h1>
            <p className="font-semibold text-xs text-slate-700">الصف الثاني الثانوي (البكالوريا المصرية)</p>
            <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50">
              {viewMode === 'teacher' ? 'دليل المعلم ونموذج الإجابة الرسمي' : 'ورقة اختبار الطالب'}
            </span>
          </div>
          <div className="text-left space-y-0.5 text-xs font-mono">
            <p className="font-sans"><span className="font-semibold">الدرجة الكلية:</span> [ &nbsp;&nbsp;&nbsp;&nbsp; / 20 ]</p>
            <p className="font-sans"><span className="font-semibold">الزمن المقترح:</span> 45 دقيقة</p>
            <p className="font-sans text-[11px] text-slate-500">العام الدراسي 2026 / 2027</p>
          </div>
        </div>

        {/* Student identification bar in Exam mode */}
        {(viewMode === 'exam' || viewMode === 'student') && (
          <div className="grid grid-cols-3 gap-3 text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-300 rounded-md mb-3">
            <div><span className="font-bold">اسم الطالب:</span> ............................................</div>
            <div><span className="font-bold">رقم الجلوس / الفصل:</span> ....................</div>
            <div><span className="font-bold">تاريخ الاختبار:</span> ..... / ..... / 2026 م</div>
          </div>
        )}

        {/* Exam specifications summary */}
        <div className="flex justify-between items-center text-xs text-slate-700 pt-1">
          <div><span className="font-bold text-slate-900">المجال / الفصل:</span> {chapterTitle}</div>
          <div><span className="font-bold text-slate-900">موضوع التقييم:</span> {lessonTitle}</div>
          <div><span className="font-bold text-slate-900">إجمالي الأسئلة:</span> {questions.length} سؤال</div>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-6">
        {questions.map((q, idx) => {
          const isExpanded = expandedExplanations[q.id] ?? true;
          const studentSelectedOpt = studentAnswers[q.id];
          const hasStudentAnswered = Boolean(studentSelectedOpt);
          const isStudentCorrect = studentSelectedOpt === q.correctAnswer;

          return (
            <article
              key={q.id}
              className="border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 sm:p-6 bg-white transition-all shadow-xs hover:shadow-sm print:border print:border-slate-300 print:rounded-lg print:p-4 print:mb-4 print:break-inside-avoid print:page-break-inside-avoid print:shadow-none"
            >
              {/* Question Header & Metadata */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-600 text-white font-bold text-xs shrink-0 tabular-nums shadow-xs print:bg-slate-800 print:text-white">
                    {idx + 1}
                  </span>
                  {/* Clean metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800">{getTypeLabel(q.type)}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      q.thinkingLevel === 'remembering'
                        ? 'bg-sky-50 text-sky-800 border border-sky-200/70'
                        : q.thinkingLevel === 'applying'
                        ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/70'
                        : 'bg-purple-50 text-purple-800 border border-purple-200/70'
                    }`}>
                      {getLevelLabel(q.thinkingLevel)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(q)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="نسخ السؤال"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {viewMode === 'teacher' && (
                    <button
                      type="button"
                      onClick={() => toggleExplanation(q.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title={isExpanded ? 'طي الإجابة والتفسير' : 'إظهار الإجابة والتفسير'}
                    >
                      {isExpanded ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mt-4 text-slate-900 font-bold text-base sm:text-lg leading-relaxed print:text-slate-950">
                {q.question}
              </div>

              {/* Code Snippet with macOS terminal styling */}
              {q.codeSnippet && (
                <div className="mt-4 bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-md print:bg-slate-50 print:text-slate-900 print:border-slate-300">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 print:bg-slate-100 print:text-slate-700 print:border-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 print:hidden">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-sky-300 print:text-slate-900">Python 3.12</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(q.codeSnippet || '');
                        setCopiedCodeId(q.id);
                        setTimeout(() => setCopiedCodeId(null), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors print:hidden text-[11px] px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
                    >
                      {copiedCodeId === q.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 text-xs text-emerald-300 leading-relaxed font-mono select-all overflow-x-auto print:text-slate-900 whitespace-pre-wrap">
                    {q.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Multiple Choice Options */}
              {q.options && q.options.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const letter = ['أ', 'ب', 'ج', 'د'][optIdx] || `${optIdx + 1}`;

                    // Teacher Mode states
                    const isTeacherCorrect = viewMode === 'teacher' && opt === q.correctAnswer;

                    // Student Mode states
                    const isStudentSelected = viewMode === 'student' && studentSelectedOpt === opt;
                    const isOptionTheCorrectAnswer = opt === q.correctAnswer;

                    let optionClasses = 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/20';

                    if (viewMode === 'teacher') {
                      if (isTeacherCorrect) {
                        optionClasses = 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-semibold';
                      }
                    } else if (viewMode === 'student') {
                      if (hasStudentAnswered) {
                        if (isStudentSelected && isStudentCorrect) {
                          optionClasses = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300 shadow-xs';
                        } else if (isStudentSelected && !isStudentCorrect) {
                          optionClasses = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-300';
                        } else if (!isStudentSelected && isOptionTheCorrectAnswer) {
                          optionClasses = 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-medium';
                        } else {
                          optionClasses = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
                        }
                      } else {
                        optionClasses = 'bg-white hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-400 text-slate-800 cursor-pointer shadow-2xs hover:shadow-xs';
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => {
                          if (viewMode === 'student') {
                            handleSelectStudentAnswer(q.id, opt);
                          }
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-sm transition-all ${optionClasses} ${
                          viewMode === 'student' && !hasStudentAnswered ? 'cursor-pointer active:scale-[0.99]' : ''
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                            isTeacherCorrect || (viewMode === 'student' && isStudentSelected && isStudentCorrect)
                              ? 'bg-emerald-600 text-white'
                              : viewMode === 'student' && isStudentSelected && !isStudentCorrect
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {letter}
                        </span>
                        <div className="flex-1 pt-0.5">{opt}</div>
                        {isTeacherCorrect && (
                          <span className="text-xs font-bold text-emerald-700 shrink-0 print:text-emerald-800">
                            (الإجابة الصحيحة)
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && isStudentSelected && isStudentCorrect && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            <span>إجابة صحيحة!</span>
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && isStudentSelected && !isStudentCorrect && (
                          <span className="text-xs font-bold text-rose-700 shrink-0">
                            اختيارك غير صحيح
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && !isStudentSelected && isOptionTheCorrectAnswer && (
                          <span className="text-xs font-bold text-emerald-700 shrink-0">
                            (الإجابة النموذجية الصحيحة)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Student Immediate Feedback in Student Mode (for MCQ options) */}
              {viewMode === 'student' && q.options && q.options.length > 0 && hasStudentAnswered && (
                <div className="mt-4 p-4 rounded-xl border transition-all animate-fade-in text-xs leading-relaxed">
                  {isStudentCorrect ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3.5 rounded-lg flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-emerald-950">🎉 أحسنت صنعاً! إجابة صحيحة ومتقنة.</div>
                        <div className="text-emerald-800 mt-1 leading-relaxed">{q.explanation}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/90 border border-amber-200 text-amber-950 p-3.5 rounded-lg flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-amber-950">
                          💡 إجابة غير دقيقة — الإجابة الصحيحة هي: «{q.correctAnswer}»
                        </div>
                        <div className="text-amber-800 mt-1 leading-relaxed">{q.explanation}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Essay / Short Answer Question Student Writing Studio */}
              {(!q.options || q.options.length === 0) && (
                <div className="mt-4 space-y-4">
                  {/* Student Mode: Interactive Writing & Grading */}
                  {viewMode === 'student' && (
                    <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-white p-4 sm:p-5 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
                            <PenLine className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                              صندوق إجابة وتحليل الطالب (سؤال مقالي)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              اكتب تحليلك العلمي، المفاهيم الأساسية، والخطوات بالتفصيل
                            </span>
                          </div>
                        </div>

                        {/* Word/Character counter */}
                        <div className="text-[11px] font-mono text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-center shrink-0">
                          <span>{essayAnswers[q.id]?.trim() ? essayAnswers[q.id].trim().split(/\s+/).length : 0} كلمة</span>
                          <span className="mx-1 text-slate-300">·</span>
                          <span>{essayAnswers[q.id]?.length || 0} حرف</span>
                        </div>
                      </div>

                      {/* Textarea for composing essay */}
                      {!submittedEssays[q.id] ? (
                        <div className="mt-3.5 space-y-3">
                          <textarea
                            value={essayAnswers[q.id] || ''}
                            onChange={(e) => handleEssayChange(q.id, e.target.value)}
                            placeholder="اكتب إجابتك وتحليلك العلمي هنا بالتفصيل (اشرح المفهوم البرمجي، القواعد، خطوات الحل، والتعليل المطلوب)..."
                            rows={4}
                            className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all leading-relaxed"
                          />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <span className="text-[11px] text-slate-500">
                              {essayAnswers[q.id]?.trim()
                                ? 'اضغط تسليم الإجابة للمقارنة بنموذج التصحيح والمعايير المعتمدة'
                                : 'اكتب إجابتك أولاً لتفعيل زر التسليم والمراجعة الذاتية'}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleSubmitEssay(q.id)}
                              disabled={!essayAnswers[q.id]?.trim()}
                              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                                essayAnswers[q.id]?.trim()
                                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white cursor-pointer active:scale-95'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>تسليم الإجابة ومطالعة نموذج التصحيح</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Submitted View */
                        <div className="mt-3.5 space-y-4">
                          {/* Student's recorded text */}
                          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>إجابتك المسجلة:</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEditEssay(q.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>تعديل الإجابة</span>
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                              {essayAnswers[q.id]}
                            </p>
                          </div>

                          {/* Model Answer & Rubric Review */}
                          <div className="p-4 bg-sky-50/70 border border-sky-200/90 rounded-xl space-y-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950 mb-1">
                                <Check className="w-4 h-4 text-sky-600" />
                                <span>الإجابة النموذجية المعتمدة:</span>
                              </div>
                              <p className="text-xs sm:text-sm font-semibold text-sky-900 leading-relaxed">
                                {q.correctAnswer}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-sky-200/60">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                <HelpCircle className="w-4 h-4 text-slate-500" />
                                <span>الشرح والتفسير التربوي:</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-sky-200/60">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                                <Award className="w-4 h-4 text-amber-700" />
                                <span>معيار تقدير الدرجة (Rubric):</span>
                              </div>
                              <p className="text-xs text-amber-900/90 leading-relaxed">
                                {q.rubricCriteria}
                              </p>
                            </div>
                          </div>

                          {/* Self-Assessment */}
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <span className="text-xs font-bold text-slate-800">
                                بناءً على معايير التصحيح (Rubric)، قيّم إجابتك ذاتياً:
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSelfRating(q.id, 'excellent')}
                                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                                    selfRatings[q.id] === 'excellent'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                                  }`}
                                >
                                  ⭐⭐⭐ نموذجية (كاملة)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelfRating(q.id, 'good')}
                                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                                    selfRatings[q.id] === 'good'
                                      ? 'bg-sky-600 text-white shadow-xs'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300'
                                  }`}
                                >
                                  ⭐⭐ مقبولة (جزئية)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelfRating(q.id, 'review')}
                                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                                    selfRatings[q.id] === 'review'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-300'
                                  }`}
                                >
                                  ⭐ تحتاج مراجعة
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Exam Mode: Student can type online or write on paper */}
                  {viewMode === 'exam' && (
                    <div className="space-y-3">
                      {/* On-screen typed answer */}
                      <div className="print:hidden">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <PenLine className="w-3.5 h-3.5 text-indigo-600" />
                            <span>إجابة الطالب والتحليل المقالي:</span>
                          </span>
                          <span className="text-[11px] text-slate-400">يمكنك كتابة الإجابة هنا مباشرة قبل الطباعة</span>
                        </label>
                        <textarea
                          value={essayAnswers[q.id] || ''}
                          onChange={(e) => handleEssayChange(q.id, e.target.value)}
                          placeholder="اكتب إجابتك هنا على ورقة الاختبار الإلكترونية..."
                          rows={4}
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
                        />
                      </div>

                      {/* Printed ruled paper area for physical exam */}
                      <div className="hidden print:block pt-2">
                        <div className="text-xs font-bold text-slate-800 mb-2">إجابة الطالب والتعليل:</div>
                        {essayAnswers[q.id]?.trim() ? (
                          <div className="p-2 border border-slate-300 rounded bg-slate-50/50 text-xs text-slate-900 whitespace-pre-wrap">
                            {essayAnswers[q.id]}
                          </div>
                        ) : (
                          <div className="space-y-4 pt-1">
                            <div className="border-b border-dashed border-slate-400 h-6" />
                            <div className="border-b border-dashed border-slate-400 h-6" />
                            <div className="border-b border-dashed border-slate-400 h-6" />
                            <div className="border-b border-dashed border-slate-400 h-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Teacher Mode: Show student's typed answer if exists */}
                  {viewMode === 'teacher' && essayAnswers[q.id]?.trim() && (
                    <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl print:hidden">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <PenLine className="w-3.5 h-3.5 text-indigo-700" />
                          <span>إجابة الطالب المدونة لهذا السؤال:</span>
                        </span>
                        {selfRatings[q.id] && (
                          <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            التقييم الذاتي: {selfRatings[q.id] === 'excellent' ? '⭐⭐⭐ كاملة' : selfRatings[q.id] === 'good' ? '⭐⭐ جزئية' : '⭐ تحتاج مراجعة'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                        {essayAnswers[q.id]}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Student Multiple-Choice Answer Space in Exam Mode */}
              {viewMode === 'exam' && q.options && q.options.length > 0 && (
                <div className="mt-4 pt-2.5 border-t border-dashed border-slate-200 text-xs text-slate-400 print:border-slate-300 print:break-inside-avoid">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-500 print:text-slate-700">اختيار الطالب:</span>
                    <span className="font-mono text-[11px] text-slate-400">[ ضع دائرة حول الحرف الصحيح: أ - ب - ج - د ]</span>
                  </div>
                </div>
              )}

              {/* Teacher Solutions & Explanations (ViewMode: Teacher) */}
              {viewMode === 'teacher' && isExpanded && (
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3.5 print:break-inside-avoid print:pt-3 print:border-slate-200">
                  {/* Correct Answer Box */}
                  <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-3.5 print:bg-slate-50 print:border-slate-300">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950 mb-1 print:text-slate-900">
                      <Check className="w-4 h-4 text-sky-600 print:text-slate-700" />
                      <span>الإجابة النموذجية المعتمدة:</span>
                    </div>
                    <div className="text-sm font-bold text-sky-900 leading-relaxed print:text-slate-950">
                      {q.correctAnswer}
                    </div>
                  </div>

                  {/* Educational Explanation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 print:border-slate-300">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500 print:text-slate-700" />
                      <span>التفسير والتحليل العلمي والتربوي:</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 print:text-slate-800">{q.explanation}</p>
                  </div>

                  {/* Rubric / Marking Criteria */}
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 print:bg-slate-50 print:border-slate-300">
                    <div className="flex items-center gap-1.5 font-bold mb-1 print:text-slate-900">
                      <Award className="w-3.5 h-3.5 text-amber-700 print:text-slate-700" />
                      <span>معيار تقدير الدرجة (Rubric):</span>
                    </div>
                    <p className="leading-relaxed text-amber-800 print:text-slate-800">{q.rubricCriteria}</p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Printable Exam Paper Footer (Visible only when printing) */}
      <div className="hidden print:flex justify-between items-center text-[10px] text-slate-600 pt-4 mt-6 border-t border-slate-400">
        <div>مساعد معلم مادة البرمجة والذكاء الاصطناعي — إعداد الأستاذة / هاجر محمود</div>
        <div>مع تمنياتنا لجميع الطلاب بالنجاح والتفوق الدراسي</div>
      </div>
    </section>
  );
};
