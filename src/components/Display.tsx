import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'motion/react';

export const Display: React.FC<{ 
  value: string; 
  expression: string; 
  onDelete: () => void;
  isEmergencyActive?: boolean;
}> = ({ 
  value, 
  expression, 
  onDelete,
  isEmergencyActive 
}) => {
  return (
    <div className="flex flex-col items-end justify-end px-8 py-4 w-full mb-2">
      <div className="text-on-surface-variant/70 text-sm font-light mb-1 h-5">
        {expression}
      </div>
      <div className="relative flex items-center justify-end w-full">
        <h1 className="text-white text-5xl md:text-6xl font-light tracking-tight truncate max-w-full">
          {value}
        </h1>
        <div className="ml-4 flex flex-col items-center justify-center relative">
          {isEmergencyActive && (
            <div className="absolute -top-3 w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_8px_theme('colors.error')]" />
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-2 text-primary hover:bg-white/5 rounded-full transition-colors shrink-0"
          >
            <Delete size={28} />
          </motion.button>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white/10 mt-4" />
    </div>
  );
};
