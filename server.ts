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
    language = 'ar',
  } = req.body;

  const isEn = language === 'en';

  if (!chapterTitle || !lessonTitle) {
    return res.status(400).json({
      success: false,
      error: isEn
        ? 'Please select both the curriculum unit and lesson.'
        : 'يرجى تحديد الفصل والدرس المطلوب إنشاء الأسئلة لهما.',
    });
  }

  // If no Gemini API key or client is available, inform client to use curriculum bank
  if (!aiClient || !process.env.GEMINI_API_KEY) {
    return res.json({
      success: false,
      error: isEn
        ? 'Gemini API key is not configured. Falling back to the accredited curriculum question bank.'
        : 'مفتاح Gemini API غير مهيأ حالياً في الخادم. سيتم التحويل تلقائياً لمحرك بنك الأسئلة المنهجي المعتمد.',
      fallbackAvailable: true,
    });
  }

  try {
    let typeDescription = '';
    let levelDescription = '';
    let prompt = '';
    let systemInstruction = '';

    if (isEn) {
      typeDescription =
        questionType === 'mcq'
          ? 'Multiple Choice Questions (MCQ) with 4 precise, unambiguous options'
          : questionType === 'true_false'
          ? 'True or False with scientific justification'
          : questionType === 'short_answer'
          ? 'Essay questions, analytical scenarios, and technological problem-solving'
          : 'A balanced mix of Multiple Choice (MCQ), True/False with justification, and analytical essay/scenario questions';

      levelDescription =
        thinkingLevel === 'remembering'
          ? 'Remembering and understanding fundamental concepts, definitions, and principles'
          : thinkingLevel === 'applying'
          ? 'Applying, analyzing, comparing technologies, and evaluating real-world scenarios'
          : thinkingLevel === 'evaluating'
          ? 'Evaluating, innovation, security flaw detection, and system critique (Higher-Order Thinking)'
          : 'Progressive cognitive levels (Remembering, Applying, and Critical Evaluation)';

      prompt = `You are a Senior Exam Inspector and Chief Author for the official Egyptian Ministry of Education subject "Programming and Artificial Intelligence" for Secondary Grade 11 (Egyptian Baccalaureate - Language Schools).
Generate an excellent, rigorous examination batch (4 to 5 distinct questions) fully compliant with official Egyptian Ministry specifications for Language Schools.

Target Lesson Information:
- Unit / Chapter: ${chapterTitle}
- Lesson Title: ${lessonTitle}
${lessonContent ? `- Lesson Content Reference:\n"""\n${lessonContent.slice(0, 2000)}\n"""` : ''}

Exam Batch Criteria:
- Question Type: ${typeDescription}
- Cognitive Thinking Level: ${levelDescription}

STRICT MANDATORY RULES:
1. STRICTLY FORBIDDEN: Do NOT write any questions about Python programming language, Python syntax, or Python code tracing. Python has been completely removed from this grade's syllabus. The curriculum covers ONLY: Information Technology & Society, Artificial Intelligence, Cybersecurity & Cryptography, Web Applications Architecture, and Web & Media Design.
2. All questions, options, answers, explanations, and grading rubrics MUST be written in fluent, grammatically correct academic English suitable for Egyptian Language School students.
3. For each question, provide:
   - Full accurate Model Answer
   - Detailed Educational Explanation
   - Teacher Rubric Criteria with marks breakdown
4. For MCQ questions, provide exactly 4 clear options (A, B, C, D) with one indisputably correct answer.
5. Do not include random page numbers or unverified external citations.`;

      systemInstruction =
        'You are an expert exam author and senior inspector for Egyptian Language Schools (Secondary Grade 11 - Programming and AI). Strictly FORBID Python syntax and questions. Focus strictly on IT & AI concepts, Cybersecurity, Web Applications, and Web Design. Output strictly JSON matching the specified schema.';
    } else {
      typeDescription =
        questionType === 'mcq'
          ? 'اختيار من متعدد (MCQ) بأربعة خيارات دقيقة'
          : questionType === 'true_false'
          ? 'صواب أو خطأ مع تعليل علمي دقيق'
          : questionType === 'short_answer'
          ? 'أسئلة مقالية وتطبيقية وتحليل سيناريوهات حل مشكلات تكنولوجية'
          : 'مزيج متنوع ومتوازن من: اختيار من متعدد (MCQ)، صواب وخطأ مع تعليل، وأسئلة مقالية تحليلية منهجية';

      levelDescription =
        thinkingLevel === 'remembering'
          ? 'مستوى التذكر والفهم واسترجاع المفاهيم والمعايير الأساسية'
          : thinkingLevel === 'applying'
          ? 'مستوى التطبيق والتحليل ومقارنة التقنيات وتحليل السيناريوهات'
          : thinkingLevel === 'evaluating'
          ? 'مستوى التقويم والابتكار واكتشاف الثغرات وتصميم الحلول ونقد النماذج (مستويات تفكير عليا)'
          : 'مستويات تفكير متدرجة وشاملة (تذكر، تطبيق، تقويم نَقدي)';

      prompt = `أنت موجه أول لمادة «البرمجة والذكاء الاصطناعي» للصف الثاني الثانوي بالبكالوريا المصرية.
قم بإنشاء دفعة ممتازة ومكتملة من الأسئلة الامتحانية الجديدة (ما بين 4 إلى 5 أسئلة متنوعة) تتوافق تماماً مع مواصفات الورقة الامتحانية المصرية الرسمية.

بيانات الدرس المستهدف:
- الفصل الدراسي: ${chapterTitle}
- عنوان الدرس: ${lessonTitle}
${lessonContent ? `- نص ومحتوى الدرس:\n"""\n${lessonContent.slice(0, 2000)}\n"""` : ''}

المعايير المحددة للدفعة:
- نوع الأسئلة المطلوب: ${typeDescription}
- مستوى التفكير المطلوب: ${levelDescription}

شروط إلزامية صارمة:
1. ممنوع نهائياً ومطلقاً كتابة أي أسئلة عن لغة بايثون (Python) أو طلب تتبع أكواد بايثون، فمنهج الصف الثاني الثانوي يركز حصراً على (تكنولوجيا المعلومات والذكاء الاصطناعي، الأمن السيبراني والتشفير، تطبيقات الويب وهيكليتها، وتصميم الوسائط والمواقع).
2. صياغة باللغة العربية الفصحى السليمة مع المصطلحات العلمية المعتمدة في كتاب الوزارة.
3. لكل سؤال، اكتب الإجابة النموذجية الكاملة والتفسير التعليمي المفصل (Explanation) ومعيار توزيع الدرجات (Rubric Criteria).
4. في أسئلة الاختيار من متعدد، وفر 4 خيارات واضحة، وخيار واحد فقط صحيح وغير قابل للجدل.
5. لا تشمل أي إشارة إلى أرقام الصفحات أو المراجع المجهولة.`;

      systemInstruction =
        'أنت معلم وموجّه خبير في مادة البرمجة والذكاء الاصطناعي لطلاب البكالوريا المصرية. يُمنع منعاً باتاً وبشكل قاطع توليد أي أسئلة أو أكواد تتعلق بلغة بايثون Python. الأسئلة يجب أن تدور حصراً حول موضوعات المنهج المعتمد (تكنولوجيا المعلومات والمجتمع، الذكاء الاصطناعي، الأمن السيبراني، تطبيقات وتصميم الويب). أخرج النتائج حصراً كصيغة JSON تطابق الـ Schema المحددة دون أي مقدمات نصية.';
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: isEn ? 'List of generated exam questions' : 'قائمة الأسئلة المنشأة',
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: 'Question type: mcq, true_false, or short_answer',
              },
              thinkingLevel: {
                type: Type.STRING,
                description: 'Cognitive level: remembering, applying, or evaluating',
              },
              question: {
                type: Type.STRING,
                description: isEn ? 'The full text of the question in English' : 'نص السؤال كاملاً باللغة العربية',
              },
              codeSnippet: {
                type: Type.STRING,
                description: isEn
                  ? 'Optional technical snippet, scenario or web architecture snippet (NO Python)'
                  : 'مقطع كود أو سيناريو تطبيقي اختياري من موضوعات الويب أو الشبكات إذا تطلب السؤال ذلك (بدون بايثون)',
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: isEn ? 'List of 4 options for MCQ questions' : 'قائمة الخيارات الأربعة لأسئلة الاختيار من متعدد',
              },
              correctAnswer: {
                type: Type.STRING,
                description: isEn ? 'Accurate model answer' : 'الإجابة النموذجية الدقيقة للسؤال',
              },
              explanation: {
                type: Type.STRING,
                description: isEn ? 'Scientific and educational explanation' : 'الشرح والتحليل العلمي والتفسير التربوي للإجابة',
              },
              rubricCriteria: {
                type: Type.STRING,
                description: isEn ? 'Grading criteria and mark allocation' : 'معيار تقييم المعلم وتوزيع الدرجة',
              },
            },
            required: ['type', 'thinkingLevel', 'question', 'correctAnswer', 'explanation', 'rubricCriteria'],
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error(isEn ? 'No response received from AI model' : 'لم يتم استلام نص من نموذج الذكاء الاصطناعي');
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
      language: language as 'ar' | 'en',
    }));

    return res.json({
      success: true,
      questions: formattedQuestions,
      generationSource: 'gemini-3.8-flash',
      language,
      engineNotice: isEn
        ? 'Generated live via Gemini 3.8 Flash following official Egyptian Ministry specs for Language Schools.'
        : 'تم توليد هذه الدفعة مباشرة بواسطة نموذج الذكاء الاصطناعي (Gemini 3.8 Flash) استناداً لمفردات الدرس المحددة.',
    });
  } catch (err: any) {
    console.error('Gemini generation error:', err);
    return res.json({
      success: false,
      error: isEn
        ? `AI generation error: ${err?.message || 'Unable to reach model'}. Falling back to accredited curriculum bank.`
        : `حدث خطأ أثناء معالجة الذكاء الاصطناعي: ${err?.message || 'تعذر الاتصال بالنموذج'}. يمكنك استخدام بنك الأسئلة المنهجي المعتمد.`,
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
