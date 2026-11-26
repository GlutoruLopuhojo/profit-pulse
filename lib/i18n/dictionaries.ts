import type { Locale } from "../types";

export interface Dictionary {
  app: {
    name: string;
    tagline: string;
    badge: string;
    currencyNote: string;
  };
  header: {
    languageLabel: string;
  };
  inputPanel: {
    title: string;
    subtitle: string;
    manualTab: string;
    uploadTab: string;
    presetsLabel: string;
    presetEcommerce: string;
    presetSaas: string;
    presetLoss: string;
    reset: string;
    fields: {
      revenue: string;
      cogs: string;
      marketing: string;
      feesAndTaxes: string;
    };
    fieldHints: {
      revenue: string;
      cogs: string;
      marketing: string;
      feesAndTaxes: string;
    };
    totalExpensesLabel: string;
  };
  uploadPanel: {
    dropTitle: string;
    dropSubtitle: string;
    browseButton: string;
    downloadSample: string;
    loadedFile: string;
    rowsDetected: string;
    mappingTitle: string;
    mappingSubtitle: string;
    unmappedOption: string;
    autoMatchedBadge: string;
    applyToManual: string;
    clearFile: string;
    errors: {
      empty: string;
      unsupported: string;
      generic: string;
    };
  };
  kpis: {
    netProfit: {
      label: string;
      positiveSub: string;
      negativeSub: string;
    };
    margin: {
      label: string;
      grossPrefix: string;
    };
    roi: {
      label: string;
      positiveSub: string;
      negativeSub: string;
      zeroSub: string;
    };
    breakEven: {
      label: string;
      unreachable: string;
      unreachableSub: string;
      abovePrefix: string;
      belowPrefix: string;
    };
  };
  chart: {
    title: string;
    subtitle: string;
    barMode: string;
    donutMode: string;
    revenue: string;
    cogs: string;
    marketing: string;
    feesAndTaxes: string;
    netProfit: string;
    netLoss: string;
    totalExpenses: string;
    shareOfRevenue: string;
    emptyState: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    analyzeButton: string;
    reanalyzeButton: string;
    analyzing: string;
    emptyPrompt: string;
    scoreLabel: string;
    statusLabels: {
      healthy: string;
      warning: string;
      critical: string;
    };
    insightsTitle: string;
    recommendationsTitle: string;
    errorMessage: string;
  };
  proModal: {
    title: string;
    subtitle: string;
    feature1: string;
    feature2: string;
    feature3: string;
    ruButton: string;
    globalButton: string;
    stubNotice: string;
    close: string;
  };
  auth: {
    login: string;
    signUp: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    needAccount: string;
    haveAccount: string;
  };
}

const en: Dictionary = {
  app: {
    name: "ProfitPulse",
    tagline: "Real-Time P&L, Unit Economics & AI Financial Diagnostics",
    badge: "MVP Analytics",
    currencyNote: "All monetary values are displayed in USD ($)",
  },
  auth: {
    login: "Login",
    signUp: "Sign Up",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    needAccount: "Need an account? Sign Up",
    haveAccount: "Have an account? Login",
  },
  header: {
    languageLabel: "Language",
  },
  inputPanel: {
    title: "Financial Inputs",
    subtitle: "Adjust metrics manually or import a CSV / XLSX report",
    manualTab: "Manual Input",
    uploadTab: "CSV / XLSX Upload",
    presetsLabel: "Quick Scenarios:",
    presetEcommerce: "E-Commerce",
    presetSaas: "SaaS Growth",
    presetLoss: "Tight Margin",
    reset: "Reset",
    fields: {
      revenue: "Revenue",
      cogs: "Cost of Goods (COGS)",
      marketing: "Marketing Spend",
      feesAndTaxes: "Fees & Taxes",
    },
    fieldHints: {
      revenue: "Gross sales before deductions",
      cogs: "Direct product or delivery cost",
      marketing: "Paid ads, CAC & promo campaigns",
      feesAndTaxes: "Payment processing, marketplace & tax",
    },
    totalExpensesLabel: "Total Expenses",
  },
  uploadPanel: {
    dropTitle: "Drop your CSV or Excel file here",
    dropSubtitle: "Supports .csv, .xlsx, .xls with automatic EN/RU column mapping",
    browseButton: "Choose File",
    downloadSample: "Download Sample CSV",
    loadedFile: "Loaded file",
    rowsDetected: "rows aggregated",
    mappingTitle: "Column Mapping",
    mappingSubtitle: "Verify or adjust auto-detected spreadsheet columns",
    unmappedOption: "— Not mapped —",
    autoMatchedBadge: "Auto-mapped",
    applyToManual: "Fine-tune in Manual Mode",
    clearFile: "Clear",
    errors: {
      empty: "The uploaded file has no readable rows or headers.",
      unsupported: "Unsupported format. Please upload a .csv, .xlsx, or .xls file.",
      generic: "Could not parse the file. Please check its formatting.",
    },
  },
  kpis: {
    netProfit: {
      label: "Net Profit",
      positiveSub: "Profitable operation",
      negativeSub: "Operating at a loss",
    },
    margin: {
      label: "Net Margin %",
      grossPrefix: "Gross Margin:",
    },
    roi: {
      label: "ROI",
      positiveSub: "Positive return on total costs",
      negativeSub: "Negative return on spend",
      zeroSub: "Add expenses to compute ROI",
    },
    breakEven: {
      label: "Break-Even Point",
      unreachable: "Unreachable",
      unreachableSub: "Variable costs exceed revenue",
      abovePrefix: "Above target by",
      belowPrefix: "Shortfall of",
    },
  },
  chart: {
    title: "Expense & Profit Structure",
    subtitle: "Visual breakdown of revenue allocation and cost drivers",
    barMode: "Breakdown Bar",
    donutMode: "Structure Donut",
    revenue: "Revenue",
    cogs: "COGS",
    marketing: "Marketing",
    feesAndTaxes: "Fees & Taxes",
    netProfit: "Net Profit",
    netLoss: "Net Loss",
    totalExpenses: "Total Expenses",
    shareOfRevenue: "of revenue",
    emptyState: "Enter revenue or upload a file to view the breakdown chart.",
  },
  advisor: {
    title: "AI Financial Advisor",
    subtitle: "Automated unit-economics review powered by /api/analyze",
    analyzeButton: "Run AI Analysis",
    reanalyzeButton: "Refresh Analysis",
    analyzing: "Analyzing metrics...",
    emptyPrompt: "Click “Run AI Analysis” to evaluate margin health, cost ratios, and break-even risk based on your current numbers.",
    scoreLabel: "Health Score",
    statusLabels: {
      healthy: "Healthy",
      warning: "Needs Attention",
      critical: "Critical Risk",
    },
    insightsTitle: "Key Diagnostics",
    recommendationsTitle: "Actionable Recommendations",
    errorMessage: "Failed to run financial analysis. Please try again.",
  },
  proModal: {
    title: "Upgrade to ProfitPulse PRO",
    subtitle: "Unlock unlimited AI financial diagnostics, unlimited saved reports in history, and advanced forecasting tools.",
    feature1: "⚡ Unlimited AI Financial Advisor scans",
    feature2: "📂 Unlimited saved reports in History",
    feature3: "🚀 Priority execution & VIP support",
    ruButton: "Оплатить картой РФ / СБП (990 ₽/мес)",
    globalButton: "Pay with International Card ($12/мес)",
    stubNotice: "Скоро запуск / Связаться в Telegram",
    close: "Close",
  },
};

const ru: Dictionary = {
  app: {
    name: "ProfitPulse",
    tagline: "P&L аналитика, юнит-экономика и ИИ-диагностика в реальном времени",
    badge: "MVP Аналитика",
    currencyNote: "Все денежные значения отображаются в USD ($)",
  },
  header: {
    languageLabel: "Язык",
  },
  inputPanel: {
    title: "Финансовые данные",
    subtitle: "Настройте показатели вручную или загрузите CSV / XLSX отчёт",
    manualTab: "Ручной ввод",
    uploadTab: "Загрузка CSV / XLSX",
    presetsLabel: "Сценарии:",
    presetEcommerce: "E-Commerce",
    presetSaas: "SaaS Рост",
    presetLoss: "Узкая маржа",
    reset: "Сброс",
    fields: {
      revenue: "Выручка",
      cogs: "Себестоимость (COGS)",
      marketing: "Маркетинг",
      feesAndTaxes: "Комиссии и налоги",
    },
    fieldHints: {
      revenue: "Валовые продажи до вычетов",
      cogs: "Прямые затраты на товар или сервис",
      marketing: "Реклама, привлечение и промо",
      feesAndTaxes: "Эквайринг, комиссии площадок и налоги",
    },
    totalExpensesLabel: "Общие расходы",
  },
  uploadPanel: {
    dropTitle: "Перетащите CSV или Excel файл сюда",
    dropSubtitle: "Поддержка .csv, .xlsx, .xls с авто-маппингом колонок EN/RU",
    browseButton: "Выбрать файл",
    downloadSample: "Скачать пример CSV",
    loadedFile: "Загружен файл",
    rowsDetected: "строк просуммировано",
    mappingTitle: "Маппинг колонок",
    mappingSubtitle: "Проверьте или скорректируйте распознанные колонки",
    unmappedOption: "— Не выбрано —",
    autoMatchedBadge: "Авто-маппинг",
    applyToManual: "Доработать вручную",
    clearFile: "Очистить",
    errors: {
      empty: "В загруженном файле нет читаемых строк или заголовков.",
      unsupported: "Неподдерживаемый формат. Загрузите .csv, .xlsx или .xls.",
      generic: "Не удалось прочитать файл. Проверьте формат таблицы.",
    },
  },
  kpis: {
    netProfit: {
      label: "Чистая прибыль",
      positiveSub: "Прибыльная модель",
      negativeSub: "Операционный убыток",
    },
    margin: {
      label: "Маржинальность %",
      grossPrefix: "Валовая маржа:",
    },
    roi: {
      label: "ROI",
      positiveSub: "Положительная окупаемость затрат",
      negativeSub: "Отрицательная окупаемость",
      zeroSub: "Добавьте расходы для расчёта ROI",
    },
    breakEven: {
      label: "Точка безубыточности",
      unreachable: "Недостижима",
      unreachableSub: "Переменные расходы выше выручки",
      abovePrefix: "Запас прочности:",
      belowPrefix: "Не хватает до цели:",
    },
  },
  chart: {
    title: "Структура расходов и прибыли",
    subtitle: "Визуальное распределение выручки, издержек и чистой прибыли",
    barMode: "Столбцы",
    donutMode: "Структура",
    revenue: "Выручка",
    cogs: "Себестоимость",
    marketing: "Маркетинг",
    feesAndTaxes: "Комиссии и налоги",
    netProfit: "Чистая прибыль",
    netLoss: "Чистый убыток",
    totalExpenses: "Всего расходов",
    shareOfRevenue: "от выручки",
    emptyState: "Укажите выручку или загрузите файл для отображения графика.",
  },
  advisor: {
    title: "AI Финансовый советник",
    subtitle: "Автоматический аудит юнит-экономики через /api/analyze",
    analyzeButton: "Анализировать финансы",
    reanalyzeButton: "Обновить анализ",
    analyzing: "Анализируем показатели...",
    emptyPrompt: "Нажмите «Анализировать финансы», чтобы получить оценку маржинальности, структуры расходов и риска безубыточности.",
    scoreLabel: "Индекс здоровья",
    statusLabels: {
      healthy: "Стабильно",
      warning: "Требует внимания",
      critical: "Высокий риск",
    },
    insightsTitle: "Ключевые наблюдения",
    recommendationsTitle: "Практические рекомендации",
    errorMessage: "Ошибка при выполнении анализа. Попробуйте снова.",
  },
  proModal: {
    title: "Перейти на ProfitPulse PRO",
    subtitle: "Разблокируйте неограниченный ИИ-анализ финансов, бесконечную историю расчетов и расширенные инструменты.",
    feature1: "⚡ Неограниченные проверки ИИ-советника",
    feature2: "📂 Безлимитные сохраненные отчеты",
    feature3: "🚀 Приоритетная поддержка и новые функции",
    ruButton: "Оплатить картой РФ / СБП (990 ₽/мес)",
    globalButton: "Pay with International Card ($12/мес)",
    stubNotice: "Скоро запуск / Связаться в Telegram",
    close: "Закрыть",
  },
  auth: {
    login: "Войти",
    signUp: "Регистрация",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Пароль",
    needAccount: "Нет аккаунта? Регистрация",
    haveAccount: "Уже есть аккаунт? Войти",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

