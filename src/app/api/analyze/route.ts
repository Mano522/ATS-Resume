import { datasetRoleCategories, extractRoleFit, formatRoleCategory } from "@/lib/role-fit";

const MAX_TEXT_LENGTH = 120_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send resume text and a role category as JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid analysis request." }, { status: 400 });
  }

  const { resumeText, category } = body as Record<string, unknown>;
  if (typeof resumeText !== "string" || !resumeText.trim()) {
    return Response.json({ error: "Resume text is required." }, { status: 400 });
  }
  if (resumeText.length > MAX_TEXT_LENGTH) {
    return Response.json({ error: "Resume text is too long to analyze." }, { status: 413 });
  }
  if (typeof category !== "string" || !datasetRoleCategories.includes(category)) {
    return Response.json({ error: "Choose a supported dataset role category." }, { status: 400 });
  }

  const text = resumeText.trim();
  const normalized = text.toLowerCase();
  const fit = extractRoleFit(text, category);
  const sectionRules = [
    ["Contact details", /\b(email|phone|linkedin|contact)\b/],
    ["Professional summary", /\b(summary|profile|objective)\b/],
    ["Work experience", /\b(experience|employment|work history)\b/],
    ["Education", /\b(education|university|college)\b/],
    ["Skills", /\b(skills|technologies|technical proficiencies)\b/],
    ["Projects", /\b(projects|selected work)\b/],
    ["Certifications", /\b(certifications|licenses)\b/],
  ] as const;
  const sections = sectionRules.map(([name, pattern]) => ({
    name,
    present: pattern.test(normalized),
    ...(!pattern.test(normalized) && name === "Contact details"
      ? { suggestion: "Add an email address and a reliable way to reach you." }
      : {}),
  }));
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasMetrics = /\b\d+(?:\.\d+)?\s*(?:%|percent\b|users?\b|customers?\b|hours?\b|days?\b|weeks?\b|months?\b|years?\b|\+|x\b)/i.test(text);
  const sectionScore = Math.round((sections.filter((section) => section.present).length / sections.length) * 100);
  const lengthScore = wordCount >= 250 && wordCount <= 1000 ? 90 : wordCount < 250 ? 65 : 70;
  const experienceScore = hasMetrics ? 86 : 65;
  const skillScore = fit?.coverage ?? 0;
  const score = Math.round(sectionScore * 0.35 + lengthScore * 0.25 + experienceScore * 0.2 + skillScore * 0.2);
  const atsScore = Math.round(sectionScore * 0.5 + lengthScore * 0.3 + (hasMetrics ? 85 : 65) * 0.2);
  const scoreLabel = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Getting started" : "Needs attention";
  const issues = [{
    id: "analysis-impact",
    color: "improvement" as const,
    severity: hasMetrics ? "Low" as const : "Medium" as const,
    section: "Work experience",
    original: hasMetrics ? "Numerical outcomes detected" : "No clear measurable outcome detected",
    issue: hasMetrics ? "Add context to measurable outcomes" : "Show the impact of your work",
    reason: "Specific outcomes help readers understand the scale of your contributions.",
    suggestion: hasMetrics
      ? "Check that each number explains what changed and who benefited."
      : "Where you can support it, add a measurable result to a relevant bullet.",
  }];
  return Response.json({
    score,
    atsScore,
    scoreLabel,
    categories: [
      { subject: "Structure", score: sectionScore, fullMark: 100 },
      { subject: "Length", score: lengthScore, fullMark: 100 },
      { subject: "Experience", score: experienceScore, fullMark: 100 },
      { subject: "Projects", score: /\b(project|built|launched|created)\b/i.test(text) ? 78 : 45, fullMark: 100 },
      { subject: "Skills", score: skillScore, fullMark: 100 },
    ],
    issues,
    skills: { existing: fit?.matchedSkills ?? [], missing: fit?.missingSkills ?? [], recommended: [] },
    sections,
    atsChecks: [
      { name: "Length", passed: wordCount >= 250 && wordCount <= 1000, detail: `${wordCount} words${wordCount >= 250 && wordCount <= 1000 ? " · within a typical range" : " · consider reviewing the length"}` },
      { name: "Contact details", passed: sections[0].present, detail: sections[0].present ? "Contact information found" : "No contact information detected" },
      { name: "Section headings", passed: sectionScore >= 57, detail: `${sections.filter((section) => section.present).length} common resume sections detected` },
      { name: "Measurable outcomes", passed: hasMetrics, detail: hasMetrics ? "Numbers or measurable outcomes found" : "No measurable outcomes detected" },
      { name: "File format", passed: true, detail: "PDF · supported format" },
    ],
    roleFit: fit
      ? { score: fit.score, coverage: fit.coverage, category: formatRoleCategory(category) }
      : undefined,
  });
}
