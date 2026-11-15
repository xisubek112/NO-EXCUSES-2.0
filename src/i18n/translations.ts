import type { CoachState, Language } from '../types';

export interface TranslationBundle {
  brandName: string;
  slogan: string;
  nav: {
    home: string;
    habits: string;
    coach: string;
    stats: string;
    settings: string;
  };
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
    warriorFallback: string;
  };
  dashboard: {
    disciplineScore: string;
    dailyScore: string;
    completion: string;
    currentStreak: string;
    daysUnit: string;
    nightReport: string;
    activeHabitsTitle: string;
    activeHabitsSubtitle: string;
    maxThreeRule: string;
    markComplete: string;
    completedLabel: string;
    pendingLabel: string;
    reminderPrefix: string;
    coachSectionTitle: string;
    openCoach: string;
    refreshBrief: string;
    loadingBrief: string;
    emptyHabitsTitle: string;
    emptyHabitsDesc: string;
    goToHabits: string;
  };
  coachStates: Record<
    CoachState,
    {
      label: string;
      statusLine: string;
      defaultMessage: string;
    }
  >;
  habitsScreen: {
    title: string;
    subtitle: string;
    activeCountLabel: string;
    addHabit: string;
    editHabit: string;
    deleteHabit: string;
    limitWarningTitle: string;
    limitWarningMessage: string;
    limitWarningAction: string;
    formTitleAdd: string;
    formTitleEdit: string;
    fieldName: string;
    fieldNamePlaceholder: string;
    fieldDesc: string;
    fieldDescPlaceholder: string;
    fieldReminder: string;
    save: string;
    cancel: string;
    validationRequired: string;
    confirmDeleteTitle: string;
    confirmDeleteDesc: string;
    confirmDeleteYes: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  coachScreen: {
    title: string;
    subtitle: string;
    strictModeLabel: string;
    balancedModeLabel: string;
    thinking: string;
    inputPlaceholder: string;
    send: string;
    suggestedTitle: string;
    suggestedQuestions: string[];
    errorTitle: string;
    retry: string;
    welcomeMessage: string;
    clearChat: string;
  };
  statsScreen: {
    title: string;
    subtitle: string;
    completionRate: string;
    currentStreak: string;
    bestStreak: string;
    todayScore: string;
    weeklyTitle: string;
    monthlyTitle: string;
    consistencyTitle: string;
    historyTitle: string;
    daysCompleted: string;
    scoreLabel: string;
    habitsDone: string;
    openNightReport: string;
    emptyTitle: string;
    emptyDesc: string;
    last7Days: string;
    last30Days: string;
    dateColumn: string;
    avgLabel: string;
  };
  settingsScreen: {
    title: string;
    subtitle: string;
    languageTitle: string;
    languageDesc: string;
    englishLabel: string;
    uzbekLabel: string;
    profileTitle: string;
    displayName: string;
    focusArea: string;
    saveProfile: string;
    profileSaved: string;
    notificationsTitle: string;
    enableReminders: string;
    morningCheckIn: string;
    nightReportTime: string;
    hapticsLabel: string;
    coachPrefsTitle: string;
    coachIntensity: string;
    balancedDesc: string;
    relentlessDesc: string;
    themeTitle: string;
    themeValue: string;
    themeNote: string;
    privacyAccountTitle: string;
    privacyNote: string;
    incognitoToggle: string;
    exportBackup: string;
    resetAll: string;
    resetConfirmTitle: string;
    resetConfirmDesc: string;
    resetConfirmYes: string;
    cancel: string;
  };
  nightReport: {
    title: string;
    subtitle: string;
    finalScore: string;
    habitsCompleted: string;
    streakStatus: string;
    verdictLabel: string;
    planTomorrow: string;
    close: string;
    allDoneVerdict: string;
    partialVerdict: string;
    zeroVerdict: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    brandName: 'NO EXCUSES',
    slogan: 'YOU PROMISED YOURSELF. NOW PROVE IT.',
    nav: {
      home: 'Home',
      habits: 'Habits',
      coach: 'AI Coach',
      stats: 'Stats',
      settings: 'Settings',
    },
    greetings: {
      morning: 'Morning Command',
      afternoon: 'Stay Locked In',
      evening: 'Evening Accountability',
      warriorFallback: 'Warrior',
    },
    dashboard: {
      disciplineScore: 'Discipline Score',
      dailyScore: 'Daily Score',
      completion: 'Completion',
      currentStreak: 'Current Streak',
      daysUnit: 'days',
      nightReport: 'Night Report',
      activeHabitsTitle: 'Today’s Non-Negotiables',
      activeHabitsSubtitle: 'Execute the three commitments you set.',
      maxThreeRule: '3-Habit Protocol',
      markComplete: 'Complete',
      completedLabel: 'Executed',
      pendingLabel: 'Pending',
      reminderPrefix: 'Reminder',
      coachSectionTitle: 'AI Discipline Coach',
      openCoach: 'Open AI Coach',
      refreshBrief: 'Refresh Brief',
      loadingBrief: 'Evaluating your discipline metrics...',
      emptyHabitsTitle: 'No active habits locked in',
      emptyHabitsDesc: 'Set up to three daily non-negotiables to activate your Discipline Score.',
      goToHabits: 'Set First Habit',
    },
    coachStates: {
      PROUD: {
        label: 'PROUD',
        statusLine: 'All daily commitments executed. Standard upheld.',
        defaultMessage: 'Every promise kept today. Rest with earned respect—tomorrow we raise the bar.',
      },
      WATCHING: {
        label: 'WATCHING',
        statusLine: 'Monitoring your execution window.',
        defaultMessage: 'Talk is cheap. Finish your remaining habits before the clock runs out.',
      },
      DISAPPOINTED: {
        label: 'DISAPPOINTED',
        statusLine: 'Late day with zero completions logged.',
        defaultMessage: 'You made promises this morning and left them untouched. Break the drift right now.',
      },
      STRICT: {
        label: 'STRICT MODE',
        statusLine: 'Zero tolerance protocol engaged.',
        defaultMessage: 'Stop negotiating with comfort. Pick the next habit and execute immediately.',
      },
    },
    habitsScreen: {
      title: 'Habit Protocol',
      subtitle: 'Maximum three active habits. Depth beats distraction.',
      activeCountLabel: 'Active Slots',
      addHabit: 'Add Habit',
      editHabit: 'Edit',
      deleteHabit: 'Delete',
      limitWarningTitle: 'Protocol Limit Reached',
      limitWarningMessage: '😂 Three habits first. Stop collecting goals and start completing them.',
      limitWarningAction: 'Understood',
      formTitleAdd: 'Lock In New Habit',
      formTitleEdit: 'Refine Habit',
      fieldName: 'Habit Title',
      fieldNamePlaceholder: 'e.g., 60m Deep Work Session',
      fieldDesc: 'Execution Standard',
      fieldDescPlaceholder: 'Define exact rule so there is zero ambiguity.',
      fieldReminder: 'Reminder Time',
      save: 'Save Habit',
      cancel: 'Cancel',
      validationRequired: 'Please enter a habit title and execution standard.',
      confirmDeleteTitle: 'Remove Habit?',
      confirmDeleteDesc: 'Removing this habit frees a slot but ends its tracking streak.',
      confirmDeleteYes: 'Delete Habit',
      emptyTitle: 'Zero Habits Active',
      emptyDesc: 'Add your first non-negotiable habit to begin tracking daily discipline.',
    },
    coachScreen: {
      title: 'AI Coach',
      subtitle: 'Direct accountability backed by your live habit telemetry.',
      strictModeLabel: 'Strict Mode',
      balancedModeLabel: 'Balanced',
      thinking: 'Analyzing your discipline record...',
      inputPlaceholder: 'Report your progress or ask for a battle plan...',
      send: 'Send',
      suggestedTitle: 'Tactical Prompts',
      suggestedQuestions: [
        'Audit my discipline today without sugarcoating.',
        'I feel low motivation right now. Snap me out of it.',
        'Build my execution plan for the next 2 hours.',
        'How do I protect my streak tomorrow morning?',
      ],
      errorTitle: 'Connection Interrupted',
      retry: 'Retry',
      welcomeMessage:
        'I see your numbers. Do not tell me what you plan to do next week—tell me what you are executing today.',
      clearChat: 'Clear Chat',
    },
    statsScreen: {
      title: 'Performance Telemetry',
      subtitle: 'Unfiltered record of your consistency and daily execution.',
      completionRate: 'Completion Rate',
      currentStreak: 'Current Streak',
      bestStreak: 'Best Streak',
      todayScore: 'Today’s Score',
      weeklyTitle: 'Weekly Performance',
      monthlyTitle: '30-Day Execution Trend',
      consistencyTitle: 'Habit Consistency',
      historyTitle: 'Daily Score History',
      daysCompleted: 'days',
      scoreLabel: 'Score',
      habitsDone: 'Habits',
      openNightReport: 'View Night Report',
      emptyTitle: 'No Tracked History Yet',
      emptyDesc: 'Complete habits on your dashboard to generate weekly and monthly performance charts.',
      last7Days: 'Last 7 days',
      last30Days: 'Last 30 days',
      dateColumn: 'Date',
      avgLabel: 'avg',
    },
    settingsScreen: {
      title: 'Command Settings',
      subtitle: 'Configure language, accountability intensity, and reminders.',
      languageTitle: 'Language',
      languageDesc: 'Switch complete interface and AI Coach responses.',
      englishLabel: 'English',
      uzbekLabel: 'O‘zbekcha',
      profileTitle: 'Warrior Profile',
      displayName: 'Callsign / Name',
      focusArea: 'Primary Focus',
      saveProfile: 'Save Profile',
      profileSaved: 'Profile updated',
      notificationsTitle: 'Notifications & Reminders',
      enableReminders: 'Daily Habit Reminders',
      morningCheckIn: 'Morning Briefing Time',
      nightReportTime: 'Night Report Time',
      hapticsLabel: 'Tactile Haptic Feedback',
      coachPrefsTitle: 'AI Coach Preferences',
      coachIntensity: 'Accountability Mode',
      balancedDesc: 'Direct, strategic, rewards completed days.',
      relentlessDesc: 'Strict Mode engaged whenever habits remain incomplete.',
      themeTitle: 'Appearance',
      themeValue: 'Dark Warrior v1.0',
      themeNote: 'Only Dark Warrior theme is available in version 1.0.',
      privacyAccountTitle: 'Privacy & Account',
      privacyNote: 'All habit records and personal notes stay stored locally on this device.',
      incognitoToggle: 'Mask Habit Titles on Lock Screen Preview',
      exportBackup: 'Export JSON Backup',
      resetAll: 'Reset All Data',
      resetConfirmTitle: 'Reset All Discipline Data?',
      resetConfirmDesc: 'This clears your habits, score history, streaks, and AI Coach messages.',
      resetConfirmYes: 'Reset Everything',
      cancel: 'Cancel',
    },
    nightReport: {
      title: 'Night Report',
      subtitle: 'End-of-day accountability verdict',
      finalScore: 'Final Daily Score',
      habitsCompleted: 'Habits Executed',
      streakStatus: 'Streak Standing',
      verdictLabel: 'Coach Verdict',
      planTomorrow: 'Plan Tomorrow with AI Coach',
      close: 'Close Report',
      allDoneVerdict: 'Mission accomplished. You kept every promise you made to yourself today.',
      partialVerdict: 'Partial execution. Finish the remaining work before sleep or accept the gap.',
      zeroVerdict: 'Zero execution logged today. Tomorrow starts tonight—reset your discipline immediately.',
    },
  },
  uz: {
    brandName: 'NO EXCUSES',
    slogan: "O'ZINGIZGA VA'DA BERDINGIZ. ENDI ISBOTLANG.",
    nav: {
      home: 'Asosiy',
      habits: 'Odatlar',
      coach: 'AI Murabbiy',
      stats: 'Statistika',
      settings: 'Sozlamalar',
    },
    greetings: {
      morning: 'Tonggi Tayyorgarlik',
      afternoon: 'Diqqatni Jamlang',
      evening: 'Kechki Hisobot Vaqti',
      warriorFallback: 'Jangchi',
    },
    dashboard: {
      disciplineScore: 'Intizom Balli',
      dailyScore: 'Kunlik Ball',
      completion: 'Bajarilish',
      currentStreak: 'Joriy Seriya',
      daysUnit: 'kun',
      nightReport: 'Kechki Hisobot',
      activeHabitsTitle: 'Bugungi Qat’iy Odatlar',
      activeHabitsSubtitle: "O'zingiz belgilagan uchta asosiy vazifani bajaring.",
      maxThreeRule: '3 Odat Qoidasi',
      markComplete: 'Bajarish',
      completedLabel: 'Bajarildi',
      pendingLabel: 'Kutilmoqda',
      reminderPrefix: 'Eslatma',
      coachSectionTitle: 'AI Intizom Murabbiyi',
      openCoach: 'AI Murabbiyni Ochish',
      refreshBrief: 'Xabarni Yangilash',
      loadingBrief: 'Intizom ko‘rsatkichlaringiz tahlil qilinmoqda...',
      emptyHabitsTitle: 'Faol odatlar belgilanmagan',
      emptyHabitsDesc: 'Intizom ballini ishga tushirish uchun uchtagacha kundalik odat qo‘shing.',
      goToHabits: 'Birinchi Odatni Qo‘shish',
    },
    coachStates: {
      PROUD: {
        label: 'FAXRLANMOQDA',
        statusLine: 'Bugungi barcha vazifalar bajarildi. So‘zingizda turdingiz.',
        defaultMessage: 'Bugun berilgan har bir va’da bajarildi. Munosib dam oling—ertaga yanada kuchliroq bo‘lamiz.',
      },
      WATCHING: {
        label: 'KUZATMOQDA',
        statusLine: 'Ijro vaqti nazorat ostida.',
        defaultMessage: 'Quruq gap yetarli emas. Vaqt tugashidan oldin qolgan odatlarni yakunlang.',
      },
      DISAPPOINTED: {
        label: 'RANJIGAN',
        statusLine: 'Kun yakunlanmoqda, ammo hali birorta odat bajarilmagan.',
        defaultMessage: 'Ertalab o‘zingizga so‘z berdingiz, lekin hali boshlamadingiz. Hozirning o‘zida harakatni boshlang.',
      },
      STRICT: {
        label: 'QATTIQ REJIM',
        statusLine: 'Murosasiz intizom protokoli yoqilgan.',
        defaultMessage: 'Bahona qidirishni to‘xtating. Keyingi odatni tanlang va darhol bajaring.',
      },
    },
    habitsScreen: {
      title: 'Odatlar Boshqaruvi',
      subtitle: 'Maksimal uchta faol odat. Soni emas, bajarilishi muhim.',
      activeCountLabel: 'Faol O‘rinlar',
      addHabit: 'Odat Qo‘shish',
      editHabit: 'Tahrirlash',
      deleteHabit: 'O‘chirish',
      limitWarningTitle: 'Cheklovga Yetildi',
      limitWarningMessage: "😂 Avval uchta odatni bajaring. Maqsad yig'ishni to'xtating va ularni bajarishni boshlang.",
      limitWarningAction: 'Tushunarli',
      formTitleAdd: 'Yangi Odat Qo‘shish',
      formTitleEdit: 'Odatni Tahrirlash',
      fieldName: 'Odat Nomi',
      fieldNamePlaceholder: 'Masalan: 60 daqiqa chuqur ishlash',
      fieldDesc: 'Bajarish Mezoni',
      fieldDescPlaceholder: 'Aniq qoidani yozing, ikkilanishga o‘rin qolmasin.',
      fieldReminder: 'Eslatma Vaqti',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      validationRequired: 'Iltimos, odat nomi va bajarish mezonini kiriting.',
      confirmDeleteTitle: 'Odatni o‘chirasizmi?',
      confirmDeleteDesc: 'Ushbu odat o‘chirilsa, yangi odat qo‘shish uchun joy ochiladi.',
      confirmDeleteYes: 'Ha, O‘chirish',
      emptyTitle: 'Faol Odatlar Yo‘q',
      emptyDesc: 'Kundalik intizomni kuzatishni boshlash uchun birinchi odatingizni qo‘shing.',
    },
    coachScreen: {
      title: 'AI Murabbiy',
      subtitle: 'Jonli natijalaringizga asoslangan qat’iy nazorat.',
      strictModeLabel: 'Qattiq Rejim',
      balancedModeLabel: 'Muvozanatli',
      thinking: 'Natijalaringiz tahlil qilinmoqda...',
      inputPlaceholder: 'Natijangizni yozing yoki reja so‘rang...',
      send: 'Yuborish',
      suggestedTitle: 'Tezkor Savollar',
      suggestedQuestions: [
        'Bugungi intizomimni ochiq va qattiq tahlil qilib ber.',
        'Hozir ishtiyoqim past. Meni hushyor torttir.',
        'Keyingi 2 soat uchun aniq harakat rejasini tuzib ber.',
        'Ertaga ertalab seriyamni qanday saqlab qolaman?',
      ],
      errorTitle: 'Aloqa Uzildi',
      retry: 'Qayta Urinish',
      welcomeMessage:
        "Odatlaring va bugungi natijang ko'z oldimda turibdi. Bahona qidirishni bas qil — hozir nimani bajarding yoki nimada qiynalyapsan, ochiq yoz.",
      clearChat: 'Tarixni Tozalash',
    },
    statsScreen: {
      title: 'Natijalar Statistikasi',
      subtitle: 'Barqarorlik va kunlik intizomning haqqoniy tarixi.',
      completionRate: 'Bajarish Foizi',
      currentStreak: 'Joriy Seriya',
      bestStreak: 'Eng Yaxshi Seriya',
      todayScore: 'Bugungi Ball',
      weeklyTitle: 'Haftalik Natija',
      monthlyTitle: '30 Kunlik Dinamika',
      consistencyTitle: 'Odatlar Barqarorligi',
      historyTitle: 'Kunlik Ballar Tarixi',
      daysCompleted: 'kun',
      scoreLabel: 'Ball',
      habitsDone: 'Odatlar',
      openNightReport: 'Kechki Hisobotni Ko‘rish',
      emptyTitle: 'Hali Tarix Mavjud Emas',
      emptyDesc: 'Haftalik va oylik grafiklarni shakllantirish uchun asosiy ekranda odatlarni bajaring.',
      last7Days: 'Oxirgi 7 kun',
      last30Days: 'Oxirgi 30 kun',
      dateColumn: 'Sana',
      avgLabel: 'o‘rtacha',
    },
    settingsScreen: {
      title: 'Sozlamalar',
      subtitle: 'Til, murabbiy qat’iyati va eslatmalarni sozlang.',
      languageTitle: 'Ilova Tili',
      languageDesc: 'Butun interfeys va AI Murabbiy javoblari tilini tanlang.',
      englishLabel: 'English',
      uzbekLabel: 'O‘zbekcha',
      profileTitle: 'Foydalanuvchi Profili',
      displayName: 'Ism / Chaqiruv Nomi',
      focusArea: 'Asosiy Yo‘nalish',
      saveProfile: 'Profilni Saqlash',
      profileSaved: 'Profil saqlandi',
      notificationsTitle: 'Bildirishnomalar va Eslatmalar',
      enableReminders: 'Kunlik Odat Eslatmalari',
      morningCheckIn: 'Tonggi Tekshiruv Vaqti',
      nightReportTime: 'Kechki Hisobot Vaqti',
      hapticsLabel: 'Taktil Tebranish (Haptics)',
      coachPrefsTitle: 'AI Murabbiy Sozlamalari',
      coachIntensity: 'Nazorat Darajasi',
      balancedDesc: 'Qat’iy, strategik va bajarilgan kunlarni qadrlaydi.',
      relentlessDesc: 'Odatlar yakunlanmaguncha doim Qattiq Rejimda ishlaydi.',
      themeTitle: 'Tashqi Ko‘rinish',
      themeValue: 'Dark Warrior v1.0',
      themeNote: '1.0 versiyasida faqat Dark Warrior mavzusi mavjud.',
      privacyAccountTitle: 'Maxfiylik va Hisob',
      privacyNote: 'Barcha odatlar va shaxsiy yozuvlar faqat qurilmangizda saqlanadi.',
      incognitoToggle: 'Qulflangan Ekranda Odat Nomlarini Yashirish',
      exportBackup: 'JSON Nusxa Yuklab Olish',
      resetAll: 'Barcha Ma’lumotlarni Tozalash',
      resetConfirmTitle: 'Barcha natijalarni o‘chirasizmi?',
      resetConfirmDesc: 'Bu amal barcha odatlar, ballar tarixi, seriyalar va AI suhbatlarini tozalaydi.',
      resetConfirmYes: 'Hammasini Tozalash',
      cancel: 'Bekor qilish',
    },
    nightReport: {
      title: 'Kechki Hisobot',
      subtitle: 'Kun yakuni bo‘yicha rasmiy xulosa',
      finalScore: 'Yakuniy Kunlik Ball',
      habitsCompleted: 'Bajarilgan Odatlar',
      streakStatus: 'Seriya Holati',
      verdictLabel: 'Murabbiy Xulosasi',
      planTomorrow: 'AI Murabbiy Bilan Ertani Rejalash',
      close: 'Yopish',
      allDoneVerdict: 'Vazifa a’lo darajada bajarildi. Bugun o‘zingizga bergan barcha va’dalarning ustidan chiqdingiz.',
      partialVerdict: 'Qisman bajarildi. Uyqudan oldin qolgan vazifalarni yakunlang yoki kamchilikni tan oling.',
      zeroVerdict: 'Bugun birorta ham odat bajarilmadi. Ertangi kun bugun kechdan boshlanadi—intizomni tiklang.',
    },
  },
};
