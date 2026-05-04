import React, { useState, useEffect } from 'react';
import { ChevronLeft, Key, Users, MapPinOff, Star, Trash2, Pointer, ShieldAlert, Mic, ChevronRight, X, Check, Palette, Vibrate } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings, AppSettings } from '../hooks/useSettings';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateContacts: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigateContacts }) => {
  const { settings, updateSetting, eraseAllData } = useSettings();
  const [editingCode, setEditingCode] = useState<'secret' | null>(null);
  const [tempCode, setTempCode] = useState('');
  const [contactsCount, setContactsCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('appContacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setContactsCount(parsed.length);
      } else {
        setContactsCount(3); // Default from ContactsScreen
      }
    } catch {
      setContactsCount(0);
    }
  }, []);

  const handleEditCode = (type: 'secret') => {
    setEditingCode(type);
    setTempCode(settings.secretCode);
  };

  const handleSaveCode = () => {
    if (tempCode.length >= 4) {
      updateSetting('secretCode', tempCode);
      setEditingCode(null);
    }
  };

  const toggle = <K extends keyof AppSettings>(key: K) => {
    if (typeof settings[key] === 'boolean') {
      updateSetting(key, !settings[key] as any);
    }
  };

  const cycleTheme = () => {
    const next: Record<string, 'system' | 'light' | 'dark'> = {
      system: 'dark',
      dark: 'light',
      light: 'system'
    };
    updateSetting('theme', next[settings.theme]);
  };

  const themeDisplay = {
    system: 'System Default',
    light: 'Light',
    dark: 'Dark'
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background text-on-surface relative overflow-hidden">
      <header className="flex items-center gap-4 px-4 pt-12 pb-6 border-b border-outline">
        <button onClick={onBack} className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-lg flex-1 mr-8 text-center">Calculator</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-12 pt-6">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted text-[15px] mb-8">Configure the Safety Layer</p>
        
        <section className="mb-8">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 ml-2">General</h2>
          <div className="bg-surface rounded-2xl overflow-hidden">
            <SettingItem icon={<Palette size={20} />} label="App Theme" description="Match system or force dark/light" value={themeDisplay[settings.theme]} onClick={cycleTheme} />
            <ToggleItem icon={<Vibrate size={20} />} label="Haptic Feedback" description="Vibrate on calculator keys" active={settings.haptics} onToggle={() => toggle('haptics')} border={false} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 ml-2">General Security</h2>
          <div className="bg-surface rounded-2xl overflow-hidden">
            <SettingItem icon={<Key size={20} />} label="Secret Code" description="Change numeric PIN" value={'* '.repeat(settings.secretCode.length).trim()} onClick={() => handleEditCode('secret')} />
            <ToggleItem icon={<Pointer size={20} />} label="Long-press Activation" description="Hold equals to open" active={settings.longPress} onToggle={() => toggle('longPress')} />
            <ToggleItem icon={<MapPinOff size={20} />} label="Location Privacy" description="Mock location in background" active={settings.locationPrivacy} onToggle={() => toggle('locationPrivacy')} />
            <SettingItem icon={<Users size={20} />} label="Trusted Contacts" description="Manage emergency contacts" value={`${contactsCount} Contacts`} onClick={onNavigateContacts} border={false} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 ml-2">Safety Gestures</h2>
          <div className="bg-surface rounded-2xl overflow-hidden">
            <ToggleItem icon={<ShieldAlert size={20} />} label="Silent Location Sharing" description="Share live location on shake" active={settings.silentLocation} onToggle={() => toggle('silentLocation')} />
            <ToggleItem icon={<Mic size={20} />} label="Automatic Voice Recording" description="Record audio on app open" active={settings.autoVoice} onToggle={() => toggle('autoVoice')} border={false} />
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between ml-2 mb-3">
            <h2 className="text-[11px] font-bold text-primary uppercase tracking-widest">Premium Services</h2>
            <Star size={16} className="text-primary fill-transparent mr-2" />
          </div>
          <div className="bg-surface border border-outline rounded-2xl overflow-hidden">
            <ToggleItem icon={<ShieldAlert size={20} className="text-error" />} label="Emergency Police Dispatch" description="Auto-dispatch on 911 PIN" active={settings.policeDispatch} onToggle={() => toggle('policeDispatch')} border={false} />
          </div>
        </section>

        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to erase all data? This cannot be undone.")) {
              eraseAllData();
            }
          }}
          className="w-full mt-6 py-[18px] bg-red-500/10 border border-error/20 rounded-3xl flex items-center justify-center gap-3 text-error font-medium transition-colors hover:bg-red-500/20 active:scale-[0.98]">
          <Trash2 size={20} />
          Erase All Data
        </button>
        
        <div className="mt-12 text-center pb-8">
          <p className="text-muted/60 text-[11px] font-medium">Version 2.4.1 (Build 890)</p>
          <p className="text-muted/80 text-[11px] mt-1">SafeCalc Core</p>
        </div>
      </div>

      {/* Code Edit Overlay */}
      <AnimatePresence>
        {editingCode && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 bg-background z-50 flex flex-col"
          >
            <header className="flex items-center gap-4 px-4 pt-12 pb-6 border-b border-outline">
              <button onClick={() => setEditingCode(null)} className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
              <span className="font-semibold text-lg flex-1 mr-8 text-center text-on-surface">
                Secret Code
              </span>
            </header>
            <div className="flex-1 px-6 py-10 flex flex-col items-center">
              <p className="text-muted text-center mb-10">
                Enter a new PIN to activate the hidden secure app.
              </p>
              
              <div className="w-full max-w-[280px]">
                <input 
                  type="text"
                  pattern="\d*"
                  maxLength={8}
                  value={tempCode}
                  onChange={(e) => setTempCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-surface border border-outline text-4xl tracking-[0.3em] text-center text-on-surface py-6 rounded-2xl focus:outline-none focus:border-primary font-mono transition-colors"
                  autoFocus
                />
              </div>

              <div className="mt-12 w-full max-w-[280px] flex flex-col gap-4">
                <button 
                  onClick={handleSaveCode}
                  disabled={tempCode.length < 4}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Check size={20} /> Save Code
                </button>
                <button 
                  onClick={() => setEditingCode(null)}
                  className="w-full py-4 bg-transparent border border-outline text-muted font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-surface transition-colors"
                >
                  <X size={20} /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingItem = ({ icon, label, value, onClick, description, border = true }: { icon: React.ReactNode, label: string, value?: string, description?: string, onClick: () => void, border?: boolean }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-4 px-5 ${border ? 'border-b border-outline' : ''} hover:bg-primary/5 transition-colors cursor-pointer group`}>
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="bg-outline p-2.5 rounded-full text-primary group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col flex-1 min-w-0 pr-4">
        <span className="font-medium text-[15px] truncate text-on-surface">{label}</span>
        {description && <span className="text-[12px] mt-[2px] text-muted truncate">{description}</span>}
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {value && <span className={value.includes('Contacts') || value === 'Clear Display' ? "text-[12px] whitespace-nowrap font-medium bg-outline px-3 py-1.5 rounded-full text-on-surface" : "text-[13px] whitespace-nowrap tracking-widest text-muted"}>{value}</span>}
      <ChevronRight size={18} className="text-muted/50 shrink-0" />
    </div>
  </div>
);

const ToggleItem = ({ icon, label, description, active, onToggle, border = true }: { icon: React.ReactNode, label: string, description: string, active: boolean, onToggle: () => void, border?: boolean }) => (
  <div onClick={onToggle} className={`flex items-center justify-between p-4 px-5 ${border ? 'border-b border-outline' : ''} hover:bg-primary/5 transition-colors cursor-pointer`}>
    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
      <div className="bg-outline p-2.5 rounded-full text-primary shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-medium text-[15px] truncate text-on-surface">{label}</span>
        <span className="text-[12px] mt-[2px] text-muted truncate">{description}</span>
      </div>
    </div>
    <button className={`w-12 h-[26px] shrink-0 rounded-full p-[2px] transition-colors ${active ? 'bg-primary' : 'bg-background border border-outline'}`}>
      <motion.div 
        layout
        className={`w-5 h-5 rounded-full ${active ? 'bg-white ml-auto shadow-sm' : 'bg-outline'}`}
      />
    </button>
  </div>
);

export default SettingsScreen;
