/**
 * UstozRank — O'quvchilar Reyting va Ball Tizimi
 * Pure Vanilla JavaScript (ES6+)
 * Multi-Language (UZ, EN, RU, KK), Dark/Light Theme, Public Parent/Student Mode & Teacher Admin
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. STORAGE KEYS & CREDENTIALS
  // =========================================================================
  const STORAGE_KEYS = {
    AUTH: 'ustoz_rank_auth_v2',
    GROUPS: 'ustoz_rank_groups_v1',
    STUDENTS: 'ustoz_rank_students_v1',
    POINTS: 'ustoz_rank_points_v1',
    TEACHERS: 'ustoz_rank_teachers_v1',
    THEME: 'ustoz_rank_theme_v1',
    LANG: 'ustoz_rank_lang_v1'
  };

  const DEFAULT_ADMIN = {
    username: 'kaludir',
    password: 'UDKM1234'
  };

  const DEFAULT_TEACHERS = [
    { id: 'teacher_default', name: 'Asosiy o‘qituvchi', username: 'ustoz', password: 'Ustoz1234' }
  ];

  // Cloud Sync Configuration (kvdb.io — free cloud key-value store)
  const CLOUD_SYNC = {
    enabled: true,
    // Same-origin Vercel function avoids browser CORS failures when syncing.
    baseUrl: '/api/data',
    key: 'ustozrank_data_v1',
    timeout: 5000 // ms
  };

  let cloudWriteQueue = Promise.resolve();

  // =========================================================================
  // 2. I18N MULTI-LANGUAGE DICTIONARY (UZ, EN, RU, KK)
  // =========================================================================
  const I18N = {
    uz: {
      appSubtitle: "Reyting & Monitoring",
      navMain: "ASOSIY",
      navDashboard: "Boshqaruv paneli",
      navGlobalRanking: "Umumiy Reyting",
      navWeeklyRanking: "Haftalik Reyting",
      badgeNew: "Yangi",
      navStudentsGroups: "O'QUVCHILAR & GURUHLAR",
      navGroups: "Guruhlar",
      navStudents: "O'quvchilar",
      navAddPoints: "Ball Qo'shish",
      navAnalytics: "TAHLIL VA SOZLAMALAR",
      navStatistics: "Statistika",
      navBackup: "Zaxira & Ma'lumotlar",
      quickAddPoint: "Tezkor Ball Berish",
      teacherLoginBtn: "🔑 Ustoz Kirish",
      teacherActiveTag: "Ustoz (Admin)",
      publicModeTag: "Ota-ona & O'quvchi",
      readOnlyMode: "Faqat ko'rish rejimi",
      activeSession: "Faol boshqaruv seansi",
      searchPlaceholder: "O'quvchi yoki guruh nomini qidirish...",
      welcomeTitle: "O'quvchilar Reytingi & Natijalar Portali 👋",
      welcomeSubtitle: "O'quvchilar, ota-onalar va ustozlar uchun shaffof dars faolligi va monitoring tizimi",
      addStudent: "+ O'quvchi qo'shish",
      addGroup: "+ Guruh ochish",
      statTotalStudents: "Jami O'quvchilar",
      statWeeklyPoints: "Bu Hafta Berilgan",
      statTotalPoints: "Jami Berilgan Ball",
      statTopStudent: "Yetakchi O'quvchi",
      statInGroups: "ta guruhda",
      statAssessmentsSub: "ta baholash",
      podiumTitle: "🏆 Top 3 Yetakchi O'quvchilar",
      podiumSubtitle: "Eng yuqori umumiy ball to'plagan eng faol o'quvchilar",
      podiumGold: "🥇 1-O'rin (Oltin)",
      podiumSilver: "🥈 2-O'rin (Kumush)",
      podiumBronze: "🥉 3-O'rin (Bronza)",
      rankingTableTitle: "📊 Umumiy O'quvchilar Reytingi",
      rankingTableSubtitle: "Barcha o'quvchilarning ballari va ko'rsatkichlari",
      filterGroupLabel: "Guruh:",
      filterPeriodLabel: "Davr:",
      filterAllGroups: "Barcha guruhlar",
      periodAllTime: "Barcha vaqt",
      periodWeek: "Bu hafta",
      periodMonth: "Bu oy",
      thRank: "O'rin",
      thStudent: "O'quvchi",
      thGroup: "Guruh",
      thWeeklyPoints: "Haftalik Ball",
      thWeekly: "Haftalik",
      thMonthly: "Oylik",
      thTasksCount: "Topshiriqlar",
      thTotalPoints: "Umumiy Ball",
      thActions: "Amallar",
      thPhone: "Telefon",
      thGlobalRank: "Reyting O'rni",
      thWeeklyRank: "Haftalik O'rin",
      thPointsThisWeek: "Bu Hafta To'plangan Ball",
      thDate: "Sana",
      thPoints: "Ball",
      thCategory: "Kategoriya",
      thDescription: "Tavsif / Izoh",
      thDelete: "O'chirish",
      weeklyRankingPageTitle: "Haftalik Reyting (Joriy Hafta)",
      weeklyResetNotice: "Hafta tugaganda umumiy ballar saqlanadi, haftalik reyting esa yangilanadi",
      globalRankingPageTitle: "Umumiy O'quvchilar Reytingi",
      globalRankingPageSubtitle: "Barcha guruhlar bo'yicha to'liq umumiy jadval",
      groupsPageTitle: "O'quv Guruhlari",
      groupsPageSubtitle: "Sinf guruhlari, ularning ballari va ko'rsatkichlari",
      studentsPageTitle: "Barcha O'quvchilar",
      studentsPageSubtitle: "O'quvchilar ro'yxati va profil ko'rsatkichlari",
      addPointsPageTitle: "Tezkor Ball Qo'shish Formasi",
      addPointsPageSubtitle: "Dars davomida o'quvchilarga rag'bat yoki jarima ballarini tezkor kiritish",
      statsPageTitle: "Umumiy Statistika va Tahlil",
      statsPageSubtitle: "O'quv jarayoni va topshiriqlar bo'yicha to'liq tahliliy ko'rsatkichlar",
      backupPageTitle: "Zaxira Nusxa va Ma'lumotlar Boshqaruvi",
      backupPageSubtitle: "Brauzer xotirasi tozalansa ma'lumotlar yo'qolmasligi uchun zaxira oling",
      backToGroups: "Barcha guruhlarga qaytish",
      editGroup: "Tahrirlash",
      statStudentCount: "O'quvchilar soni",
      statGroupTotalPoints: "Jami to'plangan ball",
      statAvgPoints: "O'rtacha ball / o'quvchi",
      groupRankingTitle: "Guruh O'quvchilari Reytingi",
      groupRankingSubtitle: "Kategoriyalar bo'yicha ballar taqsimoti",
      stepGroup: "1. Guruhni tanlang",
      stepStudent: "2. O'quvchini tanlang",
      stepPoints: "3. Ball miqdorini tanlang yoki yozing",
      stepCategory: "4. Kategoriya",
      stepDate: "5. Sana",
      stepDesc: "6. Tavsif / Izoh",
      quickDescriptions: "Tezkor izohlar:",
      btnReset: "Tozalash",
      btnSavePoint: "Ballni Saqlash",
      statTotalAssessments: "Jami Baholashlar",
      statTransactionsSub: "Tranzaksiyalar soni",
      statBestStudent: "Eng Faol O'quvchi",
      statBestGroup: "Eng Yaxshi Guruh",
      statAvgStudentPoints: "O'rtacha Ball / Talaba",
      statOverallIndicator: "Umumiy ko'rsatkich",
      categoryShareTitle: "Kategoriyalar Bo'yicha Ballar Ulushi",
      categoryShareSubtitle: "Qaysi faoliyat turidan ko'proq ball berilgan",
      groupCompTitle: "Guruhlar O'rtasidagi Raqobat",
      groupCompSubtitle: "Guruhlar jami ballari solishtirmasi",
      exportTitle: "JSON Faylga Eksport Qilish",
      exportDesc: "Barcha guruhlar, o'quvchilar va ballar tarixini kompyuteringizga .json fayl sifatida yuklab oling.",
      btnExport: "Eksport Qilish (.json)",
      importTitle: "Zaxiradan Tiklash (Import)",
      importDesc: "Avval saqlab qo'yilgan .json zaxira faylini yuklab tizim ma'lumotlarini to'liq tiklang.",
      btnImport: "Faylni Tanlash (.json)",
      textBackupTitle: "Matn Ko'rinishida Nusxalash",
      textBackupDesc: "JSON ma'lumotlarini to'g'ridan-to'g'ri clipboardga ko'chirib olish yoki qo'lda kiritish.",
      btnRawJson: "JSON Matnini Ko'rish / Kiritish",
      clearTitle: "Barcha Ma'lumotlarni Tozalash",
      clearDesc: "Tizimdagi barcha guruhlar, talabalar va ballar tarixini butunlay o'chirib tashlash.",
      btnClear: "Tozalash (Reset)",
      demoBannerTitle: "Namunaviy Ma'lumotlar Bilan Sinab Ko'rish",
      demoBannerDesc: "Agar tizim bo'sh bo'lsa yoki sinab ko'rmoqchi bo'lsangiz, bir tugma bilan namunaviy guruhlar va o'quvchilarni yuklang.",
      btnLoadDemo: "Namunaviy ma'lumotlarni yuklash",
      changePassTitle: "Admin Parolini O'zgartirish",
      changePassSubtitle: "Tizimga kirish parolini yangilash",
      newPassLabel: "Yangi parol",
      confirmPassLabel: "Yangi parolni tasdiqlang",
      btnUpdatePass: "Parolni Yangilash",
      teacherLoginModalTitle: "Ustoz Kirish Paneli",
      teacherLoginModalSubtitle: "Ball berish va boshqaruv uchun kiring",
      loginUsernameLabel: "Login (Foydalanuvchi)",
      loginPasswordLabel: "Parol",
      btnSignIn: "Tizimga kirish",
      btnCancel: "Bekor qilish",
      btnSave: "Saqlash",
      btnApplyPoint: "Ballni Biriktirish",
      btnClose: "Yopish",
      btnCopy: "📋 Nusxa olish",
      btnRestoreFromText: "🔄 Ushbu matndan tiklash",
      confirmTitle: "Tasdiqlash",
      btnConfirm: "Tasdiqlash",
      catClass: "Darsdagi faollik",
      catHomework: "Uyga vazifa",
      catExtra: "Qo‘shimcha vazifa",
      catTest: "Test",
      catOther: "Boshqa",
      addPointToStudent: "+ Ushbu o'quvchiga ball berish",
      pointHistoryTitle: "📜 Ballar Tarixi (Xronologiya)",
      profGlobalRank: "Umumiy Reyting",
      profGroupRank: "Guruhdagi O'rni",
      profTotalPoints: "Jami Ball",
      profWeeklyPoints: "Haftalik Ball",
      profMonthlyPoints: "Oylik Ball",
      groupNameInputLabel: "Guruh nomi",
      groupDescInputLabel: "Qisqacha tavsif",
      studentNameInputLabel: "To'liq F.I.Sh.",
      studentGroupSelectLabel: "Guruh",
      studentPhoneInputLabel: "Telefon raqam (ixtiyoriy)",
      studentInitialPointsLabel: "Boshlang'ich ball",
      initialPointsHint: "O'quvchi qo'shilganda beriladigan boshlang'ich rag'bat balli",
      quickPointModalTitle: "⚡ O'quvchiga Ball Berish",
      rawJsonModalTitle: "JSON Zaxira Matni",
      rawJsonDesc: "Quyidagi matnni nusxalab saqlab qo'yishingiz yoki boshqa zaxira matnini bu yerga qo'yib tiklashingiz mumkin:"
    },

    en: {
      appSubtitle: "Ranking & Monitoring",
      navMain: "MAIN",
      navDashboard: "Dashboard",
      navGlobalRanking: "Global Ranking",
      navWeeklyRanking: "Weekly Ranking",
      badgeNew: "New",
      navStudentsGroups: "STUDENTS & GROUPS",
      navGroups: "Groups",
      navStudents: "Students",
      navAddPoints: "Add Points",
      navAnalytics: "ANALYTICS & SETTINGS",
      navStatistics: "Statistics",
      navBackup: "Backup & Data",
      quickAddPoint: "Quick Add Points",
      teacherLoginBtn: "🔑 Teacher Login",
      teacherActiveTag: "Teacher (Admin)",
      publicModeTag: "Parents & Students",
      readOnlyMode: "Read-only mode",
      activeSession: "Active Admin Session",
      searchPlaceholder: "Search student or group name...",
      welcomeTitle: "Student Ranking & Results Portal 👋",
      welcomeSubtitle: "Transparent student performance and points monitoring system for parents and teachers",
      addStudent: "+ Add Student",
      addGroup: "+ New Group",
      statTotalStudents: "Total Students",
      statWeeklyPoints: "Earned This Week",
      statTotalPoints: "Total Points Awarded",
      statTopStudent: "Leading Student",
      statInGroups: "in groups",
      statAssessmentsSub: "point records",
      podiumTitle: "🏆 Top 3 Outstanding Students",
      podiumSubtitle: "Students with the highest total score across all groups",
      podiumGold: "🥇 1st Place (Gold)",
      podiumSilver: "🥈 2nd Place (Silver)",
      podiumBronze: "🥉 3rd Place (Bronze)",
      rankingTableTitle: "📊 Overall Student Leaderboard",
      rankingTableSubtitle: "Complete list of students sorted by points and performance",
      filterGroupLabel: "Group:",
      filterPeriodLabel: "Period:",
      filterAllGroups: "All Groups",
      periodAllTime: "All Time",
      periodWeek: "This Week",
      periodMonth: "This Month",
      thRank: "Rank",
      thStudent: "Student",
      thGroup: "Group",
      thWeeklyPoints: "Weekly Pts",
      thWeekly: "Weekly",
      thMonthly: "Monthly",
      thTasksCount: "Completed Tasks",
      thTotalPoints: "Total Points",
      thActions: "Actions",
      thPhone: "Phone",
      thGlobalRank: "Overall Rank",
      thWeeklyRank: "Weekly Rank",
      thPointsThisWeek: "Points This Week",
      thDate: "Date",
      thPoints: "Points",
      thCategory: "Category",
      thDescription: "Description / Notes",
      thDelete: "Delete",
      weeklyRankingPageTitle: "Weekly Leaderboard (Current Week)",
      weeklyResetNotice: "Historical points are always preserved; weekly ranking resets every calendar week",
      globalRankingPageTitle: "Global Student Rankings",
      globalRankingPageSubtitle: "Comprehensive leaderboard across all class groups",
      groupsPageTitle: "Class Groups",
      groupsPageSubtitle: "Overview of student groups, total points, and standings",
      studentsPageTitle: "All Students",
      studentsPageSubtitle: "Student directory and profile metrics",
      addPointsPageTitle: "Fast Point Entry Form",
      addPointsPageSubtitle: "Quickly award positive or penalty points during lessons",
      statsPageTitle: "Comprehensive Statistics & Analytics",
      statsPageSubtitle: "Detailed progress, activity metrics, and visual distributions",
      backupPageTitle: "Backup & Data Management",
      backupPageSubtitle: "Export, import, and safeguard your browser database",
      backToGroups: "Back to all groups",
      editGroup: "Edit Group",
      statStudentCount: "Enrolled Students",
      statGroupTotalPoints: "Total Group Points",
      statAvgPoints: "Average Points / Student",
      groupRankingTitle: "Group Leaderboard",
      groupRankingSubtitle: "Points breakdown by activity categories",
      stepGroup: "1. Select Group",
      stepStudent: "2. Select Student",
      stepPoints: "3. Choose or Enter Points",
      stepCategory: "4. Category",
      stepDate: "5. Date",
      stepDesc: "6. Description / Notes",
      quickDescriptions: "Quick presets:",
      btnReset: "Reset",
      btnSavePoint: "Save Points",
      statTotalAssessments: "Total Assessments",
      statTransactionsSub: "Transactions count",
      statBestStudent: "Most Active Student",
      statBestGroup: "Top Performing Group",
      statAvgStudentPoints: "Average Points / Student",
      statOverallIndicator: "Overall benchmark",
      categoryShareTitle: "Points Share by Category",
      categoryShareSubtitle: "Distribution of points earned across activities",
      groupCompTitle: "Inter-Group Competition",
      groupCompSubtitle: "Total accumulated points comparison",
      exportTitle: "Export to JSON File",
      exportDesc: "Download all groups, students, and point transactions as a safe .json file.",
      btnExport: "Export (.json)",
      importTitle: "Restore from File (Import)",
      importDesc: "Upload previously downloaded .json backup to restore all data.",
      btnImport: "Choose File (.json)",
      textBackupTitle: "Copy / Paste JSON Text",
      textBackupDesc: "Directly view, copy to clipboard, or paste raw JSON text data.",
      btnRawJson: "View / Edit Raw JSON",
      clearTitle: "Clear All Data",
      clearDesc: "Permanently delete all groups, students, and scoring history.",
      btnClear: "Reset All",
      demoBannerTitle: "Try with Sample Demo Data",
      demoBannerDesc: "Instantly load 3 groups and 10 students with simulated scoring history.",
      btnLoadDemo: "Load Sample Data",
      changePassTitle: "Change Admin Password",
      changePassSubtitle: "Update your login credentials",
      newPassLabel: "New Password",
      confirmPassLabel: "Confirm Password",
      btnUpdatePass: "Update Password",
      teacherLoginModalTitle: "Teacher Admin Login",
      teacherLoginModalSubtitle: "Log in to award points and manage classes",
      loginUsernameLabel: "Username",
      loginPasswordLabel: "Password",
      btnSignIn: "Sign In",
      btnCancel: "Cancel",
      btnSave: "Save",
      btnApplyPoint: "Award Points",
      btnClose: "Close",
      btnCopy: "📋 Copy to Clipboard",
      btnRestoreFromText: "🔄 Restore from Text",
      confirmTitle: "Confirmation",
      btnConfirm: "Confirm",
      catClass: "Class Participation",
      catHomework: "Homework",
      catExtra: "Additional Task",
      catTest: "Test",
      catOther: "Other",
      addPointToStudent: "+ Award Points to this Student",
      pointHistoryTitle: "📜 Point History Ledger",
      profGlobalRank: "Global Rank",
      profGroupRank: "Group Rank",
      profTotalPoints: "Total Points",
      profWeeklyPoints: "Weekly Points",
      profMonthlyPoints: "Monthly Points",
      groupNameInputLabel: "Group Name",
      groupDescInputLabel: "Brief Description",
      studentNameInputLabel: "Full Name",
      studentGroupSelectLabel: "Group",
      studentPhoneInputLabel: "Phone Number (optional)",
      studentInitialPointsLabel: "Initial Points",
      initialPointsHint: "Starting bonus points assigned upon creation",
      quickPointModalTitle: "⚡ Award Points to Student",
      rawJsonModalTitle: "Raw JSON Backup Data",
      rawJsonDesc: "Copy this raw data to save or paste your backup to restore:"
    },

    ru: {
      appSubtitle: "Рейтинг и мониторинг",
      navMain: "ГЛАВНАЯ",
      navDashboard: "Панель управления",
      navGlobalRanking: "Общий рейтинг",
      navWeeklyRanking: "Еженедельный рейтинг",
      badgeNew: "Новое",
      navStudentsGroups: "УЧЕНИКИ И ГРУППЫ",
      navGroups: "Группы",
      navStudents: "Ученики",
      navAddPoints: "Добавить баллы",
      navAnalytics: "АНАЛИТИКА И НАСТРОЙКИ",
      navStatistics: "Статистика",
      navBackup: "Резервное копирование",
      quickAddPoint: "Быстро добавить баллы",
      teacherLoginBtn: "🔑 Вход для учителя",
      teacherActiveTag: "Учитель (Админ)",
      publicModeTag: "Родители и ученики",
      readOnlyMode: "Режим просмотра",
      activeSession: "Активная сессия управления",
      searchPlaceholder: "Поиск ученика или группы...",
      welcomeTitle: "Рейтинг учеников и мониторинг успеваемости 👋",
      welcomeSubtitle: "Прозрачная система баллов и успеваемости для родителей, учеников и преподавателей",
      addStudent: "+ Добавить ученика",
      addGroup: "+ Создать группу",
      statTotalStudents: "Всего учеников",
      statWeeklyPoints: "Набрано за неделю",
      statTotalPoints: "Всего начислено баллов",
      statTopStudent: "Лидирующий ученик",
      statInGroups: "в группах",
      statAssessmentsSub: "оценок в истории",
      podiumTitle: "🏆 Топ-3 лучших ученика",
      podiumSubtitle: "Ученики с наивысшими суммарными баллами среди всех групп",
      podiumGold: "🥇 1-е место (Золото)",
      podiumSilver: "🥈 2-е место (Серебро)",
      podiumBronze: "🥉 3-е место (Бронза)",
      rankingTableTitle: "📊 Общая таблица рейтинга",
      rankingTableSubtitle: "Все ученики, отсортированные по общему баллу",
      filterGroupLabel: "Группа:",
      filterPeriodLabel: "Период:",
      filterAllGroups: "Все группы",
      periodAllTime: "За все время",
      periodWeek: "За эту неделю",
      periodMonth: "За этот месяц",
      thRank: "Место",
      thStudent: "Ученик",
      thGroup: "Группа",
      thWeeklyPoints: "За неделю",
      thWeekly: "Неделя",
      thMonthly: "Месяц",
      thTasksCount: "Заданий",
      thTotalPoints: "Всего баллов",
      thActions: "Действия",
      thPhone: "Телефон",
      thGlobalRank: "Общее место",
      thWeeklyRank: "Место за неделю",
      thPointsThisWeek: "Баллы за эту неделю",
      thDate: "Дата",
      thPoints: "Баллы",
      thCategory: "Категория",
      thDescription: "Описание / Примечание",
      thDelete: "Удалить",
      weeklyRankingPageTitle: "Еженедельный рейтинг (Текущая неделя)",
      weeklyResetNotice: "Общие баллы никогда не удаляются; еженедельный рейтинг обновляется каждый понедельник",
      globalRankingPageTitle: "Общий рейтинг учеников",
      globalRankingPageSubtitle: "Полный список успеваемости по всем группам",
      groupsPageTitle: "Учебные группы",
      groupsPageSubtitle: "Группы, их суммарные баллы и показатели",
      studentsPageTitle: "Все ученики",
      studentsPageSubtitle: "Список учащихся и профили",
      addPointsPageTitle: "Быстрое начисление баллов",
      addPointsPageSubtitle: "Оперативное выставление поощрительных или штрафных баллов",
      statsPageTitle: "Статистика и аналитика",
      statsPageSubtitle: "Детальные показатели процесса обучения",
      backupPageTitle: "Резервное копирование и управление данными",
      backupPageSubtitle: "Сохраняйте данные в файл, чтобы не потерять их при очистке браузера",
      backToGroups: "Назад ко всем группам",
      editGroup: "Редактировать",
      statStudentCount: "Количество учеников",
      statGroupTotalPoints: "Всего баллов группы",
      statAvgPoints: "Средний балл / ученик",
      groupRankingTitle: "Рейтинг группы",
      groupRankingSubtitle: "Распределение баллов по типам заданий",
      stepGroup: "1. Выберите группу",
      stepStudent: "2. Выберите ученика",
      stepPoints: "3. Выберите или введите баллы",
      stepCategory: "4. Категория",
      stepDate: "5. Дата",
      stepDesc: "6. Описание / Примечание",
      quickDescriptions: "Быстрые заметки:",
      btnReset: "Очистить",
      btnSavePoint: "Сохранить баллы",
      statTotalAssessments: "Всего оценок",
      statTransactionsSub: "Количество записей",
      statBestStudent: "Самый активный ученик",
      statBestGroup: "Лучшая группа",
      statAvgStudentPoints: "Средний балл на ученика",
      statOverallIndicator: "Общий показатель",
      categoryShareTitle: "Доля баллов по категориям",
      categoryShareSubtitle: "В каких активностях набрано больше всего баллов",
      groupCompTitle: "Соревнование между группами",
      groupCompSubtitle: "Сравнение суммарных баллов групп",
      exportTitle: "Экспорт в файл JSON",
      exportDesc: "Скачайте полную базу данных групп, учеников и истории баллов в файл .json.",
      btnExport: "Экспортировать (.json)",
      importTitle: "Восстановление из файла (Импорт)",
      importDesc: "Загрузите ранее сохраненный файл .json для полного восстановления.",
      btnImport: "Выбрать файл (.json)",
      textBackupTitle: "Копирование в виде текста",
      textBackupDesc: "Копируйте JSON в буфер обмена или вставляйте текст вручную.",
      btnRawJson: "Просмотр / Ввод JSON",
      clearTitle: "Очистить все данные",
      clearDesc: "Безвозвратно удалить все группы, учеников и историю оценок.",
      btnClear: "Сбросить все",
      demoBannerTitle: "Протестировать на демо-данных",
      demoBannerDesc: "Загрузить 3 группы и 10 учеников с готовой историей баллов в один клик.",
      btnLoadDemo: "Загрузить демо-данные",
      changePassTitle: "Смена пароля администратора",
      changePassSubtitle: "Обновление пароля входа",
      newPassLabel: "Новый пароль",
      confirmPassLabel: "Подтвердите пароль",
      btnUpdatePass: "Обновить пароль",
      teacherLoginModalTitle: "Вход для преподавателя",
      teacherLoginModalSubtitle: "Войдите для выставления баллов и управления",
      loginUsernameLabel: "Логин",
      loginPasswordLabel: "Пароль",
      btnSignIn: "Войти",
      btnCancel: "Отмена",
      btnSave: "Сохранить",
      btnApplyPoint: "Начислить баллы",
      btnClose: "Закрыть",
      btnCopy: "📋 Скопировать",
      btnRestoreFromText: "🔄 Восстановить из текста",
      confirmTitle: "Подтверждение",
      btnConfirm: "Подтвердить",
      catClass: "Активность на уроке",
      catHomework: "Домашнее задание",
      catExtra: "Дополнительное задание",
      catTest: "Тест",
      catOther: "Другое",
      addPointToStudent: "+ Начислить баллы ученику",
      pointHistoryTitle: "📜 История баллов (Хронология)",
      profGlobalRank: "Общий рейтинг",
      profGroupRank: "Место в группе",
      profTotalPoints: "Всего баллов",
      profWeeklyPoints: "Баллы за неделю",
      profMonthlyPoints: "Баллы за месяц",
      groupNameInputLabel: "Название группы",
      groupDescInputLabel: "Краткое описание",
      studentNameInputLabel: "Ф.И.О. ученика",
      studentGroupSelectLabel: "Группа",
      studentPhoneInputLabel: "Номер телефона (необязательно)",
      studentInitialPointsLabel: "Начальные баллы",
      initialPointsHint: "Стартовые баллы при добавлении ученика",
      quickPointModalTitle: "⚡ Начисление баллов",
      rawJsonModalTitle: "Текст резервной копии JSON",
      rawJsonDesc: "Скопируйте текст для сохранения или вставьте сюда файл резервной копии:"
    },

    kk: {
      appSubtitle: "Рейтинг және бақылау",
      navMain: "НЕГІЗГІ",
      navDashboard: "Басқару панелі",
      navGlobalRanking: "Жалпы рейтинг",
      navWeeklyRanking: "Апталық рейтинг",
      badgeNew: "Жаңа",
      navStudentsGroups: "ОҚУШЫЛАР ЖӘНЕ ТОПТАР",
      navGroups: "Топтар",
      navStudents: "Оқушылар",
      navAddPoints: "Ұпай қосу",
      navAnalytics: "ТАЛДАУ ЖӘНЕ БАПТАУЛАР",
      navStatistics: "Статистика",
      navBackup: "Сақтық көшірме",
      quickAddPoint: "Жылдам ұпай беру",
      teacherLoginBtn: "🔑 Мұғалім кіруі",
      teacherActiveTag: "Мұғалім (Админ)",
      publicModeTag: "Ата-аналар мен оқушылар",
      readOnlyMode: "Тек көру режимі",
      activeSession: "Белсенді басқару сеансы",
      searchPlaceholder: "Оқушы немесе топ атын іздеу...",
      welcomeTitle: "Оқушылар рейтингі және нәтижелер порталы 👋",
      welcomeSubtitle: "Ата-аналар, оқушылар мен мұғалімдерге арналған ашық бағалау жүйесі",
      addStudent: "+ Оқушы қосу",
      addGroup: "+ Топ ашу",
      statTotalStudents: "Барлық оқушылар",
      statWeeklyPoints: "Осы аптада берілген",
      statTotalPoints: "Жалпы берілген ұпай",
      statTopStudent: "Көшбасшы оқушы",
      statInGroups: "топта",
      statAssessmentsSub: "бағалау жазбасы",
      podiumTitle: "🏆 Үздік 3 оқушы",
      podiumSubtitle: "Барлық топтар бойынша ең көп ұпай жинаған үздік оқушылар",
      podiumGold: "🥇 1-орын (Алтын)",
      podiumSilver: "🥈 2-орын (Күміс)",
      podiumBronze: "🥉 3-орын (Қола)",
      rankingTableTitle: "📊 Жалпы оқушылар рейтингі",
      rankingTableSubtitle: "Барлық оқушылардың жинаған ұпайлары",
      filterGroupLabel: "Топ:",
      filterPeriodLabel: "Кезең:",
      filterAllGroups: "Барлық топтар",
      periodAllTime: "Барлық уақыт",
      periodWeek: "Осы апта",
      periodMonth: "Осы ай",
      thRank: "Орын",
      thStudent: "Оқушы",
      thGroup: "Топ",
      thWeeklyPoints: "Апталық ұпай",
      thWeekly: "Апталық",
      thMonthly: "Айлық",
      thTasksCount: "Тапсырмалар",
      thTotalPoints: "Жалпы ұпай",
      thActions: "Әрекеттер",
      thPhone: "Телефон",
      thGlobalRank: "Жалпы орын",
      thWeeklyRank: "Апталық орын",
      thPointsThisWeek: "Осы аптадағы ұпай",
      thDate: "Күні",
      thPoints: "Ұпай",
      thCategory: "Санат",
      thDescription: "Сипаттама / Түсініктеме",
      thDelete: "Жою",
      weeklyRankingPageTitle: "Апталық рейтинг (Ағымдағы апта)",
      weeklyResetNotice: "Тарихи жалпы ұпайлар жойылмайды; апталық рейтинг апта сайын жаңарады",
      globalRankingPageTitle: "Жалпы оқушылар рейтингі",
      globalRankingPageSubtitle: "Барлық топтар бойынша толық нәтижелер кестесі",
      groupsPageTitle: "Оқу топтары",
      groupsPageSubtitle: "Топтар, олардың жалпы ұпайлары мен көрсеткіштері",
      studentsPageTitle: "Барлық оқушылар",
      studentsPageSubtitle: "Оқушылар тізімі және профильдері",
      addPointsPageTitle: "Жылдам ұпай қосу формасы",
      addPointsPageSubtitle: "Сабақ кезінде оқушыларға ынталандыру немесе айыппұл ұпайларын жылдам енгізу",
      statsPageTitle: "Жалпы статистика және талдау",
      statsPageSubtitle: "Оқу үдерісі бойынша толық талдау көрсеткіштері",
      backupPageTitle: "Сақтық көшірме және деректерді басқару",
      backupPageSubtitle: "Браузер жады тазартылса деректерді жоғалтпау үшін сақтық көшірме алыңыз",
      backToGroups: "Барлық топтарға оралу",
      editGroup: "Өңдеу",
      statStudentCount: "Оқушылар саны",
      statGroupTotalPoints: "Жалпы жиналған ұпай",
      statAvgPoints: "Орташа ұпай / оқушы",
      groupRankingTitle: "Топ оқушыларының рейтингі",
      groupRankingSubtitle: "Санаттар бойынша ұпайлардың бөлінуі",
      stepGroup: "1. Топты таңдаңыз",
      stepStudent: "2. Оқушыны таңдаңыз",
      stepPoints: "3. Ұпай мөлшерін таңдаңыз немесе жазыңыз",
      stepCategory: "4. Санат",
      stepDate: "5. Күні",
      stepDesc: "6. Сипаттама / Түсініктеме",
      quickDescriptions: "Жылдам түсініктемелер:",
      btnReset: "Тазарту",
      btnSavePoint: "Ұпайды сақтау",
      statTotalAssessments: "Жалпы бағалаулар",
      statTransactionsSub: "Жазбалар саны",
      statBestStudent: "Ең белсенді оқушы",
      statBestGroup: "Ең үздік топ",
      statAvgStudentPoints: "Оқушыға шаққандағы орташа ұпай",
      statOverallIndicator: "Жалпы көрсеткіш",
      categoryShareTitle: "Санаттар бойынша ұпай үлесі",
      categoryShareSubtitle: "Қай іс-әрекет түрінен көбірек ұпай жиналған",
      groupCompTitle: "Топтар арасындағы бәсекелестік",
      groupCompSubtitle: "Топтардың жалпы ұпайларын салыстыру",
      exportTitle: "JSON файлына экспорттау",
      exportDesc: "Барлық топтар, оқушылар және ұпайлар тарихын компьютеріңізге .json файлы ретінде жүктеп алыңыз.",
      btnExport: "Экспорттау (.json)",
      importTitle: "Файлдан қалпына келтіру (Импорт)",
      importDesc: "Бұрын сақталған .json файлын жүктеп, деректерді толық қалпына келтіріңіз.",
      btnImport: "Файлды таңдау (.json)",
      textBackupTitle: "Мәтін ретінде көшіру",
      textBackupDesc: "JSON деректерін алмасу буферіне тікелей көшіріңіз немесе қолмен енгізіңіз.",
      btnRawJson: "JSON мәтінін көру / енгізу",
      clearTitle: "Барлық деректерді тазарту",
      clearDesc: "Барлық топтарды, оқушыларды және бағалау тарихын түпкілікті жою.",
      btnClear: "Тазарту (Reset)",
      demoBannerTitle: "Үлгі деректермен тексеру",
      demoBannerDesc: "Бір батырмамен 3 топ пен 10 оқушының үлгілік деректерін жүктеп көріңіз.",
      btnLoadDemo: "Үлгі деректерді жүктеу",
      changePassTitle: "Әкімші құпиясөзін өзгерту",
      changePassSubtitle: "Кіру құпиясөзін жаңарту",
      newPassLabel: "Жаңа құпиясөз",
      confirmPassLabel: "Жаңа құпиясөзді растаңыз",
      btnUpdatePass: "Құпиясөзді жаңарту",
      teacherLoginModalTitle: "Мұғалімнің кіру тақтасы",
      teacherLoginModalSubtitle: "Ұпай қою және басқару үшін жүйеге кіріңіз",
      loginUsernameLabel: "Логин",
      loginPasswordLabel: "Құпиясөз",
      btnSignIn: "Жүйеге кіру",
      btnCancel: "Болдырмау",
      btnSave: "Сақтау",
      btnApplyPoint: "Ұпайды бекіту",
      btnClose: "Жабу",
      btnCopy: "📋 Көшіріп алу",
      btnRestoreFromText: "🔄 Осы мәтіннен қалпына келтіру",
      confirmTitle: "Растау",
      btnConfirm: "Растау",
      catClass: "Сабақтағы белсенділік",
      catHomework: "Үй тапсырмасы",
      catExtra: "Қосымша тапсырма",
      catTest: "Тест",
      catOther: "Басқа",
      addPointToStudent: "+ Осы оқушыға ұпай беру",
      pointHistoryTitle: "📜 Ұпайлар тарихы (Хронология)",
      profGlobalRank: "Жалпы рейтинг",
      profGroupRank: "Топтағы орны",
      profTotalPoints: "Жалпы ұпай",
      profWeeklyPoints: "Апталық ұпай",
      profMonthlyPoints: "Айлық ұпай",
      groupNameInputLabel: "Топ атауы",
      groupDescInputLabel: "Қысқаша сипаттама",
      studentNameInputLabel: "Оқушының толық аты-жөні",
      studentGroupSelectLabel: "Топ",
      studentPhoneInputLabel: "Телефон нөмірі (міндетті емес)",
      studentInitialPointsLabel: "Бастапқы ұпай",
      initialPointsHint: "Оқушы қосылғанда берілетін бастапқы ынталандыру ұпайы",
      quickPointModalTitle: "⚡ Оқушыға ұпай беру",
      rawJsonModalTitle: "JSON сақтық көшірме мәтіні",
      rawJsonDesc: "Сақтау үшін төмендегі мәтінді көшіріп алыңыз немесе сақтық мәтінді енгізіңіз:"
    }
  };

  // Preset demo data
  const INITIAL_DEMO_DATA = {
    groups: [
      { id: 'grp_1', name: 'Frontend 10:30', description: 'HTML, CSS, JavaScript va Zamonaviy Veb Texnologiyalar', createdAt: '2026-09-01' },
      { id: 'grp_2', name: 'Python 14:00', description: 'Python asoslari, algoritmlar va ma\'lumotlar tuzilmasi', createdAt: '2026-09-02' },
      { id: 'grp_3', name: 'Backend 16:00', description: 'Node.js, Ma\'lumotlar bazasi va RESTful API ishlab chiqish', createdAt: '2026-09-03' }
    ],
    students: [
      { id: 'std_1', name: 'Aliyev Azizbek', groupId: 'grp_1', phone: '+998 90 123 45 67', createdAt: '2026-09-01' },
      { id: 'std_2', name: 'Karimov Bekzod', groupId: 'grp_1', phone: '+998 91 234 56 78', createdAt: '2026-09-01' },
      { id: 'std_3', name: 'Sobirov Muhammad', groupId: 'grp_1', phone: '+998 93 345 67 89', createdAt: '2026-09-02' },
      { id: 'std_4', name: 'Usmonova Madina', groupId: 'grp_1', phone: '+998 94 456 78 90', createdAt: '2026-09-02' },
      { id: 'std_5', name: 'Toshmatov Jasur', groupId: 'grp_2', phone: '+998 97 567 89 01', createdAt: '2026-09-03' },
      { id: 'std_6', name: 'Nazarova Shahlo', groupId: 'grp_2', phone: '+998 99 678 90 12', createdAt: '2026-09-03' },
      { id: 'std_7', name: 'Ergashev Bobur', groupId: 'grp_2', phone: '+998 90 789 01 23', createdAt: '2026-09-04' },
      { id: 'std_8', name: 'Rahimova Zarina', groupId: 'grp_3', phone: '+998 91 890 12 34', createdAt: '2026-09-05' },
      { id: 'std_9', name: 'Yuldashev Otabek', groupId: 'grp_3', phone: '+998 93 901 23 45', createdAt: '2026-09-05' },
      { id: 'std_10', name: 'Xamidov Sardor', groupId: 'grp_3', phone: '+998 94 012 34 56', createdAt: '2026-09-06' }
    ],
    points: [
      { id: 'pnt_1', studentId: 'std_1', points: 30, category: 'Darsdagi faollik', description: 'Amaliy mashg\'ulotda faol qatnashdi', date: '2026-09-19' },
      { id: 'pnt_2', studentId: 'std_1', points: 20, category: 'Uyga vazifa', description: 'Mustaqil topshiriq to\'liq bajarildi', date: '2026-09-18' },
      { id: 'pnt_3', studentId: 'std_1', points: 25, category: 'Test', description: 'Oraliq nazoratdan 100% natija', date: '2026-09-17' },
      { id: 'pnt_4', studentId: 'std_2', points: 20, category: 'Uyga vazifa', description: 'Vazifa topshirildi', date: '2026-09-19' },
      { id: 'pnt_5', studentId: 'std_2', points: 30, category: 'Qo‘shimcha vazifa', description: 'Qo\'shimcha loyiha topshirdi', date: '2026-09-16' },
      { id: 'pnt_6', studentId: 'std_3', points: 15, category: 'Darsdagi faollik', description: 'Savol-javobda faol', date: '2026-09-19' },
      { id: 'pnt_7', studentId: 'std_3', points: 20, category: 'Uyga vazifa', description: 'Vazifa a\'lo', date: '2026-09-17' },
      { id: 'pnt_8', studentId: 'std_4', points: 10, category: 'Darsdagi faollik', description: 'Darsda ishtirok', date: '2026-09-18' },
      { id: 'pnt_9', studentId: 'std_5', points: 30, category: 'Uyga vazifa', description: 'Murakkab algoritmlar yechimi', date: '2026-09-19' },
      { id: 'pnt_10', studentId: 'std_5', points: 20, category: 'Darsdagi faollik', description: 'Doskada misol yechdi', date: '2026-09-18' },
      { id: 'pnt_11', studentId: 'std_6', points: 25, category: 'Test', description: 'Python sintaksis testi', date: '2026-09-19' },
      { id: 'pnt_12', studentId: 'std_7', points: 15, category: 'Darsdagi faollik', description: 'Konspekt to\'liq', date: '2026-09-17' },
      { id: 'pnt_13', studentId: 'std_8', points: 30, category: 'Qo‘shimcha vazifa', description: 'REST API amaliyoti', date: '2026-09-19' },
      { id: 'pnt_14', studentId: 'std_9', points: 20, category: 'Uyga vazifa', description: 'Baza sxemasi to\'g\'ri', date: '2026-09-18' },
      { id: 'pnt_15', studentId: 'std_10', points: -10, category: 'Boshqa', description: 'Vazifa o\'z vaqtida topshirilmadi', date: '2026-09-18' }
    ]
  };

  // =========================================================================
  // 3. APPLICATION STATE
  // =========================================================================
  const state = {
    auth: {
      isLoggedIn: false, // Default: public view for students and parents!
      username: DEFAULT_ADMIN.username,
      password: DEFAULT_ADMIN.password,
      role: null
    },
    lang: 'uz',
    theme: 'light',
    groups: [],
    students: [],
    points: [],
    teachers: [...DEFAULT_TEACHERS],
    currentView: 'dashboard',
    activeGroupId: null,
    confirmCallback: null
  };

  // Helper to translate key
  function t(key, fallback = '') {
    const dict = I18N[state.lang] || I18N.uz;
    return dict[key] || fallback || key;
  }

  // =========================================================================
  // 4. STORAGE OPERATIONS (with Cloud Sync via kvdb.io)
  // =========================================================================

  // --- Cloud Sync Helpers ---
  async function cloudFetch() {
    if (!CLOUD_SYNC.enabled) return null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLOUD_SYNC.timeout);
      const resp = await fetch(`${CLOUD_SYNC.baseUrl}?key=${encodeURIComponent(CLOUD_SYNC.key)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!resp.ok) return null;
      const text = await resp.text();
      if (!text || text.trim() === '') return null;
      return JSON.parse(text);
    } catch (e) {
      console.warn('Cloud fetch failed (offline or timeout):', e.message);
      return null;
    }
  }

  async function cloudPush(data) {
    if (!CLOUD_SYNC.enabled) return false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CLOUD_SYNC.timeout);
      const resp = await fetch(`${CLOUD_SYNC.baseUrl}?key=${encodeURIComponent(CLOUD_SYNC.key)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return resp.ok;
    } catch (e) {
      console.warn('Cloud push failed (offline or timeout):', e.message);
      return false;
    }
  }

  // --- Local Storage (synchronous, always used) ---
  function loadFromStorage() {
    try {
      // Language (local preference)
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      if (savedLang && I18N[savedLang]) {
        state.lang = savedLang;
      }

      // Theme (local preference)
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        state.theme = savedTheme;
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.theme = prefersDark ? 'dark' : 'light';
      }
      applyTheme(state.theme);

      // Auth (local — login state is per-device)
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth) {
        state.auth = { ...state.auth, ...JSON.parse(savedAuth) };
        if (state.auth.isLoggedIn && !state.auth.role) {
          state.auth.role = 'super_admin';
        }
        state.auth.username = String(state.auth.username || DEFAULT_ADMIN.username).trim().toLowerCase();
      }

      // Groups, Students, Points — from localStorage first (instant render)
      const savedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const savedPoints = localStorage.getItem(STORAGE_KEYS.POINTS);
      const savedTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);

      if (savedGroups && savedStudents && savedPoints) {
        state.groups = JSON.parse(savedGroups).map(group => ({
          ...group,
          teacherId: group.teacherId || 'ustoz'
        }));
        state.students = JSON.parse(savedStudents);
        state.points = JSON.parse(savedPoints);
      } else {
        // No local data — will be resolved by cloud sync or demo data
        state.groups = [...INITIAL_DEMO_DATA.groups];
        state.students = [...INITIAL_DEMO_DATA.students];
        state.points = [...INITIAL_DEMO_DATA.points];
      }
      state.teachers = savedTeachers
        ? JSON.parse(savedTeachers).map(teacher => ({
          ...teacher,
          username: String(teacher.username || '').trim().toLowerCase()
        }))
        : [...DEFAULT_TEACHERS];
    } catch (e) {
      console.error('Storage error:', e);
      state.groups = [...INITIAL_DEMO_DATA.groups];
      state.students = [...INITIAL_DEMO_DATA.students];
      state.points = [...INITIAL_DEMO_DATA.points];
    }
  }

  // Async cloud load — called after initial render for seamless UX
  async function loadFromCloud() {
    const cloudData = await cloudFetch();
    if (cloudData && cloudData.groups && cloudData.students && cloudData.points) {
      const localDataExists = Boolean(
        localStorage.getItem(STORAGE_KEYS.GROUPS) &&
        localStorage.getItem(STORAGE_KEYS.STUDENTS) &&
        localStorage.getItem(STORAGE_KEYS.POINTS)
      );
      const localDataChanged = localDataExists && (
        JSON.stringify(state.groups) !== JSON.stringify(cloudData.groups) ||
        JSON.stringify(state.students) !== JSON.stringify(cloudData.students) ||
        JSON.stringify(state.points) !== JSON.stringify(cloudData.points) ||
        JSON.stringify(state.teachers) !== JSON.stringify(cloudData.teachers || [])
      );

      if (localDataChanged) {
        await cloudPush({
          groups: state.groups,
          students: state.students,
          points: state.points,
          teachers: state.teachers,
          adminPassword: state.auth.password,
          lastUpdated: new Date().toISOString()
        });
        console.log('☁️ Local changes pushed to cloud');
        return;
      }

      state.groups = cloudData.groups.map(group => ({
        ...group,
        teacherId: group.teacherId || 'ustoz'
      }));
      state.students = cloudData.students;
      state.points = cloudData.points;
      state.teachers = Array.isArray(cloudData.teachers)
        ? cloudData.teachers.map(teacher => ({
          ...teacher,
          username: String(teacher.username || '').trim().toLowerCase()
        }))
        : [...DEFAULT_TEACHERS];
      // Also update password if teacher changed it on another device
      if (cloudData.adminPassword) {
        state.auth.password = cloudData.adminPassword;
      }
      // Persist cloud data locally
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(state.groups));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
      localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(state.teachers));
      if (cloudData.adminPassword) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state.auth));
      }
      renderApp();
      console.log('✅ Cloud data loaded successfully');
    } else {
      // Never overwrite shared data with demo data when the API is unavailable.
      console.warn('☁️ Cloud data unavailable; keeping local data without overwriting cloud');
    }
  }

  function saveAllToStorage() {
    try {
      // Always save to localStorage (instant, offline-safe)
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(state.groups));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
      localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(state.points));
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(state.teachers));
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state.auth));
      localStorage.setItem(STORAGE_KEYS.LANG, state.lang);
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);

      // Queue cloud writes so rapid edits cannot overwrite one another out of order.
      const cloudData = {
        groups: state.groups,
        students: state.students,
        points: state.points,
        teachers: state.teachers,
        adminPassword: state.auth.password,
        lastUpdated: new Date().toISOString()
      };
      cloudWriteQueue = cloudWriteQueue.then(() => cloudPush(cloudData)).then(ok => {
        if (ok) console.log('☁️ Cloud sync OK');
        else console.warn('☁️ Cloud sync failed — data saved locally only');
      });
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  // =========================================================================
  // 5. THEME & LANGUAGE SWITCHER
  // =========================================================================
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  function setLanguage(newLang) {
    if (!I18N[newLang]) return;
    state.lang = newLang;
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    document.documentElement.setAttribute('lang', newLang);

    // Apply translations to all DOM elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && I18N[newLang][key]) {
        el.textContent = I18N[newLang][key];
      }
    });

    // Update placeholders
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) globalSearch.placeholder = t('searchPlaceholder');

    // Update select dropdown
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = newLang;

    // Re-render components with translated dynamic values
    renderApp();
  }

  // =========================================================================
  // 6. DATE & TIME UTILITIES
  // =========================================================================
  function getTodayIsoString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDisplayDate(isoDateStr) {
    if (!isoDateStr) return '—';
    try {
      const parts = isoDateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const monthNames = {
          uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
          en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
          kk: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан']
        };

        const list = monthNames[state.lang] || monthNames.uz;
        return `${day}-${list[monthIndex]}, ${year}`;
      }
      return isoDateStr;
    } catch {
      return isoDateStr;
    }
  }

  function isDateInCurrentWeek(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return target >= monday && target <= sunday;
  }

  function isDateInCurrentMonth(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return false;
    const now = new Date();
    return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth();
  }

  function getCurrentWeekRangeString() {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mDay = monday.getDate();
    const sDay = sunday.getDate();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    return `${mDay}.${months[monday.getMonth()]} — ${sDay}.${months[sunday.getMonth()]}.${sunday.getFullYear()}`;
  }

  // =========================================================================
  // 7. CALCULATIONS & METRICS
  // =========================================================================
  function getStudentMetrics(studentId) {
    const studentPoints = state.points.filter(p => p.studentId === studentId);

    let totalPoints = 0;
    let weeklyPoints = 0;
    let monthlyPoints = 0;
    let tasksCount = 0;

    let classPoints = 0;
    let hwPoints = 0;
    let extraPoints = 0;
    let testPoints = 0;
    let otherPoints = 0;

    for (const record of studentPoints) {
      const p = Number(record.points) || 0;
      totalPoints += p;

      if (isDateInCurrentWeek(record.date)) {
        weeklyPoints += p;
      }

      if (isDateInCurrentMonth(record.date)) {
        monthlyPoints += p;
      }

      if (p > 0) {
        tasksCount += 1;
      }

      switch (record.category) {
        case 'Darsdagi faollik':
          classPoints += p;
          break;
        case 'Uyga vazifa':
          hwPoints += p;
          break;
        case 'Qo‘shimcha vazifa':
          extraPoints += p;
          break;
        case 'Test':
          testPoints += p;
          break;
        default:
          otherPoints += p;
          break;
      }
    }

    return {
      totalPoints,
      weeklyPoints,
      monthlyPoints,
      tasksCount,
      classPoints,
      hwPoints,
      extraPoints,
      testPoints,
      otherPoints,
      history: studentPoints.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  }

  function getAllCalculatedStudents() {
    return state.students.map(student => {
      const group = state.groups.find(g => g.id === student.groupId);
      const metrics = getStudentMetrics(student.id);
      return {
        ...student,
        groupName: group ? group.name : (t('thGroup') + ' —'),
        ...metrics
      };
    });
  }

  function getGlobalRankingList(groupIdFilter = 'all', timeFilter = 'all') {
    let list = getAllCalculatedStudents();

    if (groupIdFilter !== 'all') {
      list = list.filter(s => s.groupId === groupIdFilter);
    }

    list.sort((a, b) => {
      if (timeFilter === 'week') {
        return b.weeklyPoints - a.weeklyPoints;
      } else if (timeFilter === 'month') {
        return b.monthlyPoints - a.monthlyPoints;
      }
      return b.totalPoints - a.totalPoints;
    });

    return list;
  }

  function getGroupMetrics(groupId) {
    const students = state.students.filter(s => s.groupId === groupId);
    const studentCount = students.length;
    let totalPoints = 0;
    let weeklyPoints = 0;

    for (const s of students) {
      const m = getStudentMetrics(s.id);
      totalPoints += m.totalPoints;
      weeklyPoints += m.weeklyPoints;
    }

    const avgPoints = studentCount > 0 ? Math.round(totalPoints / studentCount) : 0;

    return {
      studentCount,
      totalPoints,
      weeklyPoints,
      avgPoints
    };
  }

  function getAllCalculatedGroups() {
    return state.groups.map(group => {
      const metrics = getGroupMetrics(group.id);
      return {
        ...group,
        ...metrics
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }

  // =========================================================================
  // 8. RENDERERS & ROLE CONTROL
  // =========================================================================
  function isSuperAdmin() {
    return state.auth.isLoggedIn && state.auth.role === 'super_admin';
  }

  function canManageGroup(groupId) {
    if (isSuperAdmin()) return true;
    if (!state.auth.isLoggedIn || state.auth.role !== 'teacher') return false;
    const group = state.groups.find(item => item.id === groupId);
    const assignedTeacher = String(group?.teacherId || 'ustoz').trim().toLowerCase();
    return Boolean(group && assignedTeacher === String(state.auth.username || '').trim().toLowerCase());
  }

  function canManageStudent(studentId) {
    const student = state.students.find(item => item.id === studentId);
    return Boolean(student && canManageGroup(student.groupId));
  }

  function renderApp() {
    // 1. Update Body Role Class
    if (state.auth.isLoggedIn) {
      document.body.classList.add('is-admin');
    } else {
      document.body.classList.remove('is-admin');
    }
    document.body.classList.toggle('is-super-admin', isSuperAdmin());

    // 2. Render Header Auth Elements
    renderHeaderAuth();

    // 3. Render Sidebar User Status Card
    renderSidebarUserStatus();
    renderTeachers();

    // 4. Update Header Date & Dropdowns
    updateHeaderDate();
    populateGroupDropdowns();

    // 5. Render Active View
    switch (state.currentView) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'global-ranking':
        renderGlobalRanking();
        break;
      case 'weekly-ranking':
        renderWeeklyRanking();
        break;
      case 'groups':
        renderGroups();
        break;
      case 'group-detail':
        renderGroupDetail();
        break;
      case 'students':
        renderStudents();
        break;
      case 'add-points':
        if (!state.auth.isLoggedIn) {
          navigate('dashboard');
          showToast("Ushbu bo'lim faqat ustoz uchun mavjud", 'warning');
          return;
        }
        renderAddPointsView();
        break;
      case 'statistics':
        renderStatistics();
        break;
      case 'data-management':
        if (!isSuperAdmin()) {
          navigate('dashboard');
          showToast("Bu bo'lim faqat super admin uchun mavjud", 'warning');
          return;
        }
        break;
      default:
        renderDashboard();
        break;
    }
  }

  function renderHeaderAuth() {
    const container = document.getElementById('headerAuthContainer');
    if (!container) return;

    if (state.auth.isLoggedIn) {
      container.innerHTML = `
        <div class="header-teacher-active-group">
          <button id="headerQuickPointBtn" class="btn btn-primary btn-sm" onclick="app.openQuickPointModal()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ ${t('thPoints')}</span>
          </button>
          <button class="btn btn-secondary btn-sm" onclick="app.logout()" title="Chiqish">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button class="header-teacher-login-btn" onclick="app.openModal('teacherLoginModal')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>${t('teacherLoginBtn')}</span>
        </button>
      `;
    }
  }

  function renderSidebarUserStatus() {
    const box = document.getElementById('sidebarUserBox');
    if (!box) return;

    if (state.auth.isLoggedIn) {
      const roleLabel = isSuperAdmin() ? 'Super Admin' : "O'qituvchi";
      box.innerHTML = `
        <div class="user-status-left">
          <div class="user-status-avatar">U</div>
          <div>
            <span class="user-status-name">${roleLabel}</span>
            <span class="user-status-desc text-success">${t('activeSession')}</span>
          </div>
        </div>
        <button class="btn-logout" onclick="app.logout()" title="Chiqish">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      `;
    } else {
      box.innerHTML = `
        <div class="user-status-left">
          <div class="user-status-avatar public-mode">👁️</div>
          <div>
            <span class="user-status-name">${t('publicModeTag')}</span>
            <span class="user-status-desc">${t('readOnlyMode')}</span>
          </div>
        </div>
        <button class="btn-action-icon primary" onclick="app.openModal('teacherLoginModal')" title="${t('teacherLoginBtn')}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </button>
      `;
    }
  }

  function renderTeachers() {
    const list = document.getElementById('teachersList');
    if (!list) return;

    list.innerHTML = state.teachers.map(teacher => `
      <div class="teacher-list-row">
        <div>
          <strong>${escapeHtml(teacher.name)}</strong>
          <span>@${escapeHtml(teacher.username)}</span>
        </div>
        <button class="btn btn-danger btn-sm" type="button" data-delete-teacher="${escapeHtml(teacher.id)}" ${teacher.id === 'teacher_default' ? 'disabled title="Asosiy o‘qituvchini o‘chirish mumkin emas"' : ''}>
          O'chirish
        </button>
      </div>
    `).join('');

    list.querySelectorAll('[data-delete-teacher]').forEach(button => {
      button.addEventListener('click', () => removeTeacher(button.dataset.deleteTeacher));
    });
  }

  function updateHeaderDate() {
    const dateElem = document.getElementById('currentDateDisplay');
    if (dateElem) {
      dateElem.textContent = formatDisplayDate(getTodayIsoString());
    }
  }

  function populateGroupDropdowns() {
    const dropdownIds = [
      'dashFilterGroup',
      'globalFilterGroup',
      'weeklyFilterGroup',
      'studentsFilterGroup',
      'studentGroupSelect',
      'pointFormGroup',
      'modalPointGroup'
    ];

    dropdownIds.forEach(id => {
      const select = document.getElementById(id);
      if (!select) return;

      const currentVal = select.value;
      const isFilter = id.includes('Filter');

      let html = isFilter ? `<option value="all">${t('filterAllGroups')}</option>` : '<option value="">-- ' + t('stepGroup') + ' --</option>';

      const availableGroups = state.auth.role === 'teacher'
        ? state.groups.filter(group => canManageGroup(group.id))
        : state.groups;

      availableGroups.forEach(g => {
        html += `<option value="${g.id}">${escapeHtml(g.name)}</option>`;
      });

      select.innerHTML = html;
      if (currentVal) {
        select.value = currentVal;
      }
    });
  }

  function populateTeacherSelect(selectedTeacherId = '') {
    const select = document.getElementById('groupTeacherSelect');
    if (!select) return;

    select.innerHTML = '<option value="">O‘qituvchi tayinlanmagan</option>' +
      state.teachers.map(teacher =>
        `<option value="${escapeHtml(teacher.username)}">${escapeHtml(teacher.name)} (@${escapeHtml(teacher.username)})</option>`
      ).join('');
    select.value = selectedTeacherId || '';
  }

  // ----- DASHBOARD RENDER -----
  function renderDashboard() {
    const groupFilter = document.getElementById('dashFilterGroup')?.value || 'all';
    const timeFilter = document.getElementById('dashFilterTime')?.value || 'all';
    const searchFilter = (document.getElementById('globalSearchInput')?.value || '').toLowerCase().trim();

    let rankedStudents = getGlobalRankingList(groupFilter, timeFilter);

    if (searchFilter) {
      rankedStudents = rankedStudents.filter(s =>
        s.name.toLowerCase().includes(searchFilter) ||
        s.groupName.toLowerCase().includes(searchFilter)
      );
    }

    // 1. KPI Stats
    const totalStudents = state.students.length;
    const totalGroups = state.groups.length;
    const totalPointsGiven = state.points.reduce((sum, p) => sum + (Number(p.points) || 0), 0);
    const weeklyPointsGiven = state.points
      .filter(p => isDateInCurrentWeek(p.date))
      .reduce((sum, p) => sum + (Number(p.points) || 0), 0);

    const allGlobalStudents = getGlobalRankingList('all', 'all');
    const topStudent = allGlobalStudents[0] || null;

    document.getElementById('statTotalStudents').textContent = totalStudents;
    document.getElementById('statGroupsCountSub').textContent = `${totalGroups} ${t('statInGroups')}`;

    document.getElementById('statWeeklyPoints').textContent = weeklyPointsGiven;
    document.getElementById('statWeeklyPointsChange').textContent = `+${weeklyPointsGiven} ${t('thPoints').toLowerCase()}`;

    document.getElementById('statTotalPoints').textContent = totalPointsGiven;
    document.getElementById('statTasksCountSub').textContent = `${state.points.length} ${t('statAssessmentsSub')}`;

    if (topStudent) {
      document.getElementById('statTopStudentName').textContent = topStudent.name;
      document.getElementById('statTopStudentPoints').textContent = `${topStudent.totalPoints} ${t('thPoints').toLowerCase()} (${topStudent.groupName})`;
    } else {
      document.getElementById('statTopStudentName').textContent = '—';
      document.getElementById('statTopStudentPoints').textContent = `0 ${t('thPoints').toLowerCase()}`;
    }

    // 2. Podium Top 3 Cards
    const podiumContainer = document.getElementById('podiumContainer');
    const top3 = allGlobalStudents.slice(0, 3);

    if (top3.length === 0) {
      podiumContainer.innerHTML = `
        <div style="grid-column: 1 / -1;" class="table-empty-state">
          <p>${t('rankingTableSubtitle')}</p>
        </div>
      `;
    } else {
      const medals = [
        { rank: 1, title: t('podiumGold'), class: 'podium-1', icon: '🏆' },
        { rank: 2, title: t('podiumSilver'), class: 'podium-2', icon: '🥈' },
        { rank: 3, title: t('podiumBronze'), class: 'podium-3', icon: '🥉' }
      ];

      podiumContainer.innerHTML = top3.map((s, idx) => {
        const m = medals[idx];
        return `
          <div class="podium-card ${m.class}" onclick="app.openStudentProfile('${s.id}')">
            <div class="podium-medal">${m.icon}</div>
            <div class="podium-rank-tag">${m.title}</div>
            <h4 class="podium-name">${escapeHtml(s.name)}</h4>
            <div class="podium-group">${escapeHtml(s.groupName)}</div>
            <div class="podium-score">${s.totalPoints} <span>${t('thPoints').toLowerCase()}</span></div>
          </div>
        `;
      }).join('');
    }

    // 3. Table Ranking
    const tbody = document.getElementById('dashboardRankingTbody');
    if (rankedStudents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty-state">
            <p>O'quvchilar topilmadi</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rankedStudents.map((s, index) => {
      const rankNum = index + 1;
      let rankBadgeClass = 'rank-other';
      if (rankNum === 1) rankBadgeClass = 'rank-1';
      else if (rankNum === 2) rankBadgeClass = 'rank-2';
      else if (rankNum === 3) rankBadgeClass = 'rank-3';

      const pointsToDisplay = timeFilter === 'week' ? s.weeklyPoints : (timeFilter === 'month' ? s.monthlyPoints : s.totalPoints);

      const adminQuickBtn = canManageGroup(s.groupId)
        ? `<button class="btn btn-sm btn-primary" onclick="app.openQuickPointModal('${s.groupId}', '${s.id}')" title="Ball berish">+ ${t('thPoints')}</button>`
        : '';

      return `
        <tr>
          <td><span class="rank-badge ${rankBadgeClass}">${rankNum}</span></td>
          <td>
            <a href="javascript:void(0)" class="student-table-name" onclick="app.openStudentProfile('${s.id}')">
              ${escapeHtml(s.name)}
            </a>
            ${s.phone ? `<span class="student-table-phone">${escapeHtml(s.phone)}</span>` : ''}
          </td>
          <td><span class="badge badge-primary">${escapeHtml(s.groupName)}</span></td>
          <td class="text-right"><strong>${s.weeklyPoints > 0 ? '+' : ''}${s.weeklyPoints}</strong></td>
          <td class="text-right">${s.tasksCount}</td>
          <td class="text-right"><strong class="text-primary" style="font-size: 15px;">${pointsToDisplay}</strong></td>
          <td class="text-center">
            <div class="table-actions">
              ${adminQuickBtn}
              <button class="btn-action-icon primary" onclick="app.openStudentProfile('${s.id}')" title="Profil">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ----- GLOBAL RANKING RENDER -----
  function renderGlobalRanking() {
    const groupFilter = document.getElementById('globalFilterGroup')?.value || 'all';
    const ranked = getGlobalRankingList(groupFilter, 'all');
    const tbody = document.getElementById('globalRankingFullTbody');

    if (ranked.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="table-empty-state">O'quvchilar topilmadi</td></tr>`;
      return;
    }

    tbody.innerHTML = ranked.map((s, idx) => {
      const rankNum = idx + 1;
      let badgeClass = rankNum <= 3 ? `rank-${rankNum}` : 'rank-other';

      const adminQuickBtn = canManageGroup(s.groupId)
        ? `<button class="btn btn-sm btn-secondary" onclick="app.openQuickPointModal('${s.groupId}', '${s.id}')">+ ${t('thPoints')}</button>`
        : `<button class="btn-action-icon primary" onclick="app.openStudentProfile('${s.id}')" title="Profil"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></button>`;

      return `
        <tr>
          <td><span class="rank-badge ${badgeClass}">${rankNum}</span></td>
          <td>
            <a href="javascript:void(0)" class="student-table-name" onclick="app.openStudentProfile('${s.id}')">
              ${escapeHtml(s.name)}
            </a>
          </td>
          <td><span class="badge badge-primary">${escapeHtml(s.groupName)}</span></td>
          <td class="text-right">${s.weeklyPoints}</td>
          <td class="text-right">${s.monthlyPoints}</td>
          <td class="text-right">${s.tasksCount}</td>
          <td class="text-right"><strong class="text-primary">${s.totalPoints}</strong></td>
          <td class="text-center">${adminQuickBtn}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- WEEKLY RANKING RENDER -----
  function renderWeeklyRanking() {
    document.getElementById('currentWeekRangeSubtitle').textContent = `${t('filterPeriodLabel')} ${getCurrentWeekRangeString()}`;

    const groupFilter = document.getElementById('weeklyFilterGroup')?.value || 'all';
    const list = getAllCalculatedStudents()
      .filter(student => groupFilter === 'all' || student.groupId === groupFilter)
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints);
    const tbody = document.getElementById('weeklyRankingTbody');

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty-state">O'quvchilar topilmadi</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((s, idx) => {
      const rankNum = idx + 1;
      let badgeClass = rankNum <= 3 ? `rank-${rankNum}` : 'rank-other';

      const actionBtn = canManageGroup(s.groupId)
        ? `<button class="btn btn-sm btn-primary" onclick="app.openQuickPointModal('${s.groupId}', '${s.id}')">⚡ + ${t('thPoints')}</button>`
        : `<button class="btn btn-sm btn-secondary" onclick="app.openStudentProfile('${s.id}')">Profil</button>`;

      return `
        <tr>
          <td><span class="rank-badge ${badgeClass}">${rankNum}</span></td>
          <td>
            <a href="javascript:void(0)" class="student-table-name" onclick="app.openStudentProfile('${s.id}')">
              ${escapeHtml(s.name)}
            </a>
          </td>
          <td><span class="badge badge-primary">${escapeHtml(s.groupName)}</span></td>
          <td class="text-right">
            <span class="point-delta ${s.weeklyPoints >= 0 ? 'pos' : 'neg'}">
              ${s.weeklyPoints > 0 ? '+' : ''}${s.weeklyPoints}
            </span>
          </td>
          <td class="text-right">${s.totalPoints}</td>
          <td class="text-center">${actionBtn}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- GROUPS RENDER -----
  function renderGroups() {
    const container = document.getElementById('groupsContainer');
    const calculatedGroups = getAllCalculatedGroups();

    if (calculatedGroups.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1;" class="table-empty-state">
          <p>${t('groupsPageSubtitle')}</p>
          ${state.auth.isLoggedIn ? `<button class="btn btn-primary mt-2" onclick="app.openModal('addGroupModal')">${t('addGroup')}</button>` : ''}
        </div>
      `;
      return;
    }

    container.innerHTML = calculatedGroups.map((g, idx) => {
      const rank = idx + 1;
      const assignedTeacher = state.teachers.find(teacher => teacher.username === g.teacherId);
      const teacherLabel = assignedTeacher ? assignedTeacher.name : 'Ustoz tayinlanmagan';
      const adminActions = canManageGroup(g.id) ? `
        <div class="table-actions">
          <button class="btn-action-icon" onclick="app.openEditGroupModal('${g.id}')" title="Tahrirlash">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn-action-icon danger" onclick="app.deleteGroupPrompt('${g.id}')" title="O'chirish">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      ` : '';

      const addStudentBtn = canManageGroup(g.id)
        ? `<button class="btn btn-secondary btn-sm" onclick="app.openAddStudentForGroup('${g.id}')" title="${t('addStudent')}">${t('addStudent')}</button>`
        : '';

      return `
        <div class="group-card">
          <div>
            <div class="group-card-header">
              <span class="badge ${rank === 1 ? 'badge-warning' : 'badge-primary'}">#${rank} ${t('thRank')}</span>
              ${adminActions}
            </div>

            <h3 class="group-card-title">${escapeHtml(g.name)}</h3>
            <p class="group-card-desc">${escapeHtml(g.description || '—')}</p>
            <p class="group-card-owner">Mas'ul ustoz: ${escapeHtml(teacherLabel)}</p>

            <div class="group-card-stats">
              <div class="group-stat-mini">
                <span>${t('statStudentCount')}</span>
                <strong>${g.studentCount}</strong>
              </div>
              <div class="group-stat-mini">
                <span>${t('statGroupTotalPoints')}</span>
                <strong>${g.totalPoints}</strong>
              </div>
            </div>
          </div>

          <div class="group-card-actions">
            <button class="btn btn-primary btn-block btn-sm" onclick="app.viewGroupDetail('${g.id}')">
              ${t('groupRankingTitle')}
            </button>
            ${addStudentBtn}
          </div>
        </div>
      `;
    }).join('');
  }

  // ----- GROUP DETAIL RENDER -----
  function renderGroupDetail() {
    if (!state.activeGroupId) {
      app.navigate('groups');
      return;
    }

    const group = state.groups.find(g => g.id === state.activeGroupId);
    if (!group) {
      showToast('Guruh topilmadi', 'danger');
      app.navigate('groups');
      return;
    }

    const calculatedGroups = getAllCalculatedGroups();
    const groupRank = calculatedGroups.findIndex(g => g.id === group.id) + 1;
    const metrics = getGroupMetrics(group.id);

    document.getElementById('groupHeroRank').textContent = `#${groupRank} ${t('thRank')}`;
    document.getElementById('groupHeroName').textContent = group.name;
    document.getElementById('groupHeroDesc').textContent = group.description || '';
    document.getElementById('groupDetailStudentCount').textContent = `${metrics.studentCount}`;
    document.getElementById('groupDetailTotalPoints').textContent = `${metrics.totalPoints}`;
    document.getElementById('groupDetailAvgPoints').textContent = `${metrics.avgPoints}`;

    document.getElementById('editCurrentGroupBtn').onclick = () => app.openEditGroupModal(group.id);
    document.getElementById('groupAddStudentBtn').onclick = () => app.openAddStudentForGroup(group.id);
    document.querySelector('.group-hero-actions').style.display = canManageGroup(group.id) ? '' : 'none';

    const studentsInGroup = getAllCalculatedStudents()
      .filter(s => s.groupId === group.id)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    const tbody = document.getElementById('groupStudentsTbody');

    if (studentsInGroup.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="table-empty-state">
            <p>${t('rankingTableSubtitle')}</p>
            ${state.auth.isLoggedIn ? `<button class="btn btn-primary mt-2" onclick="app.openAddStudentForGroup('${group.id}')">${t('addStudent')}</button>` : ''}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = studentsInGroup.map((s, idx) => {
      const rankNum = idx + 1;
      let badgeClass = rankNum <= 3 ? `rank-${rankNum}` : 'rank-other';

      const actionBtn = canManageGroup(group.id)
        ? `<button class="btn btn-sm btn-primary" onclick="app.openQuickPointModal('${group.id}', '${s.id}')">+ ${t('thPoints')}</button>`
        : `<button class="btn-action-icon primary" onclick="app.openStudentProfile('${s.id}')" title="Profil"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></button>`;

      return `
        <tr>
          <td><span class="rank-badge ${badgeClass}">${rankNum}</span></td>
          <td>
            <a href="javascript:void(0)" class="student-table-name" onclick="app.openStudentProfile('${s.id}')">
              ${escapeHtml(s.name)}
            </a>
            ${s.phone ? `<span class="student-table-phone">${escapeHtml(s.phone)}</span>` : ''}
          </td>
          <td class="text-right">${s.classPoints}</td>
          <td class="text-right">${s.hwPoints}</td>
          <td class="text-right">${s.extraPoints}</td>
          <td class="text-right font-weight-bold">${s.weeklyPoints}</td>
          <td class="text-right"><strong class="text-primary">${s.totalPoints}</strong></td>
          <td class="text-center">${actionBtn}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- STUDENTS DIRECTORY RENDER -----
  function renderStudents() {
    const searchVal = (document.getElementById('studentsSearchInput')?.value || '').toLowerCase().trim();
    const groupFilter = document.getElementById('studentsFilterGroup')?.value || 'all';

    let list = getAllCalculatedStudents();

    if (groupFilter !== 'all') {
      list = list.filter(s => s.groupId === groupFilter);
    }

    if (searchVal) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(searchVal) ||
        (s.phone && s.phone.includes(searchVal)) ||
        s.groupName.toLowerCase().includes(searchVal)
      );
    }

    list.sort((a, b) => b.totalPoints - a.totalPoints);

    const globalRankMap = new Map();
    getAllCalculatedStudents()
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .forEach((s, idx) => globalRankMap.set(s.id, idx + 1));

    const tbody = document.getElementById('studentsListTbody');

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty-state">O'quvchilar topilmadi</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(s => {
      const gRank = globalRankMap.get(s.id) || '—';

      const actions = canManageStudent(s.id) ? `
        <div class="table-actions">
          <button class="btn btn-sm btn-primary" onclick="app.openQuickPointModal('${s.groupId}', '${s.id}')" title="Ball berish">
            + ${t('thPoints')}
          </button>
          <button class="btn-action-icon" onclick="app.openEditStudentModal('${s.id}')" title="Tahrirlash">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn-action-icon danger" onclick="app.deleteStudentPrompt('${s.id}')" title="O'chirish">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      ` : `
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="app.openStudentProfile('${s.id}')">
            Profil
          </button>
        </div>
      `;

      return `
        <tr>
          <td>
            <a href="javascript:void(0)" class="student-table-name" onclick="app.openStudentProfile('${s.id}')">
              ${escapeHtml(s.name)}
            </a>
          </td>
          <td><span class="badge badge-primary">${escapeHtml(s.groupName)}</span></td>
          <td>${s.phone ? escapeHtml(s.phone) : '<span class="text-muted">—</span>'}</td>
          <td class="text-right"><span class="badge badge-warning">#${gRank}</span></td>
          <td class="text-right"><strong class="text-primary">${s.totalPoints}</strong></td>
          <td class="text-center">${actions}</td>
        </tr>
      `;
    }).join('');
  }

  // ----- ADD POINTS VIEW RENDER -----
  function renderAddPointsView() {
    const dateInput = document.getElementById('pointFormDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = getTodayIsoString();
    }
  }

  // ----- STATISTICS RENDER -----
  function renderStatistics() {
    const allStudents = getAllCalculatedStudents().sort((a, b) => b.totalPoints - a.totalPoints);
    const allGroups = getAllCalculatedGroups();

    const totalTransactions = state.points.length;
    const bestStudent = allStudents[0] || null;
    const bestGroup = allGroups[0] || null;

    const totalPoints = state.points.reduce((sum, p) => sum + (Number(p.points) || 0), 0);
    const avgPerStudent = allStudents.length > 0 ? Math.round(totalPoints / allStudents.length) : 0;

    document.getElementById('statsTotalTransactions').textContent = totalTransactions;

    if (bestStudent) {
      document.getElementById('statsBestStudent').textContent = bestStudent.name;
      document.getElementById('statsBestStudentPoints').textContent = `${bestStudent.totalPoints} (${bestStudent.groupName})`;
    } else {
      document.getElementById('statsBestStudent').textContent = '—';
      document.getElementById('statsBestStudentPoints').textContent = '0';
    }

    if (bestGroup) {
      document.getElementById('statsBestGroup').textContent = bestGroup.name;
      document.getElementById('statsBestGroupPoints').textContent = `${bestGroup.totalPoints}`;
    } else {
      document.getElementById('statsBestGroup').textContent = '—';
      document.getElementById('statsBestGroupPoints').textContent = '0';
    }

    document.getElementById('statsAvgPointsPerStudent').textContent = `${avgPerStudent}`;

    // Category progress bars
    const catCounts = {
      'Darsdagi faollik': { label: t('catClass'), points: 0, count: 0, colorClass: 'bar-fill-cyan' },
      'Uyga vazifa': { label: t('catHomework'), points: 0, count: 0, colorClass: 'bar-fill-purple' },
      'Qo‘shimcha vazifa': { label: t('catExtra'), points: 0, count: 0, colorClass: 'bar-fill-emerald' },
      'Test': { label: t('catTest'), points: 0, count: 0, colorClass: 'bar-fill-amber' },
      'Boshqa': { label: t('catOther'), points: 0, count: 0, colorClass: 'bar-fill-primary' }
    };

    let totalPositivePoints = 0;
    state.points.forEach(p => {
      const val = Number(p.points) || 0;
      if (catCounts[p.category]) {
        catCounts[p.category].points += val;
        catCounts[p.category].count += 1;
      } else {
        catCounts['Boshqa'].points += val;
        catCounts['Boshqa'].count += 1;
      }
      if (val > 0) totalPositivePoints += val;
    });

    const catContainer = document.getElementById('categoryProgressContainer');
    catContainer.innerHTML = Object.entries(catCounts).map(([catKey, data]) => {
      const pct = totalPositivePoints > 0 ? Math.max(0, Math.round((data.points / totalPositivePoints) * 100)) : 0;
      return `
        <div class="bar-item">
          <div class="bar-header">
            <span>${data.label} (${data.count})</span>
            <span><strong>${data.points}</strong> (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${data.colorClass}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // Group comparison bars
    const groupBarsContainer = document.getElementById('groupComparisonContainer');
    const maxGroupPoints = allGroups.length > 0 && allGroups[0].totalPoints > 0 ? allGroups[0].totalPoints : 1;

    if (allGroups.length === 0) {
      groupBarsContainer.innerHTML = `<p class="text-muted">Guruhlar mavjud emas</p>`;
    } else {
      groupBarsContainer.innerHTML = allGroups.map(g => {
        const pct = Math.max(5, Math.round((g.totalPoints / maxGroupPoints) * 100));
        return `
          <div class="bar-item">
            <div class="bar-header">
              <span>${escapeHtml(g.name)} (${g.studentCount})</span>
              <span><strong>${g.totalPoints}</strong></span>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-fill-primary" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // =========================================================================
  // 9. TOAST NOTIFICATIONS & MODALS
  // =========================================================================
  function showToast(message, type = 'success', title = '') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <span class="toast-msg">${escapeHtml(message)}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function openModal(modalId) {
    if (modalId === 'addGroupModal') {
      if (!state.auth.isLoggedIn) {
        openModal('teacherLoginModal');
        return;
      }
      document.getElementById('groupEditId').value = '';
      document.getElementById('groupModalTitle').textContent = t('addGroup');
      document.getElementById('groupForm').reset();
      populateTeacherSelect(isSuperAdmin() ? '' : state.auth.username);
      document.getElementById('groupModal').classList.remove('hidden');
    } else if (modalId === 'addStudentModal') {
      if (!state.auth.isLoggedIn) {
        openModal('teacherLoginModal');
        return;
      }
      document.getElementById('studentEditId').value = '';
      document.getElementById('studentModalTitle').textContent = t('addStudent');
      document.getElementById('studentForm').reset();
      document.getElementById('initialPointsGroup').style.display = 'block';
      document.getElementById('studentModal').classList.remove('hidden');
    } else {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('hidden');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  function showConfirmDialog(title, message, onConfirm) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    state.confirmCallback = onConfirm;
    document.getElementById('confirmModal').classList.remove('hidden');
  }

  function closeConfirmModal(confirmed) {
    document.getElementById('confirmModal').classList.add('hidden');
    if (confirmed && typeof state.confirmCallback === 'function') {
      state.confirmCallback();
    }
    state.confirmCallback = null;
  }

  // =========================================================================
  // 10. ACTIONS: GROUPS, STUDENTS, POINTS
  // =========================================================================
  function saveGroup(name, description, teacherId, editId = null) {
    name = name.trim();
    description = description.trim();

    if (!name) {
      showToast('Guruh nomini kiriting', 'warning');
      return;
    }
    if (!state.auth.isLoggedIn) {
      showToast('Guruh yaratish uchun tizimga kiring', 'warning');
      return;
    }

    if (editId) {
      if (!canManageGroup(editId)) {
        showToast('Siz bu guruhni boshqara olmaysiz', 'danger');
        return;
      }
      const group = state.groups.find(g => g.id === editId);
      if (group) {
        group.name = name;
        group.description = description;
        if (isSuperAdmin()) {
          group.teacherId = teacherId || null;
        }
        saveAllToStorage();
        showToast('Guruh muvaffaqiyatli yangilandi', 'success');
      }
    } else {
      const newGroup = {
        id: 'grp_' + Date.now(),
        name,
        description,
        teacherId: isSuperAdmin() ? (teacherId || null) : state.auth.username,
        createdAt: getTodayIsoString()
      };
      state.groups.push(newGroup);
      saveAllToStorage();
      showToast('Yangi guruh muvaffaqiyatli yaratildi', 'success');
    }

    closeModal('groupModal');
    renderApp();
  }

  function openEditGroupModal(groupId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageGroup(groupId)) {
      showToast('Siz bu guruhni boshqara olmaysiz', 'danger');
      return;
    }
    const group = state.groups.find(g => g.id === groupId);
    if (!group) return;

    document.getElementById('groupEditId').value = group.id;
    document.getElementById('groupModalTitle').textContent = t('editGroup');
    document.getElementById('groupNameInput').value = group.name;
    document.getElementById('groupDescInput').value = group.description || '';
    populateTeacherSelect(group.teacherId || '');
    document.getElementById('groupModal').classList.remove('hidden');
  }

  function deleteGroupPrompt(groupId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageGroup(groupId)) {
      showToast('Siz bu guruhni o‘chira olmaysiz', 'danger');
      return;
    }
    const group = state.groups.find(g => g.id === groupId);
    if (!group) return;

    const studentCount = state.students.filter(s => s.groupId === groupId).length;
    let msg = `"${group.name}" guruhini o'chirmoqchimisiz?`;
    if (studentCount > 0) {
      msg += ` Diqqat: Ushbu guruhdagi ${studentCount} nafar o'quvchi va ularning barcha ballari ham o'chib ketadi!`;
    }

    showConfirmDialog(t('confirmTitle'), msg, () => {
      const studentsToRemove = state.students.filter(s => s.groupId === groupId);
      studentsToRemove.forEach(st => {
        state.points = state.points.filter(p => p.studentId !== st.id);
      });
      state.students = state.students.filter(s => s.groupId !== groupId);
      state.groups = state.groups.filter(g => g.id !== groupId);

      saveAllToStorage();
      showToast('Guruh va uning barcha o\'quvchilari o\'chirildi', 'success');

      if (state.activeGroupId === groupId) {
        app.navigate('groups');
      } else {
        renderApp();
      }
    });
  }

  function viewGroupDetail(groupId) {
    state.activeGroupId = groupId;
    app.navigate('group-detail');
  }

  function saveStudent(name, groupId, phone, initialPoints = 0, editId = null) {
    name = name.trim();
    phone = phone.trim();

    if (!name || !groupId) {
      showToast('O\'quvchi ismi va guruhini tanlang', 'warning');
      return;
    }
    if (!canManageGroup(groupId)) {
      showToast('Siz faqat o‘z guruhingizga o‘quvchi qo‘sha olasiz', 'danger');
      return;
    }

    if (editId) {
      if (!canManageStudent(editId)) {
        showToast('Siz bu o‘quvchini boshqara olmaysiz', 'danger');
        return;
      }
      const student = state.students.find(s => s.id === editId);
      if (student) {
        student.name = name;
        student.groupId = groupId;
        student.phone = phone;
        saveAllToStorage();
        showToast('O\'quvchi ma\'lumotlari yangilandi', 'success');
      }
    } else {
      const newStudentId = 'std_' + Date.now();
      const newStudent = {
        id: newStudentId,
        name,
        groupId,
        phone,
        createdAt: getTodayIsoString()
      };
      state.students.push(newStudent);

      const initPts = Number(initialPoints) || 0;
      if (initPts > 0) {
        state.points.push({
          id: 'pnt_' + Date.now(),
          studentId: newStudentId,
          points: initPts,
          category: 'Boshqa',
          description: 'Boshlang\'ich rag\'bat balli',
          date: getTodayIsoString()
        });
      }

      saveAllToStorage();
      showToast('Yangi o\'quvchi muvaffaqiyatli qo\'shildi', 'success');
    }

    closeModal('studentModal');
    renderApp();
  }

  function openEditStudentModal(studentId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageStudent(studentId)) {
      showToast('Siz bu o‘quvchini boshqara olmaysiz', 'danger');
      return;
    }
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('studentEditId').value = student.id;
    document.getElementById('studentModalTitle').textContent = student.name;
    document.getElementById('studentNameInput').value = student.name;
    document.getElementById('studentGroupSelect').value = student.groupId;
    document.getElementById('studentPhoneInput').value = student.phone || '';
    document.getElementById('initialPointsGroup').style.display = 'none';

    document.getElementById('studentModal').classList.remove('hidden');
  }

  function openAddStudentForGroup(groupId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageGroup(groupId)) {
      showToast('Siz faqat o‘z guruhingizga o‘quvchi qo‘sha olasiz', 'danger');
      return;
    }
    document.getElementById('studentEditId').value = '';
    document.getElementById('studentModalTitle').textContent = t('addStudent');
    document.getElementById('studentForm').reset();
    document.getElementById('initialPointsGroup').style.display = 'block';
    document.getElementById('studentGroupSelect').value = groupId;
    document.getElementById('studentModal').classList.remove('hidden');
  }

  function deleteStudentPrompt(studentId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageStudent(studentId)) {
      showToast('Siz bu o‘quvchini o‘chira olmaysiz', 'danger');
      return;
    }
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    showConfirmDialog(
      t('confirmTitle'),
      `"${student.name}" o'quvchisini va uning barcha to'plagan ballarini o'chirib tashlamoqchimisiz?`,
      () => {
        state.students = state.students.filter(s => s.id !== studentId);
        state.points = state.points.filter(p => p.studentId !== studentId);
        saveAllToStorage();
        showToast('O\'quvchi o\'chirildi', 'success');
        closeModal('studentProfileModal');
        renderApp();
      }
    );
  }

  // Student Profile & History
  function openStudentProfile(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const group = state.groups.find(g => g.id === student.groupId);
    const metrics = getStudentMetrics(student.id);

    const globalRank = getAllCalculatedStudents()
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .findIndex(s => s.id === student.id) + 1;

    const groupRank = getAllCalculatedStudents()
      .filter(s => s.groupId === student.groupId)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .findIndex(s => s.id === student.id) + 1;

    document.getElementById('profAvatar').textContent = student.name.charAt(0).toUpperCase();
    document.getElementById('profStudentName').textContent = student.name;
    document.getElementById('profGroupName').textContent = group ? group.name : '—';
    document.getElementById('profStudentPhone').textContent = student.phone ? `| 📞 ${student.phone}` : '';

    document.getElementById('profGlobalRank').textContent = `#${globalRank}`;
    document.getElementById('profGroupRank').textContent = `#${groupRank}`;
    document.getElementById('profTotalPoints').textContent = `${metrics.totalPoints}`;
    document.getElementById('profWeeklyPoints').textContent = `${metrics.weeklyPoints > 0 ? '+' : ''}${metrics.weeklyPoints}`;
    document.getElementById('profMonthlyPoints').textContent = `${metrics.monthlyPoints > 0 ? '+' : ''}${metrics.monthlyPoints}`;

    document.getElementById('profClassPoints').textContent = metrics.classPoints;
    document.getElementById('profHwPoints').textContent = metrics.hwPoints;
    document.getElementById('profExtraPoints').textContent = metrics.extraPoints;
    document.getElementById('profTestPoints').textContent = metrics.testPoints;

    // Render Point History Table
    const tbody = document.getElementById('profPointHistoryTbody');
    if (metrics.history.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty-state">Ballar tarixi mavjud emas</td></tr>`;
    } else {
      tbody.innerHTML = metrics.history.map(record => {
        const isPos = record.points >= 0;
        let catClass = 'cat-pill-other';
        if (record.category === 'Darsdagi faollik') catClass = 'cat-pill-class';
        else if (record.category === 'Uyga vazifa') catClass = 'cat-pill-hw';
        else if (record.category === 'Qo‘shimcha vazifa') catClass = 'cat-pill-extra';
        else if (record.category === 'Test') catClass = 'cat-pill-test';

        const deleteCol = canManageStudent(student.id) ? `
          <td class="text-center admin-only">
            <button class="btn-action-icon danger" onclick="app.deletePointRecord('${record.id}', '${student.id}')" title="Ushbu yozuvni bekor qilish">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </td>
        ` : '';

        return `
          <tr>
            <td>${formatDisplayDate(record.date)}</td>
            <td>
              <span class="point-delta ${isPos ? 'pos' : 'neg'}">
                ${isPos ? '+' : ''}${record.points}
              </span>
            </td>
            <td><span class="cat-pill ${catClass}">${escapeHtml(record.category)}</span></td>
            <td>${escapeHtml(record.description || '—')}</td>
            ${deleteCol}
          </tr>
        `;
      }).join('');
    }

    const profileAddPointButton = document.getElementById('profAddPointBtn');
    profileAddPointButton.classList.toggle('hidden', !canManageStudent(student.id));
    profileAddPointButton.onclick = () => {
      openQuickPointModal(student.groupId, student.id);
    };

    document.getElementById('studentProfileModal').classList.remove('hidden');
  }

  function deletePointRecord(pointId, studentId) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (!canManageStudent(studentId)) {
      showToast('Siz bu o‘quvchining ballarini o‘zgartira olmaysiz', 'danger');
      return;
    }
    showConfirmDialog(
      t('confirmTitle'),
      'Ushbu ball tranzaksiyasini o\'chirmoqchimisiz? O\'quvchining jami bali qayta hisoblanadi.',
      () => {
        state.points = state.points.filter(p => p.id !== pointId);
        saveAllToStorage();
        showToast('Ball yozuvi o\'chirildi', 'success');
        openStudentProfile(studentId);
        renderApp();
      }
    );
  }

  function addPoints(groupId, studentId, points, category, description, date) {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return false;
    }
    if (!canManageGroup(groupId) || !canManageStudent(studentId)) {
      showToast('Siz faqat o‘z guruhingizdagi o‘quvchiga ball bera olasiz', 'danger');
      return false;
    }

    if (!groupId || !studentId) {
      showToast('Guruh va o\'quvchini tanlang', 'warning');
      return false;
    }

    const pts = Number(points);
    if (isNaN(pts) || pts === 0) {
      showToast('Iltimos, to\'g\'ri ball sonini kiriting (0 dan farqli)', 'warning');
      return false;
    }

    const student = state.students.find(s => s.id === studentId);
    if (!student) {
      showToast('O\'quvchi topilmadi', 'danger');
      return false;
    }

    const newRecord = {
      id: 'pnt_' + Date.now(),
      studentId,
      points: pts,
      category: category || 'Boshqa',
      description: description ? description.trim() : '',
      date: date || getTodayIsoString()
    };

    state.points.push(newRecord);
    saveAllToStorage();

    const sign = pts > 0 ? '+' : '';
    showToast(`${student.name}ga ${sign}${pts} ball muvaffaqiyatli qo'shildi!`, 'success');

    renderApp();
    return true;
  }

  function openQuickPointModal(prefillGroupId = '', prefillStudentId = '') {
    if (!state.auth.isLoggedIn) {
      openModal('teacherLoginModal');
      return;
    }
    if (prefillGroupId && !canManageGroup(prefillGroupId)) {
      showToast('Siz faqat o‘z guruhingizga ball bera olasiz', 'danger');
      return;
    }

    const groupSelect = document.getElementById('modalPointGroup');
    const studentSelect = document.getElementById('modalPointStudent');
    const dateInput = document.getElementById('modalPointDate');

    dateInput.value = getTodayIsoString();

    if (prefillGroupId) {
      groupSelect.value = prefillGroupId;
      populateStudentsInSelect('modalPointStudent', prefillGroupId);
      if (prefillStudentId) {
        studentSelect.value = prefillStudentId;
      }
    } else {
      groupSelect.value = '';
      studentSelect.innerHTML = '<option value="">-- ' + t('stepGroup') + ' --</option>';
      studentSelect.disabled = true;
    }

    document.getElementById('quickPointModal').classList.remove('hidden');
  }

  function populateStudentsInSelect(selectId, groupId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    if (!groupId) {
      select.innerHTML = '<option value="">-- Avval guruhni tanlang --</option>';
      select.disabled = true;
      return;
    }

    const students = state.students.filter(s => s.groupId === groupId);
    if (students.length === 0) {
      select.innerHTML = '<option value="">-- Bu guruhda o\'quvchilar yo\'q --</option>';
      select.disabled = true;
      return;
    }

    select.disabled = false;
    select.innerHTML = '<option value="">-- O\'quvchini tanlang --</option>' +
      students.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  }

  // =========================================================================
  // 11. DATA BACKUP & RESTORE
  // =========================================================================
  function exportDataAsJson() {
    const exportObject = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'UstozRank',
      groups: state.groups,
      students: state.students,
      points: state.points
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `ustozrank-zaxira-${getTodayIsoString()}.json`;

    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Zaxira fayli kompyuteringizga yuklandi', 'success');
  }

  function importDataFromJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.groups || !json.students || !json.points) {
          showToast('Noto\'g\'ri fayl formati! groups, students va points kerak.', 'danger');
          return;
        }

        showConfirmDialog(
          t('confirmTitle'),
          `Faylda ${json.groups.length} ta guruh va ${json.students.length} ta o'quvchi topildi. Joriy ma'lumotlar almashtirilsinmi?`,
          () => {
            state.groups = json.groups;
            state.students = json.students;
            state.points = json.points;
            saveAllToStorage();
            showToast('Ma\'lumotlar to\'liq tiklandi!', 'success');
            renderApp();
          }
        );
      } catch (err) {
        showToast('JSON faylni o\'qishda xatolik yuz berdi: ' + err.message, 'danger');
      }
    };
    reader.readAsText(file);
  }

  function openRawJsonModal() {
    const rawData = {
      groups: state.groups,
      students: state.students,
      points: state.points
    };
    document.getElementById('rawJsonTextarea').value = JSON.stringify(rawData, null, 2);
    document.getElementById('rawJsonModal').classList.remove('hidden');
  }

  function restoreFromRawJsonText() {
    try {
      const text = document.getElementById('rawJsonTextarea').value.trim();
      const parsed = JSON.parse(text);

      if (!parsed.groups || !parsed.students || !parsed.points) {
        showToast('Noto\'g\'ri JSON strukturasi!', 'danger');
        return;
      }

      state.groups = parsed.groups;
      state.students = parsed.students;
      state.points = parsed.points;
      saveAllToStorage();

      closeModal('rawJsonModal');
      showToast('Ma\'lumotlar muvaffaqiyatli saqlandi!', 'success');
      renderApp();
    } catch (err) {
      showToast('JSON matnida xatolik: ' + err.message, 'danger');
    }
  }

  function clearAllDataPrompt() {
    showConfirmDialog(
      t('confirmTitle'),
      'DIQQAT! Barcha guruhlar, barcha o\'quvchilar va to\'plangan barcha ballar butunlay yo\'qoladi. Davom etasizmi?',
      () => {
        state.groups = [];
        state.students = [];
        state.points = [];
        saveAllToStorage();
        showToast('Barcha ma\'lumotlar tozalandi', 'warning');
        renderApp();
      }
    );
  }

  function loadDemoDataPrompt() {
    showConfirmDialog(
      t('confirmTitle'),
      '3 ta guruh va 10 ta o\'quvchidan iborat namunaviy ballar yuklansinmi?',
      () => {
        state.groups = [...INITIAL_DEMO_DATA.groups];
        state.students = [...INITIAL_DEMO_DATA.students];
        state.points = [...INITIAL_DEMO_DATA.points];
        saveAllToStorage();
        showToast('Namunaviy ma\'lumotlar yuklandi!', 'success');
        renderApp();
      }
    );
  }

  function addTeacher(name, username, password) {
    if (!isSuperAdmin()) return;
    name = name.trim();
    username = username.trim().toLowerCase();
    password = password.trim();

    if (!name || !username || password.length < 4) {
      showToast('Ism, login va kamida 4 belgili parol kiriting', 'warning');
      return;
    }
    if (username === String(state.auth.username || '').trim().toLowerCase() || state.teachers.some(teacher => String(teacher.username).trim().toLowerCase() === username)) {
      showToast('Bu login allaqachon mavjud', 'danger');
      return;
    }

    state.teachers.push({ id: `teacher_${Date.now()}`, name, username, password });
    saveAllToStorage();
    document.getElementById('teacherForm')?.reset();
    renderTeachers();
    showToast('O‘qituvchi muvaffaqiyatli tayinlandi', 'success');
  }

  function removeTeacher(teacherId) {
    if (!isSuperAdmin() || teacherId === 'teacher_default') return;
    const teacher = state.teachers.find(item => item.id === teacherId);
    if (!teacher) return;

    showConfirmDialog('O‘qituvchini o‘chirish', `${teacher.name} akkaunti o‘chirilsinmi?`, () => {
      state.teachers = state.teachers.filter(item => item.id !== teacherId);
      state.groups.forEach(group => {
        if (group.teacherId === teacher.username) {
          group.teacherId = null;
        }
      });
      saveAllToStorage();
      renderTeachers();
      showToast('O‘qituvchi akkaunti o‘chirildi', 'warning');
    });
  }

  // =========================================================================
  // 12. AUTH & ROUTING
  // =========================================================================
  function login(username, password) {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const errorElem = document.getElementById('modalLoginError');

    const isSuperAdminLogin = cleanUser === state.auth.username && cleanPass === state.auth.password;
    const teacher = state.teachers.find(item => item.username === cleanUser && item.password === cleanPass);
    const isTeacherLogin = Boolean(teacher);

    if (isSuperAdminLogin || isTeacherLogin) {
      state.auth.isLoggedIn = true;
      state.auth.role = isSuperAdminLogin ? 'super_admin' : 'teacher';
      saveAllToStorage();
      if (errorElem) errorElem.classList.add('hidden');
      closeModal('teacherLoginModal');
      showToast(isSuperAdminLogin ? 'Super admin paneli ochildi' : 'Oqituvchi paneli ochildi', 'success');
      renderApp();
    } else {
      if (errorElem) {
        errorElem.textContent = 'Foydalanuvchi nomi yoki parol noto\'g\'ri!';
        errorElem.classList.remove('hidden');
      }
    }
  }

  function logout() {
    state.auth.isLoggedIn = false;
    state.auth.role = null;
    saveAllToStorage();
    showToast('Tizimdan chiqildi. Ota-onalar va o\'quvchilar rejimiga o\'tildi.', 'warning');
    if (state.currentView === 'add-points' || state.currentView === 'data-management') {
      navigate('dashboard');
    } else {
      renderApp();
    }
  }

  function changePassword(newPass, confirmPass) {
    if (!isSuperAdmin()) {
      showToast('Parolni faqat super admin o‘zgartira oladi', 'warning');
      return;
    }
    if (newPass.length < 4) {
      showToast('Parol kamida 4 ta belgidan iborat bo\'lishi kerak', 'warning');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('Kiritilgan yangi parollar mos kelmadi', 'danger');
      return;
    }

    state.auth.password = newPass;
    saveAllToStorage();
    showToast('Admin paroli muvaffaqiyatli yangilandi!', 'success');
    document.getElementById('changePasswordForm').reset();
  }

  function navigate(viewName) {
    state.currentView = viewName;

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const viewMapping = {
      'dashboard': 'dashboardView',
      'global-ranking': 'globalRankingView',
      'weekly-ranking': 'weeklyRankingView',
      'groups': 'groupsView',
      'group-detail': 'groupDetailView',
      'students': 'studentsView',
      'add-points': 'addPointsView',
      'statistics': 'statisticsView',
      'data-management': 'dataManagementView'
    };

    const targetSectionId = viewMapping[viewName] || 'dashboardView';
    const section = document.getElementById(targetSectionId);
    if (section) {
      section.classList.add('active');
    }

    closeMobileSidebar();
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('active');
  }

  function openMobileSidebar() {
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('sidebarBackdrop')?.classList.add('active');
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 13. INITIALIZATION & LISTENERS
  // =========================================================================
  function initEventListeners() {
    // Teacher Login form submit
    document.getElementById('teacherLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('modalLoginUsername').value;
      const pass = document.getElementById('modalLoginPassword').value;
      login(user, pass);
    });

    // Theme toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

    // Language select
    document.getElementById('languageSelect')?.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });

    // Navigation links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        if (view) navigate(view);
      });
    });

    // Mobile Sidebar Toggles
    document.getElementById('openSidebarBtn')?.addEventListener('click', openMobileSidebar);
    document.getElementById('closeSidebarBtn')?.addEventListener('click', closeMobileSidebar);
    document.getElementById('sidebarBackdrop')?.addEventListener('click', closeMobileSidebar);

    // Quick Point Button (Sidebar)
    document.getElementById('sidebarQuickPointBtn')?.addEventListener('click', () => openQuickPointModal());

    // Global Search
    const globalSearch = document.getElementById('globalSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (globalSearch) {
      globalSearch.addEventListener('input', () => {
        if (globalSearch.value.trim().length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
        if (state.currentView !== 'dashboard') {
          navigate('dashboard');
        } else {
          renderDashboard();
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        globalSearch.value = '';
        clearSearchBtn.classList.add('hidden');
        renderDashboard();
      });
    }

    // Dashboard filters
    document.getElementById('dashFilterGroup')?.addEventListener('change', renderDashboard);
    document.getElementById('dashFilterTime')?.addEventListener('change', renderDashboard);

    // Global Ranking filter
    document.getElementById('globalFilterGroup')?.addEventListener('change', renderGlobalRanking);

    // Weekly Ranking filter
    document.getElementById('weeklyFilterGroup')?.addEventListener('change', renderWeeklyRanking);

    // Students directory filters
    document.getElementById('studentsFilterGroup')?.addEventListener('change', renderStudents);
    document.getElementById('studentsSearchInput')?.addEventListener('input', renderStudents);

    // Group Select -> Student Select Cascade
    document.getElementById('pointFormGroup')?.addEventListener('change', (e) => {
      populateStudentsInSelect('pointFormStudent', e.target.value);
    });

    document.getElementById('modalPointGroup')?.addEventListener('change', (e) => {
      populateStudentsInSelect('modalPointStudent', e.target.value);
    });

    // Point Preset Chips (Standalone View)
    document.querySelectorAll('.quick-chips-wrapper .point-chip[data-val]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.quick-chips-wrapper .point-chip[data-val]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById('pointFormCustomVal').value = chip.getAttribute('data-val');
      });
    });

    // Point Preset Chips (Modal)
    document.querySelectorAll('.quick-chips-wrapper .point-chip[data-modal-val]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.quick-chips-wrapper .point-chip[data-modal-val]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById('modalPointCustomVal').value = chip.getAttribute('data-modal-val');
      });
    });

    // Preset description tags
    document.querySelectorAll('.preset-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.getElementById('pointFormDesc').value = tag.getAttribute('data-text');
      });
    });

    // Standalone Add Points Form Submit
    document.getElementById('standaloneAddPointsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const groupId = document.getElementById('pointFormGroup').value;
      const studentId = document.getElementById('pointFormStudent').value;
      const points = document.getElementById('pointFormCustomVal').value;
      const category = document.getElementById('pointFormCategory').value;
      const desc = document.getElementById('pointFormDesc').value;
      const date = document.getElementById('pointFormDate').value;

      const success = addPoints(groupId, studentId, points, category, desc, date);
      if (success) {
        document.getElementById('pointFormDesc').value = '';
      }
    });

    // Quick Modal Add Points Form Submit
    document.getElementById('quickPointForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const groupId = document.getElementById('modalPointGroup').value;
      const studentId = document.getElementById('modalPointStudent').value;
      const points = document.getElementById('modalPointCustomVal').value;
      const category = document.getElementById('modalPointCategory').value;
      const desc = document.getElementById('modalPointDesc').value;
      const date = document.getElementById('modalPointDate').value;

      const success = addPoints(groupId, studentId, points, category, desc, date);
      if (success) {
        closeModal('quickPointModal');
        document.getElementById('quickPointForm').reset();
        const profileModal = document.getElementById('studentProfileModal');
        if (!profileModal.classList.contains('hidden')) {
          openStudentProfile(studentId);
        }
      }
    });

    // Group Modal Submit
    document.getElementById('groupForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('groupNameInput').value;
      const desc = document.getElementById('groupDescInput').value;
      const teacherId = document.getElementById('groupTeacherSelect')?.value || '';
      const editId = document.getElementById('groupEditId').value;
      saveGroup(name, desc, teacherId, editId);
    });

    // Student Modal Submit
    document.getElementById('studentForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentNameInput').value;
      const groupId = document.getElementById('studentGroupSelect').value;
      const phone = document.getElementById('studentPhoneInput').value;
      const initialPts = document.getElementById('studentInitialPoints').value;
      const editId = document.getElementById('studentEditId').value;
      saveStudent(name, groupId, phone, initialPts, editId);
    });

    // Data Management Buttons
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportDataAsJson);

    document.getElementById('importJsonFileInput')?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importDataFromJsonFile(e.target.files[0]);
        e.target.value = '';
      }
    });

    document.getElementById('openRawJsonModalBtn')?.addEventListener('click', openRawJsonModal);

    document.getElementById('copyRawJsonBtn')?.addEventListener('click', () => {
      const text = document.getElementById('rawJsonTextarea').value;
      navigator.clipboard.writeText(text).then(() => {
        showToast('JSON matni nusxalandi!', 'success');
      }).catch(() => {
        showToast('Nusxalashda xatolik', 'warning');
      });
    });

    document.getElementById('restoreFromRawJsonBtn')?.addEventListener('click', restoreFromRawJsonText);

    document.getElementById('clearAllDataBtn')?.addEventListener('click', clearAllDataPrompt);

    document.getElementById('loadDemoDataBtn')?.addEventListener('click', loadDemoDataPrompt);

    document.getElementById('jumpToTeachersBtn')?.addEventListener('click', () => {
      document.getElementById('teacherManagementSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Password Change Submit
    document.getElementById('teacherForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      addTeacher(
        document.getElementById('teacherNameInput').value,
        document.getElementById('teacherUsernameInput').value,
        document.getElementById('teacherPasswordInput').value
      );
    });

    // Password Change Submit
    document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPass = document.getElementById('newAdminPass').value;
      const confirmPass = document.getElementById('confirmAdminPass').value;
      changePassword(newPass, confirmPass);
    });

    // Modal backdrops
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.add('hidden');
        }
      });
    });

    // Hash router
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'global-ranking', 'weekly-ranking', 'groups', 'students', 'add-points', 'statistics', 'data-management'].includes(hash)) {
        navigate(hash);
      }
    });
  }

  // =========================================================================
  // 14. EXPOSED API & RUN
  // =========================================================================
  window.app = {
    navigate,
    openModal,
    closeModal,
    showConfirmDialog,
    closeConfirmModal,
    openEditGroupModal,
    deleteGroupPrompt,
    viewGroupDetail,
    openAddStudentForGroup,
    openEditStudentModal,
    deleteStudentPrompt,
    openStudentProfile,
    openQuickPointModal,
    deletePointRecord,
    logout
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initEventListeners();
    setLanguage(state.lang);

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['dashboard', 'global-ranking', 'weekly-ranking', 'groups', 'students', 'add-points', 'statistics', 'data-management'].includes(initialHash)) {
      state.currentView = initialHash;
    }

    renderApp();

    // Fetch latest data from cloud (async — updates UI after cloud responds)
    loadFromCloud();
  });

})();
