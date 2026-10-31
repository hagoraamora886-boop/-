/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuestionItem, QuestionType, ThinkingLevel } from '../types.ts';

interface QuestionBankEntry {
  chapterId: string;
  lessonId: string;
  type: 'mcq' | 'true_false' | 'code_trace' | 'short_answer';
  thinkingLevel: 'remembering' | 'applying' | 'evaluating';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  rubricCriteria: string;
}

export const CURRICULUM_QUESTION_BANK: QuestionBankEntry[] = [
  // ==========================================
  // الفصل 1: تكنولوجيا المعلومات والمجتمع
  // ==========================================

  // --- الدرس 1-1: تطور تكنولوجيا المعلومات والتحول الاجتماعي ---
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'اختر الخيار الذي يُرتّب مراحل تطور تكنولوجيا المعلومات (IT) بالترتيب الزمني الصحيح كما ورد في منهج الوزارة:',
    options: [
      'بداية ظهور الحاسب ← تسويق الإنترنت تجارياً ← ظهور الهواتف الذكية ← انتشار الحوسبة السحابية',
      'بداية ظهور الحاسب ← ظهور الهواتف الذكية ← تسويق الإنترنت تجارياً ← انتشار الحوسبة السحابية',
      'تسويق الإنترنت تجارياً ← بداية ظهور الحاسب ← انتشار الحوسبة السحابية ← ظهور الهواتف الذكية',
      'ظهور الهواتف الذكية ← تسويق الإنترنت تجارياً ← ظهور الحاسب ← انتشار الحوسبة السحابية'
    ],
    correctAnswer: 'بداية ظهور الحاسب ← تسويق الإنترنت تجارياً ← ظهور الهواتف الذكية ← انتشار الحوسبة السحابية',
    explanation: 'وفق كتاب الوزارة: ظهرت الحواسيب في الأربعينيات-الستينيات، ثم تسويق الإنترنت في التسعينيات، ثم الهواتف الذكية في العقد الأول من الألفية، وتلاها انتشار الحوسبة السحابية من العقد الثاني فصاعداً.',
    rubricCriteria: 'درجة كاملة لاختيار الترتيب الزمني الصحيح بدقة.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'short_answer',
    thinkingLevel: 'applying',
    question: 'في المركبات ذاتية القيادة، لماذا يكون من الضروري معالجة البيانات فورياً على متن المركبة نفسها عبر «الحوسبة الطرفية» (Edge Computing)، بدلاً من إرسالها إلى الخوادم السحابية لاتخاذ قرار التوقف أو الانعطاف؟',
    correctAnswer: 'لأن نقل البيانات إلى السحابة وانتظار عودة القرار يستغرق وقتاً زمنياً (زمن الاستجابة والكمون Latency)، وأي تأخير في بيئة القيادة قد يؤدي إلى حوادث كارثية؛ لذا تقوم الحوسبة الطرفية بالمعالجة اللحظية على متن المركبة لحماية السلامة.',
    explanation: 'الحوسبة الطرفية تعالج البيانات محلياً على الجهاز نفسه لتقليل زمن الاستجابة إلى أجزاء من الألف من الثانية، وهو أمر حاسم في تطبيقات السلامة الآنية كالسيارات الذاتية.',
    rubricCriteria: 'درجتان لذكر مشكلة زمن الاستجابة والاتصال + درجتان للربط بمعايير السلامة الفورية واتخاذ القرار.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'true_false',
    thinkingLevel: 'remembering',
    question: '«قانون مور» هو قانون فيزيائي طبيعي ثابت يضمن مضاعفة سرعة المعالجات إلى الأبد دون مواجهة أي قيود هندسية.',
    correctAnswer: 'خطأ',
    explanation: 'العبارة خاطئة؛ فقانون مور هو ملاحظة تجريبية وتاريخية وليس قانوناً فيزيائياً ثابتاً، وهو يواجه حالياً تحديات هندسية وفيزيائية معقدة كتسرب التيارات والتأثيرات الكمومية مثل النفق الكمومي.',
    rubricCriteria: 'درجة لتحديد الخطأ + درجة لتوضيح أنه ملاحظة تجريبية تواجه قيوداً فيزيائية.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'سؤال على نمط الامتحان: حلّل كيف غير انتشار الحوسبة السحابية (من العقد الثاني من الألفية فصاعداً) طريقة استخدام تكنولوجيا المعلومات، مشيراً إلى: تحليل البيانات الضخمة، والذكاء الاصطناعي، وتكنولوجيا المعلومات كخدمة.',
    correctAnswer: 'غيّرت الحوسبة السحابية المفهوم من شراء أجهزة وبرمجيات مكلفة إلى تقديم "تكنولوجيا المعلومات كخدمة" عبر الإنترنت حسب الطلب. ومكّنت المؤسسات من معالجة وتحليل البيانات الضخمة (Big Data) وتدريب نماذج الذكاء الاصطناعي المعقدة دون الحاجة لامتلاك حواسيب عملاقة محلية، مما أتاح الوصول الشامل والمرن.',
    explanation: 'السحابة وفرت قوة حوسبية وسعات تخزينية هائلة قابلة للتوسع الفوري، وهي البنية الأساسية التي انطلق منها التعلم العميق والذكاء الاصطناعي الحديث.',
    rubricCriteria: 'درجتان لشرح مفهوم "IT كخدمة" + درجتان لدورها في البيانات الضخمة والذكاء الاصطناعي + درجتان لتقييم الأثر المؤسسي العام.'
  },

  // --- الدرس 1-2: كيف يعمل الذكاء الاصطناعي ---
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-2',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'اختر الخيار الذي يصف بشكل صحيح وصارم العلاقة الشاملة بين المفاهيم الأربعة كفئات متداخلة:',
    options: [
      'الذكاء الاصطناعي > التعلم الآلي > التعلم العميق > الذكاء الاصطناعي التوليدي',
      'التعلم الآلي > الذكاء الاصطناعي > الذكاء الاصطناعي التوليدي > التعلم العميق',
      'الذكاء الاصطناعي > التعلم العميق > التعلم الآلي > الذكاء الاصطناعي التوليدي',
      'الذكاء الاصطناعي التوليدي > التعلم العميق > التعلم الآلي > الذكاء الاصطناعي'
    ],
    correctAnswer: 'الذكاء الاصطناعي > التعلم الآلي > التعلم العميق > الذكاء الاصطناعي التوليدي',
    explanation: 'الذكاء الاصطناعي هو المظلة الأوسع، ويقع التعلم الآلي ضمنه كفرع يتعلم من البيانات، ويقع التعلم العميق ضمن التعلم الآلي باعتماده على الشبكات العصبية، بينما تبنى أنظمة الذكاء التوليدي الحديثة فوق نماذج التعلم العميق.',
    rubricCriteria: 'درجة كاملة لترتيب الفئات المتداخلة من الأوسع إلى الأكثر تخصصاً.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-2',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'أي من التطبيقات التالية لا يُعد مثالاً على الذكاء الاصطناعي التوليدي (Generative AI)؟',
    options: [
      'مرشح الرسائل المزعجة (Spam Filter) في البريد الإلكتروني',
      'أداة ChatGPT لكتابة المقالات التوليدية',
      'نماذج Midjourney لتوليد الصور من النصوص',
      'أدوات استنساخ وتوليد الصوت البشري التوليدي'
    ],
    correctAnswer: 'مرشح الرسائل المزعجة (Spam Filter) في البريد الإلكتروني',
    explanation: 'مرشح الرسائل المزعجة هو نظام تصنيف تقليدي (Classification) يحدد فئة الرسالة (مزعجة أو غير مزعجة)، ولا يقوم بإنشاء أو توليد محتوى جديد.',
    rubricCriteria: 'درجة كاملة لاختيار مرشح الرسائل مع توضيح أنه نظام تصنيف وليس توليداً.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-2',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'يمكن للذكاء الاصطناعي التوليدي إنتاج نصوص تبدو معقولة ومكتوبة بطلاقة لكنها غير صحيحة واقعياً وتسمى «الهلوسة» (Hallucination). اشرح لماذا يعد اعتماد الطالب على هذه المخرجات دون تدقيق خطراً جسيماً، وما الإجراء الواجب اتخاذه؟',
    correctAnswer: 'الخطر: يؤدي إلى نشر معلومات مضللة وغير علمية وبناء قرارات أو أبحاث على أسس باطلة قد تؤثر على التحصيل الدراسي والمصداقية العلمية. الإجراء: يجب على الطالب دائماً التحقق من المخرجات عبر مصادر موثوقة، تدقيق الحقائق، ومراجعة الأدلة وعدم نسخ إجابات الذكاء التوليدي بصورة عمياء.',
    explanation: 'النماذج التوليدية تتنبأ بالكلمة التالية الأكثر احتمالاً بناءً على الأنماط اللغوية وليس بناءً على استيعاب حقيقي للحقيقة والواقع، مما قد يولد هلوسات مقنعة لفظياً وكاذبة علمياً.',
    rubricCriteria: 'درجتان لشرح طبيعة خطورة الهلوسة + درجتان لذكر إجراءات التحقق والتدقيق المنهجي.'
  },

  // --- الدرس 1-3: الذكاء الاصطناعي في الحياة اليومية والصناعة ---
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-3',
    type: 'true_false',
    thinkingLevel: 'applying',
    question: 'في المستشفيات الحديثة، يجب ترك اتخاذ قرار التشخيص الطبي النهائي للأورام لنظام الذكاء الاصطناعي وحده توفيراً لوقت الأطباء، نظراً لارتفاع دقة تحليله للصور.',
    correctAnswer: 'خطأ',
    explanation: 'العبارة خاطئة؛ فالذكاء الاصطناعي أداة مساعدة للتشخيص، لكن القرارات عالية الأثر كالحياة والصحة تتطلب حتماً إشرافاً بشرياً وتأكيداً من طبيب بشري مؤهل بسبب احتمالية الخطأ ومعضلة الصندوق الأسود والمسؤولية القانونية.',
    rubricCriteria: 'درجة لتحديد الخطأ + درجتان للتعليل التربوي بوجوب الإشراف البشري في القرارات عالية الأثر.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-3',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'في قطاع التصنيع، ما المقصود بمصطلح «الصيانة التنبؤية» (Predictive Maintenance)، وما الميزة الاقتصادية التي تحققها مقارنة بالصيانة الدورية التقليدية؟',
    correctAnswer: 'الصيانة التنبؤية هي استخدام مستشعرات الآلات وتحليلات الذكاء الاصطناعي للتنبؤ بأعطال المعدات قبل وقوعها استناداً للأنماط والاهتزازات. ميزتها الاقتصادية: منع التوقف المفاجئ لخطوط الإنتاج، تقليل تكاليف الإصلاحات الطارئة، وتجنب استبدال القطع السليمة قبل أوانها.',
    explanation: 'الصيانة التقليدية إما أن تنتظر وقوع العطل أو تجري فحصاً وفق جدول زمني ثابت، بينما الصيانة التنبؤية المعتمدة على الذكاء الاصطناعي تتدخل بدقة عند وجود مؤشرات خطر حقيقية.',
    rubricCriteria: 'درجتان لتعريف الصيانة التنبؤية + درجتان للميزات الاقتصادية والتشغيلية.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-3',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'في أنظمة التوصية (Recommendation Systems) المستخدمة في منصات الفيديو والتجارة الإلكترونية، ما الآلية الأساسية التي يعتمد عليها الذكاء الاصطناعي لاقتراح محتوى مخصص لكل مستخدم؟',
    options: [
      'تحليل السلوك التاريخي للمستخدم وتفضيلاته السابقة ومقارنتها بأنماط مستخدمين مشابهين',
      'عرض نفس المحتوى عشوائياً لجميع المستخدمين دون أي معالجة للبيانات',
      'إلزام المستخدم بالإجابة على استبيان مطول قبل كل عملية تصفح',
      'مسح كافة الملفات الشخصية من جهاز المستخدم دون إذن'
    ],
    correctAnswer: 'تحليل السلوك التاريخي للمستخدم وتفضيلاته السابقة ومقارنتها بأنماط مستخدمين مشابهين',
    explanation: 'تعتمد أنظمة التوصية الذكية على خوارزميات التعلم الآلي والترشيح التعاوني لتحليل التفاعلات السابقة والتنبؤ بما قد ينال اهتمام المستخدم بدقة.',
    rubricCriteria: 'درجة كاملة لاختيار آلية تحليل السلوك التاريخي والتفضيلات السابقة بدقة.'
  },

  // --- الدرس 1-4: القضايا الأخلاقية للذكاء الاصطناعي ---
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-4',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'ما هو المبدأ الأخلاقي الذي يقتضي «عدم التمييز ظلماً ضد أي شخص أو مجموعة بعينها» عند تطبيق أنظمة الذكاء الاصطناعي؟',
    options: [
      'مبدأ العدالة (Fairness)',
      'مبدأ الشفافية (Transparency)',
      'مبدأ حماية الخصوصية (Privacy)',
      'مبدأ زيادة سرعة المعالجة (Performance)'
    ],
    correctAnswer: 'مبدأ العدالة (Fairness)',
    explanation: 'مبدأ العدالة (Fairness) في ميثاق أخلاقيات الذكاء الاصطناعي يضمن المعاملة المنصفة لكافة الأفراد دون تحيز عرقي أو جندري أو جغرافي.',
    rubricCriteria: 'درجة كاملة لاختيار مبدأ العدالة.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-4',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'سؤال على نمط الامتحان: حلّل كيف يمكن أن ينشأ «التحيز الخوارزمي» (Algorithmic Bias) في نظام ذكاء اصطناعي لفرز طلبات التوظيف، وكيف يساعد مبدأ «الذكاء الاصطناعي القابل للتفسير» (XAI) في معالجة هذه المعضلة؟ [6 درجات]',
    correctAnswer: 'نشأة التحيز: ينشأ عندما تكون بيانات التدريب التاريخية غير متوازنة أو تعكس ممارسات توظيف تمييزية سابقة للبشر (كاستبعاد فئة معينة)، فيتعلم النموذج هذا الانحراف ويكرره آلياً. دور XAI: يساعد الذكاء القابل للتفسير على كشف العوامل والمدخلات التي بنى عليها النموذج قراره وكسر حاجز "الصندوق الأسود"، مما يتيح للخبراء مراجعة أسباب الرفض والتأكد من أنها استندت لمؤهلات حقيقية لا لصفات شخصية محمية.',
    explanation: 'النموذج يتعلم من التاريخ، وإذا كان التاريخ غير منصف سيتكرر الظلم تحت ستار الموضوعية الرقمية. تقنيات XAI هي الضمانة لكشف هذا التمييز.',
    rubricCriteria: 'درجتان لشرح كيفية دخول التحيز من البيانات التاريخية + درجتان لدور XAI في تفسير القرارات + درجتان للربط بالعدالة المؤسسية.'
  },

  // ==========================================
  // الفصل 2: الأمن السيبراني
  // ==========================================

  // --- الدرس 2-1: تقنيات التشفير والمصادقة ---
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-1',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'في مصافحة بروتوكول TLS عند فتح موقع مشفر (HTTPS)، لماذا يتم استخدام التشفير المتماثل (Symmetric) لحماية بيانات الجلسة المنقولة بعد إتمام المصافحة بالمفتاح العام؟',
    options: [
      'لأن التشفير المتماثل فائق السرعة وأقل استهلاكاً لموارد المعالج في نقل كميات البيانات الكبيرة',
      'لأن التشفير بالمفتاح العام لا يستطيع تشفير النصوص والملفات إطلاقاً',
      'لأن التشفير المتماثل يلغي الحاجة لأي مفاتيح أمنية في الجهاز',
      'لأن التشفير المتماثل يسمح لجميع المتنصتين على الشبكة بقراءة المحتوى'
    ],
    correctAnswer: 'لأن التشفير المتماثل فائق السرعة وأقل استهلاكاً لموارد المعالج في نقل كميات البيانات الكبيرة',
    explanation: 'وفق كتاب الوزارة: التشفير بالمفتاح العام آمن وممتاز للمصادقة وتوزيع المفاتيح الأولية لكنه بطيء حسابياً، لذا تُشتق مفاتيح جلسة متماثلة لحماية تبادل البيانات الفعلي بسرعة وكفاءة.',
    rubricCriteria: 'درجة كاملة لاختيار ميزة السرعة والكفاءة الحسابية في التشفير المتماثل.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-1',
    type: 'true_false',
    thinkingLevel: 'applying',
    question: 'قيام المستخدم بتعيين «كلمة مرور أولى» متبوعة بـ «كلمة مرور ثانية» يُعد تطبيقاً نموذجياً للمصادقة الثنائية (2FA).',
    correctAnswer: 'خطأ',
    explanation: 'العبارة خاطئة؛ لأن المصادقة الثنائية (2FA) تشترط استخدام عاملين مستقلين من فئتين مختلفتين (مثل المعرفة + الحيازة، أو المعرفة + السمات الحيوية). أما تعيين كلمتي مرور فكلاهما من نفس فئة "المعرفة" وتسمى مصادقة متعددة الخطوات فقط.',
    rubricCriteria: 'درجة لتحديد الخطأ + درجتان للتعليل الأكاديمي باشتراط فئتين مختلفتين من العوامل الثلاثة.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-1',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'ما الوظيفة الأمنية التي يؤديها «التوقيع الرقمي» (Digital Signature) في الرسائل والتعاملات الرقمية، وماذا يعني مفهوم «عدم التنصل» (Non-repudiation)؟',
    correctAnswer: 'التوقيع الرقمي: يثبت هوية مرسل الرسالة بدقة ويكتشف أي تلاعب أو تعديل يطرأ على محتواها أثناء النقل. مفهوم عدم التنصل: توفير دليل إلكتروني قاطع لا يمكن للطرف الموقع إنكار أو نفي قيامه بإرسال الرسالة أو الموافقة على المعاملة.',
    explanation: 'التوقيع الرقمي يجمع بين دالة التجزئة (Hash) والتشفير بالمفتاح الخاص للمرسل، مما يمنح الثقة الكاملة وسلامة البيانات والمسؤولية القانونية.',
    rubricCriteria: 'درجتان لوظيفة التوقيع الرقمي + درجتان لشرح مفهوم عدم التنصل بالتفصيل.'
  },

  // --- الدرس 2-2: تصميم أمن الشبكات ---
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-2',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'لماذا يكون وضع خادم الويب المتاح للجمهور في «المنطقة المعزولة» (DMZ) أكثر أماناً للمؤسسة من وضعه داخل الشبكة الداخلية؟',
    options: [
      'لمنع وصول المهاجم للشبكة الداخلية وقواعد البيانات الحساسة في حال تعرض خادم الويب للاختراق',
      'لأن المنطقة المعزولة تجعل سرعة التصفح تفوق سرعة الألياف الضوئية',
      'لأن خادم الويب في DMZ لا يحتاج إلى جدار حماية إطلاقاً',
      'لأن المنطقة المعزولة تمنع المستخدمين من إرسال طلبات الويب'
    ],
    correctAnswer: 'لمنع وصول المهاجم للشبكة الداخلية وقواعد البيانات الحساسة في حال تعرض خادم الويب للاختراق',
    explanation: 'المنطقة المعزولة (DMZ) تفصل الخوادم المعرضة للإنترنت العام عن الشبكة الداخلية، فإذا سقط خادم الويب كهدف للهجوم، يظل جدار الحماية الداخلي عازلاً للملفات والأنظمة المركزية.',
    rubricCriteria: 'درجة كاملة لاختيار عزل الخطر ومنع الاختراق من الوصول للشبكة الداخلية.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-2',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'سؤال على نمط الامتحان: قارن بين «الأمان المحيطي التقليدي» و«نهج انعدام الثقة» (Zero Trust) في حماية الشبكات، مبيناً لماذا أصبح الأمان المحيطي غير كافٍ في عصر الحوسبة السحابية والعمل عن بُعد؟ [6 درجات]',
    correctAnswer: 'المقارنة: الأمان المحيطي يفترض أن داخل الشبكة آمن وخارجها خطر بمجرد اجتياز الجدار الخارجي. بينما نهج انعدام الثقة (Zero Trust) لا يمنح الثقة تلقائياً لأي مستخدم أو جهاز حتى لو كان داخل مبنى المؤسسة، ويتحقق من كل عملية وصول وفق الهوية والصلاحيات والسياق. سبب عدم كفايته: انتشار العمل عن بعد والخدمات السحابية طمس الحدود الجغرافية بين "الداخل" و"الخارج"، وإذا اخترق مهاجم جهاز موظف داخلي سيصل لكافة الموارد ما لم يطبق Zero Trust.',
    explanation: 'الاعتماد على حدود المبنى لم يعد يجدي عندما يكون الموظف في منزله والبيانات موزعة على السحابة، لذا أصبح Zero Trust هو المعيار العالمي.',
    rubricCriteria: 'درجتان لتعريف الأمان المحيطي + درجتان لمبادئ Zero Trust + درجتان لشرح أثر السحابة والعمل عن بعد.'
  },

  // --- الدرس 2-3: الاستجابة للحوادث وإدارة المخاطر ---
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-3',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'في النموذج التعليمي للاستجابة للحوادث الأمنية المكون من 6 مراحل، ما هي المرحلة التي تلي مرحلة «الاكتشاف» مباشرة ويجب أن تسبق الاستئصال؟',
    options: [
      'مرحلة الاحتواء (Containment)',
      'مرحلة الاستعادة (Recovery)',
      'مرحلة الدروس المستفادة (Lessons Learned)',
      'مرحلة التشفير بالمفتاح العام'
    ],
    correctAnswer: 'مرحلة الاحتواء (Containment)',
    explanation: 'الترتيب المنهجي: 1- التحضير ← 2- الاكتشاف ← 3- الاحتواء ← 4- الاستئصال ← 5- الاستعادة ← 6- الدروس المستفادة. مرحلة الاحتواء ضرورية فور الاكتشاف لمنع انتشار الضرر قبل البدء في استئصال التهديد.',
    rubricCriteria: 'درجة كاملة لاختيار مرحلة الاحتواء مع معرفة الترتيب المنهجي.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-3',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'تعرضت مدرسة لهجوم ببرمجية الفدية (Ransomware) وتشفير ملفات درجات الطلاب. اقترح أحد الإداريين البدء فوراً في استعادة النسخة الاحتياطية قبل فحص وعزل الأجهزة. قيّم هذا التصرف مبيناً الخطأ الفادح الذي قد يقع فيه، وما الخطوة الصحيحة؟',
    correctAnswer: 'التقييم: تصرف خاطئ وكارثي. الخطأ: إذا بدأت الاستعادة قبل مرحلة "الاحتواء والاستئصال"، فإن البرمجية الخبيثة أو الثغرة النشطة في الشبكة ستقوم فوراً بإصابة وتشفير النسخة الاحتياطية المسترجعة أيضاً وفقدانها للأبد. الخطوة الصحيحة: يجب أولاً احتواء الحادث بفصل الأجهزة المصابة عن الشبكة، واستئصال برمجية الفدية وسد الثغرة، ثم البدء بالاستعادة من النسخة النظيفة.',
    explanation: 'كتاب الوزارة يؤكد أن الاستعادة المشروطة بنجاح تتطلب خلو البيئة تماماً من مسببات التهديد عبر مرحلتي الاحتواء والاستئصال أولاً.',
    rubricCriteria: 'درجتان لبيان خطورة تشفير النسخة الاحتياطية + درجتان للتأكيد على أسبقية الاحتواء والاستئصال + درجتان لتحديد المسار الصحيح.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-3',
    type: 'short_answer',
    thinkingLevel: 'applying',
    question: 'في مصفوفة تقييم المخاطر (Risk Assessment Matrix)، كيف يتم حساب «درجة الخطر»، وأي المخاطر يجب على فريق الأمن السيبراني إعطاؤها الأولوية القصوى للمعالجة الفورية؟',
    correctAnswer: 'حساب درجة الخطر: درجة الخطر = درجة التأثير (حجم الضرر) × درجة الاحتمالية (مدى إمكانية الوقوع). الأولوية القصوى: تُعطى للمخاطر التي تجمع بين "التأثير العالي" و"الاحتمالية العالية" (مثل هجمات تسريب سجلات الطلاب أو توقف خادم الامتحانات الوزارية).',
    explanation: 'الموارد الأمنية محدودة ولا يمكن معالجة جميع المخاطر في آن واحد، لذا تساعد مصفوفة المخاطر على توجيه الجهود للمخاطر الأشد فتكاً أولاً.',
    rubricCriteria: 'درجتان لمعادلة الخطر + درجتان لتحديد فئة المخاطر ذات الأولوية القصوى.'
  },

  // ==========================================
  // الفصل 3: تطبيقات الويب
  // ==========================================
  {
    chapterId: 'ch-3',
    lessonId: 'les-3-2',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'في بروتوكول HTTP، ما طريقة الطلب (Method) الأنسب لإرسال بيانات استمارة تسجيل طالب جديد تحتوي على كلمة مرور إلى الخادم؟',
    options: [
      'طريقة POST',
      'طريقة GET',
      'طريقة DNS',
      'طريقة FETCH_ONLY'
    ],
    correctAnswer: 'طريقة POST',
    explanation: 'طريقة POST تُرسل البيانات داخل جسم الطلب (Request Body) مما يجعلها مناسبة لإرسال البيانات الحساسة والنماذج، بينما GET تضع البيانات في رابط الصفحة URL المكشوف.',
    rubricCriteria: 'درجة كاملة لاختيار POST مع توضيح أنها ترسل البيانات في جسم الطلب.'
  },
  {
    chapterId: 'ch-3',
    lessonId: 'les-3-2',
    type: 'true_false',
    thinkingLevel: 'remembering',
    question: 'كود الحالة HTTP 404 يشير إلى نجاح الخادم في معالجة طلب العميل وإرجاع الصفحة المطلوبة بنجاح.',
    correctAnswer: 'خطأ',
    explanation: 'العبارة خاطئة؛ فكود 404 يعني Not Found (المورد أو الصفحة غير موجودة)، بينما كود النجاح هو 200 OK.',
    rubricCriteria: 'درجة لتحديد الخطأ + درجة لتحديد المعنى الحقيقي لكود 404.'
  },

  // ==========================================
  // الفصل 4: تصميم الويب والوسائط
  // ==========================================
  {
    chapterId: 'ch-4',
    lessonId: 'les-4-1',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'عند تصميم شعار أيقوني لموقع مدرسي يراد عرضه بدقة فائقة على شاشات الهواتف والحواسيب مع إمكانية تكبيره دون أي تشوه أو بكسلة، ما نوع صيغة الصور الأنسب؟',
    options: [
      'الصور المتجهة Vector (مثل صيغة SVG)',
      'الصور النقطية Raster (مثل صيغة JPEG المضغوطة)',
      'الملفات الصوتية الرقمية MP3',
      'الصور النقطية منخفضة الدقة GIF'
    ],
    correctAnswer: 'الصور المتجهة Vector (مثل صيغة SVG)',
    explanation: 'الصور المتجهة (SVG) تُبنى عبر معادلات رياضية هندسية، مما يسمح بتكبيرها وتصغيرها لأي حجم دون أدنى فقد في الجودة أو حدوث بكسلة، وهي الأنسب للشعارات والأيقونات.',
    rubricCriteria: 'درجة كاملة لاختيار الصور المتجهة SVG مع تعليل ميزة التكبير اللانهائي.'
  },
  {
    chapterId: 'ch-4',
    lessonId: 'les-4-4',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'في منهجية تحسين المواقع، اشرح كيف يساعد «اختبار أ/ب» (A/B Testing) المصمم والمعلم في معرفة التصميم الأنسب لصفحة تسجيل الطلاب في بنك الأسئلة؟',
    correctAnswer: 'يقوم اختبار أ/ب بعرض نسختين مختلفتين من الصفحة (النسخة A بلون وزر معين، والنسخة B بتخطيط مختلف) على مجموعتين عشوائيتين من المستخدمين في نفس الفترة الزمنية، ثم قياس معدل إكمال التسجيل بدقة لاتخاذ قرار مبني على بيانات حقيقية بدلاً من التخمين الشخصي.',
    explanation: 'الاختبار التكراري A/B يعتمد على القياس التجريبي المباشر لسلوك وتفاعل المستخدمين للوصول للتصميم الأفضل كفاءة.',
    rubricCriteria: 'درجتان لشرح فكرة المقارنة بين نسختين + درجتان لبيان دور البيانات في اتخاذ القرار.'
  }
];

export const CURRICULUM_QUESTION_BANK_EN: QuestionBankEntry[] = [
  // --- Unit 1: Information Technology and Society ---
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'Which sequence correctly describes the historical chronological evolution of Information Technology (IT) according to the Egyptian curriculum?',
    options: [
      'Early Computers (Vacuum Tubes) → Commercialization of Internet → Rise of Smartphones → Cloud Computing & AI',
      'Early Computers → Rise of Smartphones → Commercialization of Internet → Cloud Computing',
      'Commercialization of Internet → Early Computers → Cloud Computing → Rise of Smartphones',
      'Rise of Smartphones → Commercialization of Internet → Early Computers → Cloud Computing'
    ],
    correctAnswer: 'Early Computers (Vacuum Tubes) → Commercialization of Internet → Rise of Smartphones → Cloud Computing & AI',
    explanation: 'According to the official curriculum: Computers emerged in the 1940s-60s, commercial internet in the 1990s, smartphones in the 2000s, and cloud computing/AI expanded from 2010 onward.',
    rubricCriteria: 'Full mark for accurately identifying the correct historical chronological progression.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'short_answer',
    thinkingLevel: 'applying',
    question: 'In autonomous (self-driving) vehicles, why is it critical to process sensor telemetry data locally via "Edge Computing" rather than transmitting everything to remote cloud data centers?',
    correctAnswer: 'Transmitting data to the cloud incurs network latency and depends on continuous connectivity. Any delay in driving environments can cause fatal accidents; hence Edge Computing performs real-time milliseconds processing on-board for immediate safety actions.',
    explanation: 'Edge computing minimizes latency down to fractions of a millisecond and maintains uninterrupted local safety fail-safes without requiring cloud round-trips.',
    rubricCriteria: '2 marks for analyzing network latency and round-trip delay + 2 marks for relating to critical real-time vehicle safety.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-1',
    type: 'true_false',
    thinkingLevel: 'remembering',
    question: 'Moore’s Law is an unalterable natural physical law of nature guaranteeing that semiconductor processing speed doubles indefinitely without physical or thermal limitations.',
    correctAnswer: 'False',
    explanation: 'Moore’s Law is an empirical observation, not a physical law of nature. It currently encounters severe physical constraints such as thermal dissipation, current leakage, and quantum tunneling effects.',
    rubricCriteria: '1 mark for identifying False + 1 mark for mentioning that it is an empirical observation facing physical and thermal limits.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-2',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'Which of the following correctly orders the technical hierarchy of Artificial Intelligence domains from broadest umbrella to most specialized subset?',
    options: [
      'Artificial Intelligence (AI) > Machine Learning (ML) > Deep Learning (DL) > Generative AI (GenAI)',
      'Machine Learning (ML) > Artificial Intelligence (AI) > Deep Learning (DL) > Generative AI',
      'Generative AI > Deep Learning > Machine Learning > Artificial Intelligence',
      'Artificial Intelligence > Deep Learning > Machine Learning > Generative AI'
    ],
    correctAnswer: 'Artificial Intelligence (AI) > Machine Learning (ML) > Deep Learning (DL) > Generative AI (GenAI)',
    explanation: 'AI is the umbrella term; ML is its major branch; DL uses multi-layer neural networks within ML; and GenAI builds upon deep learning models to generate original content.',
    rubricCriteria: 'Full mark for selecting the correct taxonomic hierarchy.'
  },
  {
    chapterId: 'ch-1',
    lessonId: 'les-1-4',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'Explain the concept of "Algorithmic Bias" in AI systems and discuss how engineers can mitigate it during model training.',
    correctAnswer: 'Algorithmic bias occurs when an AI system produces systematically unfair outcomes due to historical prejudices, demographic underrepresentation, or skewed labeling in training data. Engineers mitigate it by auditing datasets for diversity, balancing sample distributions, and implementing fairness metrics and Explainable AI (XAI) audits.',
    explanation: 'Addressing algorithmic bias requires auditing the training pipeline, testing across demographic cohorts, and enforcing ethical transparency.',
    rubricCriteria: '2 marks for defining bias origins in training data + 2 marks for specifying concrete engineering mitigation techniques.'
  },

  // --- Unit 2: Cybersecurity & Cryptography ---
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-1',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'Why does the TLS/SSL protocol combine both Asymmetric and Symmetric cryptography during a secure web session rather than using asymmetric encryption exclusively for all data transfer?',
    options: [
      'Asymmetric encryption is used during the Handshake to authenticate and securely exchange session keys, while Symmetric encryption is used for data transmission due to its vastly superior computational speed',
      'Symmetric encryption cannot be executed on web browsers',
      'Asymmetric encryption does not provide confidentiality for user passwords',
      'Symmetric encryption requires three different public keys for every client'
    ],
    correctAnswer: 'Asymmetric encryption is used during the Handshake to authenticate and securely exchange session keys, while Symmetric encryption is used for data transmission due to its vastly superior computational speed',
    explanation: 'Asymmetric cryptography (RSA/ECC) solves key distribution securely, but is computationally intensive. Symmetric cryptography (AES) is thousands of times faster, making it optimal for bulk payload encryption.',
    rubricCriteria: 'Full mark for analyzing the computational speed vs key exchange trade-off.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-1',
    type: 'true_false',
    thinkingLevel: 'evaluating',
    question: 'A digital signature provides Non-Repudiation, meaning the sender cannot deny having created and sent the message, because it is signed using the sender’s private key.',
    correctAnswer: 'True',
    explanation: 'Because only the owner possesses their private key, a valid digital signature decrypted by the sender’s public key proves beyond doubt the authenticity, integrity, and origin of the document (Non-Repudiation).',
    rubricCriteria: '1 mark for identifying True + 1 mark for citing private key uniqueness.'
  },
  {
    chapterId: 'ch-2',
    lessonId: 'les-2-2',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'A company hosts a public e-commerce web portal and an internal database holding customer credit cards. Explain why placing both servers in the same subnet is dangerous, and describe how a Demilitarized Zone (DMZ) architecture resolves this risk.',
    correctAnswer: 'Placing both servers in the same network means that if an attacker compromises the web server, they gain immediate lateral access to the sensitive database. A DMZ isolates the public-facing web server in a buffer zone; a second firewall blocks direct outside access to the internal network and only permits strictly controlled internal DB queries.',
    explanation: 'A DMZ provides defense-in-depth by preventing attackers who breach public-facing web applications from pivoting into the internal network.',
    rubricCriteria: '2 marks for lateral movement risk + 2 marks for explaining DMZ firewall perimeter separation.'
  },

  // --- Unit 3: Web Applications Architecture ---
  {
    chapterId: 'ch-3',
    lessonId: 'les-3-1',
    type: 'mcq',
    thinkingLevel: 'remembering',
    question: 'In modern client-server web applications, which lightweight data-interchange format is predominantly used by RESTful APIs for transmitting structured key-value data between browser and backend server?',
    options: [
      'JSON (JavaScript Object Notation)',
      'Binary Machine Code',
      'Plain Text CSV without schema',
      'Direct SQL dump files'
    ],
    correctAnswer: 'JSON (JavaScript Object Notation)',
    explanation: 'JSON is the universal, language-independent lightweight format for web APIs, parsed natively by JavaScript and backend frameworks.',
    rubricCriteria: 'Full mark for selecting JSON.'
  },
  {
    chapterId: 'ch-3',
    lessonId: 'les-3-2',
    type: 'short_answer',
    thinkingLevel: 'applying',
    question: 'Differentiate between an HTTP GET request and an HTTP POST request in web applications, in terms of parameter location, caching, and security for user credentials.',
    correctAnswer: 'GET appends query parameters directly into the visible URL, is cached by browsers, and should never be used for sensitive credentials. POST sends parameters inside the encrypted request payload body, is not cached by default, and is the standard method for user authentication and state-modifying actions.',
    explanation: 'GET is designed for safe, idempotent data retrieval; POST is designed for submitting payloads and mutating server state.',
    rubricCriteria: '2 marks for URL parameters vs Request Body + 2 marks for caching and security implications.'
  },

  // --- Unit 4: Web Design and User Experience ---
  {
    chapterId: 'ch-4',
    lessonId: 'les-4-1',
    type: 'mcq',
    thinkingLevel: 'applying',
    question: 'What is the primary technical distinction between Vector graphics (e.g. SVG) and Raster graphics (e.g. JPEG, PNG) when designing responsive web interfaces across diverse screen resolutions?',
    options: [
      'Vector graphics use mathematical geometric paths and scale infinitely without loss of clarity, whereas Raster graphics consist of pixel grids that become blurry or pixelated when enlarged',
      'Raster graphics can only display black and white colors',
      'Vector graphics always result in significantly larger file sizes than any PNG',
      'Vector graphics cannot be rendered by modern web browsers'
    ],
    correctAnswer: 'Vector graphics use mathematical geometric paths and scale infinitely without loss of clarity, whereas Raster graphics consist of pixel grids that become blurry or pixelated when enlarged',
    explanation: 'SVG vector files define lines and curves mathematically, ensuring crisp sharpness on 4K/Retina displays as well as smartphones.',
    rubricCriteria: 'Full mark for highlighting mathematical paths vs pixel grids and scalability.'
  },
  {
    chapterId: 'ch-4',
    lessonId: 'les-4-4',
    type: 'short_answer',
    thinkingLevel: 'evaluating',
    question: 'In iterative web application optimization, explain how A/B Testing allows engineers to scientifically determine which user interface layout maximizes student exam completions.',
    correctAnswer: 'A/B Testing routes incoming users randomly to two live variants (Variant A: baseline layout, Variant B: redesigned layout) concurrently. By measuring conversion metrics (completion rate, time-to-finish) under identical conditions, developers choose the winning design backed by quantitative behavioral data rather than subjective guessing.',
    explanation: 'A/B Testing provides empirical, data-driven evidence to evaluate UI/UX modifications.',
    rubricCriteria: '2 marks for explaining randomized concurrent split + 2 marks for objective metric-driven decision making.'
  }
];

export function generateCurriculumQuestions(
  chapterId: string,
  lessonId: string,
  questionType: QuestionType,
  thinkingLevel: ThinkingLevel,
  lessonTitle: string,
  language: 'ar' | 'en' = 'ar'
): QuestionItem[] {
  const isEn = language === 'en';
  const targetBank = isEn ? CURRICULUM_QUESTION_BANK_EN : CURRICULUM_QUESTION_BANK;

  let filtered = targetBank.filter(q => {
    const matchLesson = lessonId === 'all' || q.lessonId === lessonId || q.chapterId === chapterId;
    const matchType = questionType === 'all' || q.type === questionType;
    const matchLevel = thinkingLevel === 'all' || q.thinkingLevel === thinkingLevel;
    return matchLesson && matchType && matchLevel;
  });

  if (filtered.length < 3) {
    const backup = targetBank.filter(q => {
      const matchChapter = q.chapterId === chapterId || chapterId === 'all';
      const matchType = questionType === 'all' || q.type === questionType;
      return matchChapter && matchType;
    });
    filtered = Array.from(new Set([...filtered, ...backup]));
  }

  if (filtered.length === 0) {
    return generateCustomQuestionsForNewLesson(chapterId, lessonId, lessonTitle, questionType, thinkingLevel, language);
  }

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const count = Math.min(Math.max(3, Math.floor(Math.random() * 2) + 4), shuffled.length);
  const selected = shuffled.slice(0, count);

  return selected.map((q, idx) => ({
    id: `curr-${Date.now()}-${idx + 1}`,
    type: q.type,
    thinkingLevel: q.thinkingLevel,
    question: q.question,
    codeSnippet: q.codeSnippet,
    options: q.options ? [...q.options] : undefined,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    rubricCriteria: q.rubricCriteria,
    chapterId: q.chapterId,
    lessonId: q.lessonId,
    language,
  }));
}

function generateCustomQuestionsForNewLesson(
  chapterId: string,
  lessonId: string,
  lessonTitle: string,
  questionType: QuestionType,
  thinkingLevel: ThinkingLevel,
  language: 'ar' | 'en' = 'ar'
): QuestionItem[] {
  const ts = Date.now();
  const level: 'remembering' | 'applying' | 'evaluating' = 
    thinkingLevel === 'all' ? 'applying' : thinkingLevel;

  const isEn = language === 'en';

  const questions: QuestionItem[] = isEn
    ? [
        {
          id: `custom-${ts}-1`,
          type: 'mcq',
          thinkingLevel: level === 'remembering' ? 'remembering' : 'applying',
          question: `In the context of "${lessonTitle}", which technical implementation or security standard complies with official curriculum specifications?`,
          options: [
            `Analyze security requirements and apply standard architectural guidelines for ${lessonTitle}`,
            'Bypass encryption and edge controls assuming networks are secure by default',
            'Use hardcoded static credentials across all endpoints without authentication',
            'Disable firewalls and network segmentation to accelerate data transfers'
          ],
          correctAnswer: `Analyze security requirements and apply standard architectural guidelines for ${lessonTitle}`,
          explanation: `The Egyptian curriculum focuses on connecting theoretical comprehension of "${lessonTitle}" with secure, standard engineering practices.`,
          rubricCriteria: `Full mark for identifying standard architectural guidelines aligned with ${lessonTitle}.`,
          chapterId,
          lessonId,
          language: 'en',
        },
        {
          id: `custom-${ts}-2`,
          type: 'true_false',
          thinkingLevel: 'applying',
          question: `The concepts taught in "${lessonTitle}" are purely theoretical abstractions with no practical bearing on modern web applications, AI models, or cybersecurity perimeters.`,
          correctAnswer: 'False',
          explanation: `The statement is false; the Egyptian curriculum directly connects theoretical concepts to real-world software, AI systems, and defensive cybersecurity measures.`,
          rubricCriteria: '1 mark for selecting False + 1 mark for justifying real-world practical integration.',
          chapterId,
          lessonId,
          language: 'en',
        },
        {
          id: `custom-${ts}-3`,
          type: 'short_answer',
          thinkingLevel: 'evaluating',
          question: `Examination Task: Provide a brief technical analysis explaining the strategic importance of "${lessonTitle}" in national digital transformation, identifying one practical engineering challenge developers face during deployment.`,
          correctAnswer: `"${lessonTitle}" is vital for engineering resilient, secure digital infrastructure. A key challenge is balancing high security and rigorous encryption with low-latency user experience and accessibility.`,
          explanation: `The curriculum cultivates analytical thinking, problem-solving, and adherence to international engineering standards.`,
          rubricCriteria: '2 marks for contextual strategic analysis + 2 marks for analyzing engineering challenges and mitigations.',
          chapterId,
          lessonId,
          language: 'en',
        }
      ]
    : [
        {
          id: `custom-${ts}-1`,
          type: 'mcq',
          thinkingLevel: level === 'remembering' ? 'remembering' : 'applying',
          question: `في سياق درس «${lessonTitle}»، ما هو الإجراء الأمني أو المفهوم البرمجي الأنسب المعتمد في مواصفات الوزارة؟`,
          options: [
            `تحليل متطلبات الأمان والتطبيق النموذجي لقواعد المنهج في موضوع ${lessonTitle}`,
            'تجاهل ضوابط الحوسبة الطرفية والتشفير والاعتماد على افتراض الأمان التلقائي',
            'استخدام كلمات مرور ثابتة ومشتركة دون تفعيل أي وسيلة مصادقة إضافية',
            'تعطيل جدار الحماية والمنطقة المعزولة لتسريع تدفق البيانات'
          ],
          correctAnswer: `تحليل متطلبات الأمان والتطبيق النموذجي لقواعد المنهج في موضوع ${lessonTitle}`,
          explanation: `يركز موضوع «${lessonTitle}» في مقرر البكالوريا على الربط بين الفهم النظري والممارسة العملية الآمنة.`,
          rubricCriteria: 'درجة كاملة لاختيار الإجراء الصحيح مع توضيح ارتباطه بدرس ' + lessonTitle,
          chapterId,
          lessonId,
          language: 'ar',
        },
        {
          id: `custom-${ts}-2`,
          type: 'true_false',
          thinkingLevel: 'applying',
          question: `تطبيق المفاهيم الواردة في درس «${lessonTitle}» يقتصر فقط على الجانب النظري ولا يرتبط بأي حماية أمنية أو تقنيات شبكات وبرمجة في الواقع العملي.`,
          correctAnswer: 'خطأ',
          explanation: `العبارة خاطئة تماماً؛ فمنهج البرمجة والذكاء الاصطناعي للصف الثاني بالبكالوريا يربط المفاهيم النظرية مباشرة بحماية الشبكات والتطبيقات البرمجية الواقعية.`,
          rubricCriteria: 'درجة لتحديد الخطأ + درجة لتقديم التعليل المناسب.',
          chapterId,
          lessonId,
          language: 'ar',
        },
        {
          id: `custom-${ts}-3`,
          type: 'short_answer',
          thinkingLevel: 'evaluating',
          question: `سؤال امتحاني: اكتب تحليلاً موجزاً يوضح أهمية موضوع «${lessonTitle}» في تعزيز منظومة التكنولوجيا والأمن الرقمي في مصر، موضحاً تحدياً عملياً قد يواجه المهندس أو المطور أثناء التنفيذ.`,
          correctAnswer: `تكمن أهمية درس «${lessonTitle}» في بناء بنية تحتية رقمية آمنة وموثوقة تواكب التحول الرقمي. ومن أبرز التحديات: الموازنة بين سهولة استخدام الخدمات من قِبل الجمهور وبين فرض أعلى معايير الأمان والتشفير.`,
          explanation: `يستهدف المنهج تنمية التفكير النقدي وتطبيق المعايير الدولية للاستخدام الآمن والمسؤول لتكنولوجيا المعلومات.`,
          rubricCriteria: 'درجتان للتحليل المنهجي + درجتان لبيان التحدي العملي وسبل معالجته.',
          chapterId,
          lessonId,
          language: 'ar',
        }
      ];

  if (questionType === 'all') {
    return questions;
  }
  return questions.filter(q => q.type === questionType);
}

