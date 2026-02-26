const STORAGE_KEY = "magnetism-unplugged-progress";

export interface Progress {
  completedModules: string[];
  quizScores: Record<string, number>;
}

function getDefaultProgress(): Progress {
  return { completedModules: [], quizScores: {} };
}

function isValidProgress(value: unknown): value is Progress {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    Array.isArray(obj.completedModules) &&
    obj.completedModules.every((item) => typeof item === "string") &&
    typeof obj.quizScores === "object" &&
    obj.quizScores !== null &&
    !Array.isArray(obj.quizScores) &&
    Object.values(obj.quizScores as Record<string, unknown>).every(
      (v) => typeof v === "number",
    )
  );
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return getDefaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed: unknown = JSON.parse(raw);
    return isValidProgress(parsed) ? parsed : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Fail silently — quota exceeded, private browsing, etc.
  }
}

export function markModuleComplete(slug: string): void {
  const progress = loadProgress();
  if (!progress.completedModules.includes(slug)) {
    progress.completedModules.push(slug);
    saveProgress(progress);
  }
}

export function saveQuizScore(moduleSlug: string, score: number): void {
  const progress = loadProgress();
  progress.quizScores[moduleSlug] = score;
  saveProgress(progress);
}

export function isModuleComplete(slug: string): boolean {
  return loadProgress().completedModules.includes(slug);
}
