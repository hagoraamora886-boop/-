/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_CHAPTERS, DEFAULT_LESSONS } from '../data/defaultLessons.ts';
import { Chapter, Lesson, QuestionBatch } from '../types.ts';

const LESSONS_STORAGE_KEY = 'ai_programming_assistant_lessons_v3_curriculum_nopy';
const CHAPTERS_STORAGE_KEY = 'ai_programming_assistant_chapters_v3_curriculum';
const SAVED_BATCHES_STORAGE_KEY = 'ai_programming_assistant_saved_batches_v3';

export const storageService = {
  // Lessons
  getLessons(): Lesson[] {
    try {
      const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Check migration from previous storage versions to retain any user-created custom lessons
      const prevStored = localStorage.getItem('ai_programming_assistant_lessons_v2_textbook') ||
        localStorage.getItem('ai_programming_assistant_lessons_v1');
      if (prevStored) {
        const prevParsed = JSON.parse(prevStored);
        if (Array.isArray(prevParsed)) {
          const userCustomLessons = prevParsed.filter((l: Lesson) => l.isCustom);
          const combined = [...userCustomLessons, ...DEFAULT_LESSONS];
          this.saveLessons(combined);
          return combined;
        }
      }
    } catch (e) {
      console.error('Error reading lessons from localStorage:', e);
    }
    // Default fallback
    this.saveLessons(DEFAULT_LESSONS);
    return DEFAULT_LESSONS;
  },

  saveLessons(lessons: Lesson[]): void {
    try {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
    } catch (e) {
      console.error('Error saving lessons to localStorage:', e);
    }
  },

  addLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Lesson {
    const current = this.getLessons();
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newLesson, ...current];
    this.saveLessons(updated);
    return newLesson;
  },

  updateLesson(id: string, updates: Partial<Omit<Lesson, 'id' | 'createdAt'>>): Lesson | null {
    const current = this.getLessons();
    const index = current.findIndex(l => l.id === id);
    if (index === -1) return null;

    const updatedLesson: Lesson = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    current[index] = updatedLesson;
    this.saveLessons(current);
    return updatedLesson;
  },

  deleteLesson(id: string): boolean {
    const current = this.getLessons();
    const filtered = current.filter(l => l.id !== id);
    if (filtered.length !== current.length) {
      this.saveLessons(filtered);
      return true;
    }
    return false;
  },

  resetLessonsToDefault(): Lesson[] {
    this.saveLessons(DEFAULT_LESSONS);
    this.saveChapters(DEFAULT_CHAPTERS);
    return DEFAULT_LESSONS;
  },

  // Chapters
  getChapters(): Chapter[] {
    try {
      const stored = localStorage.getItem(CHAPTERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading chapters from localStorage:', e);
    }
    this.saveChapters(DEFAULT_CHAPTERS);
    return DEFAULT_CHAPTERS;
  },

  saveChapters(chapters: Chapter[]): void {
    try {
      localStorage.setItem(CHAPTERS_STORAGE_KEY, JSON.stringify(chapters));
    } catch (e) {
      console.error('Error saving chapters to localStorage:', e);
    }
  },

  addChapter(title: string, description: string): Chapter {
    const chapters = this.getChapters();
    const newChapter: Chapter = {
      id: `ch-custom-${Date.now()}`,
      title,
      description,
      order: chapters.length + 1,
    };
    const updated = [...chapters, newChapter];
    this.saveChapters(updated);
    return newChapter;
  },

  // Saved Question Batches / Exams
  getSavedBatches(): QuestionBatch[] {
    try {
      const stored = localStorage.getItem(SAVED_BATCHES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading saved batches from localStorage:', e);
    }
    return [];
  },

  saveBatch(batch: QuestionBatch): void {
    try {
      const current = this.getSavedBatches();
      const updated = [batch, ...current];
      // Keep up to 20 batches
      localStorage.setItem(SAVED_BATCHES_STORAGE_KEY, JSON.stringify(updated.slice(0, 20)));
    } catch (e) {
      console.error('Error saving batch to localStorage:', e);
    }
  },

  deleteBatch(batchId: string): void {
    try {
      const current = this.getSavedBatches();
      const updated = current.filter(b => b.id !== batchId);
      localStorage.setItem(SAVED_BATCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting batch:', e);
    }
  },

  // Export / Import
  exportDataAsJson(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      lessons: this.getLessons(),
      chapters: this.getChapters(),
      savedBatches: this.getSavedBatches(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDataFromJson(jsonStr: string): { success: boolean; count?: number; error?: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || !Array.isArray(data.lessons)) {
        return { success: false, error: 'الملف لا يحتوي على صيغة دروس صحيحة' };
      }
      this.saveLessons(data.lessons);
      if (Array.isArray(data.chapters) && data.chapters.length > 0) {
        this.saveChapters(data.chapters);
      }
      if (Array.isArray(data.savedBatches)) {
        localStorage.setItem(SAVED_BATCHES_STORAGE_KEY, JSON.stringify(data.savedBatches));
      }
      return { success: true, count: data.lessons.length };
    } catch (e) {
      return { success: false, error: 'تعذر قراءة ملف JSON' };
    }
  }
};
