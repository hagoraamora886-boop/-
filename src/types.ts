/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'all' | 'mcq' | 'true_false' | 'code_trace' | 'short_answer';

export type ThinkingLevel = 'all' | 'remembering' | 'applying' | 'evaluating';

export interface QuestionItem {
  id: string;
  type: 'mcq' | 'true_false' | 'code_trace' | 'short_answer';
  thinkingLevel: 'remembering' | 'applying' | 'evaluating';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  rubricCriteria: string;
  chapterId: string;
  lessonId: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapterId: string;
  chapterTitle: string;
  content: string;
  keyConcepts: string[];
  codeExample?: string;
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface QuestionBatch {
  id: string;
  timestamp: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  questionType: QuestionType;
  thinkingLevel: ThinkingLevel;
  questions: QuestionItem[];
  generationSource: 'gemini-3.8-flash' | 'curriculum_bank';
  engineNotice: string;
}

export interface GenerationRequest {
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonContent?: string;
  questionType: QuestionType;
  thinkingLevel: ThinkingLevel;
}

export interface GenerationResponse {
  success: boolean;
  questions: QuestionItem[];
  generationSource: 'gemini-3.8-flash' | 'curriculum_bank';
  engineNotice: string;
  error?: string;
}
