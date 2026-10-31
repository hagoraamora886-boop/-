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
  XCircle,
  CheckCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface VerificationResult {
  isCorrect: boolean;
  matchScore: number;
  feedback: string;
}

const verifyStudentText = (
  userText: string,
  correctAnswer: string,
  options?: string[],
  language: 'ar' | 'en' = 'ar'
): VerificationResult => {
  const isEn = language === 'en';

  if (!userText || !userText.trim()) {
    return {
      isCorrect: false,
      matchScore: 0,
      feedback: isEn
        ? 'Please write your answer or notes in the scratchpad first.'
        : 'يرجى كتابة إجابتك أو مسودتك أولاً للتحقق منها.',
    };
  }

  const normalizeAr = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '') // remove tashkeel
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
      .replace(/\s+/g, ' ');

  const normalizeEn = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/['"`]/g, '')
      .replace(/[.,/#!$%^&*;:{}=\-_~()?"«»]/g, ' ')
      .replace(/\s+/g, ' ');

  const normUser = isEn ? normalizeEn(userText) : normalizeAr(userText);
  const normCorrect = isEn ? normalizeEn(correctAnswer) : normalizeAr(correctAnswer);

  // 1. Check if user wrote option letter (A, B, C, D in English / أ, ب, ج, د in Arabic)
  if (options && options.length > 0) {
    const letters = isEn ? ['a', 'b', 'c', 'd'] : ['أ', 'ب', 'ج', 'د'];
    const correctIdx = options.findIndex((opt) => opt === correctAnswer);
    if (correctIdx !== -1) {
      const correctLetter = letters[correctIdx];
      const userLetter = isEn
        ? normUser.replace(/^(option|choice|letter|answer)\s*/i, '').trim().toLowerCase()
        : normUser.replace(/^(الخيار|خيار|اجابة|حرف)\s*/, '').trim();

      if (userLetter === correctLetter || normUser === correctLetter) {
        return {
          isCorrect: true,
          matchScore: 100,
          feedback: isEn
            ? `Correct choice (${correctLetter.toUpperCase()}): "${correctAnswer}".`
            : `إجابة صحيحة ومطابقة تماماً! اختيارك (${correctLetter}): «${correctAnswer}».`,
        };
      }
    }
  }

  // 1.5 True / False shortcut check
  if (isEn) {
    const isUserTrue = ['true', 't', 'correct', 'right'].includes(normUser);
    const isUserFalse = ['false', 'f', 'incorrect', 'wrong'].includes(normUser);
    const isCorrectTrue = normCorrect === 'true';
    const isCorrectFalse = normCorrect === 'false';

    if ((isUserTrue && isCorrectTrue) || (isUserFalse && isCorrectFalse)) {
      return {
        isCorrect: true,
        matchScore: 100,
        feedback: `Correct! Your judgment matches the official curriculum criteria (${correctAnswer}).`,
      };
    }
  }

  // 2. Exact match
  if (normUser === normCorrect) {
    return {
      isCorrect: true,
      matchScore: 100,
      feedback: isEn
        ? 'Correct! Your drafted answer perfectly matches the official curriculum answer criteria. Excellent work!'
        : 'إجابة صحيحة ومطابقة تماماً لنموذج الحل المعتمد! أحسنت صنعاً.',
    };
  }

  // 3. Substring match
  if (normUser.includes(normCorrect)) {
    return {
      isCorrect: true,
      matchScore: 95,
      feedback: isEn
        ? 'Correct! The draft contains the official model answer and covers the required task.'
        : 'إجابة صحيحة! تتضمن المسودة الإجابة النموذجية المعتمدة وتغطي المطلوب بدقة.',
    };
  }

  if (normCorrect.includes(normUser) && normUser.length >= 4) {
    return {
      isCorrect: true,
      matchScore: 85,
      feedback: isEn
        ? 'Correct and very close to the official model solution.'
        : 'إجابة صحيحة ومتقاربة جداً مع الحل المعتمد في المنهج.',
    };
  }

  // 4. Token overlap (for essays and multi-word answers)
  const stopWordsAr = new Set([
    'في', 'من', 'على', 'عن', 'الى', 'إلى', 'مع', 'هذا', 'هذه', 'تم', 'هو', 'هي', 'أن', 'ان',
    'ما', 'لا', 'قد', 'كل', 'او', 'أو', 'حيث', 'بواسطة', 'عبر', 'ذلك', 'تلك', 'التي', 'الذي',
  ]);
  const stopWordsEn = new Set([
    'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'by',
    'with', 'this', 'that', 'an', 'a', 'as', 'it', 'be', 'from', 'which', 'than',
  ]);

  const stopWords = isEn ? stopWordsEn : stopWordsAr;
  const userWords = new Set(
    normUser.split(' ').filter((w) => w.length > 2 && !stopWords.has(w))
  );
  const correctWords = normCorrect
    .split(' ')
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (correctWords.length > 0) {
    let matchedWords = 0;
    correctWords.forEach((cw) => {
      if (userWords.has(cw)) {
        matchedWords += 1;
      } else {
        for (const uw of userWords) {
          if (uw.includes(cw) || cw.includes(uw)) {
            matchedWords += 0.8;
            break;
          }
        }
      }
    });

    const matchRatio = matchedWords / correctWords.length;
    if (matchRatio >= 0.35) {
      const score = Math.min(100, Math.round(matchRatio * 100));
      return {
        isCorrect: true,
        matchScore: score,
        feedback: isEn
          ? `Correct answer with ${score}% match ratio! Your draft contains key concepts and terms.`
          : `إجابة صحيحة بنسبة توافق ${score}%! تحتوي المسودة على المفاهيم والكلمات المفتاحية الأساسية.`,
      };
    }
  }

  return {
    isCorrect: false,
    matchScore: 0,
    feedback: isEn
      ? 'The drafted answer is incomplete or needs review. Compare with the official model solution below.'
      : 'الإجابة المدونة في المسودة غير مطابقة أو ينقصها التدقيق. راجع الحل النموذجي المعتمد أدناه.',
  };
};

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
  const { language, t, isRtl } = useLanguage();
  const isEn = language === 'en';

  const [viewMode, setViewMode] = useState<'teacher' | 'student' | 'exam'>('teacher');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>(
    () => questions.reduce((acc, q) => ({ ...acc, [q.id]: true }), {})
  );
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [submittedEssays, setSubmittedEssays] = useState<Record<string, boolean>>({});
  const [selfRatings, setSelfRatings] = useState<Record<string, 'excellent' | 'good' | 'review'>>({});

  // Student Draft & Scratchpad states
  const [studentDrafts, setStudentDrafts] = useState<Record<string, string>>({});
  const [openDrafts, setOpenDrafts] = useState<Record<string, boolean>>({});
  const [draftVerifications, setDraftVerifications] = useState<
    Record<
      string,
      {
        verified: boolean;
        isCorrect: boolean;
        matchScore: number;
        feedback: string;
        verifiedText: string;
      }
    >
  >({});

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
    if (draftVerifications[questionId]) {
      setDraftVerifications((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleDraftChange = (questionId: string, text: string) => {
    setStudentDrafts((prev) => ({
      ...prev,
      [questionId]: text,
    }));
    if (draftVerifications[questionId]) {
      setDraftVerifications((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const toggleDraft = (questionId: string) => {
    setOpenDrafts((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleVerifyStudentAnswer = (questionId: string, inputSource: 'draft' | 'essay') => {
    const targetQuestion = questions.find((q) => q.id === questionId);
    if (!targetQuestion) return;

    const textToVerify =
      inputSource === 'essay'
        ? essayAnswers[questionId] || ''
        : studentDrafts[questionId] || '';

    const result = verifyStudentText(
      textToVerify,
      targetQuestion.correctAnswer,
      targetQuestion.options,
      language
    );

    setDraftVerifications((prev) => ({
      ...prev,
      [questionId]: {
        verified: true,
        isCorrect: result.isCorrect,
        matchScore: result.matchScore,
        feedback: result.feedback,
        verifiedText: textToVerify,
      },
    }));
  };

  const handleClearVerification = (questionId: string) => {
    setDraftVerifications((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
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
    setStudentDrafts({});
    setDraftVerifications({});
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
      text += `\n${isEn ? 'Code Snippet:' : 'الكود البرمجي:'}\n${q.codeSnippet}\n`;
    }
    if (q.options) {
      const letters = isEn ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
      text += `\n${isEn ? 'Options:' : 'الخيارات:'}\n${q.options.map((opt, i) => `${letters[i]}) ${opt}`).join('\n')}\n`;
    }
    if (essayAnswers[q.id]?.trim()) {
      text += `\n${isEn ? 'Student Answer:' : 'إجابة الطالب:'} ${essayAnswers[q.id]}\n`;
    }
    if (viewMode === 'teacher') {
      text += `\n${isEn ? 'Correct Answer:' : 'الإجابة الصحيحة:'} ${q.correctAnswer}\n${isEn ? 'Explanation:' : 'التفسير التربوي:'} ${q.explanation}\n${isEn ? 'Rubric Criteria:' : 'معيار التقييم:'} ${q.rubricCriteria}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllQuestions = () => {
    let fullText = isEn
      ? `Programming & AI Exam — Secondary Grade 11 (Egyptian Baccalaureate)\n`
      : `اختبار مادة البرمجة والذكاء الاصطناعي - الصف الثاني بالبكالوريا المصرية\n`;
    fullText += `${isEn ? 'Unit' : 'الفصل'}: ${chapterTitle}\n${isEn ? 'Lesson' : 'الدرس'}: ${lessonTitle}\n${isEn ? 'Questions Count' : 'عدد الأسئلة'}: ${questions.length}\n`;
    fullText += `==============================================\n\n`;

    questions.forEach((q, idx) => {
      fullText += `${isEn ? 'Question' : 'السؤال'} ${idx + 1}: ${q.question}\n`;
      if (q.codeSnippet) {
        fullText += `\n${isEn ? 'Code Snippet:' : 'الكود البرمجي:'}\n${q.codeSnippet}\n`;
      }
      if (q.options) {
        const letters = isEn ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
        fullText += `${isEn ? 'Options:' : 'الخيارات:'}\n${q.options.map((opt, i) => `(${letters[i]}) ${opt}`).join('\n')}\n`;
      }
      if (essayAnswers[q.id]?.trim()) {
        fullText += `${isEn ? 'Student Answer:' : 'إجابة الطالب:'} ${essayAnswers[q.id]}\n`;
      }
      if (viewMode === 'teacher') {
        fullText += `${isEn ? 'Model Answer:' : 'الإجابة النموذجية:'} ${q.correctAnswer}\n`;
        fullText += `${isEn ? 'Explanation:' : 'التفسير العلمي:'} ${q.explanation}\n`;
        fullText += `${isEn ? 'Rubric Criteria:' : 'معيار الدرجة:'} ${q.rubricCriteria}\n`;
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
    if (isEn) {
      switch (type) {
        case 'mcq': return 'Multiple Choice (MCQ)';
        case 'true_false': return 'True / False';
        case 'code_trace': return 'Applied Task';
        case 'short_answer': return 'Essay & Analysis';
        default: return 'Curriculum Question';
      }
    }
    switch (type) {
      case 'mcq': return 'اختيار من متعدد';
      case 'true_false': return 'صواب أو خطأ';
      case 'code_trace': return 'سؤال تطبيقي وعملي';
      case 'short_answer': return 'سؤال مقالي وتحليلي';
      default: return 'سؤال منهجي';
    }
  };

  const getLevelLabel = (level: QuestionItem['thinkingLevel']) => {
    if (isEn) {
      switch (level) {
        case 'remembering': return 'Remembering & Understanding';
        case 'applying': return 'Applying & Analysis';
        case 'evaluating': return 'Evaluating & Innovation';
        default: return 'Comprehensive Level';
      }
    }
    switch (level) {
      case 'remembering': return 'مستوى التذكر والفهم';
      case 'applying': return 'مستوى التطبيق والتحليل';
      case 'evaluating': return 'مستوى التقويم والابتكار';
      default: return 'مستوى شامل';
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
              {questions.length} {t('questionsCount')}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t('batchTitle')}
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
              <span>{t('modeTeacher')}</span>
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
              <span>{t('modeStudent')}</span>
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
              <span>{t('modeExam')}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            onClick={handleCopyAllQuestions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title={t('copyBatch')}
          >
            {allCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{t('copiedSuccess')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('copyBatch')}</span>
              </>
            )}
          </button>

          {/* زر طباعة الأسئلة */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow-xs transition-colors active:scale-95 cursor-pointer"
            title={t('printExam')}
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>{t('printExam')}</span>
          </button>

          {viewMode === 'teacher' && (
            <button
              type="button"
              onClick={toggleAllExplanations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title={t('toggleExplanationsHide')}
            >
              {Object.values(expandedExplanations).every(Boolean) ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{t('toggleExplanationsHide')}</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('toggleExplanationsShow')}</span>
                </>
              )}
            </button>
          )}

          {onSaveToSavedBatches && (
            <button
              type="button"
              onClick={onSaveToSavedBatches}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isSaved ? t('savedBadge') : t('saveBatch')}</span>
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
                <span>{t('studentPracticeTitle')}</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-white/90 border border-indigo-200 px-2 py-0.5 rounded-full shadow-2xs">
                  {isEn ? 'Instant Feedback' : 'تقييم فوري وتشجيعي'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {t('studentPracticeDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-3.5 py-1.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-medium">{t('totalProgress')}</div>
              <div className="text-sm font-bold text-indigo-700 font-mono tabular-nums">
                {totalCorrectCount} / {totalAnsweredCount > 0 ? totalAnsweredCount : questions.length} {totalAnsweredCount > 0 ? (isEn ? 'Completed' : 'مكتملة') : (isEn ? 'Questions' : 'سؤال')}
              </div>
            </div>

            {(totalAnsweredCount > 0 ||
              Object.keys(studentDrafts).some((k) => studentDrafts[k]?.trim()) ||
              Object.keys(draftVerifications).length > 0) && (
              <button
                type="button"
                onClick={handleResetStudentQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                title={t('resetPractice')}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEn ? 'Reset' : 'إعادة البدء'}</span>
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
            {generationSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : (isEn ? 'Curriculum Bank' : 'بنك الأسئلة المعتمد')}
          </span>
        </div>
      )}

      {/* Printable Official Exam Header (Visible ONLY during print) */}
      <div className="hidden print:block pb-4 mb-6 border-b-2 border-slate-900 text-slate-900" dir={isEn ? "ltr" : "rtl"}>
        <div className="flex justify-between items-start text-xs pb-3 mb-3 border-b border-slate-300">
          <div className={`${isEn ? 'text-left' : 'text-right'} space-y-0.5`}>
            <p className="font-bold text-sm">{t('republicTitle')}</p>
            <p className="font-semibold text-xs text-slate-800">{t('ministryTitle')}</p>
            <p className="text-[11px] text-slate-600">{t('sectorTitle')}</p>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-base font-bold tracking-tight">
              {viewMode === 'teacher' ? t('examRubricTitle') : t('examTitle')}
            </h1>
            <p className="font-semibold text-xs text-slate-700">{t('stageGrade')}</p>
            <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50">
              {viewMode === 'teacher'
                ? (isEn ? 'Teacher Answer Key & Marking Scheme' : 'دليل المعلم ونموذج الإجابة الرسمي')
                : (isEn ? 'Official Student Exam Sheet' : 'ورقة اختبار الطالب')}
            </span>
          </div>
          <div className={`${isEn ? 'text-right' : 'text-left'} space-y-0.5 text-xs font-mono`}>
            <p className="font-sans"><span className="font-semibold">{t('totalGradeLabel')}</span></p>
            <p className="font-sans"><span className="font-semibold">{t('timeAllowed')}</span></p>
            <p className="font-sans text-[11px] text-slate-500">{t('academicYear')}</p>
          </div>
        </div>

        {/* Student identification bar in Exam mode */}
        {(viewMode === 'exam' || viewMode === 'student') && (
          <div className="grid grid-cols-3 gap-3 text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-300 rounded-md mb-3">
            <div><span className="font-bold">{t('studentNameLine')}</span> ............................................</div>
            <div><span className="font-bold">{t('seatNumberLine')}</span> ....................</div>
            <div><span className="font-bold">{t('dateLine')}</span></div>
          </div>
        )}

        {/* Exam specifications summary */}
        <div className="flex justify-between items-center text-xs text-slate-700 pt-1">
          <div><span className="font-bold text-slate-900">{t('unitField')}</span> {chapterTitle}</div>
          <div><span className="font-bold text-slate-900">{t('topicField')}</span> {lessonTitle}</div>
          <div><span className="font-bold text-slate-900">{isEn ? 'Total Questions:' : 'إجمالي الأسئلة:'}</span> {questions.length} {isEn ? 'Questions' : 'سؤال'}</div>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-6">
        {questions.map((q, idx) => {
          const isExpanded = expandedExplanations[q.id] ?? true;
          const studentSelectedOpt = studentAnswers[q.id];
          const hasStudentAnswered = Boolean(studentSelectedOpt);
          const isStudentCorrect = studentSelectedOpt === q.correctAnswer;
          const optionLetters = isEn ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];

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
                    title={t('copyQuestion')}
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
                      title={isExpanded ? t('hideExplanation') : t('showExplanation')}
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

              {/* Code / Scenario Snippet */}
              {q.codeSnippet && (
                <div className="mt-4 bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-md print:bg-slate-50 print:text-slate-900 print:border-slate-300">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 print:bg-slate-100 print:text-slate-700 print:border-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 print:hidden">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-sky-300 print:text-slate-900">
                        {isEn ? 'Applied Scenario & Technical Context' : 'السيناريو والتطبيق العملي'}
                      </span>
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
                          <span className="text-emerald-300 font-semibold">{isEn ? 'Copied' : 'تم النسخ'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isEn ? 'Copy Snippet' : 'نسخ الكود'}</span>
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
                    const letter = optionLetters[optIdx] || `${optIdx + 1}`;

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
                            {isEn ? '(Model Answer)' : '(الإجابة الصحيحة)'}
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && isStudentSelected && isStudentCorrect && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Correct Answer!' : 'إجابة صحيحة!'}</span>
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && isStudentSelected && !isStudentCorrect && (
                          <span className="text-xs font-bold text-rose-700 shrink-0">
                            {isEn ? 'Incorrect Selection' : 'اختيارك غير صحيح'}
                          </span>
                        )}
                        {viewMode === 'student' && hasStudentAnswered && !isStudentSelected && isOptionTheCorrectAnswer && (
                          <span className="text-xs font-bold text-emerald-700 shrink-0">
                            {isEn ? '(Official Solution)' : '(الإجابة النموذجية الصحيحة)'}
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
                        <div className="font-bold text-sm text-emerald-950">
                          {isEn ? '🎉 Well done! Correct and precise answer.' : '🎉 أحسنت صنعاً! إجابة صحيحة ومتقنة.'}
                        </div>
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
                          {isEn
                            ? `💡 Needs Revision — Correct Model Answer is: "${q.correctAnswer}"`
                            : `💡 إجابة غير دقيقة — الإجابة الصحيحة هي: «${q.correctAnswer}»`}
                        </div>
                        <div className="text-amber-800 mt-1 leading-relaxed">{q.explanation}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* مسودة الطالب وتتبع الكود والتحقق من صحة الإجابة (لأسئلة الاختيار وتتبع الكود والصواب والخطأ) */}
              {q.options && q.options.length > 0 && (viewMode === 'student' || viewMode === 'exam') && (
                <div className="mt-4 pt-3 border-t border-slate-100 print:hidden">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleDraft(q.id)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-700 py-1 px-2.5 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    >
                      <PenLine className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isEn ? 'Student Scratchpad & Answer Verification' : 'مسودة الطالب وتتبع الكود (كتابة خطوات الحل وفحص الإجابة)'}</span>
                      {studentDrafts[q.id]?.trim() && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                      {draftVerifications[q.id] && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            draftVerifications[q.id].isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {draftVerifications[q.id].isCorrect
                            ? (isEn ? '✓ Verified: Correct' : '✓ تم التحقق: صحيحة')
                            : (isEn ? '✗ Verified: Non-matching' : '✗ تم التحقق: غير مطابقة')}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDraft(q.id)}
                      className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer font-medium"
                    >
                      {openDrafts[q.id]
                        ? (isEn ? 'Hide Scratchpad ▲' : 'إخفاء المسودة ▲')
                        : (isEn ? 'Open Scratchpad & Verify ▼' : 'فتح مسودة الطالب والكتابة والتحقق ▼')}
                    </button>
                  </div>

                  {/* Collapsible / Expandable Draft Area */}
                  {(openDrafts[q.id] || studentDrafts[q.id]?.trim() || draftVerifications[q.id]) && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {t('scratchpadLabel')}
                        </label>
                        <textarea
                          value={studentDrafts[q.id] || ''}
                          onChange={(e) => handleDraftChange(q.id, e.target.value)}
                          placeholder={t('scratchpadPlaceholder')}
                          rows={3}
                          className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
                        />
                      </div>

                      {/* Draft Action Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {studentDrafts[q.id]?.length || 0} {isEn ? 'chars in draft' : 'حرف مدون في مسودة الطالب'}
                        </span>

                        <div className="flex items-center gap-2">
                          {studentDrafts[q.id]?.trim() && (
                            <button
                              type="button"
                              onClick={() => {
                                handleDraftChange(q.id, '');
                                handleClearVerification(q.id);
                              }}
                              className="px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              {isEn ? 'Clear Draft' : 'مسح المسودة'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleVerifyStudentAnswer(q.id, 'draft')}
                            disabled={!studentDrafts[q.id]?.trim()}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-2xs ${
                              studentDrafts[q.id]?.trim()
                                ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white cursor-pointer active:scale-95'
                                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                            }`}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>{t('verifyAnswerBtn')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Verification Feedback Card */}
                      {draftVerifications[q.id] && (
                        <div
                          className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                            draftVerifications[q.id].isCorrect
                              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                              : 'bg-rose-50/90 border-rose-300 text-rose-950'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-sm">
                              {draftVerifications[q.id].isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-900">
                                    {isEn
                                      ? `✓ Correct answer! (Match Score: ${draftVerifications[q.id].matchScore}%)`
                                      : `✓ إجابة المسودة صحيحة ومطابقة! (نسبة التوافق: ${draftVerifications[q.id].matchScore}%)`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  <span className="text-rose-900">
                                    {isEn ? '✗ Answer needs revision / non-matching' : '✗ إجابة المسودة غير مطابقة / خطأ'}
                                  </span>
                                </>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleClearVerification(q.id)}
                              className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                            >
                              {t('close')}
                            </button>
                          </div>

                          <p className="leading-relaxed font-sans">{draftVerifications[q.id].feedback}</p>

                          <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1">
                            <div className="font-semibold text-slate-900">
                              <span>{isEn ? 'Official Model Answer: ' : 'الإجابة النموذجية المعتمدة: '}</span>
                              <span className="font-bold text-indigo-950">{q.correctAnswer}</span>
                            </div>
                            <div className="text-slate-600">
                              <span>{isEn ? 'Explanation: ' : 'التفسير والشرح: '}</span>
                              <span>{q.explanation}</span>
                            </div>
                          </div>
                        </div>
                      )}
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
                              {isEn ? 'Student Essay & Analytical Answer Box' : 'صندوق إجابة وتحليل الطالب (سؤال مقالي)'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isEn ? 'Write your technical analysis, definitions, and reasoning in detail' : 'اكتب تحليلك العلمي، المفاهيم الأساسية، والخطوات بالتفصيل'}
                            </span>
                          </div>
                        </div>

                        {/* Word counter */}
                        <div className="text-[11px] font-mono text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-center shrink-0">
                          <span>{essayAnswers[q.id]?.trim() ? essayAnswers[q.id].trim().split(/\s+/).length : 0} {isEn ? 'words' : 'كلمة'}</span>
                          <span className="mx-1 text-slate-300">·</span>
                          <span>{essayAnswers[q.id]?.length || 0} {isEn ? 'chars' : 'حرف'}</span>
                        </div>
                      </div>

                      {/* Textarea for composing essay */}
                      {!submittedEssays[q.id] ? (
                        <div className="mt-3.5 space-y-3">
                          <textarea
                            value={essayAnswers[q.id] || ''}
                            onChange={(e) => handleEssayChange(q.id, e.target.value)}
                            placeholder={isEn ? 'Type your detailed analytical response and technical justification here...' : 'اكتب إجابتك وتحليلك العلمي هنا بالتفصيل (اشرح المفهوم البرمجي، القواعد، خطوات الحل، والتعليل المطلوب)...'}
                            rows={4}
                            className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all leading-relaxed"
                          />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            <span className="text-[11px] text-slate-500">
                              {essayAnswers[q.id]?.trim()
                                ? (isEn ? 'Verify your draft instantly or submit for model grading' : 'يمكنك التحقق من صحة إجابتك فورياً أو تسليمها للاعتماد والتقييم')
                                : (isEn ? 'Type your answer to enable verification and submission' : 'اكتب إجابتك أولاً لتفعيل زر التحقق والتسليم')}
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleVerifyStudentAnswer(q.id, 'essay')}
                                disabled={!essayAnswers[q.id]?.trim()}
                                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                                  essayAnswers[q.id]?.trim()
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                }`}
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>{t('verifyAnswerBtn')}</span>
                              </button>

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
                                <span>{isEn ? 'Submit & View Model Rubric' : 'تسليم ومطالعة نموذج التصحيح'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Instant Verification Feedback Card for Essay */}
                          {draftVerifications[q.id] && (
                            <div
                              className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 mt-2 ${
                                draftVerifications[q.id].isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                  : 'bg-rose-50 border-rose-300 text-rose-950'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-bold text-sm flex items-center gap-1.5">
                                  {draftVerifications[q.id].isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span>
                                        {isEn
                                          ? `✓ Correct answer! (Match Score: ${draftVerifications[q.id].matchScore}%)`
                                          : `✓ إجابتك صحيحة ومطابقة! (نسبة التوافق: ${draftVerifications[q.id].matchScore}%)`}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 text-rose-600" />
                                      <span>{isEn ? '✗ Answer needs revision' : '✗ إجابتك غير مطابقة / خطأ'}</span>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleClearVerification(q.id)}
                                  className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                                >
                                  {t('close')}
                                </button>
                              </div>
                              <p className="leading-relaxed font-sans">{draftVerifications[q.id].feedback}</p>
                              <div className="pt-1.5 border-t border-slate-200 font-semibold text-slate-800">
                                {isEn ? 'Official Model Answer: ' : 'الإجابة النموذجية المعتمدة: '}
                                <span className="font-bold text-indigo-950">{q.correctAnswer}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Submitted Essay View */
                        <div className="mt-3.5 space-y-3.5">
                          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{isEn ? 'Your Submitted Answer:' : 'إجابتك المسلمة لهذا السؤال:'}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEditEssay(q.id)}
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isEn ? 'Edit Answer' : 'تعديل الإجابة'}</span>
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                              {essayAnswers[q.id]}
                            </p>
                          </div>

                          {/* Self-Rating Rubric */}
                          <div className="p-4 bg-indigo-50/70 border border-indigo-200/90 rounded-xl space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-indigo-600" />
                                <span>{isEn ? 'Student Self-Assessment & Mark Allocation:' : 'التقييم الذاتي للطالب وفق المعيار المعتمد:'}</span>
                              </span>
                              <span className="text-[11px] text-indigo-700 font-semibold">
                                {selfRatings[q.id]
                                  ? (selfRatings[q.id] === 'excellent'
                                      ? (isEn ? '⭐⭐⭐ Full Mark' : '⭐⭐⭐ ممتازة ومكتملة')
                                      : selfRatings[q.id] === 'good'
                                      ? (isEn ? '⭐⭐ Good / Partial' : '⭐⭐ جيدة وجزئية')
                                      : (isEn ? '⭐ Needs Review' : '⭐ تحتاج مراجعة وتدقيق'))
                                  : (isEn ? 'Select your rating:' : 'حدد تقييمك الذاتي:')}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleSelfRating(q.id, 'excellent')}
                                className={`p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                  selfRatings[q.id] === 'excellent'
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {isEn ? '⭐⭐⭐ Full Mark' : '⭐⭐⭐ درجة كاملة'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelfRating(q.id, 'good')}
                                className={`p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                  selfRatings[q.id] === 'good'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                    : 'bg-white hover:bg-indigo-50 text-indigo-800 border-indigo-200'
                                }`}
                              >
                                {isEn ? '⭐⭐ Partial Mark' : '⭐⭐ درجة جزئية'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelfRating(q.id, 'review')}
                                className={`p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                                  selfRatings[q.id] === 'review'
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                    : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {isEn ? '⭐ Needs Review' : '⭐ تحتاج مراجعة'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Exam Mode / Print Ruled Paper Space */}
                  {viewMode === 'exam' && (
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                      <div className="print:hidden p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-bold text-slate-700 flex items-center gap-1.5">
                            <PenLine className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{isEn ? 'Student Draft Space for this question:' : 'مسودة الطالب وتدوين خطوات الحل لهذا السؤال:'}</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {studentDrafts[q.id]?.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleDraftChange(q.id, '');
                                  handleClearVerification(q.id);
                                }}
                                className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                              >
                                {isEn ? 'Clear' : 'مسح'}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleVerifyStudentAnswer(q.id, 'draft')}
                              disabled={!studentDrafts[q.id]?.trim()}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                                studentDrafts[q.id]?.trim()
                                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {t('verifyAnswerBtn')}
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={studentDrafts[q.id] || ''}
                          onChange={(e) => handleDraftChange(q.id, e.target.value)}
                          placeholder={isEn ? 'Type your draft or reasoning here to verify correctness...' : 'اكتب مسودتك أو خطواتك هنا للتحقق من صحتها وتدريب نفسك قبل الامتحان...'}
                          rows={3}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
                        />

                        {draftVerifications[q.id] && (
                          <div
                            className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 mt-2 ${
                              draftVerifications[q.id].isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-rose-50 border-rose-300 text-rose-950'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-sm flex items-center gap-1.5">
                                {draftVerifications[q.id].isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>
                                      {isEn
                                        ? `✓ Correct! (Match Score: ${draftVerifications[q.id].matchScore}%)`
                                        : `✓ إجابتك صحيحة ومطابقة! (نسبة التوافق: ${draftVerifications[q.id].matchScore}%)`}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <span>{isEn ? '✗ Needs revision / non-matching' : '✗ إجابتك غير مطابقة / خطأ'}</span>
                                  </>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleClearVerification(q.id)}
                                className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                              >
                                {t('close')}
                              </button>
                            </div>
                            <p className="leading-relaxed font-sans">{draftVerifications[q.id].feedback}</p>
                            <div className="pt-1.5 border-t border-slate-200 font-semibold text-slate-800">
                              {isEn ? 'Official Model Answer: ' : 'الإجابة النموذجية المعتمدة: '}
                              <span className="font-bold text-indigo-950">{q.correctAnswer}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Printed ruled paper area for physical exam */}
                      <div className="hidden print:block pt-2">
                        <div className="text-xs font-bold text-slate-800 mb-2">
                          {isEn ? 'Student Written Answer & Justification:' : 'إجابة الطالب والتعليل:'}
                        </div>
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
                          <span>{isEn ? 'Student Drafted Response:' : 'إجابة الطالب المدونة لهذا السؤال:'}</span>
                        </span>
                        {selfRatings[q.id] && (
                          <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            {isEn ? 'Self Rating: ' : 'التقييم الذاتي: '}
                            {selfRatings[q.id] === 'excellent' ? '⭐⭐⭐ Full Mark' : selfRatings[q.id] === 'good' ? '⭐⭐ Partial' : '⭐ Needs Work'}
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
                    <span className="font-semibold text-slate-500 print:text-slate-700">
                      {isEn ? 'Student Selection:' : 'اختيار الطالب:'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {isEn ? '[ Circle the correct option: A - B - C - D ]' : '[ ضع دائرة حول الحرف الصحيح: أ - ب - ج - د ]'}
                    </span>
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
                      <span>{t('correctAnswerLabel')}</span>
                    </div>
                    <div className="text-sm font-bold text-sky-900 leading-relaxed print:text-slate-950">
                      {q.correctAnswer}
                    </div>
                  </div>

                  {/* Educational Explanation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 print:border-slate-300">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500 print:text-slate-700" />
                      <span>{t('explanationLabel')}</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 print:text-slate-800">{q.explanation}</p>
                  </div>

                  {/* Rubric / Marking Criteria */}
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 print:bg-slate-50 print:border-slate-300">
                    <div className="flex items-center gap-1.5 font-bold mb-1 print:text-slate-900">
                      <Award className="w-3.5 h-3.5 text-amber-700 print:text-slate-700" />
                      <span>{t('rubricLabel')}</span>
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
      <div className="hidden print:flex justify-between items-center text-[10px] text-slate-600 pt-4 mt-6 border-t border-slate-400" dir={isEn ? "ltr" : "rtl"}>
        <div>{isEn ? 'Programming and AI Assistant — Prepared by: Ms. Hagar Mahmoud' : 'مساعد معلم مادة البرمجة والذكاء الاصطناعي — إعداد الأستاذة / هاجر محمود'}</div>
        <div>{isEn ? 'With our best wishes for excellence and success' : 'مع تمنياتنا لجميع الطلاب بالنجاح والتفوق الدراسي'}</div>
      </div>
    </section>
  );
};
