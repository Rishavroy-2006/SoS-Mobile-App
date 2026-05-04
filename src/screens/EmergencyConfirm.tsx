import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, Mic, Phone, LockOpen, Megaphone, EyeOff, X, Clock, Timer as TimerIcon } from 'lucide-react';

interface EmergencyConfirmProps {
  onCancel: () => void;
  onEnableStealth: () => void;
}

const EmergencyConfirm: React.FC<EmergencyConfirmProps> = ({ onCancel, onEnableStealth }) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Note: This initial alert might contradict the timer feature if it alerts immediately, 
    // but the system was already sending this on load. We will leave it as an initialization event,
    // or maybe the user wants the alert contacts to be a manual trigger now?
    // Let's keep it as is, but maybe this initial alert is a panic trigger, while "Alert contacts" is specifically for SMS.
    const sendAlert = async () => {
      try {
        await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user_active_1',
            coords: { latitude: 34.0522, longitude: -118.2437 },
            timestamp: new Date().toISOString(),
            type: 'PANIC_TRIGGER'
          })
        });
      } catch (e) {
        console.error("Failed to send alert", e);
      }
    };
    sendAlert();
  }, []);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timeRemaining === 0) {
      // Trigger the alert!
      setTimeRemaining(null);
      setTimerDuration(null);
      alert("Safety Check-in Timer expired! Alerting contacts...");
      // In a real app, this would send an SMS or API call
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining]);

  const handleStartTimer = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTimeRemaining(minutes * 60);
    setIsAlertModalOpen(false);
  };

  const handleCancelTimer = () => {
    setTimerDuration(null);
    setTimeRemaining(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-6 bg-[#131315] relative overflow-hidden text-on-surface">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-4"
      >
        {/* Active Status Badge */}
        <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur px-5 py-2 rounded-full border border-zinc-800 mb-16">
          <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-error text-[10px] font-bold uppercase tracking-wider">Emergency Mode Active</span>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <ActionCard 
            icon={timeRemaining !== null ? <TimerIcon className="fill-primary text-primary animate-pulse" size={36} /> : <Megaphone className="fill-primary text-primary" size={36} />} 
            label={timeRemaining !== null ? `Timer: ${formatTime(timeRemaining)}` : "Alert Contacts"} 
            onClick={timeRemaining !== null ? handleCancelTimer : () => setIsAlertModalOpen(true)}
          />
          <ActionCard icon={<MapPin className="fill-primary text-primary" size={36} />} label="Share Location" />
          <ActionCard icon={<Mic className="fill-error text-error" size={36} />} label="Record Audio" />
          <ActionCard icon={<ShieldAlert className="fill-primary text-primary" size={36} />} label="Call Services" />
        </div>

        {/* Big Stealth Button */}
        <button 
          onClick={onEnableStealth}
          className="w-full bg-[#93000a] hover:bg-error transition-colors p-6 rounded-2xl flex flex-col items-center justify-center gap-3 mb-6 shadow-2xl shadow-error/10 active:scale-95"
        >
          <div className="text-white font-bold flex items-center gap-3">
            <EyeOff size={24} />
            Silent Stealth Mode
          </div>
        </button>

        <p className="text-center text-xs text-zinc-500 px-2 mb-10 leading-relaxed opacity-60">
          Activates all safety features and returns to calculator. Re-enter code to deactivate.
        </p>

        <button 
          onClick={onCancel}
          className="w-full py-4 bg-zinc-900/50 rounded-full flex items-center justify-center gap-3 text-zinc-400 font-medium border border-zinc-800 hover:bg-zinc-800 transition-colors active:scale-95"
        >
          <LockOpen size={18} />
          Deactivate / Return
        </button>
      </motion.div>

      {/* Decorative pulse edge */}
      <div className="fixed inset-0 border-[3px] border-error/20 animate-pulse pointer-events-none" />

      {/* Alert Contacts Modal */}
      <AnimatePresence>
        {isAlertModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-x-0 bottom-0 bg-[#1f1f21] rounded-t-3xl p-6 z-50 border-t border-zinc-800 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert size={20} className="text-primary" />
                Alert Contacts
              </h3>
              <button 
                onClick={() => setIsAlertModalOpen(false)}
                className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <button 
              onClick={() => { alert("Alerting contacts now!"); setIsAlertModalOpen(false); }}
              className="w-full py-4 bg-error text-white font-bold rounded-2xl mb-6 flex justify-center items-center gap-2 hover:bg-error/90 active:scale-[0.98] transition-all"
            >
              <Megaphone size={20} className="fill-white" />
              Alert Now Location
            </button>

            <div className="mb-2 flex items-center gap-2 text-zinc-400 font-medium">
              <Clock size={16} />
              <span>Safety Check-in Timer</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Set a timer. If you don't cancel it before it expires, your emergency contacts will be alerted with your last known location automatically.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[5, 15, 30].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleStartTimer(mins)}
                  className="py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-primary font-bold hover:bg-zinc-700 transition-colors"
                >
                  {mins} min
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActionCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className="bg-zinc-900/40 border-b border border-zinc-800 hover:bg-zinc-800/60 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 w-full">
    {icon}
    <span className="text-[11px] font-semibold text-zinc-300">{label}</span>
  </button>
);

export default EmergencyConfirm;
