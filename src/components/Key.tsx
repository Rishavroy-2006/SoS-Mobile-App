import { motion } from 'motion/react';
import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useSettings } from '../hooks/useSettings';

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
  const { settings } = useSettings();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const longPressFiredRef = React.useRef(false);

  const handleTapStart = () => {
    longPressFiredRef.current = false;
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        longPressFiredRef.current = true;
        if (settings.haptics) {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
        }
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
      if (settings.haptics) {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      }
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
    number: 'bg-key-num text-key-num-text',
    operator: 'bg-primary text-white',
    modifier: 'bg-key-mod text-key-mod-text',
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
