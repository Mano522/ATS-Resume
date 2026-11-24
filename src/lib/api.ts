export type IssueColor = "grammar" | "formatting" | "keywords" | "improvement";
export type Severity = "Low" | "Medium" | "High";

export type ResumeIssue = {
  id: string;
  color: IssueColor;
  severity: Severity;
  section: string;
  original: string;
  issue: string;
  reason: string;
  suggestion: string;
};

export type ResumeSummary = {
  id: string;
  name: string;
  role: string;
  updatedAt: string;
  score: number;
  atsScore: number;
  color: string;
  history: number[];
};

export type AnalysisResult = {
  score: number;
  atsScore: number;
  scoreLabel: string;
  roleFit?: {
    score: number;
    coverage: number;
    category: string;
  };
  categories: { subject: string; score: number; fullMark: number }[];
  issues: ResumeIssue[];
  skills: { existing: string[]; missing: string[]; recommended: string[] };
  sections: { name: string; present: boolean; suggestion?: string }[];
  atsChecks: { name: string; passed: boolean; detail: string }[];
};

export type DashboardData = {
  name: string;
  resumes: ResumeSummary[];
  weeklyScores: { day: string; score: number; ats: number }[];
};

const dashboard: DashboardData = {
  name: "Maya",
  resumes: [
    { id: "maya-swe", name: "Maya_Patel_Resume.pdf", role: "Senior Software Engineer", updatedAt: "Today", score: 78, atsScore: 84, color: "mint", history: [61, 66, 64, 72, 78] },
    { id: "maya-product", name: "Product_Engineer_v2.pdf", role: "Product Engineer", updatedAt: "Yesterday", score: 91, atsScore: 94, color: "lilac", history: [73, 76, 80, 86, 91] },
    { id: "maya-data", name: "Data_Analyst_2025.pdf", role: "Data Analyst", updatedAt: "Oct 8", score: 67, atsScore: 72, color: "peach", history: [58, 62, 59, 65, 67] },
  ],
  weeklyScores: [
    { day: "Mon", score: 62, ats: 68 }, { day: "Tue", score: 66, ats: 71 },
    { day: "Wed", score: 65, ats: 73 }, { day: "Thu", score: 71, ats: 77 },
    { day: "Fri", score: 74, ats: 79 }, { day: "Sat", score: 76, ats: 82 },
    { day: "Sun", score: 78, ats: 84 },
  ],
};

export const mockAnalysis: AnalysisResult = {
  score: 78,
  atsScore: 84,
  scoreLabel: "Good",
  categories: [
    { subject: "Grammar", score: 88, fullMark: 100 },
    { subject: "Readability", score: 82, fullMark: 100 },
    { subject: "Experience", score: 74, fullMark: 100 },
    { subject: "Projects", score: 66, fullMark: 100 },
    { subject: "Skills", score: 80, fullMark: 100 },
  ],
  issues: [
    { id: "issue-1", color: "keywords", severity: "High", section: "Experience · Product Engineer", original: "Improved performance across several services.", issue: "Add a measurable result", reason: "Hiring teams can better understand your impact when a result has a number or clear outcome.", suggestion: "Improved API response times by 38% across 6 customer-facing services." },
    { id: "issue-2", color: "grammar", severity: "Medium", section: "Summary", original: "I has a passion for building great products.", issue: "Subject and verb do not agree", reason: "A small grammar fix makes your introduction feel polished and confident.", suggestion: "I have a passion for building great products." },
    { id: "issue-3", color: "formatting", severity: "Low", section: "Education", original: "B.S. Computer Science | 2018", issue: "Date format is inconsistent", reason: "The rest of your resume uses full month names. A consistent date style is easier to scan.", suggestion: "Bachelor of Science in Computer Science · May 2018" },
    { id: "issue-4", color: "improvement", severity: "Medium", section: "Projects", original: "Built an internal dashboard for the team.", issue: "Add tools and purpose", reason: "Naming your tools and the people who used the dashboard helps show the scope of your work.", suggestion: "Built a React and TypeScript dashboard used by 24 support teammates to track customer escalations." },
  ],
  skills: {
    existing: ["TypeScript", "React", "Node.js", "PostgreSQL", "REST APIs", "AWS", "CI/CD"],
    missing: ["GraphQL", "Kubernetes", "System design"],
    recommended: ["Redis", "Terraform", "Observability"],
  },
  sections: [
    { name: "Contact details", present: true }, { name: "Professional summary", present: true },
    { name: "Work experience", present: true }, { name: "Education", present: true },
    { name: "Skills", present: true }, { name: "Projects", present: true },
    { name: "Certifications", present: false, suggestion: "Add relevant certificates or remove this section if you do not have any." },
  ],
  atsChecks: [
    { name: "Length", passed: true, detail: "2 pages · just right for your experience" },
    { name: "Fonts", passed: true, detail: "Standard, easy-to-read fonts" },
    { name: "Tables and columns", passed: true, detail: "No complex layouts detected" },
    { name: "Icons and graphics", passed: true, detail: "Your content is readable by screeners" },
    { name: "Section headings", passed: true, detail: "Familiar headings are easy to find" },
    { name: "File format", passed: true, detail: "PDF · supported format" },
  ],
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardData(): Promise<DashboardData> {
  await wait(180);
  return dashboard;
}

export async function analyzeResume(file?: File, category?: string): Promise<AnalysisResult> {
  await wait(800);
  if (!file || !category) return mockAnalysis;

  let resumeText = "";
  try {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = await Promise.all(
      Array.from({ length: document.numPages }, (_, index) => document.getPage(index + 1)),
    );
    const pageTexts = await Promise.all(
      pages.map(async (page) => {
        const content = await page.getTextContent();
        return content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
      }),
    );
    resumeText = pageTexts.join(" ");
  } catch {
    resumeText = "";
  }

  const { extractRoleFit, formatRoleCategory } = await import("@/lib/role-fit");
  const fit = extractRoleFit(resumeText, category);

  return {
    ...mockAnalysis,
    roleFit: fit
      ? {
          score: fit.score,
          coverage: fit.coverage,
          category: formatRoleCategory(category),
        }
      : undefined,
  };
}