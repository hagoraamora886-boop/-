/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Globe,
  Layout,
  Award,
  Sparkles,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export const CurriculumGuideView: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const isEn = language === 'en';
  const [filterQuery, setFilterQuery] = useState('');

  const chaptersData = [
    {
      id: 'ch1',
      number: isEn ? 'Unit 1' : 'الفصل 1',
      title: isEn ? 'Information Technology and Society' : 'تكنولوجيا المعلومات والمجتمع',
      subtitle: isEn
        ? 'Evolution of computing, network foundations, artificial intelligence systems, and ethical social impacts'
        : 'مسار تطور الحواسيب والشبكات ونماذج الذكاء الاصطناعي وتأثيرها المجتمعي',
      color: 'indigo',
      accentBorder: 'border-indigo-500/30 hover:border-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Cpu,
      gradient: 'from-indigo-500 to-sky-500',
      lessons: [
        {
          num: '1-1',
          title: isEn ? 'Evolution of IT and Social Transformation' : 'تطور تكنولوجيا المعلومات والتحول الاجتماعي',
          details: isEn
            ? 'Historical computing milestones from vacuum tubes (ENIAC) to microprocessors and cloud architecture. Moore’s Law and physical limitations (thermal leakage, quantum tunneling). Five societal shifts (Social Networks, E-commerce, Remote Work, Online Learning, Cashless Payments). Emerging tech: Edge Computing for real-time safety, AR/VR, and Quantum Computing.'
            : 'مراحل تطور الحواسيب من الصمامات المفرغة (ENIAC) إلى المعالجات والحوسبة السحابية، قانون مور ومحدودياته الفيزيائية، التحولات الخمسة للمجتمع، والتقنيات الناشئة (الحوسبة الطرفية Edge Computing، الواقع المعزز AR، والحوسبة الكمومية).',
          keywords: ['ENIAC', "Moore's Law", 'Edge Computing', 'Quantum Computing'],
        },
        {
          num: '1-2',
          title: isEn ? 'How Artificial Intelligence Works (AI Architecture)' : 'كيف يعمل الذكاء الاصطناعي (AI Architecture)',
          details: isEn
            ? 'Hierarchical taxonomy: Artificial Intelligence (AI) > Machine Learning (ML) > Deep Learning (DL) > Generative AI (GenAI). Artificial Neural Networks (ANN), weights and biases. Addressing AI Hallucinations and temperature parameters.'
            : 'التسلسل الهرمي: الذكاء الاصطناعي AI > تعلم الآلة ML > التعلم العميق DL > الذكاء التوليدي GenAI، الخلايا العصبية الاصطناعية (ANN)، الأوزان والانحيازات، ومعالجة ظاهرة الهلوسة Hallucination وضبط درجات الحرارة Temperature.',
          keywords: ['ANN', 'Deep Learning', 'GenAI', 'Hallucination'],
        },
        {
          num: '1-3',
          title: isEn ? 'AI in Daily Life and Industry' : 'الذكاء الاصطناعي في الحياة اليومية والصناعة',
          details: isEn
            ? 'Recommendation algorithms, voice assistants, automated facial recognition, medical diagnostic imaging, predictive maintenance in manufacturing, autonomous vehicles, and the Black Box problem.'
            : 'أنظمة التوصية، المساعدات الذكية، التعرف على الوجه، التشخيص الطبي، الصيانة التنبؤية، المركبات ذاتية القيادة، ومفهوم الصندوق الأسود (Black Box Problem).',
          keywords: ['Recommendation Systems', 'Black Box', 'Predictive Maintenance'],
        },
        {
          num: '1-4',
          title: isEn ? 'Ethical Issues of AI and Digital Citizenship' : 'القضايا الأخلاقية للذكاء الاصطناعي والمواطنة الرقمية',
          details: isEn
            ? 'Algorithmic bias origins in skewed training data, facial recognition demographic discrepancies, privacy rights, Explainable AI (XAI), and four ethical pillars: Fairness, Transparency, Privacy, and Accountability.'
            : 'التحيز الخوارزمي (Algorithmic Bias)، حماية الخصوصية، الذكاء الاصطناعي القابل للتفسير (XAI)، وأركان الميثاق الأخلاقي: العدالة والشفافية والمساءلة والأمان.',
          keywords: ['XAI', 'Algorithmic Bias', 'Privacy', 'Accountability'],
        },
      ],
    },
    {
      id: 'ch2',
      number: isEn ? 'Unit 2' : 'الفصل 2',
      title: isEn ? 'Cybersecurity & Network Defense' : 'الأمن السيبراني وحماية البيانات',
      subtitle: isEn
        ? 'Communication encryption, secure network perimeter design, and security incident risk management'
        : 'تأمين الاتصالات، وهيكلية أمن الشبكات، وإدارة مخاطر الحوادث الرقمية',
      color: 'emerald',
      accentBorder: 'border-emerald-500/30 hover:border-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-teal-500',
      lessons: [
        {
          num: '2-1',
          title: isEn ? 'Encryption & Digital Authentication Technologies' : 'تقنيات التشفير والمصادقة الرقمية',
          details: isEn
            ? 'HTTPS protocol and 3-step TLS Handshake. Symmetric (AES) vs Asymmetric (RSA) cryptography. Digital certificates and signatures ensuring Non-repudiation. Multi-factor authentication (MFA/2FA) across knowledge, possession, and biometrics.'
            : 'بروتوكول HTTPS ومصافحة TLS ثلاثية الخطوات، التشفير المتماثل (AES) وغير المتماثل (RSA)، الشهادات والتوقيعات الرقمية لمنع التنصل (Non-repudiation)، والمصادقة متعددة العوامل 2FA (المعرفة، الحيازة، الصفة الحيوية).',
          keywords: ['TLS Handshake', 'RSA vs AES', '2FA', 'Non-repudiation'],
        },
        {
          num: '2-2',
          title: isEn ? 'Network Security Design & Architecture' : 'تصميم أمن الشبكات والبنية التحتية',
          details: isEn
            ? 'Firewalls packet inspection, Virtual Private Networks (VPN), Demilitarized Zone (DMZ) perimeter buffer, 4-tier Defense-in-Depth strategy, and modern Zero Trust Architecture.'
            : 'جدار الحماية Firewall، الشبكة الافتراضية الخاصة VPN، المنطقة المنزوعة السلاح DMZ، استراتيجية الدفاع في العمق (Defense in Depth عبر 4 طبقات)، ومبدأ انعدام الثقة (Zero Trust Architecture).',
          keywords: ['Zero Trust', 'Firewall', 'DMZ', 'Defense in Depth'],
        },
        {
          num: '2-3',
          title: isEn ? 'Incident Response and Risk Assessment' : 'الاستجابة للحوادث السيبرانية وإدارة المخاطر',
          details: isEn
            ? 'Six sequential stages of incident response: Preparation, Detection & Analysis, Containment (mandatory before eradication), Eradication, Recovery, and Lessons Learned. Risk formula: Risk = Impact × Likelihood.'
            : 'المراحل الست للاستجابة للحوادث: التحضير، الاكتشاف والتحليل، الاحتواء، الاستئصال، الاستعادة، والدروس المستفادة، ومعادلة مصفوفة المخاطر: درجة الخطر = مستوى التأثير × احتمالية الحدوث.',
          keywords: ['Risk Matrix', 'Six Response Stages', 'Containment'],
        },
      ],
    },
    {
      id: 'ch3',
      number: isEn ? 'Unit 3' : 'الفصل 3',
      title: isEn ? 'Web Applications Architecture' : 'تطبيقات الويب وهيكلية النظم',
      subtitle: isEn
        ? 'Client-server architecture, communication protocols, and interactive frontend engineering'
        : 'هندسة الويب، بروتوكولات الاتصال، والواجهة الأمامية التفاعلية',
      color: 'sky',
      accentBorder: 'border-sky-500/30 hover:border-sky-500',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Globe,
      gradient: 'from-sky-500 to-blue-600',
      lessons: [
        {
          num: '3-1',
          title: isEn ? 'Web Applications General Architecture' : 'البنية العامة لتطبيقات الويب',
          details: isEn
            ? 'Client-Server architecture, web browser (Client) responsibilities, application and web servers, and persistent database management systems.'
            : 'نموذج العميل والخادم Client-Server، دور متصفح الويب (Client)، خادم الويب وخادم التطبيقات، وقواعد البيانات العلائقية وغير العلائقية.',
          keywords: ['Client-Server', 'Web Server', 'Database Engine'],
        },
        {
          num: '3-2',
          title: isEn ? 'Web Communication Protocols & Data Exchange' : 'بروتوكولات وطرق الاتصال وتبادل البيانات',
          details: isEn
            ? 'HTTP/HTTPS protocols, request methods (GET, POST, PUT, DELETE), standard status codes (200 OK, 404 Not Found, 500 Server Error), and lightweight JSON structured data interchange via RESTful APIs.'
            : 'بروتوكولات HTTP/HTTPS، طرق الطلب (GET, POST, PUT, DELETE)، أكواد الحالة (200 OK, 404 Not Found, 500 Server Error)، وتنسيق تبادل البيانات القياسي JSON عبر RESTful APIs.',
          keywords: ['REST APIs', 'HTTP Methods', 'JSON Data', 'Status Codes'],
        },
        {
          num: '3-3',
          title: isEn ? 'Frontend Engineering Fundamentals' : 'أساسيات وتكامل تقنيات الواجهة الأمامية',
          details: isEn
            ? 'HTML5 semantic structural tags, CSS3 responsive grid layouts and media queries, and JavaScript event listeners for DOM manipulation.'
            : 'تكامل HTML5 للهيكلة الدلالية (Semantic Tags)، و CSS3 للتنسيق الشبكي Flexbox/Grid والتجاوب، و JavaScript للبرمجة الحركية والتعامل مع شجرة عناصر DOM.',
          keywords: ['HTML5 Semantic', 'CSS Flex/Grid', 'DOM Manipulation'],
        },
      ],
    },
    {
      id: 'ch4',
      number: isEn ? 'Unit 4' : 'الفصل 4',
      title: isEn ? 'Web Design & User Experience' : 'تصميم الويب والوسائط الرقمية',
      subtitle: isEn
        ? 'User experience (UX) engineering, digital media optimization, and iterative improvement'
        : 'هندسة تجربة المستخدم UX، تحسين الوسائط، والتحسين التكراري',
      color: 'purple',
      accentBorder: 'border-purple-500/30 hover:border-purple-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Layout,
      gradient: 'from-purple-500 to-pink-500',
      lessons: [
        {
          num: '4-1',
          title: isEn ? 'Digital Media Types & Compression Characteristics' : 'أنواع الوسائط الرقمية وخصائص الضغط',
          details: isEn
            ? 'Pixel-based raster graphics (JPEG, PNG, WebP) vs mathematical vector graphics (SVG). Lossy vs lossless compression trade-offs for web performance.'
            : 'الصور النقطية Raster (JPEG, PNG) مقابل الصور المتجهة Vector (SVG)، تقنيات الضغط Lossy و Lossless وتأثيرها على سرعة تحميل الصفحات.',
          keywords: ['SVG vs PNG', 'Lossy vs Lossless', 'Web Performance'],
        },
        {
          num: '4-2',
          title: isEn ? 'Information Architecture & UX Principles' : 'تصميم المعلومات وتجربة المستخدم (UI/UX)',
          details: isEn
            ? 'Information Architecture (IA), intuitive navigation, accessibility (a11y) standards including alt attributes and color contrast ratios.'
            : 'هيكلية المعلومات (IA)، تجربة المستخدم (UX)، إمكانية الوصول الشاملة (Accessibility - a11y) ومعايير تباين الألوان.',
          keywords: ['UX/UI', 'Information Architecture', 'Accessibility a11y'],
        },
        {
          num: '4-3',
          title: isEn ? 'Iterative Improvement & A/B Testing' : 'أساليب التقييم والتحسين التكراري',
          details: isEn
            ? 'Iterative development cycle: Design → Test → Feedback → Refine. Empirical A/B testing methodologies comparing UI variants with conversion data.'
            : 'دورة التطوير التكرارية: التصميم -> الاختبار -> جمع الملاحظات -> التحسين. اختبار أ/ب (A/B Testing) المبني على قياس تفاعل المستخدمين.',
          keywords: ['A/B Testing', 'Iterative Design', 'User Feedback'],
        },
      ],
    },
  ];

  const filteredChapters = chaptersData.map((ch) => ({
    ...ch,
    lessons: ch.lessons.filter(
      (l) =>
        filterQuery.trim() === '' ||
        l.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(filterQuery.toLowerCase()) ||
        l.keywords.some((kw) => kw.toLowerCase().includes(filterQuery.toLowerCase()))
    ),
  })).filter((ch) => ch.lessons.length > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Official Egyptian Ministry Curriculum' : 'المقرر المعتمد لوزارة التربية والتعليم'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('curriculumGuideTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('curriculumGuideSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Grade 11 Approved' : 'معتمد للثانوية العامة'}</span>
            </span>
          </div>
        </div>

        {/* Search within curriculum */}
        <div className="mt-4 relative">
          <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder={isEn ? 'Search curriculum standards, topics, and keywords...' : 'ابحث في موضوعات المنهج، المفاهيم، ومخرجات التعلم المستهدفة...'}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>
      </div>

      {/* Chapters Accordion / Grid */}
      <div className="space-y-6">
        {filteredChapters.map((ch) => {
          const Icon = ch.icon;

          return (
            <div
              key={ch.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 ${ch.accentBorder}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${ch.gradient} flex items-center justify-center text-white shadow-xs`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${ch.badgeBg}`}>
                        {ch.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {ch.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ch.subtitle}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {ch.lessons.length} {isEn ? 'Topics' : 'موضوعات'}
                </div>
              </div>

              {/* Lessons details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {ch.lessons.map((les) => (
                  <div
                    key={les.num}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                        {les.num}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {les.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {les.details}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {les.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
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
            {t('curriculumWeightTitle')}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          {isEn
            ? 'Accredited weight ratios for Egyptian Baccalaureate official exam specifications:'
            : 'النسب المعتمدة للامتحانات الرسمية بالبكالوريا المصرية لضمان شمولية التقييم والعدالة التربوية:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1 */}
          <div className="p-4 bg-gradient-to-b from-sky-50/50 to-white border border-sky-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800">{t('levelRem')}</span>
              <span className="text-sm font-extrabold text-sky-600 bg-sky-100/80 px-2 py-0.5 rounded-md">
                30%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '30%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn
                ? 'Recalling basic definitions and concepts: TLS handshake sequence, six stages of incident response, Moore’s Law physical boundaries, and symmetric vs asymmetric encryption differences.'
                : 'استرجاع المصطلحات والمفاهيم الأساسية: خطوات مصافحة TLS، مراحل الاستجابة الست للحوادث، قانون مور ومحدودياته، والفرق بين التشفير المتماثل وغير المتماثل.'}
            </p>
          </div>

          {/* Level 2 */}
          <div className="p-4 bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-800">{t('levelApp')}</span>
              <span className="text-sm font-extrabold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                50%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '50%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn
                ? 'Applying protocols in scenarios, calculating risk scores (Risk = Impact × Likelihood), analyzing edge computing latency in self-driving cars, and evaluating multi-factor authentication categories.'
                : 'تحليل سيناريوهات الويب والشبكات، حساب درجة الخطر في مصفوفة المخاطر (درجة الخطر = التأثير × الاحتمالية)، تحليل استخدام الحوسبة الطرفية في القيادة الذاتية، وتحديد فئات 2FA.'}
            </p>
          </div>

          {/* Level 3 */}
          <div className="p-4 bg-gradient-to-b from-purple-50/50 to-white border border-purple-200/80 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-800">{t('levelEval')}</span>
              <span className="text-sm font-extrabold text-purple-600 bg-purple-100/80 px-2 py-0.5 rounded-md">
                20%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '20%' }} />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEn
                ? 'Critiquing security architectures, detecting dataset algorithmic bias, evaluating the risks of premature recovery before eradication, and comparing Zero Trust with classical perimeter defense.'
                : 'نقد واقتراح الحلول الأمنية، كشف التحيز الخوارزمي في البيانات، تقييم مخاطر استعادة النسخ الاحتياطية قبل الاستئصال، ومقارنة نهج Zero Trust بالأمان المحيطي الكلاسيكي.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
