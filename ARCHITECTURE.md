# ProfitPulse — Architecture & Financial Formulas

## 1. Overview

**ProfitPulse** is a Next.js (App Router, TypeScript, Tailwind CSS) financial analytics MVP designed for rapid unit-economics and P&L evaluation. Users can enter metrics interactively via sliders/inputs or upload `.csv` / `.xlsx` spreadsheets with automatic column mapping, inspect KPIs and cost-structure visualizations, switch between **EN** and **RU** interfaces, and request insights from the **AI Financial Advisor** (`/api/analyze`).

---

## 2. Directory & Component Structure

```text
profit-pulse/
├── ARCHITECTURE.md                  # Architecture overview & financial formulas
├── app/
│   ├── layout.tsx                   # Root layout, fonts, metadata, LanguageProvider
│   ├── page.tsx                     # Dashboard entry page
│   ├── globals.css                  # Tailwind CSS v4 theme tokens & base styles
│   └── api/
│       └── analyze/
│           └── route.ts             # POST /api/analyze Route Handler (smart mock advisor)
├── components/
│   ├── providers/
│   │   └── LanguageProvider.tsx     # EN / RU locale context (default: "en")
│   ├── Header.tsx                   # App header, branding, EN / RU toggle
│   ├── Dashboard.tsx                # Main dashboard state & layout orchestrator
│   ├── ManualInputPanel.tsx         # Interactive sliders, numeric fields, presets
│   ├── FileUploadPanel.tsx          # CSV/XLSX drag-and-drop, auto column mapping UI
│   ├── KpiCards.tsx                 # 4 KPI cards with green/red status indicators
│   ├── FinancialChart.tsx           # Recharts revenue, expenses & profit visualization
│   └── AiAdvisorCard.tsx            # AI Financial Advisor panel & API integration
└── lib/
    ├── types.ts                     # Shared TypeScript interfaces
    ├── finance.ts                   # Pure financial calculations & formatters
    ├── advisor.ts                   # Smart rule-based AI advisor generator (EN/RU)
    ├── file-parser.ts               # PapaParse & SheetJS parsing + EN/RU auto-mapping
    └── i18n/
        └── dictionaries.ts          # Complete EN / RU translation dictionary
```

### Component Responsibilities

| Component / Module | Responsibility |
| --- | --- |
| `LanguageProvider` | Holds active locale (`"en" \| "ru"`, default `"en"`), persists preference in `localStorage`, and exposes `t` dictionary + `setLocale`. |
| `Header` | Displays ProfitPulse logo/title and the `EN / RU` segmented language switcher. |
| `Dashboard` | Manages `FinancialInputs` state, active input mode (`"manual" \| "upload"`), and feeds derived `FinancialMetrics` to KPIs, charts, and the AI Advisor. |
| `ManualInputPanel` | Synchronized range sliders and numeric inputs for Revenue, COGS, Marketing, and Fees & Taxes, plus quick presets and reset. |
| `FileUploadPanel` | Accepts `.csv`, `.xlsx`, and `.xls` files; auto-maps columns via `lib/file-parser.ts`; lets users adjust mappings and download a sample CSV. |
| `KpiCards` | Renders Net Profit, Profit Margin %, ROI, and Break-Even Point with green/red semantic health indicators. |
| `FinancialChart` | Renders Recharts visualizations (Breakdown Bar Chart & Structure Donut Chart) with localized labels and tooltips. |
| `AiAdvisorCard` | Calls `POST /api/analyze` with current inputs and active locale, then renders health score, summary, insights, and recommendations. |

---

## 3. Financial Formulas

Let the four core user inputs (in currency units, e.g., USD `$`) be:

- $R$ — **Revenue** (Выручка)
- $C_{\text{cogs}}$ — **Cost of Goods Sold / COGS** (Себестоимость)
- $C_{\text{mkt}}$ — **Marketing** (Маркетинг)
- $C_{\text{fees}}$ — **Fees & Taxes** (Комиссии и налоги)

### 3.1 Total Expenses

$$E = C_{\text{cogs}} + C_{\text{mkt}} + C_{\text{fees}}$$

### 3.2 Gross Profit & Gross Margin %

$$\text{Gross Profit} = R - C_{\text{cogs}}$$

$$\text{Gross Margin (\%)} = \begin{cases} \dfrac{R - C_{\text{cogs}}}{R} \times 100, & R > 0 \\ 0, & R \le 0 \end{cases}$$

### 3.3 Net Profit

$$\text{Net Profit} = R - E = R - (C_{\text{cogs}} + C_{\text{mkt}} + C_{\text{fees}})$$

### 3.4 Net Profit Margin % (Маржинальность %)

$$\text{Net Margin (\%)} = \begin{cases} \dfrac{\text{Net Profit}}{R} \times 100, & R > 0 \\ 0, & R \le 0 \end{cases}$$

### 3.5 Return on Investment (ROI %)

Measures net profit generated per unit of total costs invested:

$$\text{ROI (\%)} = \begin{cases} \dfrac{\text{Net Profit}}{E} \times 100, & E > 0 \\ 0, & E \le 0 \end{cases}$$

### 3.6 Break-Even Point (Точка безубыточности)

To model break-even revenue from the four P&L inputs:
- **Variable Costs** ($V$) scale with sales volume: $V = C_{\text{cogs}} + C_{\text{fees}}$
- **Fixed / Acquisition Spend** ($F$) represents committed marketing budget: $F = C_{\text{mkt}}$

When $R > 0$, the **Contribution Margin Ratio** ($\text{CMR}$) is:

$$\text{CMR} = \frac{R - (C_{\text{cogs}} + C_{\text{fees}})}{R} = 1 - \frac{C_{\text{cogs}} + C_{\text{fees}}}{R}$$

The **Break-Even Revenue** ($\text{BEP}$) is:

$$\text{BEP} = \begin{cases} \dfrac{C_{\text{mkt}}}{\text{CMR}}, & R > 0 \text{ and } \text{CMR} > 0 \\ \text{null (Unreachable)}, & \text{otherwise} \end{cases}$$

When $R \ge \text{BEP}$ (with $\text{CMR} > 0$), $\text{Net Profit} \ge 0$; when $R < \text{BEP}$, the business operates at a loss.

---

## 4. Data Flow

1. **Input**: User adjusts sliders/fields in `ManualInputPanel` OR uploads a spreadsheet in `FileUploadPanel`.
2. **Normalization**: `FileUploadPanel` aggregates mapped numeric columns into `FinancialInputs` (`revenue`, `cogs`, `marketing`, `feesAndTaxes`).
3. **Calculation**: `calculateFinancialMetrics(inputs)` produces `FinancialMetrics` synchronously for zero-latency UI updates.
4. **Visualization**: `KpiCards` and `FinancialChart` reactively re-render with updated numbers and green/red status indicators.
5. **AI Analysis**: Clicking **Analyze** sends `{ ...inputs, locale }` to `POST /api/analyze`, returning localized insights rendered in `AiAdvisorCard`.

| `app/api/analyze/route.ts` | Validates payload, computes metrics server-side, evaluates ratios, and returns a structured, number-aware diagnostic report. |
