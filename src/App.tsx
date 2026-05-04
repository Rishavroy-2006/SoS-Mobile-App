import { useState } from 'react';
import CalculatorScreen from './screens/CalculatorScreen';
import EmergencyConfirm from './screens/EmergencyConfirm';
import SettingsScreen from './screens/SettingsScreen';
import ContactsScreen from './screens/ContactsScreen';
import { AnimatePresence, motion } from 'motion/react';

type Screen = 'calculator' | 'emergency' | 'settings' | 'contacts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('calculator');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

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

