import { internalError, success, validationError } from '../../api';
import type { ApiResponse } from '../../api';

const MAX_INPUT_LENGTH = 20_000;

export interface MedicalGuidanceReviewRequest {
  title?: unknown;
  body?: unknown;
  sourceUrls?: unknown;
  productName?: unknown;
  produceKey?: unknown;
  familyName?: unknown;
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function urls(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && /^https?:\/\//i.test(item.trim())).map((item) => item.trim()).slice(0, 10)
    : [];
}

function fallback(body: string) {
  const findings: Array<Record<string, string>> = [];
  if (!body) findings.push({ severity: 'critical', message: 'نص الإرشاد مفقود.', suggestedAction: 'أكمل النص قبل المراجعة.' });
  if (!/https?:\/\//i.test(body)) findings.push({ severity: 'high', message: 'لا يظهر مصدر داخل نص الطلب.', suggestedAction: 'أضف مصدراً موثوقاً من حقل المصادر.' });
  if (/يعالج|يشفي|جرعة|أوقف الدواء|تشخيص/iu.test(body)) findings.push({ severity: 'critical', message: 'توجد صياغة صحية حساسة تحتاج مراجعة مختص.', suggestedAction: 'أعد الصياغة كمعلومة غذائية عامة.' });
  return { provider: 'deterministic-fallback', status: findings.length ? 'needs_review' : 'pass', readOnly: true, mustNotPublish: true, findings };
}

export async function reviewMedicalGuidanceWithAI(request: { body?: unknown }): Promise<ApiResponse<unknown>> {
  const input = (request.body && typeof request.body === 'object' ? request.body : {}) as MedicalGuidanceReviewRequest;
  const title = text(input.title, 180);
  const body = text(input.body, MAX_INPUT_LENGTH);
  const sourceUrls = urls(input.sourceUrls);
  if (!title || !body) return validationError('education_ai_review_fields_required', { timestamp: new Date().toISOString(), version: 'v1' });

  const apiKey = process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;
  const apiBase = (process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_API_BASE || '').replace(/\/$/, '');
  const model = process.env.EDUCATION_REVIEW_MODEL || 'gpt-5-mini';
  if (!apiKey || !apiBase) return success({ ...fallback(body), provider: 'deterministic-fallback', reason: 'AI provider is not configured' }, { timestamp: new Date().toISOString(), version: 'v1' });

  const systemPrompt = 'أنت مراجع محتوى غذائي مسؤول. لا تشخص ولا تعالج ولا تقترح جرعات. حلل النص فقط، أخرج JSON مطابقاً للمخطط، واعتبر كل نتيجة اقتراحاً يحتاج مراجعة بشرية. لا تخترع مصدراً.';
  const userPayload = JSON.stringify({ title, body, sourceUrls, productName: text(input.productName, 160), produceKey: text(input.produceKey, 120), familyName: text(input.familyName, 120) });
  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_completion_tokens: 1200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `راجع هذا الإدخال وأعد JSON فقط:\n${userPayload}` },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'medical_guidance_review',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                status: { type: 'string', enum: ['pass', 'needs_review', 'blocked'] },
                summary: { type: 'string' },
                findings: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { severity: { type: 'string' }, message: { type: 'string' }, suggestedAction: { type: 'string' } }, required: ['severity', 'message', 'suggestedAction'] } },
              },
              required: ['status', 'summary', 'findings'],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`AI review failed with status ${response.status}`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI review returned empty content');
    const result = JSON.parse(content) as Record<string, unknown>;
    return success({ ...result, provider: model, readOnly: true, mustNotPublish: true }, { timestamp: new Date().toISOString(), version: 'v1' });
  } catch {
    return success({ ...fallback(body), provider: 'deterministic-fallback', reason: 'AI review unavailable; no content was changed' }, { timestamp: new Date().toISOString(), version: 'v1' });
  }
}
