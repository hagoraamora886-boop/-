/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Chapter, Lesson, QuestionBatch, QuestionItem, QuestionType, ThinkingLevel } from './types.ts';
import { storageService } from './services/storageService.ts';
import { aiService } from './services/aiService.ts';
import { Navbar } from './components/Navbar.tsx';
import { QuestionGenerator } from './components/QuestionGenerator.tsx';
import { QuestionsDisplay } from './components/QuestionsDisplay.tsx';
import { LessonLibrary } from './components/LessonLibrary.tsx';
import { LessonModal } from './components/LessonModal.tsx';
import { SavedBatchesView } from './components/SavedBatchesView.tsx';
import { CurriculumGuideView } from './components/CurriculumGuideView.tsx';
import { Sparkles, BookOpen, Layers, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'library' | 'saved' | 'curriculum'>('generator');
  
  // Data state
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [savedBatches, setSavedBatches] = useState<QuestionBatch[]>([]);

  // Generator selection state
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<QuestionType>('all');
  const [selectedLevel, setSelectedLevel] = useState<ThinkingLevel>('all');

  // Active question batch state
  const [currentQuestions, setCurrentQuestions] = useState<QuestionItem[]>([]);
  const [currentBatchMeta, setCurrentBatchMeta] = useState<{
    source: 'gemini-3.8-flash' | 'curriculum_bank';
    notice: string;
    chapterTitle: string;
    lessonTitle: string;
  } | null>(null);

  // Loading and system state
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    hasApiKey: false,
    model: 'gemini-3.8-flash',
  });
  const [isCurrentBatchSaved, setIsCurrentBatchSaved] = useState(false);

  // Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [libraryNotification, setLibraryNotification] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedChapters = storageService.getChapters();
    const loadedLessons = storageService.getLessons();
    const loadedSavedBatches = storageService.getSavedBatches();

    setChapters(loadedChapters);
    setLessons(loadedLessons);
    setSavedBatches(loadedSavedBatches);

    // Default select first chapter and lesson
    if (loadedChapters.length > 0) {
      setSelectedChapterId(loadedChapters[0].id);
      const firstLessonInCh = loadedLessons.find(l => l.chapterId === loadedChapters[0].id);
      if (firstLessonInCh) {
        setSelectedLessonId(firstLessonInCh.id);
      }
    }

    // Check backend health
    aiService.checkBackendStatus().then(status => {
      setBackendStatus(status);
    });

    // Generate initial initial batch automatically on first load so the teacher sees instant content
    if (loadedLessons.length > 0) {
      const initialLesson = loadedLessons[0];
      const initialChapter = loadedChapters[0];
      setIsGenerating(true);
      aiService.generateQuestionsBatch({
        chapterId: initialLesson.chapterId,
        chapterTitle: initialChapter ? initialChapter.title : 'الفصل الأول',
        lessonId: initialLesson.id,
        lessonTitle: initialLesson.title,
        lessonContent: initialLesson.content,
        questionType: 'all',
        thinkingLevel: 'all',
      }).then(res => {
        setIsGenerating(false);
        if (res.success && res.questions.length > 0) {
          setCurrentQuestions(res.questions);
          setCurrentBatchMeta({
            source: res.generationSource,
            notice: res.engineNotice,
            chapterTitle: initialChapter ? initialChapter.title : 'الفصل الأول',
            lessonTitle: initialLesson.title,
          });
        }
      });
    }
  }, []);

  // Handler: Generate a new batch of questions (without specifying question count!)
  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    setIsCurrentBatchSaved(false);

    // Resolve chapter title and lesson title
    let targetChapterTitle = 'كافة فصول المنهج';
    if (selectedChapterId !== 'all') {
      const ch = chapters.find(c => c.id === selectedChapterId);
      if (ch) targetChapterTitle = ch.title;
    }

    let targetLessonTitle = 'كافة موضوعات المقرر';
    let targetLessonContent = '';
    if (selectedLessonId !== 'all') {
      const les = lessons.find(l => l.id === selectedLessonId);
      if (les) {
        targetLessonTitle = les.title;
        targetLessonContent = les.content;
      }
    }

    try {
      const response = await aiService.generateQuestionsBatch({
        chapterId: selectedChapterId,
        chapterTitle: targetChapterTitle,
        lessonId: selectedLessonId,
        lessonTitle: targetLessonTitle,
        lessonContent: targetLessonContent,
        questionType: selectedType,
        thinkingLevel: selectedLevel,
      });

      if (response.success && response.questions.length > 0) {
        setCurrentQuestions(response.questions);
        setCurrentBatchMeta({
          source: response.generationSource,
          notice: response.engineNotice,
          chapterTitle: targetChapterTitle,
          lessonTitle: targetLessonTitle,
        });
        // Refresh saved batches from storage
        setSavedBatches(storageService.getSavedBatches());
      }
    } catch (err) {
      console.error('Error in handleGenerateBatch:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Save Lesson (Add or Edit)
  const handleSaveLesson = (lessonData: {
    title: string;
    chapterId: string;
    chapterTitle: string;
    content: string;
    keyConcepts: string[];
    codeExample?: string;
  }) => {
    if (editingLesson) {
      const updated = storageService.updateLesson(editingLesson.id, lessonData);
      if (updated) {
        setLessons(storageService.getLessons());
        setLibraryNotification(`تم تعديل الدرس «${lessonData.title}» وحفظه بنجاح.`);
      }
    } else {
      const created = storageService.addLesson(lessonData);
      setLessons(storageService.getLessons());
      setLibraryNotification(`تم إضافة الدرس الجديد «${lessonData.title}» وحفظه في المكتبة.`);
    }

    setTimeout(() => {
      setLibraryNotification(null);
    }, 4000);
  };

  // Handler: Delete Lesson
  const handleDeleteLesson = (id: string) => {
    const success = storageService.deleteLesson(id);
    if (success) {
      setLessons(storageService.getLessons());
      setLibraryNotification('تم حذف الدرس بنجاح من المكتبة.');
      setTimeout(() => setLibraryNotification(null), 3000);
    }
  };

  // Handler: Reset Lessons to defaults
  const handleResetLessons = () => {
    const defaults = storageService.resetLessonsToDefault();
    setLessons(defaults);
    setChapters(storageService.getChapters());
    setLibraryNotification('تمت استعادة دروس المنهج الرسمية الافتراضية.');
    setTimeout(() => setLibraryNotification(null), 3000);
  };

  // Handler: Select Lesson from library directly for generation
  const handleSelectLessonForGeneration = (chapterId: string, lessonId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedLessonId(lessonId);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Save current batch to saved batches
  const handleSaveCurrentBatch = () => {
    if (!currentBatchMeta || currentQuestions.length === 0) return;

    const newBatch: QuestionBatch = {
      id: `manual-saved-${Date.now()}`,
      timestamp: new Date().toISOString(),
      chapterId: selectedChapterId,
      chapterTitle: currentBatchMeta.chapterTitle,
      lessonId: selectedLessonId,
      lessonTitle: currentBatchMeta.lessonTitle,
      questionType: selectedType,
      thinkingLevel: selectedLevel,
      questions: currentQuestions,
      generationSource: currentBatchMeta.source,
      engineNotice: currentBatchMeta.notice,
    };

    storageService.saveBatch(newBatch);
    setSavedBatches(storageService.getSavedBatches());
    setIsCurrentBatchSaved(true);
  };

  // Handler: Load saved batch
  const handleLoadSavedBatch = (batch: QuestionBatch) => {
    setCurrentQuestions(batch.questions);
    setCurrentBatchMeta({
      source: batch.generationSource,
      notice: batch.engineNotice,
      chapterTitle: batch.chapterTitle,
      lessonTitle: batch.lessonTitle,
    });
    setSelectedChapterId(batch.chapterId);
    setSelectedLessonId(batch.lessonId);
    setSelectedType(batch.questionType);
    setSelectedLevel(batch.thinkingLevel);
    setIsCurrentBatchSaved(true);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Delete saved batch
  const handleDeleteSavedBatch = (batchId: string) => {
    storageService.deleteBatch(batchId);
    setSavedBatches(storageService.getSavedBatches());
  };

  // Handler: Export data JSON
  const handleExportData = () => {
    const jsonStr = storageService.exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `programming_ai_assistant_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handler: Import data JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const res = storageService.importDataFromJson(text);
        if (res.success) {
          setLessons(storageService.getLessons());
          setChapters(storageService.getChapters());
          setSavedBatches(storageService.getSavedBatches());
          setLibraryNotification(`تم استيراد ${res.count || 0} درساً بنجاح إلى المكتبة.`);
          setTimeout(() => setLibraryNotification(null), 4000);
        } else {
          alert(res.error || 'فشل استيراد الملف');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white print:bg-white print:min-h-0" dir="rtl">
      {/* 1. Header with Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewLessonModal={() => {
          setEditingLesson(null);
          setIsLessonModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        {/* TAB 1: GENERATOR & QUESTIONS DISPLAY */}
        {activeTab === 'generator' && (
          <div className="space-y-6 print:space-y-0">
            {/* Student Welcome & Innovation Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border border-slate-800 shadow-md print:hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-sky-500/20 border border-indigo-400/30 text-xs font-semibold text-sky-300">
                      <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                      <span>منصة التفوق — الصف الثاني الثانوي بالبكالوريا المصرية</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/25 to-pink-500/20 border border-purple-400/40 text-xs font-bold text-purple-200 shadow-sm">
                      <span>✨ إعداد سفيرة البرمجة أ/ هاجر محمود</span>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    منصة البرمجة والذكاء الاصطناعي التفاعلية
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    منظومة تفاعلية تجمع بين معايير وزارة التربية والتعليم المصرية ونماذج الذكاء الاصطناعي للتدريب العملي، حل المشكلات والسيناريوهات التقنية، وتصدير نماذج الاختبارات والتقييم المعتمدة.
                  </p>
                </div>

                {/* 3 Quick Student Feature Badges */}
                <div className="grid grid-cols-3 gap-2.5 self-stretch lg:self-auto sm:min-w-[300px]">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                    <div className="text-indigo-400 font-extrabold text-base font-mono">12+</div>
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">دروس المنهج</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                    <div className="text-sky-400 font-extrabold text-base font-mono">100%</div>
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">مواصفات الوزارة</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                    <div className="text-emerald-400 font-extrabold text-base font-mono">AI</div>
                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">تدريب تفاعلي</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Generator Card */}
            <QuestionGenerator
              chapters={chapters}
              lessons={lessons}
              selectedChapterId={selectedChapterId}
              selectedLessonId={selectedLessonId}
              selectedType={selectedType}
              selectedLevel={selectedLevel}
              isGenerating={isGenerating}
              engineStatus={backendStatus}
              onSelectChapter={setSelectedChapterId}
              onSelectLesson={setSelectedLessonId}
              onSelectType={setSelectedType}
              onSelectLevel={setSelectedLevel}
              onGenerateBatch={handleGenerateBatch}
            />

            {/* Questions, Answers & Explanations Display */}
            {currentQuestions.length > 0 ? (
              <QuestionsDisplay
                questions={currentQuestions}
                generationSource={currentBatchMeta?.source}
                engineNotice={currentBatchMeta?.notice}
                chapterTitle={currentBatchMeta?.chapterTitle || 'الفصل المحدد'}
                lessonTitle={currentBatchMeta?.lessonTitle || 'الدرس المستهدف'}
                onSaveToSavedBatches={handleSaveCurrentBatch}
                isSaved={isCurrentBatchSaved}
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">اضغط على زر «إنشاء دفعة جديدة من الأسئلة» أعلاه</p>
                <p className="text-xs text-slate-400 mt-1">
                  سيتم توليد باقة متكاملة من الأسئلة ونموذج الإجابة والتفسيرات الأكاديمية فوراً
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LESSON LIBRARY */}
        {activeTab === 'library' && (
          <LessonLibrary
            chapters={chapters}
            lessons={lessons}
            onOpenNewLessonModal={() => {
              setEditingLesson(null);
              setIsLessonModalOpen(true);
            }}
            onEditLesson={(les) => {
              setEditingLesson(les);
              setIsLessonModalOpen(true);
            }}
            onDeleteLesson={handleDeleteLesson}
            onResetLessons={handleResetLessons}
            onSelectLessonForGeneration={handleSelectLessonForGeneration}
            onExportData={handleExportData}
            onImportData={handleImportData}
            notificationMessage={libraryNotification}
          />
        )}

        {/* TAB 3: SAVED BATCHES */}
        {activeTab === 'saved' && (
          <SavedBatchesView
            savedBatches={savedBatches}
            onLoadBatch={handleLoadSavedBatch}
            onDeleteBatch={handleDeleteSavedBatch}
          />
        )}

        {/* TAB 4: CURRICULUM SPECIFICATIONS GUIDE */}
        {activeTab === 'curriculum' && <CurriculumGuideView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">مساعد البرمجة والذكاء الاصطناعي</span>
            <span aria-hidden="true">·</span>
            <span>الصف الثاني بالبكالوريا المصرية</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>منهج معتمد لوزارة التربية والتعليم والتعليم الفني</span>
            <span aria-hidden="true">·</span>
            <span>تكنولوجيا المعلومات وتطبيقات الويب والذكاء الاصطناعي</span>
          </div>
        </div>
      </footer>

      {/* Lesson Add/Edit Modal */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
        editingLesson={editingLesson}
        chapters={chapters}
      />
    </div>
  );
}
