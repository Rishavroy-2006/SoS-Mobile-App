export type Operation = '+' | '-' | '×' | '÷' | '%' | null;

export interface CalculatorState {
  displayValue: string;
  expression: string;
  operator: Operation;
  waitingForOperand: boolean;
  history: string[];
}

export const formatValue = (value: string): string => {
  const [int, dec] = value.split('.');
  const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt;
};

export const calculate = (n1: number, n2: number, op: Operation): number => {
  switch (op) {
    case '+': return n1 + n2;
    case '-': return n1 - n2;
    case '×': return n1 * n2;
    case '÷': return n2 !== 0 ? n1 / n2 : 0;
    case '%': return n1 % n2;
    default: return n2;
  }
};
