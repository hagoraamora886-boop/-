/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
  });
});

// AI Question Generation endpoint
app.post('/api/generate-questions', async (req, res) => {
  const {
    chapterTitle,
    lessonTitle,
    lessonContent,
    questionType,
    thinkingLevel,
  } = req.body;

  if (!chapterTitle || !lessonTitle) {
    return res.status(400).json({
      success: false,
      error: 'يرجى تحديد الفصل والدرس المطلوب إنشاء الأسئلة لهما.',
    });
  }

  // If no Gemini API key or client is available, inform client to use curriculum bank
  if (!aiClient || !process.env.GEMINI_API_KEY) {
    return res.json({
      success: false,
      error: 'مفتاح Gemini API غير مهيأ حالياً في الخادم. سيتم التحويل تلقائياً لمحرك بنك الأسئلة المنهجي المعتمد.',
      fallbackAvailable: true,
    });
  }

  try {
    const typeDescription =
      questionType === 'mcq'
        ? 'اختيار من متعدد (MCQ) بأربعة خيارات دقيقة'
        : questionType === 'true_false'
        ? 'صواب أو خطأ مع تعليل علمي دقيق'
        : questionType === 'code_trace'
        ? 'تتبع كود بايثون واكتشاف الخطأ أو ناتج التنفيذ'
        : questionType === 'short_answer'
        ? 'أسئلة مقالية وتطبيقية وحل مشكلات برمجية'
        : 'مزيج متنوع ومتوازن من: اختيار من متعدد، صواب وخطأ مع تعليل، تتبع كود بايثون، وأسئلة مقالية تحليلية';

    const levelDescription =
      thinkingLevel === 'remembering'
        ? 'مستوى التذكر والفهم واسترجاع المفاهيم البرمجية الأساسية'
        : thinkingLevel === 'applying'
        ? 'مستوى التطبيق والتحليل وكتابة وتتبع مقاطع بايثون'
        : thinkingLevel === 'evaluating'
        ? 'مستوى التقويم والابتكار واكتشاف الثغرات وتصميم النماذج الذكية (مستويات تفكير عليا)'
        : 'مستويات تفكير متدرجة وشاملة (تذكر، تطبيق، تقويم نَقدي)';

    const prompt = `أنت موجه أول لمادة «البرمجة والذكاء الاصطناعي» للصف الثاني الثانوي بالبكالوريا المصرية.
قم بإنشاء دفعة ممتازة ومكتملة من الأسئلة الامتحانية الجديدة (ما بين 4 إلى 5 أسئلة متنوعة) تتوافق تماماً مع مواصفات الورقة الامتحانية المصرية.

بيانات الدرس المستهدف:
- الفصل الدراسي: ${chapterTitle}
- عنوان الدرس: ${lessonTitle}
${lessonContent ? `- نص ومحتوى الدرس:\n"""\n${lessonContent.slice(0, 2000)}\n"""` : ''}

المعايير المحددة للدفعة:
- نوع الأسئلة المطلوب: ${typeDescription}
- مستوى التفكير المطلوب: ${levelDescription}

شروط إلزامية في صياغة الأسئلة:
1. صياغة باللغة العربية الفصحى السليمة مع مصطلحات بايثون والذكاء الاصطناعي المعتمدة.
2. لكل سؤال، اكتب الإجابة النموذجية الكاملة والتفسير التعليمي المفصل (Explanation) ومعيار توزيع الدرجات (Rubric Criteria).
3. في أسئلة تتبع الكود البرمجي (code_trace)، اكتب مقطع كود بايثون حقيقي صالح للتنفيذ في حقل codeSnippet.
4. في أسئلة الاختيار من متعدد، وفر 4 خيارات واضحة، وخيار واحد فقط صحيح وغير قابل للجدل.
5. لا تشمل أي إشارة إلى أرقام الصفحات أو المراجع المجهولة.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'أنت معلم وموجّه خبير في مادة البرمجة والذكاء الاصطناعي لطلاب البكالوريا المصرية. أخرج النتائج حصراً كصيغة JSON تطابق الـ Schema المحددة دون أي مقدمات نصية.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'قائمة الأسئلة المنشأة',
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: 'نوع السؤال: mcq أو true_false أو code_trace أو short_answer',
              },
              thinkingLevel: {
                type: Type.STRING,
                description: 'مستوى التفكير: remembering أو applying أو evaluating',
              },
              question: {
                type: Type.STRING,
                description: 'نص السؤال كاملاً باللغة العربية',
              },
              codeSnippet: {
                type: Type.STRING,
                description: 'مقطع كود بايثون اختياري إذا كان السؤال يتضمن تتبعاً أو تصحيح كود',
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'قائمة الخيارات الأربعة لأسئلة الاختيار من متعدد',
              },
              correctAnswer: {
                type: Type.STRING,
                description: 'الإجابة النموذجية الدقيقة للسؤال',
              },
              explanation: {
                type: Type.STRING,
                description: 'الشرح والتحليل العلمي والتفسير التربوي للإجابة',
              },
              rubricCriteria: {
                type: Type.STRING,
                description: 'معيار تقييم المعلم وتوزيع الدرجة',
              },
            },
            required: ['type', 'thinkingLevel', 'question', 'correctAnswer', 'explanation', 'rubricCriteria'],
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('لم يتم استلام نص من نموذج الذكاء الاصطناعي');
    }

    const parsedQuestions = JSON.parse(textOutput);
    const formattedQuestions = parsedQuestions.map((q: any, idx: number) => ({
      id: `ai-${Date.now()}-${idx + 1}`,
      type: q.type || 'short_answer',
      thinkingLevel: q.thinkingLevel || 'applying',
      question: q.question,
      codeSnippet: q.codeSnippet || undefined,
      options: Array.isArray(q.options) && q.options.length > 0 ? q.options : undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      rubricCriteria: q.rubricCriteria,
      chapterId: req.body.chapterId || 'ch-1',
      lessonId: req.body.lessonId || 'les-1',
    }));

    return res.json({
      success: true,
      questions: formattedQuestions,
      generationSource: 'gemini-3.8-flash',
      engineNotice: 'تم توليد هذه الدفعة مباشرة بواسطة نموذج الذكاء الاصطناعي (Gemini 3.8 Flash) استناداً لمفردات الدرس المحددة.',
    });
  } catch (err: any) {
    console.error('Gemini generation error:', err);
    return res.json({
      success: false,
      error: `حدث خطأ أثناء معالجة الذكاء الاصطناعي: ${err?.message || 'تعذر الاتصال بالنموذج'}. يمكنك استخدام بنك الأسئلة المنهجي المعتمد.`,
      fallbackAvailable: true,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
