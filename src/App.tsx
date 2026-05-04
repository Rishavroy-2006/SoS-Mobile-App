import { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import CalculatorScreen from './screens/CalculatorScreen';
import EmergencyConfirm from './screens/EmergencyConfirm';
import SettingsScreen from './screens/SettingsScreen';
import ContactsScreen from './screens/ContactsScreen';
import { AnimatePresence, motion } from 'motion/react';
import { useSettings } from './hooks/useSettings';

type Screen = 'calculator' | 'emergency' | 'settings' | 'contacts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('calculator');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [lastBackPress, setLastBackPress] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // system
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  useEffect(() => {
    const handleBackButton = () => {
      if (currentScreen === 'contacts') {
        setCurrentScreen('settings');
      } else if (currentScreen === 'settings') {
        setCurrentScreen('calculator');
      } else if (currentScreen === 'emergency') {
        setCurrentScreen('calculator');
        setIsEmergencyActive(false);
      } else if (currentScreen === 'calculator') {
        const timeNow = new Date().getTime();
        if (timeNow - lastBackPress < 2000) {
          CapacitorApp.exitApp();
        } else {
          setLastBackPress(timeNow);
          // Optional: toast here "Press back again to exit"
        }
      }
    };

    const listener = CapacitorApp.addListener('backButton', handleBackButton);
    return () => {
      listener.then(l => l.remove());
    };
  }, [currentScreen, lastBackPress]);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handlePanic = () => {
    setIsEmergencyActive(true);
    navigateTo('emergency');
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    navigateTo('calculator');
  };

  return (
    <div className="h-[100dvh] w-screen bg-background overflow-hidden text-on-surface">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          className="h-full w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentScreen === 'calculator' && (
            <CalculatorScreen 
              isEmergencyActive={isEmergencyActive}
              onPanic={handlePanic} 
              onCancelEmergency={cancelEmergency}
              onNavigateSettings={() => navigateTo('settings')}
            />
          )}
          {currentScreen === 'emergency' && (
            <EmergencyConfirm 
              onCancel={cancelEmergency} 
              onEnableStealth={() => navigateTo('calculator')} 
            />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen 
              onBack={() => navigateTo('calculator')} 
              onNavigateContacts={() => navigateTo('contacts')}
            />
          )}
          {currentScreen === 'contacts' && (
            <ContactsScreen onBack={() => navigateTo('settings')} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

