import { useState, useEffect } from 'react';

export interface AppSettings {
  secretCode: string;
  longPress: boolean;
  locationPrivacy: boolean;
  silentLocation: boolean;
  autoVoice: boolean;
  policeDispatch: boolean;
  theme: 'system' | 'light' | 'dark';
  haptics: boolean;
}

const defaultSettings: AppSettings = {
  secretCode: '9119',
  longPress: true,
  locationPrivacy: false,
  silentLocation: false,
  autoVoice: true,
  policeDispatch: false,
  theme: 'system',
  haptics: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('appSettingsChanged'));
  }, [settings]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
          setSettings((prev) => {
            const next = { ...defaultSettings, ...JSON.parse(saved) };
            if (JSON.stringify(prev) !== JSON.stringify(next)) {
              return next;
            }
            return prev;
          });
        }
      } catch {}
    };

    window.addEventListener('appSettingsChanged', handleStorageChange);
    return () => window.removeEventListener('appSettingsChanged', handleStorageChange);
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const eraseAllData = () => {
    localStorage.clear();
    setSettings(defaultSettings);
    // You might want to also clear contacts from localStorage if they aren't already
    // but the contacts are currently just hardcoded in state, let's fix that too if needed.
    // For now, this clears all localStorage.
    window.location.reload(); // Quick way to reset all states that might read from local storage
  };

  return { settings, updateSetting, eraseAllData };
}
