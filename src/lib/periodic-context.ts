export interface PTCell {
  symbol: string;
  atomicNumber: number;
}

/** 5-cell strip of periodic table row neighbors: [left2, left1, self, right1, right2] */
export const periodicContext: Record<string, PTCell[]> = {
  // Period 1 row elements — pad with empty cells where neighbors don't exist
  B: [
    // Row 2: B is at position 13 in the p-block; neighbors Li, Be, B, C, N
    { symbol: "Li", atomicNumber: 3 },
    { symbol: "Be", atomicNumber: 4 },
    { symbol: "B", atomicNumber: 5 },
    { symbol: "C", atomicNumber: 6 },
    { symbol: "N", atomicNumber: 7 },
  ],
  C: [
    { symbol: "Be", atomicNumber: 4 },
    { symbol: "B", atomicNumber: 5 },
    { symbol: "C", atomicNumber: 6 },
    { symbol: "N", atomicNumber: 7 },
    { symbol: "O", atomicNumber: 8 },
  ],
  O: [
    { symbol: "C", atomicNumber: 6 },
    { symbol: "N", atomicNumber: 7 },
    { symbol: "O", atomicNumber: 8 },
    { symbol: "F", atomicNumber: 9 },
    { symbol: "Ne", atomicNumber: 10 },
  ],
  Al: [
    { symbol: "Na", atomicNumber: 11 },
    { symbol: "Mg", atomicNumber: 12 },
    { symbol: "Al", atomicNumber: 13 },
    { symbol: "Si", atomicNumber: 14 },
    { symbol: "P", atomicNumber: 15 },
  ],
  Cr: [
    { symbol: "Ti", atomicNumber: 22 },
    { symbol: "V", atomicNumber: 23 },
    { symbol: "Cr", atomicNumber: 24 },
    { symbol: "Mn", atomicNumber: 25 },
    { symbol: "Fe", atomicNumber: 26 },
  ],
  Mn: [
    { symbol: "V", atomicNumber: 23 },
    { symbol: "Cr", atomicNumber: 24 },
    { symbol: "Mn", atomicNumber: 25 },
    { symbol: "Fe", atomicNumber: 26 },
    { symbol: "Co", atomicNumber: 27 },
  ],
  Fe: [
    { symbol: "Cr", atomicNumber: 24 },
    { symbol: "Mn", atomicNumber: 25 },
    { symbol: "Fe", atomicNumber: 26 },
    { symbol: "Co", atomicNumber: 27 },
    { symbol: "Ni", atomicNumber: 28 },
  ],
  Co: [
    { symbol: "Mn", atomicNumber: 25 },
    { symbol: "Fe", atomicNumber: 26 },
    { symbol: "Co", atomicNumber: 27 },
    { symbol: "Ni", atomicNumber: 28 },
    { symbol: "Cu", atomicNumber: 29 },
  ],
  Ni: [
    { symbol: "Fe", atomicNumber: 26 },
    { symbol: "Co", atomicNumber: 27 },
    { symbol: "Ni", atomicNumber: 28 },
    { symbol: "Cu", atomicNumber: 29 },
    { symbol: "Zn", atomicNumber: 30 },
  ],
  Cu: [
    { symbol: "Co", atomicNumber: 27 },
    { symbol: "Ni", atomicNumber: 28 },
    { symbol: "Cu", atomicNumber: 29 },
    { symbol: "Zn", atomicNumber: 30 },
    { symbol: "Ga", atomicNumber: 31 },
  ],
  Nd: [
    { symbol: "Ce", atomicNumber: 58 },
    { symbol: "Pr", atomicNumber: 59 },
    { symbol: "Nd", atomicNumber: 60 },
    { symbol: "Pm", atomicNumber: 61 },
    { symbol: "Sm", atomicNumber: 62 },
  ],
  Gd: [
    { symbol: "Sm", atomicNumber: 62 },
    { symbol: "Eu", atomicNumber: 63 },
    { symbol: "Gd", atomicNumber: 64 },
    { symbol: "Tb", atomicNumber: 65 },
    { symbol: "Dy", atomicNumber: 66 },
  ],
  Pt: [
    { symbol: "Os", atomicNumber: 76 },
    { symbol: "Ir", atomicNumber: 77 },
    { symbol: "Pt", atomicNumber: 78 },
    { symbol: "Au", atomicNumber: 79 },
    { symbol: "Hg", atomicNumber: 80 },
  ],
  Bi: [
    { symbol: "Tl", atomicNumber: 81 },
    { symbol: "Pb", atomicNumber: 82 },
    { symbol: "Bi", atomicNumber: 83 },
    { symbol: "Po", atomicNumber: 84 },
    { symbol: "At", atomicNumber: 85 },
  ],
};
