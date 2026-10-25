/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateCurriculumQuestions } from '../data/curriculumQuestionBank.ts';
import { GenerationRequest, GenerationResponse, QuestionBatch } from '../types.ts';
import { storageService } from './storageService.ts';

export const aiService = {
  async checkBackendStatus(): Promise<{ connected: boolean; hasApiKey: boolean; model: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return {
          connected: true,
          hasApiKey: !!data.hasApiKey,
          model: data.model || 'gemini-3.8-flash',
        };
      }
    } catch (e) {
      // Backend not reached
    }
    return {
      connected: false,
      hasApiKey: false,
      model: 'بنك الأسئلة المنهجي المعتمد',
    };
  },

  async generateQuestionsBatch(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      // Try real AI server endpoint first
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.questions) && result.questions.length > 0) {
          const batch: QuestionBatch = {
            id: `batch-${Date.now()}`,
            timestamp: new Date().toISOString(),
            chapterId: request.chapterId,
            chapterTitle: request.chapterTitle,
            lessonId: request.lessonId,
            lessonTitle: request.lessonTitle,
            questionType: request.questionType,
            thinkingLevel: request.thinkingLevel,
            questions: result.questions,
            generationSource: 'gemini-3.8-flash',
            engineNotice: result.engineNotice || 'تم التوليد بنجاح عبر نموذج Gemini 3.8 Flash.',
          };
          // Persist batch to history
          storageService.saveBatch(batch);

          return {
            success: true,
            questions: result.questions,
            generationSource: 'gemini-3.8-flash',
            engineNotice: result.engineNotice,
          };
        }
      }
    } catch (err) {
      console.warn('Backend API request error, falling back to curriculum question bank:', err);
    }

    // Fallback: Real educational curriculum generator
    const fallbackQuestions = generateCurriculumQuestions(
      request.chapterId,
      request.lessonId,
      request.questionType,
      request.thinkingLevel,
      request.lessonTitle
    );

    const fallbackBatch: QuestionBatch = {
      id: `batch-curriculum-${Date.now()}`,
      timestamp: new Date().toISOString(),
      chapterId: request.chapterId,
      chapterTitle: request.chapterTitle,
      lessonId: request.lessonId,
      lessonTitle: request.lessonTitle,
      questionType: request.questionType,
      thinkingLevel: request.thinkingLevel,
      questions: fallbackQuestions,
      generationSource: 'curriculum_bank',
      engineNotice: 'تم التوليد عبر بنك الأسئلة المنهجي المعتمد لوزارة التربية والتعليم (الصف الثاني بالبكالوريا).',
    };
    storageService.saveBatch(fallbackBatch);

    return {
      success: true,
      questions: fallbackQuestions,
      generationSource: 'curriculum_bank',
      engineNotice: 'تم إنشاء هذه الأسئلة من بنك الأسئلة المنهجي المعتمد للصف الثاني الثانوي.',
    };
  },
};
