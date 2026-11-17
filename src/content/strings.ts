/**
 * CENTRALISED UI STRINGS — BRIDGIO Learn-to-Hire.
 *
 * Arabic wording here is DRAFT, awaiting owner / Arabic reviewer approval.
 * It is deliberately kept in one file so it can be replaced without touching
 * components. Brand and AI names live here so a rename is a swap, not a rebuild.
 *
 * Voice rules (LIVE_RULES §4, C26 LOCKED):
 *  - academy / instructor / desk copy: MSA formal
 *  - learner copy: Egyptian casual (not built in Batch 1)
 *  - running text keeps Latin "Bridgio"; the logo itself is artwork, never retyped.
 *
 * The wordmark is artwork and is never retyped in a font; `wordmarkText` is for
 * documentation / alt text only and must not be rendered as the logo text.
 */

import { countPhrase, englishCount, type NounForms } from './plural'
import type { NavScreenId } from '~/shell/nav'

export const brand = {
  /** Running-text name. */
  name: 'Bridgio',
  /** Brand line, locked. */
  line: "Your bridge to what's next",
  lineAr: 'جسرك إلى ما هو التالي',
  /** Logo lettering is artwork; this string is only for alt text / docs. */
  wordmarkText: 'BRIDGIO',
} as const

export const assistant = {
  name: 'Mohsen',
  nameAr: 'محسن',
} as const

/**
 * Swap points for the two working names. Every Arabic string that mentions a
 * name interpolates these two consts, so a rename is a one-line change here
 * plus the matching artwork file name.
 */
const B = brand.name
const M = assistant.nameAr

/** Counted nouns for academy copy. Academy register is formal MSA. */
const cohortsMsa: NounForms = {
  one: 'فوج واحد',
  two: 'فوجان',
  few: 'أفواج',
  many: 'فوجًا',
}
const learnersMsa: NounForms = {
  one: 'متدرّب واحد',
  two: 'متدرّبان',
  few: 'متدرّبين',
  many: 'متدرّبًا',
}
const lessonsMsa: NounForms = {
  one: 'درس واحد',
  two: 'درسان',
  few: 'دروس',
  many: 'درسًا',
}
const unitsMsa: NounForms = {
  one: 'وحدة واحدة',
  two: 'وحدتان',
  few: 'وحدات',
  many: 'وحدة',
}
const sessionsMsa: NounForms = {
  one: 'جلسة واحدة',
  two: 'جلستان',
  few: 'جلسات',
  many: 'جلسة',
}
const seatsMsa: NounForms = {
  one: 'مقعد واحد',
  two: 'مقعدان',
  few: 'مقاعد',
  many: 'مقعدًا',
}

/** Help Center categories; the view shows a role-scoped subset in this order. */
export type HelpCategory =
  | 'gettingStarted'
  | 'academy'
  | 'instructor'
  | 'account'
  | 'faq'

/**
 * Link targets an article or guide step can point at. The matching routes live
 * in `src/shell/help-links.ts`, because URLs are code, not copy.
 */
export type HelpLinkId =
  | 'profile'
  | 'onboarding'
  | 'dashboard'
  | 'cohorts'
  | 'roster'
  | 'curriculum'
  | 'rubrics'
  | 'earnings'

/** One Help Center article: a single task with short numbered steps. */
export interface HelpArticle {
  category: HelpCategory
  title: string
  body: string
  steps: string[]
  link?: HelpLinkId
}

/** One numbered step of a role walkthrough on `/guide`. */
export interface GuideStep {
  title: string
  body: string
  link: HelpLinkId
}

/**
 * Preview roles (`?as`) — diagnostic UI state only, never auth. The canonical
 * union lives in `~/shell/nav` as `AppRole`; this alias is kept out of the
 * string file so copy does not depend on routing.
 */

/** DRAFT Arabic — not approved final copy. */
export const ar = {
  head: {
    title: `${B} — أكاديمية اللغات والتوظيف`,
    description:
      'منصّة الأكاديميات والمدربين: الأفواج والقوائم والحضور والمناهج ومعايير التقييم والأرباح.',
  },
  header: {
    navLabel: 'التنقّل الرئيس',
    wordmarkAlt: `شعار ${B}`,
    skipToMain: 'تخطَّ إلى المحتوى',
    menuLabel: 'افتح قائمة التنقّل',
    menuCloseLabel: 'إغلاق القائمة',
    utilityLabel: 'شريط الأدوات',
    langLabel: 'اللغة',
    langToEnglish: 'English',
    langToArabic: 'العربية',
    langGlyphEnglish: 'EN',
    langGlyphArabic: 'ع',
    assistantLabel: 'المحادثات',
    assistantOpenLabel: 'افتح المحادثات',
    accountLabel: 'الحساب',
    themeLabel: 'المظهر',
    themeToDark: 'المظهر الداكن',
    themeToLight: 'المظهر الفاتح',
  },
  /** Primary navigation sidebar. */
  sidebar: {
    navLabel: 'التنقّل الرئيس',
    openLabel: 'افتح قائمة التنقّل',
    closeLabel: 'إغلاق القائمة',
    collapseLabel: 'طيّ',
    expandLabel: 'توسيع',
    utilitiesLabel: 'روابط مساعدة',
    helpLabel: 'المساعدة',
    guideLabel: 'الدليل',
    profileLabel: 'الملف الشخصي',
  },
  /** Nav item labels — academy register is formal MSA. */
  nav: {
    'academy-dashboard': 'لوحة الأكاديمية',
    'academy-onboarding': 'التهيئة والمعايرة',
    'academy-cohorts': 'الأفواج',
    'academy-curriculum': 'المناهج',
    'academy-rubrics': 'معايير التقييم',
    'academy-earnings': 'الأرباح',
  } as Record<NavScreenId, string>,
  common: {
    loading: 'جارٍ التحميل...',
    loadErrorTitle: 'تعذّر تحميل البيانات.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    retry: 'أعد المحاولة',
    emptyTitle: 'لا توجد بيانات بعد',
    emptyBody: 'ستظهر البيانات هنا بمجرد إضافتها.',
    demoNotice:
      'بيانات تجريبية — لا توجد بيانات أكاديمية أو مالية حقيقية متصلة بهذه المعاينة.',
    notAvailable: 'غير متاح',
    notAssessed: 'غير مُقاس',
    language: 'اللغة',
    level: 'المستوى',
    status: 'الحالة',
    cohort: 'الفوج',
    session: 'الجلسة',
    duration: 'المدة',
    instructor: 'المدرب',
    schedule: 'الجدول',
    capacity: 'السعة',
    seats: 'المقاعد',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    updatedAt: 'آخر تحديث',
    price: 'السعر',
    pricePlaceholder: '[السعر]',
    provisionalFigures:
      'أرقام أولية — لم تُعتمد بعد من المراجعة القانونية والمالية.',
    save: 'احفظ',
    saving: 'جارٍ الحفظ...',
    cancel: 'إلغاء',
    open: 'افتح',
    createdAt: 'أُنشئ في',
    date: 'التاريخ',
    reference: 'المرجع',
    description: 'الوصف',
    total: 'الإجمالي',
    actions: 'إجراء',
  },
  status: {
    cohort: {
      draft: 'مسودة',
      published: 'منشور',
      active: 'نشط',
      completed: 'مكتمل',
    } as Record<'draft' | 'published' | 'active' | 'completed', string>,
    onboarding: {
      complete: 'مكتمل',
      in_progress: 'قيد التنفيذ',
      pending: 'في الانتظار',
      blocked: 'متوقف',
    } as Record<'complete' | 'in_progress' | 'pending' | 'blocked', string>,
    calibration: {
      not_started: 'لم تبدأ',
      in_review: 'قيد المراجعة',
      calibrated: 'تمت المعايرة',
      changes_requested: 'مطلوب تعديلات',
    } as Record<
      'not_started' | 'in_review' | 'calibrated' | 'changes_requested',
      string
    >,
    roster: {
      active: 'نشط',
      invited: 'مدعو',
      withdrawn: 'منسحب',
    } as Record<'active' | 'invited' | 'withdrawn', string>,
    attendance: {
      present: 'حاضر',
      late: 'متأخر',
      absent: 'غائب',
      excused: 'بعذر',
      not_recorded: 'لم يُسجّل',
    } as Record<
      'present' | 'late' | 'absent' | 'excused' | 'not_recorded',
      string
    >,
    lessonKind: {
      lesson: 'درس',
      practice: 'تدريب',
      assessment: 'تقييم',
    } as Record<'lesson' | 'practice' | 'assessment', string>,
    rubric: {
      draft: 'مسودة',
      published: 'منشور',
    } as Record<'draft' | 'published', string>,
    dimension: {
      pronunciation: 'النطق',
      fluency: 'الطلاقة',
      empathy: 'التعاطف',
      vocabulary: 'المفردات',
      listening: 'الاستماع',
    } as Record<
      'pronunciation' | 'fluency' | 'empathy' | 'vocabulary' | 'listening',
      string
    >,
    session: {
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
    } as Record<'scheduled' | 'completed' | 'cancelled', string>,
    ledgerType: {
      tuition: 'رسوم دراسية',
      escrow_hold: 'حجز ضمان',
      instructor_share: 'حصة المدرب',
      platform_fee: 'رسوم المنصة',
      payout: 'صرف',
      adjustment: 'تسوية',
    } as Record<
      | 'tuition'
      | 'escrow_hold'
      | 'instructor_share'
      | 'platform_fee'
      | 'payout'
      | 'adjustment',
      string
    >,
    ledgerStatus: {
      pending: 'قيد الانتظار',
      held: 'محجوز',
      available: 'متاح',
      paid: 'مدفوع',
      reversed: 'معكوس',
    } as Record<
      'pending' | 'held' | 'available' | 'paid' | 'reversed',
      string
    >,
    payout: {
      scheduled: 'مجدول',
      processing: 'قيد المعالجة',
      paid: 'مدفوع',
      on_hold: 'متوقف',
    } as Record<'scheduled' | 'processing' | 'paid' | 'on_hold', string>,
    payoutAccount: {
      not_connected: 'غير متصل',
      pending: 'قيد التحقق',
      verified: 'موثّق',
    } as Record<'not_connected' | 'pending' | 'verified', string>,
    alert: {
      attendance_due: 'حضور بحاجة إلى تسجيل',
      roster_incomplete: 'قائمة فوج غير مكتملة',
      curriculum_draft: 'منهج في المسودة',
      rubric_draft: 'معيار تقييم في المسودة',
      payout_profile: 'ملف الصرف غير مكتمل',
    } as Record<
      | 'attendance_due'
      | 'roster_incomplete'
      | 'curriculum_draft'
      | 'rubric_draft'
      | 'payout_profile',
      string
    >,
  },
  /** Screen 11 — partner onboarding and calibration. */
  onboarding: {
    headTitle: `التهيئة والمعايرة — ${B}`,
    badge: 'تهيئة الشريك',
    title: 'التهيئة والمعايرة',
    lead:
      'أكمل خطوات تهيئة الشريك ثم اعتمد المعايرة قبل نشر الأفواج على المنصة. لا يبدأ استقبال المتدرّبين قبل اعتماد خطوة المعايرة.',
    completion: (percent: number) => `نسبة الإنجاز ${percent}٪`,
    stepsHeading: 'خطوات التهيئة',
    calibrationHeading: 'المعايرة',
    calibrationBody:
      'يراجع فريق المعايرة عيّنة من الدروس ومعيار التقييم قبل فتح الأفواج. حالة المراجعة تظهر كما يعيدها النظام، ولا تُحدَّث من الواجهة.',
    reviewer: 'الجهة المراجعة',
    rubricVersion: 'إصدار معيار التقييم',
    appealOwner: 'مسؤول الاعتراضات',
    appealOwnerReady: 'معتمد',
    appealOwnerMissing: 'غير معتمد',
    samples: (reviewed: number, required: number) =>
      `${reviewed} من ${required} دروس عيّنة`,
    languagesHeading: 'لغات التدريس',
    languageDirection: (label: string) => `اتجاه المحتوى: ${label}`,
    directionLabels: {
      ltr: 'من اليسار إلى اليمين',
      rtl: 'من اليمين إلى اليسار',
    } as Record<'ltr' | 'rtl', string>,
    markComplete: 'أكمل الخطوة',
    complete: 'الخطوة مكتملة',
    blockedNote: 'تتوقف هذه الخطوة على المراجعة المالية.',
    notice:
      'المعايرة والتهيئة نموذج مقترح في هذه النسخة التجريبية. لا يوجد اتصال بمنصة Mentingo بعد.',
    steps: {
      profile: {
        title: 'ملف الشريك',
        body: 'اسم الأكاديمية وبريد التواصل المعتمد.',
      },
      languages: {
        title: 'لغات التدريس',
        body: 'اللغات التي تدرّسها الأكاديمية ومستوياتها.',
      },
      sample_lesson: {
        title: 'درس عيّنة',
        body: 'درس واحد لكل لغة يراجعه فريق المعايرة.',
      },
      rubric_calibration: {
        title: 'معايرة معيار التقييم',
        body: 'اعتماد معيار التقييم قبل نشر الأفواج.',
      },
      payout_profile: {
        title: 'ملف الصرف',
        body: 'بيانات الصرف والمراجعة المالية. الأرقام أولية.',
      },
    } as Record<
      'profile' | 'languages' | 'sample_lesson' | 'rubric_calibration' | 'payout_profile',
      { title: string; body: string }
    >,
  },
  /** Screen 12 — academy dashboard. */
  dashboard: {
    headTitle: `لوحة الأكاديمية — ${B}`,
    badge: 'الأكاديمية',
    title: 'لوحة الأكاديمية',
    lead:
      'الأفواج النشطة والجلسات القادمة وما يحتاج انتباهك في شاشة واحدة. الأرقام كما يعيدها النظام، والأرباح أولية.',
    greeting: (name: string) => `أهلًا، ${name}.`,
    cohortsCount: (count: number) => countPhrase(count, cohortsMsa),
    learnersCount: (count: number) => countPhrase(count, learnersMsa),
    sessionsCount: (count: number) => countPhrase(count, sessionsMsa),
    totals: {
      cohorts: 'أفواج نشطة',
      learners: 'متدرّبون نشطون',
      sessions: 'جلسات هذا الأسبوع',
    },
    calibration: {
      heading: 'المعايرة',
      open: 'افتح التهيئة والمعايرة',
      samples: (reviewed: number, required: number) =>
        `${reviewed} من ${required} دروس عيّنة`,
    },
    upcoming: {
      heading: 'الجلسات القادمة',
      lead: 'أقرب الجلسات المجدولة عبر كل الأفواج.',
      emptyTitle: 'لا جلسات مجدولة',
      emptyBody: 'ستظهر الجلسات هنا بمجرد جدولتها في الأفواج.',
      duration: (minutes: number) => `${minutes} دقيقة`,
    },
    cohorts: {
      heading: 'الأفواج النشطة',
      open: 'افتح منشئ الأفواج',
      emptyTitle: 'لا أفواج نشطة',
      emptyBody: 'أنشئ فوجًا وانشر مقاعده ليظهر هنا.',
    },
    alerts: {
      heading: 'يحتاج انتباهك',
      lead: 'عناصر ناقصة تمنع النشر أو الصرف.',
      emptyTitle: 'لا عناصر معلّقة',
      emptyBody: 'كل ما يحتاج إجراءً مكتمل الآن.',
      count: (count: number) => `${count}`,
    },
    earnings: {
      heading: 'الأرباح المتاحة',
      provisional: 'أولي',
      open: 'افتح دفتر الأرباح',
      note: 'الأرقام أولية حتى اعتماد المراجعة القانونية والمالية.',
    },
    updatedAt: 'آخر تحديث',
  },
  /** Screen 13 — cohort builder and seat publisher. */
  cohorts: {
    headTitle: `الأفواج — ${B}`,
    badge: 'الأفواج',
    title: 'منشئ الأفواج ونشر المقاعد',
    lead:
      'أنشئ فوجًا بلغة ومستوى ومدرب وجدول واضح، ثم انشر مقاعده. لا يُنشر الفوج قبل اكتمال الجدول.',
    listHeading: 'الأفواج',
    seatsLabel: (filled: number, capacity: number) =>
      `${filled} من ${capacity} مقعدًا`,
    seatsAvailable: (count: number) => countPhrase(count, seatsMsa),
    openRoster: 'افتح القائمة والحضور',
    publish: 'انشر المقاعد',
    published: 'المقاعد منشورة',
    publishNote:
      'نشر المقاعد يفتح الفوج للتسجيل. التسجيل والدفع ليسا جزءًا من هذه الدفعة.',
    createHeading: 'فوج جديد',
    form: {
      label: 'اسم الفوج',
      labelPlaceholder: 'مثال: الألمانية A2 — مسائي',
      language: 'اللغة',
      level: 'المستوى',
      schedule: 'الجدول',
      schedulePlaceholder: 'الأحد والثلاثاء · 18:00–19:30',
      capacity: 'السعة',
      instructor: 'المدرب',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      submit: 'أنشئ المسودة',
      submitting: 'جارٍ الإنشاء...',
      selectPlaceholder: 'اختر',
    },
    validation: {
      required: 'أكمل الحقول المطلوبة.',
      capacity: 'أدخل سعة بين 1 و200.',
    },
    emptyTitle: 'لا أفواج بعد',
    emptyBody: 'أنشئ أول فوج من النموذج أعلاه.',
    loadListError: 'تعذّر تحميل الأفواج.',
    createdNote: 'أُنشئ الفوج كمسودة. راجع الجدول ثم انشر المقاعد.',
    conflict:
      'كل المقاعد مشغولة. افتح فوجًا جديدًا بدلًا من تجاوز السعة.',
    priceNote: 'السعر يُعرض كعنصر نائب حتى اعتماد نطاقات التسعير.',
  },
  /** Screen 14 — roster and attendance. */
  roster: {
    headTitle: `القائمة والحضور — ${B}`,
    badge: 'القائمة والحضور',
    title: 'قائمة الفوج والحضور',
    lead:
      'قائمة المتدرّبين وجلسات الفوج وسجل الحضور. نموذج الحضور مقترح في هذه النسخة، وكل رقم حضور يعود إلى جلسة مسجّلة.',
    back: 'عد إلى الأفواج',
    membersHeading: 'المتدرّبون',
    sessionsHeading: 'الجلسات',
    sheetHeading: 'سجل الحضور',
    attendanceRate: 'نسبة الحضور',
    attendanceRateValue: (percent: number) => `${percent}٪`,
    recordedSessions: (count: number) => countPhrase(count, sessionsMsa),
    joinedAt: 'تاريخ الانضمام',
    email: 'البريد الإلكتروني',
    learner: 'المتدرّب',
    statusColumn: 'الحالة',
    sessionTopic: 'الموضوع',
    sessionDate: 'التاريخ',
    duration: (minutes: number) => `${minutes} دقيقة`,
    markAllPresent: 'سجّل الجميع حاضرين',
    save: 'احفظ الحضور',
    saving: 'جارٍ الحفظ...',
    saved: 'حُفظ الحضور.',
    selectSession: 'اختر جلسة لعرض سجل الحضور.',
    noMembersTitle: 'لا متدرّبين في القائمة',
    noMembersBody: 'ستظهر القائمة بعد قبول التسجيل في الفوج.',
    noSessionsTitle: 'لا جلسات بعد',
    noSessionsBody: 'ستظهر الجلسات بعد جدولتها.',
    notRecordedNote:
      'لم يُسجّل حضور هذه الجلسة بعد. اختر حالة لكل متدرّب ثم احفظ.',
    proposedNotice:
      'نموذج الحضور مقترح — لا يمثّل ميزة مؤكدة في Mentingo. الأرقام تظهر فقط بعد تسجيل جلسة.',
    noRate: 'لا نسبة بعد',
    selectAllHint: 'كل متدرّب يحتاج حالة قبل الحفظ.',
    errorSave: 'تعذّر حفظ الحضور. أعد المحاولة.',
  },
  /** Screen 15 — curriculum and lesson builder. */
  curriculum: {
    headTitle: `المناهج — ${B}`,
    badge: 'المناهج',
    title: 'منشئ المناهج والدروس',
    lead:
      'ابنِ وحدات ودروسًا لكل لغة ومستوى. لكل درس لغة محتوى واتجاه مستقلان عن لغة الواجهة.',
    listHeading: 'المناهج',
    open: 'افتح المنهج',
    unitsCount: (count: number) => countPhrase(count, unitsMsa),
    lessonsCount: (count: number) => countPhrase(count, lessonsMsa),
    createHeading: 'منهج جديد',
    form: {
      title: 'عنوان المنهج',
      description: 'الوصف',
      language: 'اللغة',
      level: 'المستوى',
      submit: 'أنشئ المسودة',
      submitting: 'جارٍ الإنشاء...',
    },
    detail: {
      unitsHeading: 'الوحدات',
      lessonsHeading: 'الدروس',
      addUnitHeading: 'أضف وحدة',
      unitTitle: 'عنوان الوحدة',
      unitObjective: 'هدف الوحدة',
      addUnit: 'أضف الوحدة',
      addLessonHeading: 'أضف درسًا',
      lessonTitle: 'عنوان الدرس',
      lessonObjective: 'هدف الدرس',
      lessonDuration: 'المدة بالدقائق',
      lessonKind: 'نوع الدرس',
      contentLanguage: 'لغة المحتوى',
      addLesson: 'أضف الدرس',
      publish: 'انشر المنهج',
      published: 'المنهج منشور',
      publishNote:
        'لا يُنشر المنهج قبل وجود درس واحد على الأقل.',
      emptyUnitsTitle: 'لا وحدات بعد',
      emptyUnitsBody: 'أضف أول وحدة ثم أضف دروسها.',
      noLessons: 'لا دروس في هذه الوحدة بعد.',
      contentDirection: (label: string) => `اتجاه المحتوى: ${label}`,
      materials: (count: number) => `${count} مواد`,
      objective: 'الهدف',
      duration: (minutes: number) => `${minutes} دقيقة`,
      back: 'عد إلى المناهج',
      updatedAt: 'آخر تحديث',
      errorPublish: 'تعذّر النشر. أضف درسًا واحدًا على الأقل.',
    },
    mohsen: {
      heading: `مسودة من ${M}`,
      lead:
        `${M} هو المساعد الذكي: يقدّم مخططًا مبدئيًا للوحدة من عنوانها وعدد الدروس. المخطط اقتراح لا يُحفظ حتى تضيفه.`,
      unitTitle: 'عنوان الوحدة',
      lessonCount: 'عدد الدروس',
      submit: 'اطلب مسودة',
      submitting: 'جارٍ الإعداد...',
      resultHeading: 'المخطط المقترح',
      grounding: 'المراجع',
      addUnit: 'أضف هذه الوحدة',
      disclaimer: 'مسودة من محسن، المساعد الذكي — راجعها قبل إضافتها إلى المنهج.',
      error: 'تعذّر إعداد المسودة. أعد المحاولة.',
    },
    emptyTitle: 'لا مناهج بعد',
    emptyBody: 'أنشئ أول منهج من النموذج أعلاه.',
    loadError: 'تعذّر تحميل المناهج.',
    validation: {
      required: 'أكمل الحقول المطلوبة.',
      duration: 'أدخل مدة بين 5 و240 دقيقة.',
    },
    createdNote: 'أُنشئ المنهج كمسودة.',
  },
  /** Screen 16 — grading rubric. */
  rubric: {
    headTitle: `معايير التقييم — ${B}`,
    badge: 'معايير التقييم',
    title: 'معيار التقييم',
    lead:
      'خمسة أبعاد، لكل بُعد وزنه ووصفه. البُعد غير المُقاس يظهر كذلك ولا يُفترض له قيمة.',
    listHeading: 'المعايير',
    open: 'افتح المعيار',
    version: (version: number) => `الإصدار ${version}`,
    versionHeading: 'الإصدار',
    dimensionsHeading: 'الأبعاد',
    dimension: 'البُعد',
    assessed: 'مُقاس',
    notAssessed: 'غير مُقاس',
    weight: 'الوزن٪',
    weightTotal: 'مجموع أوزان الأبعاد المُقاسة',
    descriptors: 'أوصاف المستويات',
    band: (band: number) => `المستوى ${band}`,
    saveWeight: 'احفظ الوزن',
    saving: 'جارٍ الحفظ...',
    publish: 'انشر المعيار',
    published: 'المعيار منشور',
    publishNote:
      'لا يُنشر المعيار قبل أن تساوي أوزان الأبعاد المُقاسة 100٪.',
    coverageNote: 'ملاحظة التغطية',
    noCoverageNote: 'لا ملاحظة تغطية من النظام.',
    updatedAt: 'آخر تحديث',
    back: 'عد إلى المعايير',
    emptyTitle: 'لا معايير بعد',
    emptyBody: 'سيظهر المعيار هنا بعد إنشائه من لوحة الأكاديمية.',
    loadError: 'تعذّر تحميل المعايير.',
    proposedNotice:
      'تغطية الأبعاد الخمسة غير مؤكدة في Mentingo. ما لا يقيسه المعيار يظهر «غير مُقاس».',
    errorWeight: 'أدخل وزنًا بين 0 و100.',
  },
  /** Screen 17 — earnings ledger. */
  earnings: {
    headTitle: `الأرباح — ${B}`,
    badge: 'الأرباح',
    title: 'دفتر الأرباح والضمان',
    lead:
      'الرسوم والضمان وحصة المدرب والصرف في دفتر واحد. كل مبلغ في هذه الشاشة أولي وحقوله نائبة.',
    provisionalHeading: 'أرقام أولية',
    provisionalBody:
      'لم تُعتمد الأرقام من المراجعة القانونية والمالية. لا يمثّل أي مبلغ هنا صرفًا حقيقيًا، والسعر يظهر كعنصر نائب.',
    summary: {
      available: 'متاح',
      pending: 'قيد الانتظار',
      held: 'محجوز في الضمان',
      paidToDate: 'المدفوع حتى الآن',
      nextPayout: 'الصرف القادم',
      payoutAccount: 'حساب الصرف',
    },
    ledgerHeading: 'الحركات',
    scheduleHeading: 'جدول الصرف',
    cohort: 'الفوج',
    amount: 'المبلغ',
    type: 'النوع',
    reference: 'المرجع',
    date: 'التاريخ',
    status: 'الحالة',
    description: 'الوصف',
    emptyTitle: 'لا حركات بعد',
    emptyBody: 'ستظهر الحركات هنا بعد أول دفعة مسجّلة.',
    emptySchedule: 'لا صرف مجدول.',
    payoutDate: 'تاريخ الصرف',
    noPayoutDate: 'لم يُحدد بعد',
    loadError: 'تعذّر تحميل دفتر الأرباح.',
    provisionalTag: 'أولي',
    escrowNote:
      'الضمان وحسم الرسوم من بنود المراجعة القانونية والمالية، ولم تُعتمد بعد.',
  },
  /**
   * In-app chat popup — human threads, mock only (N1: the header button opens
   * human messages, not the AI persona). No real-time transport claimed.
   */
  chat: {
    title: 'المحادثات',
    openLabel: 'افتح المحادثات',
    closeLabel: 'إغلاق المحادثات',
    threadsLabel: 'المحادثات',
    noThreads: 'لا توجد محادثات بعد.',
    selectThread: 'اختر محادثة لعرض الرسائل.',
    loading: 'جارٍ تحميل المحادثات...',
    loadError: 'تعذّر تحميل المحادثات. أعد المحاولة بعد قليل.',
    messagesLoading: 'جارٍ تحميل الرسائل...',
    messagesError: 'تعذّر تحميل الرسائل. أعد المحاولة بعد قليل.',
    empty: 'لا توجد رسائل بعد. اكتب أول رسالة.',
    inputLabel: 'رسالتك',
    placeholder: 'اكتب رسالتك هنا...',
    send: 'إرسال',
    sending: 'جارٍ الإرسال...',
    sendError: 'تعذّر إرسال الرسالة. أعد المحاولة.',
    youLabel: 'أنت',
    replyFrom: (name: string) => `الرد من ${name}`,
    notice: 'قناة داخل المنصة للرسائل البشرية، وليست قناة خارجية.',
    roleNames: {
      academy_owner: 'مالك الأكاديمية',
      instructor: 'المدرب',
      support: 'دعم الأكاديمية',
    } as Record<'academy_owner' | 'instructor' | 'support', string>,
  },
  auth: {
    headTitle: `تسجيل الدخول — ${B}`,
    badge: 'تسجيل الدخول',
    title: 'تسجيل الدخول',
    lead: 'سجّل الدخول للوصول إلى حسابك على المنصة.',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    submit: 'دخول',
    status:
      'تسجيل الدخول غير متاح حاليًا. المصادقة مملوكة لـ Mentingo ولم تُربط بعد.',
  },
  /** Profile / settings — session display + UI settings. */
  profile: {
    headTitle: `الملف الشخصي والإعدادات — ${B}`,
    badge: 'الملف الشخصي',
    title: 'الملف الشخصي والإعدادات',
    lead: 'تعرض هذه الشاشة بيانات الجلسة الحالية وإعدادات الواجهة.',
    loading: 'جارٍ تحميل الجلسة...',
    loadErrorTitle: 'تعذّر تحميل الجلسة.',
    loadErrorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
    sessionHeading: 'الجلسة الحالية',
    sessionName: 'الاسم',
    sessionRole: 'الدور',
    sessionEmail: 'البريد الإلكتروني',
    noSession: 'لا توجد جلسة معروضة.',
    accountHeading: 'بيانات الحساب',
    accountNote:
      'بيانات الحساب تأتي من الجلسة، ولا يمكن تعديلها من هذه الشاشة.',
    accountSignIn: 'افتح صفحة تسجيل الدخول',
    settingsHeading: 'إعدادات الواجهة',
    languageLabel: 'اللغة',
    themeLabel: 'المظهر',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    roles: {
      academy_owner: 'مالك الأكاديمية',
      instructor: 'المدرب',
      learner: 'المتدرّب',
    } as Record<'academy_owner' | 'instructor' | 'learner', string>,
    previewHeading: 'الدور المعروض',
    previewNote:
      'مفتاح معاينة للواجهة فقط، وليس مصادقة. تُبنى النسخة المستضافة بجلسة الأكاديمية.',
  },
  /**
   * Help Center — a role-scoped reference library. Every article is one task
   * with short numbered steps and a link into the real screen. Register: MSA
   * throughout, so a reader never meets two voices inside one article.
   */
  help: {
    headTitle: `المساعدة — ${B}`,
    badge: 'المساعدة',
    title: 'مرجع المهام',
    lead: 'مقالات قصيرة لكل مهمة في دورك، مع خطوات مرتّبة ورابط إلى الشاشة.',
    indexHeading: 'المحتويات',
    stepsLabel: 'الخطوات',
    open: 'افتح الشاشة',
    categories: {
      gettingStarted: 'البدء',
      academy: 'للأكاديمية',
      instructor: 'للمدرب',
      account: 'الحساب والإعدادات',
      faq: 'أسئلة شائعة',
    } as Record<HelpCategory, string>,
    links: {
      profile: 'الملف الشخصي والإعدادات',
      onboarding: 'التهيئة والمعايرة',
      dashboard: 'لوحة الأكاديمية',
      cohorts: 'الأفواج',
      roster: 'القائمة والحضور',
      curriculum: 'المناهج',
      rubrics: 'معايير التقييم',
      earnings: 'الأرباح',
    } as Record<HelpLinkId, string>,
    articles: {
      'start-tour': {
        category: 'gettingStarted',
        title: 'تعرّف على التنقّل',
        body: 'كل شاشاتك تُفتح من القائمة الجانبية، ومساعدتك ودليلك وملفك الشخصي أسفلها.',
        steps: [
          'افتح القائمة الجانبية من زر القائمة على الهاتف، أو استخدمها ثابتة على الحاسوب.',
          'اختر الشاشة التي تريدها من القائمة.',
          'استخدم روابط المساعدة والدليل والملف الشخصي أسفل القائمة.',
        ],
      },
      'start-language': {
        category: 'gettingStarted',
        title: 'بدّل اللغة',
        body: 'تتبدّل اللغة من الشريط العلوي أو من الملف الشخصي والإعدادات، مع اتجاه الصفحة.',
        steps: [
          'افتح مفتاح اللغة من الشريط العلوي.',
          'اختر العربية أو English.',
          'يتبدّل اتجاه الصفحة تلقائيًا مع اللغة.',
        ],
        link: 'profile',
      },
      'start-preview': {
        category: 'gettingStarted',
        title: 'اعرض دور الأكاديمية أو المدرب',
        body: 'مفتاح المعاينة يعرض واجهة كل دور على النسخة المستضافة، وهو ليس مصادقة.',
        steps: [
          'افتح الملف الشخصي والإعدادات.',
          'اختر الدور المعروض: الأكاديمية أو المدرب.',
          'تتغير القائمة الجانبية والشاشات المتاحة بحسب الدور.',
        ],
        link: 'profile',
      },
      'academy-onboarding': {
        category: 'academy',
        title: 'أكمل تهيئة الشريك',
        body: 'التهيئة خمس خطوات، وتنتهي بمعايرة معيار التقييم قبل فتح الأفواج.',
        steps: [
          'افتح التهيئة والمعايرة من القائمة الجانبية.',
          'أكمل كل خطوة من خطوات التهيئة.',
          'راجع حالة المعايرة ومسؤول الاعتراضات.',
        ],
        link: 'onboarding',
      },
      'academy-cohort': {
        category: 'academy',
        title: 'أنشئ فوجًا وانشر مقاعده',
        body: 'الفوج يحتاج لغة ومستوى ومدرب وجدولًا وسعة قبل النشر.',
        steps: [
          'افتح الأفواج من القائمة الجانبية.',
          'أكمل نموذج الفوج الجديد وأنشئ المسودة.',
          'راجع الجدول والسعة ثم انشر المقاعد.',
        ],
        link: 'cohorts',
      },
      'academy-attendance': {
        category: 'academy',
        title: 'سجّل الحضور',
        body: 'سجل الحضور يعود إلى جلسة محددة في فوج محدد، ونموذجه مقترح.',
        steps: [
          'افتح الأفواج واختر الفوج.',
          'اختر الجلسة من قائمة الجلسات.',
          'حدد حالة كل متدرّب ثم احفظ الحضور.',
        ],
        link: 'roster',
      },
      'academy-curriculum': {
        category: 'academy',
        title: 'ابنِ منهجًا واطلب مسودة من محسن، المساعد الذكي',
        body: 'المنهج وحدات ودروس، ولكل درس لغة محتوى مستقلة.',
        steps: [
          'افتح المناهج واختر المنهج.',
          'أضف وحدة ثم أضف دروسها.',
          'استخدم مسودة محسن، المساعد الذكي، كمقترح ثم راجعها قبل الإضافة.',
          'انشر المنهج بعد وجود درس واحد على الأقل.',
        ],
        link: 'curriculum',
      },
      'academy-rubric': {
        category: 'academy',
        title: 'اضبط معيار التقييم',
        body: 'لكل بُعد وزن ووصف، والبُعد غير المُقاس يظهر كذلك.',
        steps: [
          'افتح معايير التقييم واختر المعيار.',
          'راجع أوزان الأبعاد المُقاسة.',
          'انشر المعيار بعد أن يساوي مجموع الأوزان 100٪.',
        ],
        link: 'rubrics',
      },
      'academy-earnings': {
        category: 'academy',
        title: 'راجع دفتر الأرباح',
        body: 'كل مبلغ أولي حتى اعتماد المراجعة القانونية والمالية.',
        steps: [
          'افتح الأرباح من القائمة الجانبية.',
          'راجع الملخص والحركات وجدول الصرف.',
          'لا تعتمد أي مبلغ كصرف حقيقي قبل اعتماد المراجعة.',
        ],
        link: 'earnings',
      },
      'instructor-cohorts': {
        category: 'instructor',
        title: 'راجع أفواجك',
        body: 'يعرض المدرب الأفواج المسندة إليه وقوائمها وحضورها.',
        steps: [
          'افتح الأفواج من القائمة الجانبية.',
          'اختر الفوج المسند إليك.',
          'راجع القائمة والجلسات قبل تسجيل الحضور.',
        ],
        link: 'cohorts',
      },
      'instructor-curriculum': {
        category: 'instructor',
        title: 'راجع المنهج قبل الجلسة',
        body: 'لكل درس هدف ومدة ولغة محتوى، وللمدرب مراجعتها قبل التدريس.',
        steps: [
          'افتح المناهج واختر المنهج.',
          'راجع الوحدات والدروس وأهدافها.',
          'تحقق من لغة المحتوى واتجاهها لكل درس.',
        ],
        link: 'curriculum',
      },
      'account-profile': {
        category: 'account',
        title: 'بيانات الحساب والإعدادات',
        body: 'بيانات الحساب تأتي من الجلسة، واللغة والمظهر إعدادات واجهة فقط.',
        steps: [
          'افتح الملف الشخصي من أسفل القائمة الجانبية.',
          'راجع بيانات الجلسة.',
          'بدّل اللغة أو المظهر من إعدادات الواجهة.',
        ],
        link: 'profile',
      },
      'faq-data': {
        category: 'faq',
        title: 'هل هذه البيانات حقيقية؟',
        body: 'لا. كل بيانات هذه النسخة تجريبية، وكل عقود الواجهة مقترحة بانتظار Mentingo.',
        steps: [
          'تحقق من لافتة «بيانات تجريبية» أعلى الشاشة.',
          'لا تُستخدم هذه النسخة لاستقبال متدرّبين أو صرف أموال.',
        ],
      },
      'faq-money': {
        category: 'faq',
        title: 'لماذا يظهر السعر كعنصر نائب؟',
        body: 'التسعير والضمان وحسم الرسوم من بنود المراجعة القانونية والمالية.',
        steps: [
          'افتح الأرباح لرؤية لافتة «أرقام أولية».',
          'انتظر اعتماد النطاقات قبل أي رقم حقيقي.',
        ],
        link: 'earnings',
      },
    } as Record<string, HelpArticle>,
  },
  guide: {
    headTitle: `الدليل — ${B}`,
    badge: 'الدليل',
    title: 'دليل الاستخدام',
    lead: 'خطوات مرتّبة لدورك الحالي، من أول شاشة إلى آخر مهمة.',
    stepsLabel: 'خطوات الدليل',
    open: 'افتح',
    academy: {
      title: 'مسار الأكاديمية',
      lead: 'من تهيئة الشريك إلى دفتر الأرباح.',
      steps: [
        {
          title: 'أكمل التهيئة والمعايرة',
          body: 'أكمل خطوات الشريك واعتمد المعايرة قبل فتح الأفواج.',
          link: 'onboarding',
        },
        {
          title: 'أنشئ فوجًا وانشر مقاعده',
          body: 'اختر اللغة والمستوى والمدرب والجدول والسعة، ثم انشر المقاعد.',
          link: 'cohorts',
        },
        {
          title: 'سجّل الحضور',
          body: 'افتح قائمة الفوج واختر جلسة، ثم سجّل حالة كل متدرّب.',
          link: 'roster',
        },
        {
          title: 'ابنِ المنهج',
          body: 'أضف الوحدات والدروس، ولكل درس لغة محتوى مستقلة.',
          link: 'curriculum',
        },
        {
          title: 'اضبط معيار التقييم',
          body: 'راجع الأوزان والأوصاف وانشر المعيار بعد اكتمال 100٪.',
          link: 'rubrics',
        },
        {
          title: 'راجع الأرباح',
          body: 'كل مبلغ أولي حتى اعتماد المراجعة القانونية والمالية.',
          link: 'earnings',
        },
      ] as GuideStep[],
    },
    instructor: {
      title: 'مسار المدرب',
      lead: 'من الأفواج المسندة إليك إلى معيار التقييم.',
      steps: [
        {
          title: 'راجع أفواجك',
          body: 'افتح الأفواج المسندة إليك وقوائمها.',
          link: 'cohorts',
        },
        {
          title: 'سجّل الحضور',
          body: 'اختر الجلسة وسجّل حالة كل متدرّب.',
          link: 'roster',
        },
        {
          title: 'راجع المنهج',
          body: 'تحقق من الوحدات والدروس ولغة المحتوى قبل الجلسة.',
          link: 'curriculum',
        },
        {
          title: 'راجع معيار التقييم',
          body: 'اعرف الأبعاد المُقاسة وأوزانها قبل التقييم.',
          link: 'rubrics',
        },
      ] as GuideStep[],
    },
  },
  root: {
    notFound: 'الصفحة غير موجودة.',
    notFoundBody: 'راجع التنقّل أعلاه، أو عد إلى زر الرجوع في المتصفح.',
    errorTitle: 'حدث خطأ غير متوقع.',
    errorBody: 'من جهتنا، لا من جهتك. أعد المحاولة بعد قليل.',
  },
} as const

/**
 * Widen the literal types of `ar` so the English mirror can hold any string.
 * The shape (keys, function arity) is identical, so `en` fails to compile if a
 * key is missing or renamed.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends (...args: infer A) => infer R
          ? (...args: A) => Widen<R>
          : T extends object
            ? { [K in keyof T]: Widen<T[K]> }
            : T

export type Strings = Widen<typeof ar>

export const en: Strings = {
  head: {
    title: `${B} — language and hiring academy`,
    description:
      'The academy and instructor platform: cohorts, rosters and attendance, curricula, grading rubrics and earnings.',
  },
  header: {
    navLabel: 'Primary navigation',
    wordmarkAlt: `${B} wordmark`,
    skipToMain: 'Skip to content',
    menuLabel: 'Open the navigation menu',
    menuCloseLabel: 'Close the menu',
    utilityLabel: 'Utility bar',
    langLabel: 'Language',
    langToEnglish: 'English',
    langToArabic: 'العربية',
    langGlyphEnglish: 'EN',
    langGlyphArabic: 'ع',
    assistantLabel: 'Messages',
    assistantOpenLabel: 'Open messages',
    accountLabel: 'Account',
    themeLabel: 'Theme',
    themeToDark: 'Dark theme',
    themeToLight: 'Light theme',
  },
  sidebar: {
    navLabel: 'Primary navigation',
    openLabel: 'Open the navigation menu',
    closeLabel: 'Close the menu',
    collapseLabel: 'Collapse',
    expandLabel: 'Expand',
    utilitiesLabel: 'Help links',
    helpLabel: 'Help',
    guideLabel: 'Guide',
    profileLabel: 'Profile',
  },
  nav: {
    'academy-dashboard': 'Dashboard',
    'academy-onboarding': 'Onboarding',
    'academy-cohorts': 'Cohorts',
    'academy-curriculum': 'Curriculum',
    'academy-rubrics': 'Rubrics',
    'academy-earnings': 'Earnings',
  } as Record<NavScreenId, string>,
  common: {
    loading: 'Loading...',
    loadErrorTitle: 'This data could not be loaded.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    retry: 'Try again',
    emptyTitle: 'Nothing here yet',
    emptyBody: 'Data will appear here once it is added.',
    demoNotice:
      'Demo data — no live academy or payment data is connected to this preview.',
    notAvailable: 'Not available',
    notAssessed: 'Not assessed',
    language: 'Language',
    level: 'Level',
    status: 'Status',
    cohort: 'Cohort',
    session: 'Session',
    duration: 'Duration',
    instructor: 'Instructor',
    schedule: 'Schedule',
    capacity: 'Capacity',
    seats: 'Seats',
    startDate: 'Start date',
    endDate: 'End date',
    updatedAt: 'Last updated',
    price: 'Price',
    pricePlaceholder: '[price]',
    provisionalFigures:
      'Provisional figures — pending legal and finance review.',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    open: 'Open',
    createdAt: 'Created',
    date: 'Date',
    reference: 'Reference',
    description: 'Description',
    total: 'Total',
    actions: 'Action',
  },
  status: {
    cohort: {
      draft: 'Draft',
      published: 'Published',
      active: 'Active',
      completed: 'Completed',
    },
    onboarding: {
      complete: 'Complete',
      in_progress: 'In progress',
      pending: 'Pending',
      blocked: 'Blocked',
    },
    calibration: {
      not_started: 'Not started',
      in_review: 'In review',
      calibrated: 'Calibrated',
      changes_requested: 'Changes requested',
    },
    roster: {
      active: 'Active',
      invited: 'Invited',
      withdrawn: 'Withdrawn',
    },
    attendance: {
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      excused: 'Excused',
      not_recorded: 'Not recorded',
    },
    lessonKind: {
      lesson: 'Lesson',
      practice: 'Practice',
      assessment: 'Assessment',
    },
    rubric: {
      draft: 'Draft',
      published: 'Published',
    },
    dimension: {
      pronunciation: 'Pronunciation',
      fluency: 'Fluency',
      empathy: 'Empathy',
      vocabulary: 'Vocabulary',
      listening: 'Listening',
    },
    session: {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    ledgerType: {
      tuition: 'Tuition',
      escrow_hold: 'Escrow hold',
      instructor_share: 'Instructor share',
      platform_fee: 'Platform fee',
      payout: 'Payout',
      adjustment: 'Adjustment',
    },
    ledgerStatus: {
      pending: 'Pending',
      held: 'Held',
      available: 'Available',
      paid: 'Paid',
      reversed: 'Reversed',
    },
    payout: {
      scheduled: 'Scheduled',
      processing: 'Processing',
      paid: 'Paid',
      on_hold: 'On hold',
    },
    payoutAccount: {
      not_connected: 'Not connected',
      pending: 'Pending verification',
      verified: 'Verified',
    },
    alert: {
      attendance_due: 'Attendance to record',
      roster_incomplete: 'Incomplete cohort roster',
      curriculum_draft: 'Curriculum in draft',
      rubric_draft: 'Grading rubric in draft',
      payout_profile: 'Payout profile incomplete',
    },
  },
  onboarding: {
    headTitle: `Onboarding and calibration — ${B}`,
    badge: 'Partner onboarding',
    title: 'Onboarding and calibration',
    lead:
      'Complete the partner steps, then pass calibration before your cohorts open on the platform. No learner intake starts before calibration is approved.',
    completion: (percent: number) => `${percent}% complete`,
    stepsHeading: 'Onboarding steps',
    calibrationHeading: 'Calibration',
    calibrationBody:
      'The calibration team reviews sample lessons and the grading rubric before cohorts open. The review state is shown as the system returns it and is not edited from this screen.',
    reviewer: 'Reviewer',
    rubricVersion: 'Rubric version',
    appealOwner: 'Appeal owner',
    appealOwnerReady: 'Confirmed',
    appealOwnerMissing: 'Not confirmed',
    samples: (reviewed: number, required: number) =>
      `${reviewed} of ${required} sample lessons`,
    languagesHeading: 'Teaching languages',
    languageDirection: (label: string) => `Content direction: ${label}`,
    directionLabels: {
      ltr: 'Left to right',
      rtl: 'Right to left',
    },
    markComplete: 'Complete this step',
    complete: 'Step complete',
    blockedNote: 'This step waits on the finance review.',
    notice:
      'Onboarding and calibration are proposed shapes in this demo build. No Mentingo connection exists yet.',
    steps: {
      profile: {
        title: 'Partner profile',
        body: 'Academy name and the approved contact email.',
      },
      languages: {
        title: 'Teaching languages',
        body: 'The languages the academy teaches and their levels.',
      },
      sample_lesson: {
        title: 'Sample lesson',
        body: 'One sample lesson per language, reviewed by calibration.',
      },
      rubric_calibration: {
        title: 'Rubric calibration',
        body: 'Approve the grading rubric before cohorts open.',
      },
      payout_profile: {
        title: 'Payout profile',
        body: 'Payout details and the finance review. Figures are provisional.',
      },
    },
  },
  dashboard: {
    headTitle: `Academy dashboard — ${B}`,
    badge: 'Academy',
    title: 'Academy dashboard',
    lead:
      'Active cohorts, upcoming sessions and what needs attention in one screen. Numbers come from the system; earnings stay provisional.',
    greeting: (name: string) => `Welcome, ${name}.`,
    cohortsCount: (count: number) => englishCount(count, 'cohort', 'cohorts'),
    learnersCount: (count: number) => englishCount(count, 'learner', 'learners'),
    sessionsCount: (count: number) => englishCount(count, 'session', 'sessions'),
    totals: {
      cohorts: 'Active cohorts',
      learners: 'Active learners',
      sessions: 'Sessions this week',
    },
    calibration: {
      heading: 'Calibration',
      open: 'Open onboarding and calibration',
      samples: (reviewed: number, required: number) =>
        `${reviewed} of ${required} sample lessons`,
    },
    upcoming: {
      heading: 'Upcoming sessions',
      lead: 'The next scheduled sessions across every cohort.',
      emptyTitle: 'No scheduled sessions',
      emptyBody: 'Sessions appear here once a cohort is scheduled.',
      duration: (minutes: number) => `${minutes} min`,
    },
    cohorts: {
      heading: 'Active cohorts',
      open: 'Open the cohort builder',
      emptyTitle: 'No active cohorts',
      emptyBody: 'Create a cohort and publish its seats to see it here.',
    },
    alerts: {
      heading: 'Needs attention',
      lead: 'Missing items that block publishing or payouts.',
      emptyTitle: 'Nothing pending',
      emptyBody: 'Everything that needs an action is complete.',
      count: (count: number) => `${count}`,
    },
    earnings: {
      heading: 'Available earnings',
      provisional: 'Provisional',
      open: 'Open the earnings ledger',
      note: 'Figures are provisional until the legal and finance review.',
    },
    updatedAt: 'Last updated',
  },
  cohorts: {
    headTitle: `Cohorts — ${B}`,
    badge: 'Cohorts',
    title: 'Cohort builder and seat publisher',
    lead:
      'Create a cohort with a clear language, level, instructor, schedule and capacity, then publish its seats. A cohort is never published with an empty schedule.',
    listHeading: 'Cohorts',
    seatsLabel: (filled: number, capacity: number) =>
      `${filled} of ${capacity} seats`,
    seatsAvailable: (count: number) => englishCount(count, 'seat', 'seats'),
    openRoster: 'Open roster and attendance',
    publish: 'Publish seats',
    published: 'Seats published',
    publishNote:
      'Publishing opens the cohort for enrolment. Enrolment and checkout are not part of this batch.',
    createHeading: 'New cohort',
    form: {
      label: 'Cohort name',
      labelPlaceholder: 'For example: German A2 — Evening',
      language: 'Language',
      level: 'Level',
      schedule: 'Schedule',
      schedulePlaceholder: 'Sun & Tue · 18:00–19:30',
      capacity: 'Capacity',
      instructor: 'Instructor',
      startDate: 'Start date',
      endDate: 'End date',
      submit: 'Create draft',
      submitting: 'Creating...',
      selectPlaceholder: 'Select',
    },
    validation: {
      required: 'Complete the required fields.',
      capacity: 'Enter a capacity between 1 and 200.',
    },
    emptyTitle: 'No cohorts yet',
    emptyBody: 'Create the first cohort from the form above.',
    loadListError: 'Cohorts could not be loaded.',
    createdNote: 'Cohort created as a draft. Review the schedule, then publish.',
    conflict:
      'Every seat is filled. Open a new cohort instead of exceeding capacity.',
    priceNote: 'Price is shown as a placeholder until pricing bands are approved.',
  },
  roster: {
    headTitle: `Roster and attendance — ${B}`,
    badge: 'Roster and attendance',
    title: 'Cohort roster and attendance',
    lead:
      'The learner roster, the cohort sessions and the attendance record. The attendance model is proposed in this build, and every rate comes from a recorded session.',
    back: 'Back to cohorts',
    membersHeading: 'Learners',
    sessionsHeading: 'Sessions',
    sheetHeading: 'Attendance sheet',
    attendanceRate: 'Attendance rate',
    attendanceRateValue: (percent: number) => `${percent}%`,
    recordedSessions: (count: number) =>
      englishCount(count, 'recorded session', 'recorded sessions'),
    joinedAt: 'Joined',
    email: 'Email',
    learner: 'Learner',
    statusColumn: 'Status',
    sessionTopic: 'Topic',
    sessionDate: 'Date',
    duration: (minutes: number) => `${minutes} min`,
    markAllPresent: 'Mark everyone present',
    save: 'Save attendance',
    saving: 'Saving...',
    saved: 'Attendance saved.',
    selectSession: 'Select a session to open its attendance sheet.',
    noMembersTitle: 'No learners on the roster',
    noMembersBody: 'The roster appears once enrolment is accepted.',
    noSessionsTitle: 'No sessions yet',
    noSessionsBody: 'Sessions appear here once they are scheduled.',
    notRecordedNote:
      'Attendance is not recorded for this session yet. Choose a status for each learner, then save.',
    proposedNotice:
      'Proposed attendance model — not a confirmed Mentingo feature. Numbers appear only after a session is recorded.',
    noRate: 'No rate yet',
    selectAllHint: 'Every learner needs a status before saving.',
    errorSave: 'Attendance could not be saved. Try again.',
  },
  curriculum: {
    headTitle: `Curriculum — ${B}`,
    badge: 'Curriculum',
    title: 'Curriculum and lesson builder',
    lead:
      'Build units and lessons per language and level. Every lesson carries its own content language and direction, separate from the UI language.',
    listHeading: 'Curricula',
    open: 'Open curriculum',
    unitsCount: (count: number) => englishCount(count, 'unit', 'units'),
    lessonsCount: (count: number) => englishCount(count, 'lesson', 'lessons'),
    createHeading: 'New curriculum',
    form: {
      title: 'Curriculum title',
      description: 'Description',
      language: 'Language',
      level: 'Level',
      submit: 'Create draft',
      submitting: 'Creating...',
    },
    detail: {
      unitsHeading: 'Units',
      lessonsHeading: 'Lessons',
      addUnitHeading: 'Add a unit',
      unitTitle: 'Unit title',
      unitObjective: 'Unit objective',
      addUnit: 'Add unit',
      addLessonHeading: 'Add a lesson',
      lessonTitle: 'Lesson title',
      lessonObjective: 'Lesson objective',
      lessonDuration: 'Duration in minutes',
      lessonKind: 'Lesson kind',
      contentLanguage: 'Content language',
      addLesson: 'Add lesson',
      publish: 'Publish curriculum',
      published: 'Curriculum published',
      publishNote: 'A curriculum cannot be published before it has one lesson.',
      emptyUnitsTitle: 'No units yet',
      emptyUnitsBody: 'Add the first unit, then add its lessons.',
      noLessons: 'No lessons in this unit yet.',
      contentDirection: (label: string) => `Content direction: ${label}`,
      materials: (count: number) =>
        englishCount(count, 'material', 'materials'),
      objective: 'Objective',
      duration: (minutes: number) => `${minutes} min`,
      back: 'Back to curricula',
      updatedAt: 'Last updated',
      errorPublish: 'Publishing failed. Add at least one lesson.',
    },
    mohsen: {
      heading: `${assistant.name} draft`,
      lead:
        `${assistant.name} is the AI assistant. ${assistant.name} suggests a unit outline from the unit title and lesson count; the outline is a suggestion and is not saved until you add it.`,
      unitTitle: 'Unit title',
      lessonCount: 'Lesson count',
      submit: 'Draft an outline',
      submitting: 'Drafting...',
      resultHeading: 'Suggested outline',
      grounding: 'References',
      addUnit: 'Add this unit',
      disclaimer:
        `${assistant.name} AI draft — review it before adding it to the curriculum.`,
      error: 'The draft could not be prepared. Try again.',
    },
    emptyTitle: 'No curricula yet',
    emptyBody: 'Create the first curriculum from the form above.',
    loadError: 'Curricula could not be loaded.',
    validation: {
      required: 'Complete the required fields.',
      duration: 'Enter a duration between 5 and 240 minutes.',
    },
    createdNote: 'Curriculum created as a draft.',
  },
  rubric: {
    headTitle: `Grading rubrics — ${B}`,
    badge: 'Grading rubrics',
    title: 'Grading rubric',
    lead:
      'Five dimensions, each with a weight and descriptors. A dimension the rubric does not assess is shown as not assessed.',
    listHeading: 'Rubrics',
    open: 'Open rubric',
    version: (version: number) => `Version ${version}`,
    versionHeading: 'Version',
    dimensionsHeading: 'Dimensions',
    dimension: 'Dimension',
    assessed: 'Assessed',
    notAssessed: 'Not assessed',
    weight: 'Weight %',
    weightTotal: 'Assessed weight total',
    descriptors: 'Band descriptors',
    band: (band: number) => `Band ${band}`,
    saveWeight: 'Save weight',
    saving: 'Saving...',
    publish: 'Publish rubric',
    published: 'Rubric published',
    publishNote:
      'A rubric cannot be published before the assessed weights total 100%.',
    coverageNote: 'Coverage note',
    noCoverageNote: 'No coverage note supplied.',
    updatedAt: 'Last updated',
    back: 'Back to rubrics',
    emptyTitle: 'No rubrics yet',
    emptyBody: 'A rubric appears here once it is created from the academy.',
    loadError: 'Rubrics could not be loaded.',
    proposedNotice:
      'Five-dimension coverage is not confirmed in Mentingo. Anything the rubric does not measure is shown as not assessed.',
    errorWeight: 'Enter a weight between 0 and 100.',
  },
  earnings: {
    headTitle: `Earnings — ${B}`,
    badge: 'Earnings',
    title: 'Earnings and escrow ledger',
    lead:
      'Tuition, escrow, instructor share and payouts in one ledger. Every amount on this screen is provisional and every figure is a placeholder.',
    provisionalHeading: 'Provisional figures',
    provisionalBody:
      'The figures are not approved by the legal and finance review. No amount here is a real payout, and price is shown as a placeholder.',
    summary: {
      available: 'Available',
      pending: 'Pending',
      held: 'Held in escrow',
      paidToDate: 'Paid to date',
      nextPayout: 'Next payout',
      payoutAccount: 'Payout account',
    },
    ledgerHeading: 'Entries',
    scheduleHeading: 'Payout schedule',
    cohort: 'Cohort',
    amount: 'Amount',
    type: 'Type',
    reference: 'Reference',
    date: 'Date',
    status: 'Status',
    description: 'Description',
    emptyTitle: 'No entries yet',
    emptyBody: 'Entries appear here after the first recorded payment.',
    emptySchedule: 'No scheduled payouts.',
    payoutDate: 'Payout date',
    noPayoutDate: 'Not set yet',
    loadError: 'The earnings ledger could not be loaded.',
    provisionalTag: 'Provisional',
    escrowNote:
      'Escrow and fee deductions are part of the legal and finance review and are not approved yet.',
  },
  chat: {
    title: 'Messages',
    openLabel: 'Open messages',
    closeLabel: 'Close messages',
    threadsLabel: 'Conversations',
    noThreads: 'No conversations yet.',
    selectThread: 'Select a conversation to read its messages.',
    loading: 'Loading conversations...',
    loadError: 'Conversations could not be loaded. Try again shortly.',
    messagesLoading: 'Loading messages...',
    messagesError: 'Messages could not be loaded. Try again shortly.',
    empty: 'No messages yet. Write the first one.',
    inputLabel: 'Your message',
    placeholder: 'Write your message...',
    send: 'Send',
    sending: 'Sending...',
    sendError: 'The message could not be sent. Try again.',
    youLabel: 'You',
    replyFrom: (name: string) => `Reply from ${name}`,
    notice: 'An in-platform channel for human messages, not an external one.',
    roleNames: {
      academy_owner: 'Academy owner',
      instructor: 'Instructor',
      support: 'Academy support',
    },
  },
  auth: {
    headTitle: `Sign in — ${B}`,
    badge: 'Sign in',
    title: 'Sign in',
    lead: 'Sign in to reach your account on the platform.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Sign in',
    status:
      'Sign-in is not available yet. Authentication is owned by Mentingo and is not connected.',
  },
  profile: {
    headTitle: `Profile and settings — ${B}`,
    badge: 'Profile',
    title: 'Profile and settings',
    lead: 'This screen shows the current session and the interface settings.',
    loading: 'Loading the session...',
    loadErrorTitle: 'The session could not be loaded.',
    loadErrorBody: 'It is on our side, not yours. Try again shortly.',
    sessionHeading: 'Current session',
    sessionName: 'Name',
    sessionRole: 'Role',
    sessionEmail: 'Email',
    noSession: 'No session is shown.',
    accountHeading: 'Account details',
    accountNote:
      'Account details come from the session and cannot be edited on this screen.',
    accountSignIn: 'Open the sign-in page',
    settingsHeading: 'Interface settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    roles: {
      academy_owner: 'Academy owner',
      instructor: 'Instructor',
      learner: 'Learner',
    },
    previewHeading: 'Preview role',
    previewNote:
      'A UI preview switch, not authentication. Hosted builds are baked with the academy session.',
  },
  help: {
    headTitle: `Help — ${B}`,
    badge: 'Help',
    title: 'Task reference',
    lead:
      'Short articles for each task in your role, with ordered steps and a link to the screen.',
    indexHeading: 'Contents',
    stepsLabel: 'Steps',
    open: 'Open the screen',
    categories: {
      gettingStarted: 'Getting started',
      academy: 'For the academy',
      instructor: 'For the instructor',
      account: 'Account and settings',
      faq: 'Frequently asked',
    },
    links: {
      profile: 'Profile and settings',
      onboarding: 'Onboarding and calibration',
      dashboard: 'Academy dashboard',
      cohorts: 'Cohorts',
      roster: 'Roster and attendance',
      curriculum: 'Curriculum',
      rubrics: 'Grading rubrics',
      earnings: 'Earnings',
    },
    articles: {
      'start-tour': {
        category: 'gettingStarted',
        title: 'Find your way around',
        body: 'Every screen opens from the sidebar, with Help, Guide and your profile at the bottom.',
        steps: [
          'Open the sidebar from the menu button on a phone, or use it fixed on desktop.',
          'Choose the screen you need from the list.',
          'Use the Help, Guide and Profile links at the bottom of the sidebar.',
        ],
      },
      'start-language': {
        category: 'gettingStarted',
        title: 'Switch language',
        body: 'Switch the language from the header or from Profile and settings; the page direction follows.',
        steps: [
          'Open the language control in the header.',
          'Choose Arabic or English.',
          'The page direction follows the language automatically.',
        ],
        link: 'profile',
      },
      'start-preview': {
        category: 'gettingStarted',
        title: 'Preview the academy or instructor role',
        body: 'The preview switch shows each role on the hosted build; it is not authentication.',
        steps: [
          'Open Profile and settings.',
          'Choose the preview role: academy or instructor.',
          'The sidebar and available screens follow the role.',
        ],
        link: 'profile',
      },
      'academy-onboarding': {
        category: 'academy',
        title: 'Complete partner onboarding',
        body: 'Onboarding has five steps and ends with rubric calibration before cohorts open.',
        steps: [
          'Open Onboarding and calibration from the sidebar.',
          'Complete each onboarding step.',
          'Review the calibration state and the appeal owner.',
        ],
        link: 'onboarding',
      },
      'academy-cohort': {
        category: 'academy',
        title: 'Create a cohort and publish its seats',
        body: 'A cohort needs a language, level, instructor, schedule and capacity before publishing.',
        steps: [
          'Open Cohorts from the sidebar.',
          'Complete the new cohort form and create the draft.',
          'Review the schedule and capacity, then publish the seats.',
        ],
        link: 'cohorts',
      },
      'academy-attendance': {
        category: 'academy',
        title: 'Record attendance',
        body: 'Attendance belongs to one session of one cohort, and its model is proposed.',
        steps: [
          'Open Cohorts and choose the cohort.',
          'Choose the session from the session list.',
          'Set a status for each learner, then save attendance.',
        ],
        link: 'roster',
      },
      'academy-curriculum': {
        category: 'academy',
        title: 'Build a curriculum and ask Mohsen, the AI assistant, for a draft',
        body: 'A curriculum holds units and lessons, and every lesson has its own content language.',
        steps: [
          'Open Curriculum and choose the curriculum.',
          'Add a unit, then add its lessons.',
          'Use a Mohsen, the AI assistant, draft as a suggestion and review it before adding it.',
          'Publish the curriculum once it has at least one lesson.',
        ],
        link: 'curriculum',
      },
      'academy-rubric': {
        category: 'academy',
        title: 'Set the grading rubric',
        body: 'Every dimension has a weight and descriptors, and an unassessed dimension is shown as such.',
        steps: [
          'Open Grading rubrics and choose the rubric.',
          'Review the assessed dimension weights.',
          'Publish once the assessed weights total 100%.',
        ],
        link: 'rubrics',
      },
      'academy-earnings': {
        category: 'academy',
        title: 'Review the earnings ledger',
        body: 'Every amount is provisional until the legal and finance review.',
        steps: [
          'Open Earnings from the sidebar.',
          'Review the summary, entries and payout schedule.',
          'Do not treat any amount as a real payout before the review.',
        ],
        link: 'earnings',
      },
      'instructor-cohorts': {
        category: 'instructor',
        title: 'Review your cohorts',
        body: 'An instructor sees the assigned cohorts, their rosters and attendance.',
        steps: [
          'Open Cohorts from the sidebar.',
          'Choose a cohort assigned to you.',
          'Review the roster and sessions before recording attendance.',
        ],
        link: 'cohorts',
      },
      'instructor-curriculum': {
        category: 'instructor',
        title: 'Review the curriculum before a session',
        body: 'Every lesson has an objective, duration and content language to review before teaching.',
        steps: [
          'Open Curriculum and choose the curriculum.',
          'Review the units, lessons and objectives.',
          'Check each lesson content language and direction.',
        ],
        link: 'curriculum',
      },
      'account-profile': {
        category: 'account',
        title: 'Account details and settings',
        body: 'Account details come from the session; language and theme are interface settings.',
        steps: [
          'Open Profile from the bottom of the sidebar.',
          'Review the session details.',
          'Switch language or theme from the interface settings.',
        ],
        link: 'profile',
      },
      'faq-data': {
        category: 'faq',
        title: 'Is this real data?',
        body: 'No. Every data point in this build is demo data, and every API contract is proposed pending Mentingo.',
        steps: [
          'Check the demo-data notice at the top of a screen.',
          'Do not use this build for learner intake or real payouts.',
        ],
      },
      'faq-money': {
        category: 'faq',
        title: 'Why is the price a placeholder?',
        body: 'Pricing, escrow and fee deductions are part of the legal and finance review.',
        steps: [
          'Open Earnings to see the provisional-figures notice.',
          'Wait for the approved bands before any real figure.',
        ],
        link: 'earnings',
      },
    },
  },
  guide: {
    headTitle: `Guide — ${B}`,
    badge: 'Guide',
    title: 'How to use it',
    lead: 'Ordered steps for your current role, from the first screen to the last task.',
    stepsLabel: 'Guide steps',
    open: 'Open',
    academy: {
      title: 'Academy path',
      lead: 'From partner onboarding to the earnings ledger.',
      steps: [
        {
          title: 'Complete onboarding and calibration',
          body: 'Complete the partner steps and pass calibration before opening cohorts.',
          link: 'onboarding',
        },
        {
          title: 'Create a cohort and publish its seats',
          body: 'Choose the language, level, instructor, schedule and capacity, then publish.',
          link: 'cohorts',
        },
        {
          title: 'Record attendance',
          body: 'Open the cohort roster, choose a session, and set each learner status.',
          link: 'roster',
        },
        {
          title: 'Build the curriculum',
          body: 'Add units and lessons; every lesson keeps its own content language.',
          link: 'curriculum',
        },
        {
          title: 'Set the grading rubric',
          body: 'Review weights and descriptors, then publish once they total 100%.',
          link: 'rubrics',
        },
        {
          title: 'Review earnings',
          body: 'Every amount is provisional until the legal and finance review.',
          link: 'earnings',
        },
      ] as GuideStep[],
    },
    instructor: {
      title: 'Instructor path',
      lead: 'From your assigned cohorts to the grading rubric.',
      steps: [
        {
          title: 'Review your cohorts',
          body: 'Open the cohorts assigned to you and their rosters.',
          link: 'cohorts',
        },
        {
          title: 'Record attendance',
          body: 'Choose the session and set each learner status.',
          link: 'roster',
        },
        {
          title: 'Review the curriculum',
          body: 'Check units, lessons and content language before a session.',
          link: 'curriculum',
        },
        {
          title: 'Review the grading rubric',
          body: 'Know the assessed dimensions and weights before grading.',
          link: 'rubrics',
        },
      ] as GuideStep[],
    },
  },
  root: {
    notFound: 'Page not found.',
    notFoundBody: 'Check the navigation, or use the browser back button.',
    errorTitle: 'Something unexpected happened.',
    errorBody: 'It is on our side, not yours. Try again shortly.',
  },
}
