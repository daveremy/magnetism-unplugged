export interface AlloyIngredient {
  symbol: string;
  label: string;
  proportion: number;
  color: string;
}

export interface AlloyData {
  name: string;
  ingredients: AlloyIngredient[];
  magneticBehavior: "ferromagnetic" | "varies";
  note?: string;
}

export const alloys: Record<string, AlloyData> = {
  steel: {
    name: "Steel",
    ingredients: [
      { symbol: "Fe", label: "Iron", proportion: 0.98, color: "var(--north)" },
      { symbol: "C", label: "Carbon", proportion: 0.02, color: "var(--ink-faint)" },
    ],
    magneticBehavior: "ferromagnetic",
  },
  "stainless-steel": {
    name: "Stainless Steel",
    ingredients: [
      { symbol: "Fe", label: "Iron", proportion: 0.72, color: "var(--north)" },
      { symbol: "Cr", label: "Chromium", proportion: 0.18, color: "var(--caution)" },
      { symbol: "Ni", label: "Nickel", proportion: 0.10, color: "var(--south)" },
    ],
    magneticBehavior: "varies",
    note: "Depends on crystal structure — some grades are magnetic, others are not",
  },
  alnico: {
    name: "Alnico",
    ingredients: [
      { symbol: "Fe", label: "Iron", proportion: 0.50, color: "var(--north)" },
      { symbol: "Al", label: "Aluminum", proportion: 0.12, color: "var(--caution)" },
      { symbol: "Ni", label: "Nickel", proportion: 0.20, color: "var(--south)" },
      { symbol: "Co", label: "Cobalt", proportion: 0.18, color: "var(--experiment)" },
    ],
    magneticBehavior: "ferromagnetic",
    note: "Used in permanent magnets since the 1930s",
  },
  ndfeb: {
    name: "NdFeB (Neodymium)",
    ingredients: [
      { symbol: "Nd", label: "Neodymium", proportion: 0.27, color: "var(--experiment)" },
      { symbol: "Fe", label: "Iron", proportion: 0.68, color: "var(--north)" },
      { symbol: "B", label: "Boron", proportion: 0.05, color: "var(--caution)" },
    ],
    magneticBehavior: "ferromagnetic",
    note: "Strongest permanent magnets available today",
  },
};
