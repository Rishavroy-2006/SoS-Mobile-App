import React, { useState } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useSettings } from '../hooks/useSettings';
import { Display } from '../components/Display';
import { Key } from '../components/Key';
import { Menu, History, X, Trash2 } from 'lucide-react';

interface CalculatorScreenProps {
  isEmergencyActive: boolean;
  onPanic: () => void;
  onCancelEmergency: () => void;
  onNavigateSettings: () => void;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ isEmergencyActive, onPanic, onCancelEmergency, onNavigateSettings }) => {
  const calc = useCalculator();
  const { settings } = useSettings();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleEqualClick = () => {
    if (calc.displayValue === settings.secretCode) {
      if (isEmergencyActive) {
        onCancelEmergency();
        calc.clearAll();
      } else {
        onPanic();
        calc.clearAll();
      }
    } else {
      calc.performCalculation();
    }
  };

  const handleEqualLongPress = () => {
    if (settings.longPress && !isEmergencyActive) {
       onPanic();
       calc.clearAll();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden bg-background">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 pt-8 shrink-0 z-10">
        <button 
          onClick={isEmergencyActive ? undefined : onNavigateSettings} 
          className={`p-2 -ml-2 rounded-full transition-colors relative z-10 ${isEmergencyActive ? 'opacity-0 pointer-events-none' : 'text-zinc-500 hover:bg-white/5'}`}
        >
          <Menu size={22} />
        </button>
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
          className={`p-2 -mr-2 rounded-full transition-colors relative z-10 ${isHistoryOpen ? 'text-primary bg-primary/10' : 'text-primary hover:bg-white/5'}`}
        >
          {isHistoryOpen ? <X size={22} /> : <History size={22} />}
        </button>
      </header>

      {/* History Overlay */}
      {isHistoryOpen && (
        <div className="absolute inset-0 top-[80px] bg-background z-20 flex flex-col px-6 pb-6">
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4">
            {calc.history.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                No History
              </div>
            ) : (
              calc.history.map((entry, index) => {
                const [expression, result] = entry.split(' = ');
                return (
                  <div key={index} className="flex flex-col items-end gap-1 mb-4 border-b border-[#2a2a2c] pb-4 last:border-0">
                    <div className="text-zinc-400 text-sm">{expression} =</div>
                    <div className="text-2xl text-white font-medium">{result}</div>
                  </div>
                );
              })
            )}
          </div>
          {calc.history.length > 0 && (
            <button 
              onClick={calc.clearHistory}
              className="mt-auto mx-auto p-4 text-zinc-500 hover:text-error transition-colors rounded-full hover:bg-error/10"
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>
      )}

      {/* Main UI */}
      <div className={`flex-1 flex flex-col justify-end min-h-0 pb-4 ${isHistoryOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex-1 overflow-y-auto flex flex-col justify-end">
          <Display 
            value={calc.formattedValue} 
            expression={calc.expression || calc.history[calc.history.length - 1]?.split(' = ')[0] || ''} 
            onDelete={calc.deleteLastDigit} 
            isEmergencyActive={isEmergencyActive}
          />
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-4 px-6 pt-2 shrink-0">
          <Key label="AC" type="modifier" onClick={calc.clearAll} />
          <Key label="+/-" type="modifier" onClick={calc.toggleSign} />
          <Key label="%" type="modifier" onClick={() => calc.selectOperator('%')} />
          <Key label="÷" type="operator" onClick={() => calc.selectOperator('÷')} />

          <Key label="7" onClick={() => calc.inputDigit('7')} />
          <Key label="8" onClick={() => calc.inputDigit('8')} />
          <Key label="9" onClick={() => calc.inputDigit('9')} />
          <Key label="×" type="operator" onClick={() => calc.selectOperator('×')} />

          <Key label="4" onClick={() => calc.inputDigit('4')} />
          <Key label="5" onClick={() => calc.inputDigit('5')} />
          <Key label="6" onClick={() => calc.inputDigit('6')} />
          <Key label="-" type="operator" onClick={() => calc.selectOperator('-')} />

          <Key label="1" onClick={() => calc.inputDigit('1')} />
          <Key label="2" onClick={() => calc.inputDigit('2')} />
          <Key label="3" onClick={() => calc.inputDigit('3')} />
          <Key label="+" type="operator" onClick={() => calc.selectOperator('+')} />

          <Key label="0" className="col-span-2 !aspect-auto rounded-[40px] !justify-start pl-8" onClick={() => calc.inputDigit('0')} />
          <Key label="." onClick={calc.inputDot} />
          <Key 
            label="=" 
            type="operator" 
            onClick={handleEqualClick} 
            onLongPress={handleEqualLongPress}
          />
        </div>
      </div>
    </div>
  );
};

export default CalculatorScreen;
