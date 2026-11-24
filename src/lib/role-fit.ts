import dataset from "@/lib/job-fit-profiles.json";

type RoleProfile = {
  requiredSkills: string[];
  samples: number;
  scorePoints: { coverage: number; score: number; samples: number }[];
};

const profiles = dataset.profiles as Record<string, RoleProfile>;

export const datasetRoleCategories = Object.keys(profiles);

export function formatRoleCategory(category: string): string {
  return category
    .split("-")
    .map((part) =>
      ["BPO", "HR"].includes(part) ? part : `${part[0]}${part.slice(1).toLowerCase()}`,
    )
    .join(" ");
}

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function scoreAtCoverage(profile: RoleProfile, coverage: number): number | undefined {
  const points = profile.scorePoints;
  if (points.length === 0) return undefined;
  if (coverage <= points[0].coverage) return points[0].score;
  if (coverage >= points[points.length - 1].coverage) return points[points.length - 1].score;

  const upperIndex = points.findIndex((point) => point.coverage >= coverage);
  const lower = points[upperIndex - 1];
  const upper = points[upperIndex];
  if (upper.coverage === lower.coverage) return (lower.score + upper.score) / 2;

  const progress = (coverage - lower.coverage) / (upper.coverage - lower.coverage);
  return lower.score + (upper.score - lower.score) * progress;
}

export function calculateRoleFit(resumeSkills: string[], category: string) {
  const profile = profiles[category];
  if (!profile) return null;

  const normalizedResumeSkills = new Set(resumeSkills.map(normalizeSkill));
  const matchedSkills = profile.requiredSkills.filter((skill) =>
    normalizedResumeSkills.has(normalizeSkill(skill)),
  );
  const missingSkills = profile.requiredSkills.filter(
    (skill) => !normalizedResumeSkills.has(normalizeSkill(skill)),
  );
  const coverage = profile.requiredSkills.length
    ? matchedSkills.length / profile.requiredSkills.length
    : 0;
  const score = scoreAtCoverage(profile, coverage);
  if (score === undefined) return null;

  return {
    score: Math.round(score),
    coverage: Math.round(coverage * 100),
    matchedSkills,
    missingSkills,
    sampleCount: profile.samples,
  };
}

export function extractRoleFit(resumeText: string, category: string) {
  const profile = profiles[category];
  if (!profile) return null;

  const normalizedText = normalizeSkill(resumeText);
  const resumeSkills = profile.requiredSkills.filter((skill) =>
    normalizedText.includes(normalizeSkill(skill)),
  );

  return calculateRoleFit(resumeSkills, category);
}
