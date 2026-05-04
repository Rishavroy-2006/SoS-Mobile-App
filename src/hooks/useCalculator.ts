import { useState, useCallback, useEffect } from 'react';
import { calculate, Operation, CalculatorState, formatValue } from '../lib/calculator';

const getInitialHistory = (): string[] => {
  try {
    const saved = localStorage.getItem('calculatorHistory');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    displayValue: '0',
    expression: '',
    operator: null,
    waitingForOperand: false,
    history: getInitialHistory(),
  });

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(state.history));
  }, [state.history]);

  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      const newValue = prev.waitingForOperand ? digit : (prev.displayValue === '0' ? digit : prev.displayValue + digit);
      return {
        ...prev,
        displayValue: newValue,
        waitingForOperand: false,
      };
    });
  }, []);

  const inputDot = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) return { ...prev, displayValue: '0.', waitingForOperand: false };
      if (!prev.displayValue.includes('.')) return { ...prev, displayValue: prev.displayValue + '.' };
      return prev;
    });
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: '0',
      expression: '',
      operator: null,
      waitingForOperand: false,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
    }));
  }, []);

  const selectOperator = useCallback((nextOp: Operation) => {
    setState(prev => {
      const operand = parseFloat(prev.displayValue);
      
      if (prev.operator && !prev.waitingForOperand) {
        const result = calculate(parseFloat(prev.expression.split(' ')[0]), operand, prev.operator);
        return {
          ...prev,
          displayValue: String(result),
          expression: `${result} ${nextOp}`,
          operator: nextOp,
          waitingForOperand: true,
        };
      }

      return {
        ...prev,
        expression: `${operand} ${nextOp}`,
        operator: nextOp,
        waitingForOperand: true,
      };
    });
  }, []);

  const performCalculation = useCallback(() => {
    setState(prev => {
      if (!prev.operator) return prev;
      const operand = parseFloat(prev.displayValue);
      const prevOperand = parseFloat(prev.expression.split(' ')[0]);
      const result = calculate(prevOperand, operand, prev.operator);
      
      return {
        ...prev,
        displayValue: String(result),
        expression: '',
        operator: null,
        waitingForOperand: true,
        history: [...prev.history, `${prevOperand} ${prev.operator} ${operand} = ${result}`]
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: String(parseFloat(prev.displayValue) * -1)
    }));
  }, []);

  const deleteLastDigit = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: prev.displayValue.length > 1 ? prev.displayValue.slice(0, -1) : '0'
    }));
  }, []);

  return {
    ...state,
    inputDigit,
    inputDot,
    deleteLastDigit,
    clearAll,
    clearHistory,
    selectOperator,
    performCalculation,
    toggleSign,
    formattedValue: formatValue(state.displayValue)
  };
}
