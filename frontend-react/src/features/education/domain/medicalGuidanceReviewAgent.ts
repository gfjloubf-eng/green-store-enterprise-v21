/**
 * Qutoof Nature - Medical Guidance Review Agent (read-only)
 *
 * This module is deliberately side-effect free:
 * - it never writes to the database;
 * - it never changes an article or product;
 * - it never publishes content;
 * - it only returns findings for a human reviewer.
 */

export type ReviewSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ReviewFindingType = 'health_claim' | 'missing_source' | 'unsafe_language' | 'product_link' | 'content_quality';

export interface GuidanceReviewInput {
  title: string;
  body: string;
  sourceUrls?: string[];
  productName?: string;
  produceKey?: string | null;
  familyName?: string | null;
}

export interface GuidanceReviewFinding {
  type: ReviewFindingType;
  severity: ReviewSeverity;
  message: string;
  evidence?: string;
  suggestedAction: string;
}

export interface GuidanceReviewResult {
  status: 'pass' | 'needs_review' | 'blocked';
  readOnly: true;
  mustNotPublish: true;
  findings: GuidanceReviewFinding[];
  checkedAt: string;
}

const UNSAFE_PATTERNS: Array<{ pattern: RegExp; message: string; severity: ReviewSeverity }> = [
  { pattern: /يعالج|يشفي|الشفاء|يقضي على المرض|يمنع المرض|علاج مضمون/iu, message: 'قد توحي العبارة بعلاج أو شفاء مؤكد.', severity: 'critical' },
  { pattern: /تشخيص|جرعة|أوقف الدواء|استبدل الدواء|بدون طبيب/iu, message: 'تتضمن العبارة تشخيصاً أو توجيهاً دوائياً شخصياً.', severity: 'critical' },
  { pattern: /مناسب للجميع|آمن للجميع|لا توجد أضرار/iu, message: 'تعميم صحي مطلق يحتاج إلى تقييد ومراجعة مختص.', severity: 'high' },
  { pattern: /الحامل|الحمل|الأطفال|السكري|ضغط الدم|الكلى|الكبد|حساسية/iu, message: 'المحتوى يتناول فئة أو حالة حساسة ويحتاج تحذيراً مناسباً.', severity: 'high' },
];

const normalize = (value: string | null | undefined) => (value ?? '').trim();

export function reviewGuidance(input: GuidanceReviewInput): GuidanceReviewResult {
  const findings: GuidanceReviewFinding[] = [];
  const text = `${normalize(input.title)}\n${normalize(input.body)}`;
  const sources = (input.sourceUrls ?? []).filter((source) => /^https?:\/\//i.test(source.trim()));

  if (!normalize(input.title)) findings.push({ type: 'content_quality', severity: 'high', message: 'عنوان الإرشاد مفقود.', suggestedAction: 'إضافة عنوان واضح يصف المحتوى دون وعود علاجية.' });
  if (!normalize(input.body)) findings.push({ type: 'content_quality', severity: 'critical', message: 'نص الإرشاد مفقود.', suggestedAction: 'إيقاف النشر حتى يكتمل النص وتتم مراجعته.' });
  if (!sources.length) findings.push({ type: 'missing_source', severity: 'high', message: 'لا يوجد مصدر موثق ظاهر للإرشاد.', suggestedAction: 'إضافة رابط مصدر موثوق ومحدد قبل النشر.' });
  if (!normalize(input.produceKey)) findings.push({ type: 'product_link', severity: 'high', message: 'لا يوجد produceKey موثوق للربط بالمنتج.', suggestedAction: 'إكمال المفتاح أو عدم عرض إرشاد منتج محدد.' });

  for (const rule of UNSAFE_PATTERNS) {
    const match = text.match(rule.pattern);
    if (match) {
      findings.push({ type: 'unsafe_language', severity: rule.severity, message: rule.message, evidence: match[0], suggestedAction: 'إعادة الصياغة كمعلومة غذائية عامة وإضافة إحالة لمختص عند الحاجة.' });
    }
  }

  const hasDisclaimer = /تثقيفية عامة|ليست تشخيصاً|ليست علاجاً|استشر/iu.test(text);
  if (!hasDisclaimer) {
    findings.push({ type: 'content_quality', severity: 'medium', message: 'لا يظهر تنبيه واضح يحدد أن المحتوى تثقيفي وليس علاجاً.', suggestedAction: 'إضافة تنبيه صحي ثابت أسفل الإرشاد.' });
  }

  const hasCritical = findings.some((finding) => finding.severity === 'critical');
  return {
    status: hasCritical ? 'blocked' : findings.length ? 'needs_review' : 'pass',
    readOnly: true,
    mustNotPublish: true,
    findings,
    checkedAt: new Date().toISOString(),
  };
}
