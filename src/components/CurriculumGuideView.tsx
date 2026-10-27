/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Globe,
  Layout,
  Award,
  Sparkles,
  CheckCircle2,
  Binary,
  Layers,
  Lock,
  Search,
  ExternalLink,
} from 'lucide-react';

export const CurriculumGuideView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const chaptersData = [
    {
      id: 'ch1',
      number: 'الفصل 1',
      title: 'تكنولوجيا المعلومات والمجتمع',
      subtitle: 'مسار تطور الحواسيب والشبكات ونماذج الذكاء الاصطناعي وتأثيرها المجتمعي',
      color: 'indigo',
      accentBorder: 'border-indigo-500/30 hover:border-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Cpu,
      gradient: 'from-indigo-500 to-sky-500',
      lessons: [
        {
          num: '1-1',
          title: 'تطور تكنولوجيا المعلومات والتحول الاجتماعي',
          details:
            'مراحل تطور الحواسيب من الصمامات المفرغة (ENIAC) إلى المعالجات والحوسبة السحابية، قانون مور ومحدودياته الفيزيائية، التحولات الخمسة للمجتمع، والتقنيات الناشئة (الحوسبة الطرفية Edge Computing، الواقع المعزز AR، والحوسبة الكمومية).',
          keywords: ['ENIAC', 'قانون مور', 'Edge Computing', 'الحوسبة الكمومية'],
        },
        {
          num: '1-2',
          title: 'كيف يعمل الذكاء الاصطناعي (AI Architecture)',
          details:
            'التسلسل الهرمي: الذكاء الاصطناعي AI > تعلم الآلة ML > التعلم العميق DL > الذكاء التوليدي GenAI، الخلايا العصبية الاصطناعية (ANN)، الأوزان والانحيازات، ومعالجة ظاهرة الهلوسة Hallucination وضبط درجات الحرارة Temperature.',
          keywords: ['ANN', 'Deep Learning', 'GenAI', 'Hallucination'],
        },
        {
          num: '1-3',
          title: 'الذكاء الاصطناعي في الحياة اليومية والصناعة',
          details:
            'أنظمة التوصية، المساعدات الذكية، التعرف على الوجه، التشخيص الطبي، الصيانة التنبؤية، المركبات ذاتية القيادة، ومفهوم الصندوق الأسود (Black Box Problem).',
          keywords: ['أنظمة التوصية', 'الصندوق الأسود', 'الصيانة التنبؤية'],
        },
        {
          num: '1-4',
          title: 'القضايا الأخلاقية للذكاء الاصطناعي والمواطنة الرقمية',
          details:
            'التحيز الخوارزمي (Algorithmic Bias)، حماية الخصوصية، الذكاء الاصطناعي القابل للتفسير (XAI)، وأركان الميثاق الأخلاقي: العدالة والشفافية والمساءلة والأمان.',
          keywords: ['XAI', 'Algorithmic Bias', 'الخصوصية', 'المساءلة'],
        },
      ],
    },
    {
      id: 'ch2',
      number: 'الفصل 2',
      title: 'الأمن السيبراني وحماية البيانات',
      subtitle: 'تأمين الاتصالات، وهيكلية أمن الشبكات، وإدارة مخاطر الحوادث الرقمية',
      color: 'emerald',
      accentBorder: 'border-emerald-500/30 hover:border-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-teal-500',
      lessons: [
        {
          num: '2-1',
          title: 'تقنيات التشفير والمصادقة الرقمية',
          details:
            'بروتوكول HTTPS ومصافحة TLS ثلاثية الخطوات، التشفير المتماثل (AES) وغير المتماثل (RSA)، الشهادات والتوقيعات الرقمية لمنع التنصل (Non-repudiation)، والمصادقة متعددة العوامل 2FA (المعرفة، الحيازة، الصفة الحيوية).',
          keywords: ['TLS Handshake', 'RSA vs AES', '2FA', 'Non-repudiation'],
        },
        {
          num: '2-2',
          title: 'تصميم أمن الشبكات والبنية التحتية',
          details:
            'جدار الحماية Firewall، الشبكة الافتراضية الخاصة VPN، المنطقة المنزوعة السلاح DMZ، استراتيجية الدفاع في العمق (Defense in Depth عبر 4 طبقات)، ومبدأ انعدام الثقة (Zero Trust Architecture).',
          keywords: ['Zero Trust', 'Firewall', 'DMZ', 'Defense in Depth'],
        },
        {
          num: '2-3',
          title: 'الاستجابة للحوادث السيبرانية وإدارة المخاطر',
          details:
            'المراحل الست للاستجابة للحوادث: التحضير، الاكتشاف والتحليل، الاحتواء، الاستئصال، الاستعادة، والدروس المستفادة، ومعادلة مصفوفة المخاطر: درجة الخطر = مستوى التأثير × احتمالية الحدوث.',
          keywords: ['مصفوفة المخاطر', 'مراحل الاستجابة الست', 'الاستئصال'],
        },
      ],
    },
    {
      id: 'ch3',
      number: 'الفصل 3',
      title: 'تطبيقات الويب وهيكلية النظم',
      subtitle: 'هندسة الويب، بروتوكولات الاتصال، والواجهة الأمامية التفاعلية',
      color: 'sky',
      accentBorder: 'border-sky-500/30 hover:border-sky-500',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Globe,
      gradient: 'from-sky-500 to-blue-600',
      lessons: [
        {
          num: '3-1',
          title: 'البنية العامة لتطبيقات الويب',
          details:
            'نموذج العميل والخادم Client-Server، دور متصفح الويب (Client)، خادم الويب وخادم التطبيقات، وقواعد البيانات العلائقية وغير العلائقية.',
          keywords: ['Client-Server', 'Web Server', 'Database Engine'],
        },
        {
          num: '3-2',
          title: 'بروتوكولات وطرق الاتصال وتبادل البيانات',
          details:
            'بروتوكولات HTTP/HTTPS، طرق الطلب (GET, POST, PUT, DELETE)، أكواد الحالة (200 OK, 404 Not Found, 500 Server Error)، وتنسيق تبادل البيانات القياسي JSON عبر RESTful APIs.',
          keywords: ['REST APIs', 'HTTP Methods', 'JSON Data', 'Status Codes'],
        },
        {
          num: '3-3',
          title: 'أساسيات وتكامل تقنيات الواجهة الأمامية',
          details:
            'تكامل HTML5 للهيكلة الدلالية (Semantic Tags)، و CSS3 للتنسيق الشبكي Flexbox/Grid والتجاوب، و JavaScript للبرمجة الحركية والتعامل مع شجرة عناصر DOM.',
          keywords: ['HTML5 Semantic', 'CSS Flex/Grid', 'DOM Manipulation'],
        },
      ],
    },
    {
      id: 'ch4',
      number: 'الفصل 4',
      title: 'تصميم الويب والوسائط الرقمية',
      subtitle: 'هندسة تجربة المستخدم UX، تحسين الوسائط، والتحسين التكراري',
      color: 'purple',
      accentBorder: 'border-purple-500/30 hover:border-purple-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Layout,
      gradient: 'from-purple-500 to-pink-500',
      lessons: [
        {
          num: '4-1',
          title: 'أنواع الوسائط الرقمية وخصائص الضغط',
          details:
            'الصور النقطية Raster (PNG, JPEG) مقابل الصور المتجهة Vector (SVG)، صيغ الفيديو والصوتيات، الفرق بين الضغط الفاقد Lossy والضغط غير الفاقد Lossless وتطبيقاتهما على الويب.',
          keywords: ['Vector SVG', 'Raster Images', 'Lossy vs Lossless'],
        },
        {
          num: '4-2',
          title: 'تصميم المعلومات وتجربة المستخدم (UI / UX)',
          details:
            'الفرق بين واجهة المستخدم UI وتجربة المستخدم UX، هيكلية المعلومات Information Architecture، سهولة الاستخدام Usability، وإمكانية الوصول الشاملة لذوي الاحتياجات الخاصة (a11y - WCAG).',
          keywords: ['UI vs UX', 'Usability', 'Accessibility a11y', 'Wireframes'],
        },
        {
          num: '4-3',
          title: 'أساليب قياس وتقييم المواقع الإلكترونية',
          details:
            'فحص مؤشرات الأداء والسرعة (Core Web Vitals)، التوافقية Cross-Browser، واختبار سهولة الاستخدام مع مستخدمين حقيقيين ومراجعة خرائط الحرارة Heatmaps.',
          keywords: ['Core Web Vitals', 'Cross-Browser', 'Heatmaps'],
        },
        {
          num: '4-4',
          title: 'دورة التحسين المستمر والتكراري (Iterative Design)',
          details:
            'حلقة التصميم والاختبار والتحليل، اختبار أ/ب (A/B Testing) لتحسين معدلات التفاعل، وجمع التغذية الراجعة من المستخدمين وتطبيق منهجية Agile التكرارية.',
          keywords: ['A/B Testing', 'Feedback Loop', 'Agile Workflow'],
        },
      ],
    },
  ];

  const filteredChapters = chaptersData.map((ch) => {
    if (!filterQuery.trim()) return ch;
    const q = filterQuery.toLowerCase();
    const matchingLessons = ch.lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.keywords.some((k) => k.toLowerCase().includes(q))
    );
    return {
      ...ch,
      lessons: matchingLessons,
    };
  }).filter((ch) => ch.lessons.length > 0 || ch.title.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg border border-indigo-900/40">
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-sky-300">
              <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-200 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-sky-300" />
                طبعة 2026 المعتمدة
              </span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-slate-300">وزارة التربية والتعليم والتعليم الفني - مصر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
              دليل مقرر البرمجة والذكاء الاصطناعي
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              الصف الثاني الثانوي — البكالوريا المصرية (إشراف البكالوريا الدولية IB). يغطي المنهج تكنولوجيا المعلومات، الذكاء الاصطناعي التوليدي، الأمن السيبراني، وتطوير الويب.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center shrink-0">
            <div>
              <div className="text-xl sm:text-2xl font-black text-sky-400">4</div>
              <div className="text-[11px] text-slate-300">فصول دراسية</div>
            </div>
            <div className="border-r border-white/10 pr-2.5 sm:pr-3">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">14</div>
              <div className="text-[11px] text-slate-300">درساً تفصيلياً</div>
            </div>
            <div className="border-r border-white/10 pr-2.5 sm:pr-3">
              <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
              <div className="text-[11px] text-slate-300">مواصفات الوزارة</div>
            </div>
          </div>
        </div>

        {/* Search bar inside header */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في موضوعات المنهج، المصطلحات، المفاهيم (مثل TLS، Zero Trust، GenAI)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 bg-white/10 border border-white/20 focus:border-sky-400 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-400/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChapters.map((ch) => {
          const IconComp = ch.icon;
          return (
            <div
              key={ch.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${ch.accentBorder}`}
            >
              <div>
                {/* Chapter Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${ch.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">{ch.number}</span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                        {ch.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{ch.subtitle}</p>

                {/* Lessons list */}
                <div className="space-y-2.5">
                  {ch.lessons.map((les) => (
                    <div
                      key={les.num}
                      className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">
                          {les.num}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {les.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pr-8">
                        {les.details}
                      </p>

                      {/* Keywords / Tags */}
                      <div className="mt-2 pr-8 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        {les.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assessment Weights & Thinking Levels (Bloom's Taxonomy) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            مواصفات الورقة الامتحانية وتوزيع مستويات التفكير (هرم بلوم والمركز القومي للامتحانات)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          النسب المعتمدة للامتحانات الرسمية بالبكالوريا المصرية لضمان شمولية التقييم والعدالة التربوية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1 */}
          <div className="p-4 bg-gradient-to-b from-sky-50/50 to-white border border-sky-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800">التذكر والفهم</span>
              <span className="text-sm font-extrabold text-sky-600 bg-sky-100/80 px-2 py-0.5 rounded-md">
                30%
              </span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              استرجاع المصطلحات والمفاهيم الأساسية: خطوات مصافحة TLS، مراحل الاستجابة الست للحوادث، قانون مور ومحدودياته، والفرق بين التشفير المتماثل وغير المتماثل.
            </p>
          </div>

          {/* Level 2 */}
          <div className="p-4 bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-800">التطبيق والتحليل</span>
              <span className="text-sm font-extrabold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                50%
              </span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '50%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تحليل سيناريوهات الويب والشبكات، حساب درجة الخطر في مصفوفة المخاطر (درجة الخطر = التأثير × الاحتمالية)، تحليل استخدام الحوسبة الطرفية في القيادة الذاتية، وتحديد فئات 2FA.
            </p>
          </div>

          {/* Level 3 */}
          <div className="p-4 bg-gradient-to-b from-purple-50/50 to-white border border-purple-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-800">التقويم والابتكار</span>
              <span className="text-sm font-extrabold text-purple-600 bg-purple-100/80 px-2 py-0.5 rounded-md">
                20%
              </span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '20%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              نقد واقتراح الحلول الأمنية، كشف التحيز الخوارزمي في البيانات، تقييم مخاطر استعادة النسخ الاحتياطية قبل الاستئصال، ومقارنة نهج Zero Trust بالأمان المحيطي الكلاسيكي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
