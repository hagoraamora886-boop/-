/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-ignore
import html2pdf from 'html2pdf.js';
import { QuestionItem } from '../types.ts';

interface ExportPdfOptions {
  questions: QuestionItem[];
  chapterTitle: string;
  lessonTitle: string;
  viewMode: 'teacher' | 'exam' | 'student';
  teacherName?: string;
}

export const pdfExportService = {
  async downloadQuestionsPdf({
    questions,
    chapterTitle,
    lessonTitle,
    viewMode,
    teacherName = 'الأستاذة / هاجر محمود',
  }: ExportPdfOptions): Promise<void> {
    const isTeacherMode = viewMode === 'teacher';
    const cleanChapter = (chapterTitle || 'المنهج').replace(/[\s/\\?%*:|"<>]+/g, '_');
    const cleanLesson = (lessonTitle || 'الدرس').replace(/[\s/\\?%*:|"<>]+/g, '_');
    const modeLabel = isTeacherMode ? 'نموذج_إجابة_المعلم' : 'ورقة_أسئلة_الطالب';
    const fileName = `اختبار_${cleanChapter}_${cleanLesson}_${modeLabel}.pdf`;

    // 1. Create a pristine container detached from current viewport
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // Standard A4 width at 96 DPI
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.direction = 'rtl';
    container.style.fontFamily = "'IBM Plex Sans Arabic', 'Tajawal', sans-serif";
    container.style.padding = '32px 36px';
    container.style.boxSizing = 'border-box';
    container.style.lineHeight = '1.6';

    // Helper functions for labels
    const getTypeLabel = (type: QuestionItem['type']) => {
      switch (type) {
        case 'mcq':
          return 'اختيار من متعدد (MCQ)';
        case 'true_false':
          return 'صواب أو خطأ مع التعليل';
        case 'code_trace':
          return 'تتبع كود بايثون واكتشاف الأخطاء';
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
          return 'مستوى التقويم والابتكار (تفكير عليا)';
        default:
          return 'مستوى شامل';
      }
    };

    // 2. Build HTML Content
    const headerHtml = `
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: bold; color: #0f172a;">جمهورية مصر العربية</div>
            <div style="font-size: 12px; font-weight: 600; color: #334155;">وزارة التربية والتعليم والتعليم الفني</div>
            <div style="font-size: 11px; color: #64748b;">قطاع التعليم العام — مادة البرمجة والذكاء الاصطناعي</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              ${isTeacherMode ? 'نموذج الإجابة ودليل التقييم الرسمي' : 'ورقة اختبار وتقييم تحصيلي'}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #475569;">
              الصف الثاني الثانوي (البكالوريا المصرية)
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              العام الدراسي 2026 / 2027
            </div>
          </div>
          <div style="text-align: left; font-size: 11px; color: #334155;">
            <div><strong>الدرجة الكلية:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp; / 20 ]</div>
            <div><strong>الزمن المقترح:</strong> 45 دقيقة</div>
            <div><strong>النمط:</strong> ${isTeacherMode ? 'نموذج المعلم' : 'ورقة الطالب'}</div>
          </div>
        </div>

        ${
          !isTeacherMode
            ? `
          <div style="display: flex; justify-content: space-between; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 14px; margin-bottom: 12px;">
            <div><strong>اسم الطالب:</strong> .....................................................</div>
            <div><strong>رقم الجلوس / الفصل:</strong> ...................</div>
            <div><strong>التاريخ:</strong> ..... / ..... / 2026 م</div>
          </div>
        `
            : ''
        }

        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #334155;">
          <div><strong>المجال / الفصل:</strong> ${chapterTitle}</div>
          <div><strong>موضوع التقييم:</strong> ${lessonTitle}</div>
          <div><strong>إجمالي الأسئلة:</strong> ${questions.length} سؤال</div>
        </div>
      </div>
    `;

    const questionsHtml = questions
      .map((q, idx) => {
        let codeSnippetHtml = '';
        if (q.codeSnippet) {
          codeSnippetHtml = `
            <div style="margin-top: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; direction: ltr; text-align: left; white-space: pre-wrap; color: #0f172a;">
              <div style="font-weight: 600; color: #475569; font-size: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;"># Python Code</div>
              <code>${q.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
            </div>
          `;
        }

        let optionsHtml = '';
        if (q.options && q.options.length > 0) {
          optionsHtml = `
            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
              ${q.options
                .map((opt, optIdx) => {
                  const letter = ['أ', 'ب', 'ج', 'د'][optIdx] || `${optIdx + 1}`;
                  const isCorrect = isTeacherMode && opt === q.correctAnswer;
                  return `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 7px 12px; border: 1px solid ${
                      isCorrect ? '#10b981' : '#e2e8f0'
                    }; background: ${
                    isCorrect ? '#ecfdf5' : '#ffffff'
                  }; border-radius: 6px; font-size: 12px;">
                      <span style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; font-weight: bold; font-size: 11px; background: ${
                        isCorrect ? '#10b981' : '#f1f5f9'
                      }; color: ${isCorrect ? '#ffffff' : '#334155'};">
                        ${letter}
                      </span>
                      <span style="flex: 1; color: #0f172a;">${opt}</span>
                      ${
                        isCorrect
                          ? `<span style="font-weight: bold; color: #047857; font-size: 11px;">(الإجابة الصحيحة)</span>`
                          : ''
                      }
                    </div>
                  `;
                })
                .join('')}
            </div>
          `;
        }

        let studentAnswerSpaceHtml = '';
        if (!isTeacherMode) {
          studentAnswerSpaceHtml = `
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b;">
              <div style="font-weight: 600; margin-bottom: 6px;">إجابة الطالب / خطوات الحل:</div>
              <div style="height: 60px; border: 1px dashed #cbd5e1; border-radius: 6px; background: #fafafa;"></div>
            </div>
          `;
        }

        let teacherSolutionHtml = '';
        if (isTeacherMode) {
          teacherSolutionHtml = `
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 12px; font-size: 12px;">
                <div style="font-weight: bold; color: #166534; font-size: 11px; margin-bottom: 3px;">✓ الإجابة النموذجية المعتمدة:</div>
                <div style="color: #14532d; font-weight: 600;">${q.correctAnswer}</div>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 11px;">
                <div style="font-weight: bold; color: #334155; margin-bottom: 3px;">التفسير والتحليل التربوي:</div>
                <div style="color: #475569; line-height: 1.5;">${q.explanation}</div>
              </div>
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 12px; font-size: 11px;">
                <div style="font-weight: bold; color: #92400e; margin-bottom: 3px;">معيار الدرجة (Rubric):</div>
                <div style="color: #78350f;">${q.rubricCriteria}</div>
              </div>
            </div>
          `;
        }

        return `
          <div style="page-break-inside: avoid; break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; background: #ffffff;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; background: #0f172a; color: #ffffff; font-weight: bold; font-size: 12px;">
                  ${idx + 1}
                </span>
                <span style="font-size: 11px; font-weight: 600; color: #334155;">
                  ${getTypeLabel(q.type)} &nbsp;·&nbsp; ${getLevelLabel(q.thinkingLevel)}
                </span>
              </div>
              <div style="font-size: 11px; font-weight: bold; color: #475569;">
                [ درجتان ]
              </div>
            </div>

            <div style="font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.6;">
              ${q.question}
            </div>

            ${codeSnippetHtml}
            ${optionsHtml}
            ${studentAnswerSpaceHtml}
            ${teacherSolutionHtml}
          </div>
        `;
      })
      .join('');

    const footerHtml = `
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
        <div>مساعد معلم البرمجة والذكاء الاصطناعي — إعداد ${teacherName}</div>
        <div>انتهت الأسئلة مع أطيب التمنيات بالتفوق والتميز</div>
      </div>
    `;

    container.innerHTML = `
      ${headerHtml}
      ${questionsHtml}
      ${footerHtml}
    `;

    // 3. Attach container to DOM for rendering
    document.body.appendChild(container);

    // 4. Configure html2pdf options
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: fileName,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
    };

    try {
      await html2pdf().set(opt).from(container).save();
    } finally {
      // Clean up detached element
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  },
};
