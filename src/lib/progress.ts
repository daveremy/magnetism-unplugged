const STORAGE_KEY = "magnetism-unplugged-progress";

export interface Progress {
  completedModules: string[];
  quizScores: Record<string, number>;
}

function getDefaultProgress(): Progress {
  return { completedModules: [], quizScores: {} };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return getDefaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as Progress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
