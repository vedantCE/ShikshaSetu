export type AdditionProblem = {
  num1: number;
  num2: number;
};

export type AdditionLevel = {
  level: number;
  problems: AdditionProblem[];
};

export const ADDITION_LEVELS: AdditionLevel[] = [
  // Intro to minimal interaction
  { level: 1, problems: [{ num1: 1, num2: 1 }, { num1: 2, num2: 1 }] },
  // Bridging up to 5
  { level: 2, problems: [{ num1: 2, num2: 2 }, { num1: 3, num2: 1 }] },
  { level: 3, problems: [{ num1: 3, num2: 2 }, { num1: 4, num2: 1 }, { num1: 2, num2: 3 }] },
  // Up to 8
  { level: 4, problems: [{ num1: 4, num2: 2 }, { num1: 3, num2: 3 }] },
  { level: 5, problems: [{ num1: 4, num2: 4 }, { num1: 5, num2: 3 }, { num1: 6, num2: 1 }] },
  { level: 6, problems: [{ num1: 5, num2: 4 }, { num1: 6, num2: 2 }, { num1: 4, num2: 5 }] },
  // Nearing 10, introducing 3 problem sequences standard
  { level: 7, problems: [{ num1: 5, num2: 5 }, { num1: 6, num2: 3 }, { num1: 7, num2: 2 }] },
  { level: 8, problems: [{ num1: 6, num2: 4 }, { num1: 7, num2: 3 }, { num1: 8, num2: 2 }] },
  // Double digits ( > 9 )
  { level: 9, problems: [{ num1: 5, num2: 6 }, { num1: 7, num2: 4 }, { num1: 8, num2: 3 }] },
  { level: 10, problems: [{ num1: 6, num2: 6 }, { num1: 7, num2: 5 }, { num1: 8, num2: 4 }] },
];
