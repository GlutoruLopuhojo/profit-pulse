import {
  calculateFinancialMetrics,
  formatCurrency,
  formatPercent,
} from "@/lib/finance";
import type {
  AdvisorInsight,
  AdvisorStatus,
  AnalyzeRequest,
  AnalyzeResponse,
  Locale,
} from "@/lib/types";

export function buildFinancialAdvice(
  payload: AnalyzeRequest,
  locale: Locale
): AnalyzeResponse {
  const metrics = calculateFinancialMetrics(payload);
  const { revenue, cogs, marketing, feesAndTaxes } = metrics;
  const isRu = locale === "ru";

  const forecast = [
    {
      month: isRu ? "Месяц 1" : "Month 1",
      base: Math.round(metrics.netProfit),
      optimistic: Math.round(metrics.netProfit * 1.15),
      pessimistic: Math.round(metrics.netProfit * 0.85),
    },
    {
      month: isRu ? "Месяц 2" : "Month 2",
      base: Math.round(metrics.netProfit * 1.05),
      optimistic: Math.round(metrics.netProfit * 1.25),
      pessimistic: Math.round(metrics.netProfit * 0.75),
    },
    {
      month: isRu ? "Месяц 3" : "Month 3",
      base: Math.round(metrics.netProfit * 1.10),
      optimistic: Math.round(metrics.netProfit * 1.35),
      pessimistic: Math.round(metrics.netProfit * 0.65),
    },
  ];

  if (revenue === 0) {
    return {
      score: 15,
      status: "critical",
      headline: isRu
        ? "Нет выручки для полноценной оценки"
        : "Zero revenue detected",
      summary: isRu
        ? "Укажите выручку или загрузите отчёт о продажах, чтобы рассчитать маржинальность, ROI и точку безубыточности."
        : "Enter revenue or upload a sales report to evaluate margin structure, ROI, and break-even coverage.",
      insights: [
        {
          title: isRu ? "Отсутствует входящий поток" : "Missing top-line revenue",
          detail: isRu
            ? `Текущие расходы составляют ${formatCurrency(metrics.totalExpenses, locale)} при нулевой выручке.`
            : `Current expenses stand at ${formatCurrency(metrics.totalExpenses, locale)} with $0 in revenue.`,
          tone: "negative",
        },
      ],
      recommendations: [
        isRu
          ? "Введите прогнозируемую или фактическую выручку за период."
          : "Add projected or actual period revenue to unlock unit-economics diagnostics.",
      ],
      metrics,
      generatedAt: new Date().toISOString(),
    };
  }

  const cogsShare = (cogs / revenue) * 100;
  const mktShare = (marketing / revenue) * 100;
  const feesShare = (feesAndTaxes / revenue) * 100;

  let score = 50;
  if (metrics.netMarginPercent >= 25) score += 30;
  else if (metrics.netMarginPercent >= 12) score += 20;
  else if (metrics.netMarginPercent >= 0) score += 8;
  else score -= 25;

  if (metrics.roiPercent >= 35) score += 15;
  else if (metrics.roiPercent >= 10) score += 8;
  else if (metrics.roiPercent < 0) score -= 15;

  if (metrics.isAboveBreakEven) score += 5;
  else score -= 10;

  score = Math.max(5, Math.min(98, Math.round(score)));
  const status: AdvisorStatus =
    score >= 70 ? "healthy" : score >= 45 ? "warning" : "critical";

  const insights: AdvisorInsight[] = [];
  const recommendations: string[] = [];

  if (metrics.netProfit >= 0) {
    insights.push({
      title: isRu ? "Положительная чистая прибыль" : "Profitable unit economics",
      detail: isRu
        ? `Чистая прибыль ${formatCurrency(metrics.netProfit, locale)} (${formatPercent(metrics.netMarginPercent, locale)} маржи), ROI составляет ${formatPercent(metrics.roiPercent, locale)}.`
        : `Net profit is ${formatCurrency(metrics.netProfit, locale)} (${formatPercent(metrics.netMarginPercent, locale)} net margin) with ${formatPercent(metrics.roiPercent, locale)} ROI.`,
      tone: metrics.netMarginPercent >= 15 ? "positive" : "warning",
    });
  } else {
    insights.push({
      title: isRu ? "Операционный убыток" : "Operating at a net loss",
      detail: isRu
        ? `Расходы превышают выручку на ${formatCurrency(Math.abs(metrics.netProfit), locale)} (${formatPercent(metrics.netMarginPercent, locale)} маржи).`
        : `Total expenses exceed revenue by ${formatCurrency(Math.abs(metrics.netProfit), locale)} (${formatPercent(metrics.netMarginPercent, locale)} net margin).`,
      tone: "negative",
    });
  }

  if (cogsShare > 55) {
    insights.push({
      title: isRu ? "Высокая доля себестоимости" : "Elevated COGS burden",
      detail: isRu
        ? `Себестоимость забирает ${formatPercent(cogsShare, locale)} выручки, сжимая валовую маржу до ${formatPercent(metrics.grossMarginPercent, locale)}.`
        : `COGS consumes ${formatPercent(cogsShare, locale)} of revenue, compressing gross margin to ${formatPercent(metrics.grossMarginPercent, locale)}.`,
      tone: "negative",
    });
    recommendations.push(
      isRu
        ? "Пересмотрите условия с поставщиками или поднимите средний чек на 5–10% для расширения валовой маржи."
        : "Renegotiate supplier pricing or test a 5–10% price increase to expand gross margin."
    );
  } else {
    insights.push({
      title: isRu ? "Сбалансированная себестоимость" : "Healthy gross margin base",
      detail: isRu
        ? `Валовая маржа ${formatPercent(metrics.grossMarginPercent, locale)} (COGS — ${formatPercent(cogsShare, locale)} от выручки).`
        : `Gross margin is ${formatPercent(metrics.grossMarginPercent, locale)} with COGS at ${formatPercent(cogsShare, locale)} of revenue.`,
      tone: "positive",
    });
  }

  if (mktShare > 28) {
    insights.push({
      title: isRu ? "Высокая маркетинговая нагрузка" : "Heavy marketing spend ratio",
      detail: isRu
        ? `Маркетинг составляет ${formatPercent(mktShare, locale)} от выручки (${formatCurrency(marketing, locale)}).`
        : `Marketing accounts for ${formatPercent(mktShare, locale)} of revenue (${formatCurrency(marketing, locale)}).`,
      tone: "warning",
    });
    recommendations.push(
      isRu
        ? "Перераспределите рекламный бюджет в каналы с наименьшим CAC и усильте повторные продажи (LTV)."
        : "Reallocate ad spend toward lower-CAC channels and focus on retention to lift LTV/CAC."
    );
  }

  if (feesShare > 15) {
    recommendations.push(
      isRu
        ? `Комиссии и налоги (${formatPercent(feesShare, locale)}) заметно снижают прибыль — проверьте тарифы эквайринга и налоговый режим.`
        : `Fees & taxes (${formatPercent(feesShare, locale)}) are relatively high — audit payment gateway tiers and tax deductions.`
    );
  }

  if (metrics.breakEvenPoint === null) {
    recommendations.push(
      isRu
        ? "Переменные расходы (COGS + комиссии) превышают 100% выручки — точка безубыточности недостижима без снижения себестоимости или роста цен."
        : "Variable costs (COGS + fees) exceed 100% of revenue — break-even requires raising prices or cutting direct costs."
    );
  } else if (!metrics.isAboveBreakEven && metrics.breakEvenDelta !== null) {
    recommendations.push(
      isRu
        ? `Для выхода в ноль нужно увеличить выручку на ${formatCurrency(Math.abs(metrics.breakEvenDelta), locale)} (цель: ${formatCurrency(metrics.breakEvenPoint, locale)}).`
        : `Increase revenue by ${formatCurrency(Math.abs(metrics.breakEvenDelta), locale)} to reach break-even at ${formatCurrency(metrics.breakEvenPoint, locale)}.`
    );
  } else if (recommendations.length === 0) {
    recommendations.push(
      isRu
        ? "Юнит-экономика устойчива: можно безопасно масштабировать прибыльные рекламные кампании, удерживая маржу выше 15%."
        : "Unit economics are solid: scale winning acquisition channels gradually while keeping net margin above 15%."
    );
  }

  const headline =
    status === "healthy"
      ? isRu
        ? "Сильная финансовая позиция и устойчивая маржа"
        : "Strong profitability and healthy cost discipline"
      : status === "warning"
        ? isRu
          ? "Прибыль под давлением: есть резерв для оптимизации"
          : "Moderate margins with clear optimization upside"
        : isRu
          ? "Критическое давление на маржинальность и прибыль"
          : "High financial risk — immediate cost or pricing action needed";

  const summary = isRu
    ? `При выручке ${formatCurrency(revenue, locale)} и расходах ${formatCurrency(metrics.totalExpenses, locale)} бизнес генерирует ${formatCurrency(metrics.netProfit, locale)} чистого результата (ROI ${formatPercent(metrics.roiPercent, locale)}).`
    : `On ${formatCurrency(revenue, locale)} in revenue and ${formatCurrency(metrics.totalExpenses, locale)} in total costs, the model yields ${formatCurrency(metrics.netProfit, locale)} net profit (${formatPercent(metrics.roiPercent, locale)} ROI).`;

  return {
    score,
    status,
    headline,
    summary,
    insights,
    recommendations,
    metrics,
    forecast,
    generatedAt: new Date().toISOString(),
  };
}
