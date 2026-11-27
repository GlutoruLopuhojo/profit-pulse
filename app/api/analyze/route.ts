import { buildFinancialAdvice } from "@/lib/advisor";
import { calculateFinancialMetrics } from "@/lib/finance";
import type { AnalyzeRequest, Locale } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeRequest>;
    const revenue = Number(body.revenue ?? 0);
    const cogs = Number(body.cogs ?? 0);
    const marketing = Number(body.marketing ?? 0);
    const feesAndTaxes = Number(body.feesAndTaxes ?? 0);
    const locale: Locale = body.locale === "ru" ? "ru" : "en";

    if (
      [revenue, cogs, marketing, feesAndTaxes].some(
        (n) => !Number.isFinite(n) || n < 0
      )
    ) {
      return Response.json(
        { error: "Invalid non-negative numeric financial inputs required." },
        { status: 400 }
      );
    }

    const metrics = calculateFinancialMetrics({
      revenue,
      cogs,
      marketing,
      feesAndTaxes,
    });

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackReport = buildFinancialAdvice(
        { revenue, cogs, marketing, feesAndTaxes, locale },
        locale
      );
      return Response.json(fallbackReport);
    }

    const isRu = locale === "ru";

    const systemInstruction = isRu
      ? `Ты — опытный финансовый директор (CFO). Проанализируй метрики и верни СТРОГО валидный JSON (без оберток) со структурой:
{"score":0-100,"status":"healthy"|"warning"|"critical","headline":"Заголовок","summary":"Резюме","insights":[{"title":"Инсайт","detail":"Детали","tone":"positive"|"warning"|"negative"}],"recommendations":["Совет 1","Совет 2","Совет 3"]}.
Требования: ровно 3 практических совета на русском языке.`
      : `You are an expert CFO. Analyze the metrics and return STRICTLY valid JSON (no markdown wrappers) with structure:
{"score":0-100,"status":"healthy"|"warning"|"critical","headline":"Headline","summary":"Summary","insights":[{"title":"Title","detail":"Detail","tone":"positive"|"warning"|"negative"}],"recommendations":["Advice 1","Advice 2","Advice 3"]}.
Requirements: exactly 3 actionable recommendations in English.`;

    const userPrompt = JSON.stringify({ metrics, locale });
    const modelName = "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nMetrics: ${userPrompt}` }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    };

    const apiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!apiRes.ok) {
      throw new Error(`Gemini API error: ${apiRes.status}`);
    }

    const data = await apiRes.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Empty response from Gemini API.");
    }

    let cleanedText = candidateText.trim();
    if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7);
    else if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3);
    if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3);
    cleanedText = cleanedText.trim();

    const parsedAiResult = JSON.parse(cleanedText);

    return Response.json({
      score: Number(parsedAiResult.score ?? 50),
      status: ["healthy", "warning", "critical"].includes(parsedAiResult.status) ? parsedAiResult.status : "warning",
      headline: String(parsedAiResult.headline || (isRu ? "Финансовый анализ" : "Financial Analysis")),
      summary: String(parsedAiResult.summary || ""),
      insights: Array.isArray(parsedAiResult.insights) ? parsedAiResult.insights : [],
      recommendations: Array.isArray(parsedAiResult.recommendations) ? parsedAiResult.recommendations.slice(0, 3) : [],
      metrics,
      forecast: [
        { month: isRu ? "Месяц 1" : "Month 1", base: Math.round(metrics.netProfit), optimistic: Math.round(metrics.netProfit * 1.15), pessimistic: Math.round(metrics.netProfit * 0.85) },
        { month: isRu ? "Месяц 2" : "Month 2", base: Math.round(metrics.netProfit * 1.05), optimistic: Math.round(metrics.netProfit * 1.25), pessimistic: Math.round(metrics.netProfit * 0.75) },
        { month: isRu ? "Месяц 3" : "Month 3", base: Math.round(metrics.netProfit * 1.10), optimistic: Math.round(metrics.netProfit * 1.35), pessimistic: Math.round(metrics.netProfit * 0.65) },
      ],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gemini API route error:", error);
    try {
      const body = (await request.json().catch(() => ({}))) as Partial<AnalyzeRequest>;
      const revenue = Number(body.revenue ?? 0);
      const cogs = Number(body.cogs ?? 0);
      const marketing = Number(body.marketing ?? 0);
      const feesAndTaxes = Number(body.feesAndTaxes ?? 0);
      const locale: Locale = body.locale === "ru" ? "ru" : "en";
      return Response.json(buildFinancialAdvice({ revenue, cogs, marketing, feesAndTaxes, locale }, locale));
    } catch {
      return Response.json({ error: "Failed to process financial analysis." }, { status: 500 });
    }
  }
}

