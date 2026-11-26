import Papa from "papaparse";
import * as XLSX from "xlsx";
import type {
  ColumnMapping,
  FinancialFieldKey,
  FinancialInputs,
  ParsedSpreadsheet,
} from "./types";

const COLUMN_ALIASES: Record<FinancialFieldKey, string[]> = {
  revenue: [
    "revenue",
    "sales",
    "income",
    "turnover",
    "gross_revenue",
    "total_revenue",
    "выручка",
    "доход",
    "продажи",
    "оборот",
  ],
  cogs: [
    "cogs",
    "cost_of_goods",
    "cost of goods",
    "cost",
    "production_cost",
    "purchase_cost",
    "себестоимость",
    "закупка",
    "затраты_на_товар",
  ],
  marketing: [
    "marketing",
    "ads",
    "ad_spend",
    "ad spend",
    "advertising",
    "cac",
    "promotion",
    "маркетинг",
    "реклама",
    "продвижение",
  ],
  feesAndTaxes: [
    "fees",
    "taxes",
    "fees_and_taxes",
    "fees & taxes",
    "commission",
    "tax",
    "fee",
    "platform_fee",
    "комиссии",
    "налоги",
    "комиссия",
    "налог",
    "эквайринг",
  ],
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s\-]+/g, "_");
}

export function autoMapColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    revenue: null,
    cogs: null,
    marketing: null,
    feesAndTaxes: null,
  };

  const usedHeaders = new Set<string>();
  const fields: FinancialFieldKey[] = [
    "revenue",
    "cogs",
    "marketing",
    "feesAndTaxes",
  ];

  for (const field of fields) {
    const aliases = COLUMN_ALIASES[field].map(normalizeHeader);
    const match = headers.find(
      (h) => !usedHeaders.has(h) && aliases.includes(normalizeHeader(h))
    );
    if (match) {
      mapping[field] = match;
      usedHeaders.add(match);
    }
  }

  for (const field of fields) {
    if (mapping[field]) continue;
    const aliases = COLUMN_ALIASES[field].map(normalizeHeader);
    const match = headers.find((h) => {
      if (usedHeaders.has(h)) return false;
      const norm = normalizeHeader(h);
      return aliases.some((a) => norm.includes(a) || a.includes(norm));
    });
    if (match) {
      mapping[field] = match;
      usedHeaders.add(match);
    }
  }

  return mapping;
}

export function parseNumericCell(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : 0;
  }
  if (typeof value !== "string") return 0;

  const cleaned = value.trim().replace(/[$€₽£\s\u00A0]/g, "");
  if (!cleaned) return 0;

  let normalized = cleaned;
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  if (hasComma && hasDot) {
    if (cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (hasComma) {
    const parts = cleaned.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = cleaned.replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function aggregateMappedRows(
  rows: Record<string, unknown>[],
  mapping: ColumnMapping
): FinancialInputs {
  const totals: FinancialInputs = {
    revenue: 0,
    cogs: 0,
    marketing: 0,
    feesAndTaxes: 0,
  };

  for (const row of rows) {
    if (mapping.revenue) totals.revenue += parseNumericCell(row[mapping.revenue]);
    if (mapping.cogs) totals.cogs += parseNumericCell(row[mapping.cogs]);
    if (mapping.marketing) {
      totals.marketing += parseNumericCell(row[mapping.marketing]);
    }
    if (mapping.feesAndTaxes) {
      totals.feesAndTaxes += parseNumericCell(row[mapping.feesAndTaxes]);
    }
  }

  return {
    revenue: Math.round(totals.revenue * 100) / 100,
    cogs: Math.round(totals.cogs * 100) / 100,
    marketing: Math.round(totals.marketing * 100) / 100,
    feesAndTaxes: Math.round(totals.feesAndTaxes * 100) / 100,
  };
}

export async function parseSpreadsheetFile(
  file: File
): Promise<ParsedSpreadsheet> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "csv") {
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, unknown>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = (results.meta.fields ?? []).filter(Boolean);
          const rows = results.data ?? [];
          if (headers.length === 0 || rows.length === 0) {
            reject(new Error("EMPTY_FILE"));
            return;
          }
          resolve({
            fileName: file.name,
            headers,
            rows,
            mapping: autoMapColumns(headers),
          });
        },
        error: (err) => reject(err),
      });
    });
  }

  if (ext === "xlsx" || ext === "xls") {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("EMPTY_FILE");
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
    });
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    if (headers.length === 0 || rows.length === 0) {
      throw new Error("EMPTY_FILE");
    }
    return {
      fileName: file.name,
      headers,
      rows,
      mapping: autoMapColumns(headers),
    };
  }

  throw new Error("UNSUPPORTED_FORMAT");
}

export function createSampleCsvBlob(): Blob {
  const csv = [
    "Month,Revenue,COGS,Marketing,Fees & Taxes",
    "January,42000,16800,7500,4900",
    "February,48500,19200,8200,5400",
    "March,54000,20900,9100,6100",
  ].join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

