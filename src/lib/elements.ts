export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  unpairedElectrons: number;
  magneticBehavior: "ferromagnetic" | "paramagnetic" | "diamagnetic";
  note?: string;
}

export const elements: Record<string, ElementData> = {
  Fe: {
    symbol: "Fe",
    name: "Iron",
    atomicNumber: 26,
    unpairedElectrons: 4,
    magneticBehavior: "ferromagnetic",
  },
  Al: {
    symbol: "Al",
    name: "Aluminum",
    atomicNumber: 13,
    unpairedElectrons: 1,
    magneticBehavior: "paramagnetic",
  },
  Ni: {
    symbol: "Ni",
    name: "Nickel",
    atomicNumber: 28,
    unpairedElectrons: 2,
    magneticBehavior: "ferromagnetic",
  },
  Co: {
    symbol: "Co",
    name: "Cobalt",
    atomicNumber: 27,
    unpairedElectrons: 3,
    magneticBehavior: "ferromagnetic",
  },
  Cu: {
    symbol: "Cu",
    name: "Copper",
    atomicNumber: 29,
    unpairedElectrons: 0,
    magneticBehavior: "diamagnetic",
  },
  Cr: {
    symbol: "Cr",
    name: "Chromium",
    atomicNumber: 24,
    unpairedElectrons: 6,
    magneticBehavior: "paramagnetic",
    note: "Anti-ferromagnetic — neighbors anti-align, cancelling out",
  },
  Mn: {
    symbol: "Mn",
    name: "Manganese",
    atomicNumber: 25,
    unpairedElectrons: 5,
    magneticBehavior: "paramagnetic",
    note: "Five unpaired electrons, but neighbors anti-align",
  },
  Gd: {
    symbol: "Gd",
    name: "Gadolinium",
    atomicNumber: 64,
    unpairedElectrons: 7,
    magneticBehavior: "ferromagnetic",
    note: "Only below ~20 °C (68 °F)",
  },
  Pt: {
    symbol: "Pt",
    name: "Platinum",
    atomicNumber: 78,
    unpairedElectrons: 2,
    magneticBehavior: "paramagnetic",
  },
  Bi: {
    symbol: "Bi",
    name: "Bismuth",
    atomicNumber: 83,
    unpairedElectrons: 0,
    magneticBehavior: "diamagnetic",
    note: "Strongly diamagnetic — can levitate small magnets",
  },
  B: {
    symbol: "B",
    name: "Boron",
    atomicNumber: 5,
    unpairedElectrons: 1,
    magneticBehavior: "diamagnetic",
  },
  Nd: {
    symbol: "Nd",
    name: "Neodymium",
    atomicNumber: 60,
    unpairedElectrons: 4,
    magneticBehavior: "paramagnetic",
    note: "Paramagnetic alone, but ferromagnetic in NdFeB alloys",
  },
  O: {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    unpairedElectrons: 2,
    magneticBehavior: "paramagnetic",
    note: "Liquid oxygen is visibly attracted to magnets",
  },
  C: {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    unpairedElectrons: 2,
    magneticBehavior: "diamagnetic",
    note: "Diamagnetic in solid forms (graphite, diamond)",
  },
};
