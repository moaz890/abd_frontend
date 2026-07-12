/**
 * contentDefaults.ts — Frontend mirror of backend/src/data/contentDefaults.js
 *
 * Used by:
 *   - lib/content.ts  → deepMerge(DEFAULT_SITE_CONTENT, apiData)
 *   - Any component as fallback when API is unavailable
 *
 * RULE: Never import raw Arabic strings directly into components.
 *       Always receive content via props from page.tsx.
 *
 * Phase 04.
 */

import type { SiteContent } from './types';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  // ── Hero ────────────────────────────────────────────────────────────────────
  hero: {
    badge:      '🌟 الشريك الموثوق للتقنية',
    titleLine1: 'ABD — اي بي دي',
    titleLine2: 'هواتفك الذكية بين يديك',
    subtitle:
      'احصل على أحدث الهواتف الذكية بتقسيط مرن ومريح يناسب دخلك، بدون تعقيدات وبخدمة سعودية أصيلة.',
    ctaText:  'تحقق من أهليتك الآن',
    imageUrl: '/assests/hero.webp',
    trustBadges: [
      { icon: '🔒', label: 'معاملات آمنة 100%' },
      { icon: '⚡', label: 'موافقة فورية' },
      { icon: '🇸🇦', label: 'خدمة سعودية أصيلة' },
    ],
  },

  // ── Lead Form Section ────────────────────────────────────────────────────────
  leadFormSection: {
    badge:    '✅ تحقق من أهليتك',
    title:    'هل أنت مؤهل للحصول على هاتف بالتقسيط؟',
    subtitle:
      'تواصل معنا عبر واتساب وسيساعدك فريقنا في التحقق من أهليتك خلال دقائق.',
    consentText:
      'اضغط على الزر أدناه للتواصل مباشرة مع فريق ABD — اي بي دي عبر واتساب.',
  },

  // ── Form Labels ─────────────────────────────────────────────────────────────
  formLabels: {
    fullName:                   'الاسم الكامل',
    phone:                      'رقم الجوال',
    ageGroup:                   'هل عمرك 20 سنة أو أكثر؟',
    residency:                  'الجنسية',
    monthlySalary:              'الراتب الشهري (ريال)',
    monthlyObligations:         'الالتزامات الشهرية (ريال)',
    realEstateLoan:             'هل لديك قرض عقاري؟',
    workSector:                 'جهة العمل',
    serviceDuration:            'مدة الخدمة في الجهة الحالية',
    nextButton:                 'التالي',
    backButton:                 'السابق',
    submitButton:               'تحقق من أهليتي',
    ageQualified:               'نعم، عمري 20 سنة أو أكثر',
    ageNotQualified:            'لا، عمري أقل من 20 سنة',
    citizen:                    'مواطن سعودي',
    resident:                   'مقيم',
    loanYes:                    'نعم',
    loanNo:                     'لا',
    sectorGovernment:           'قطاع حكومي',
    sectorPrivateCompany:       'شركة خاصة',
    sectorPrivateEstablishment: 'منشأة خاصة',
    sectorRetired:              'متقاعد',
    durationLess:               'أقل من 3 أشهر',
    durationMore:               'أكثر من 3 أشهر',
  },

  // ── Features ────────────────────────────────────────────────────────────────
  features: {
    badge:          '✨ لماذا ABD؟',
    title:          'مميزات لا مثيل',
    titleHighlight: 'لها',
    subtitle:
      'نقدم لك تجربة تسوق استثنائية مع أفضل العروض وأسرع الخدمات في المملكة.',
    items: [
      {
        id:        'feature-1',
        heading:   'أقساط مرنة تناسبك',
        paragraph: 'نوفر خطط تقسيط متعددة تبدأ من 3 أشهر وحتى 24 شهراً بدون فوائد مخفية.',
        imageUrl:  '/assests/feature-1.webp',
      },
      {
        id:        'feature-2',
        heading:   'أحدث الأجهزة دائماً',
        paragraph: 'نحتفظ بأحدث إصدارات Apple وSamsung وغيرها من الشركات العالمية الكبرى.',
        imageUrl:  '/assests/feature-2.webp',
      },
      {
        id:        'feature-3',
        heading:   'خدمة عملاء 24/7',
        paragraph: 'فريقنا جاهز لمساعدتك على مدار الساعة عبر واتساب أو الاتصال المباشر.',
        imageUrl:  '/assests/feature-3.webp',
      },
      {
        id:        'feature-4',
        heading:   'ضمان وما بعد البيع',
        paragraph: 'جميع أجهزتنا مصحوبة بضمان رسمي وخدمة ما بعد البيع التي تُريحك من أي قلق.',
        imageUrl:  '/assests/feature-4.webp',
      },
    ],
    shopPromo: {
      imageUrl:          '/assests/shopping.webp',
      imageAlt:          'متجر ABD — اي بي دي للهواتف الذكية',
      heading:           'تسوق الآن من متجرنا الإلكتروني',
      subtextBefore:     'ادفع بـ',
      subtextHighlight:  'تابي أو تمارة',
      subtextAfter:      ' وقسّط بدون فوائد على 4 دفعات.',
      storeUrl:          'https://store.abd.sa',
      ctaText:           'تسوق الآن',
    },
  },

  // ── Testimonials ────────────────────────────────────────────────────────────
  testimonials: [
    {
      id: 't1', name: 'محمد العمري', order: 1, rating: 5, monthsAgo: 1,
      avatar_url: null,
      text: 'خدمة ممتازة وسرعة في التوصيل. حصلت على جهازي في نفس اليوم والأقساط كانت في المتناول تماماً.',
    },
    {
      id: 't2', name: 'سارة القحطاني', order: 2, rating: 5, monthsAgo: 2,
      avatar_url: null,
      text: 'تعاملت مع ABD مرتين وفي كل مرة كانت التجربة رائعة. الموظفون محترفون ويشرحون كل شيء بوضوح.',
    },
    {
      id: 't3', name: 'عبدالرحمن الدوسري', order: 3, rating: 5, monthsAgo: 3,
      avatar_url: null,
      text: 'سعر الجهاز مناسب جداً مقارنة بالسوق، والتقسيط مريح. أنصح الجميع بالتعامل مع ABD.',
    },
    {
      id: 't4', name: 'نورة الشهراني', order: 4, rating: 5, monthsAgo: 1,
      avatar_url: null,
      text: 'أفضل تجربة شراء هاتف على الإطلاق. ما توقعت يكون التعامل بهالسهولة والسرعة.',
    },
    {
      id: 't5', name: 'فهد المطيري', order: 5, rating: 4, monthsAgo: 2,
      avatar_url: null,
      text: 'الخدمة احترافية وفريق العمل ودود. حصلت على عرض تقسيط ممتاز على آيفون الجديد.',
    },
  ],

  // ── FAQs ────────────────────────────────────────────────────────────────────
  faqs: [
    {
      id: 'faq-1', order: 1,
      q: 'من يمكنه التقدم للحصول على التقسيط؟',
      a: 'يمكن لأي مواطن سعودي أو مقيم يبلغ من العمر 20 عاماً أو أكثر ولديه دخل شهري ثابت التقدم للحصول على التقسيط.',
    },
    {
      id: 'faq-2', order: 2,
      q: 'ما هي المستندات المطلوبة؟',
      a: 'الهوية الوطنية أو الإقامة، وما يثبت الدخل (كشف راتب أو خطاب عمل). فريقنا سيرشدك بالتفاصيل بعد التواصل معك.',
    },
    {
      id: 'faq-3', order: 3,
      q: 'كم يستغرق الحصول على الموافقة؟',
      a: 'يتم مراجعة الطلبات خلال 24 ساعة من أيام العمل، وسيتواصل معك أحد ممثلينا لإكمال الإجراءات.',
    },
    {
      id: 'faq-4', order: 4,
      q: 'هل يمكنني الشراء بدون تقسيط؟',
      a: 'بالطبع! نقبل الدفع نقداً أو ببطاقة الائتمان أو الدفع عبر نظام تابي وتمارة بدون فوائد.',
    },
    {
      id: 'faq-5', order: 5,
      q: 'ما هي ضمانات الأجهزة؟',
      a: 'جميع الأجهزة تأتي بضمان المصنع الأصلي (سنة كاملة أو أكثر)، ونقدم أيضاً خدمة دعم ما بعد البيع.',
    },
  ],

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    whatsapp:             '966500000000',
    email:                'info@abd.sa',
    tiktok:               'https://tiktok.com/@abd.sa',
    snapchat:             'https://snapchat.com/add/abd_sa',
    crNumber:             '1010000000',
    taxNumber:            '300000000000003',
    businessCenterNumber: '1010000000',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1700000000000!5m2!1sar!2ssa',
    mapsExternalUrl: 'https://maps.google.com/?q=24.7136,46.6753',
    copyrightText:   '© 2025 ABD — اي بي دي. جميع الحقوق محفوظة.',
  },

  // ── Logo ─────────────────────────────────────────────────────────────────────
  logoUrl: '/assests/logo.webp',

  // ── SEO ──────────────────────────────────────────────────────────────────────
  seo: {
    title:         'ABD — اي بي دي | هواتف ذكية وتقسيط مرن',
    description:
      'احصل على أحدث الهواتف الذكية من ABD — اي بي دي بتقسيط مرن ومريح. خدمة سريعة وموثوقة في المملكة العربية السعودية.',
    ogTitle:       'ABD — اي بي دي | هواتفك الذكية بين يديك',
    ogDescription:
      'تقسيط مرن على أحدث هواتف Apple وSamsung وغيرها. تحقق من أهليتك الآن.',
  },

  // ── Success Page ─────────────────────────────────────────────────────────────
  successPage: {
    title:            '🎉 تم استلام طلبك بنجاح!',
    subtitle:
      'شكراً لك! سيتواصل معك أحد ممثلي فريق ABD — اي بي دي خلال 24 ساعة من أيام العمل لإتمام الإجراءات.',
    whatsapp:         '966500000000',
    whatsappMessage:
      'مرحباً، أنا مهتم بعروض ABD — اي بي دي وأرغب في معرفة المزيد.',
  },
};
