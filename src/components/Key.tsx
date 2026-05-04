import { motion } from 'motion/react';
import React from 'react';

interface KeyProps {
  label: string | React.ReactNode;
  type?: 'number' | 'operator' | 'modifier';
  onClick?: () => void;
  className?: string;
  onLongPress?: () => void;
}

export const Key: React.FC<KeyProps> = ({ 
  label, 
  type = 'number', 
  onClick, 
  className = '', 
  onLongPress 
}) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const longPressFiredRef = React.useRef(false);

  const handleTapStart = () => {
    longPressFiredRef.current = false;
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        longPressFiredRef.current = true;
        onLongPress();
      }, 1000);
    }
  };

  const handleTap = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!longPressFiredRef.current) {
      onClick?.();
    }
  };

  const handleTapCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    longPressFiredRef.current = true; // Prevent tap if they drag off the button
  };

  const bgColor = {
    number: 'bg-[#333333] text-white',
    operator: 'bg-[#FF9F0A] text-white',
    modifier: 'bg-[#A5A5A5] text-black',
  }[type];

  return (
    <motion.button
      whileTap={{ scale: 0.92, opacity: 0.8 }}
      onTapStart={handleTapStart}
      onTap={handleTap}
      onTapCancel={handleTapCancel}
      onContextMenu={(e) => e.preventDefault()}
      className={`
        aspect-square rounded-full flex items-center justify-center 
        text-2xl font-medium transition-colors cursor-pointer 
        ${bgColor} ${className}
      `}
    >
      {label}
    </motion.button>
  );
};
