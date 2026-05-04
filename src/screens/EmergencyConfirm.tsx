import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  MapPin,
  Mic,
  Phone,
  LockOpen,
  Megaphone,
  EyeOff,
  X,
  Clock,
  Timer as TimerIcon,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Geolocation } from "@capacitor/geolocation";

interface EmergencyConfirmProps {
  onCancel: () => void;
  onEnableStealth: () => void;
}

const EmergencyConfirm: React.FC<EmergencyConfirmProps> = ({
  onCancel,
  onEnableStealth,
}) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationLink, setLocationLink] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendAlert = async () => {
      try {
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "user_active_1",
            coords: { latitude: 34.0522, longitude: -118.2437 },
            timestamp: new Date().toISOString(),
            type: "PANIC_TRIGGER",
          }),
        });
      } catch (e) {
        console.error("Failed to send alert", e);
      }
    };
    sendAlert();
  }, []);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setTimeout(
        () => setTimeRemaining(timeRemaining - 1),
        1000,
      );
    } else if (timeRemaining === 0) {
      // Trigger the alert!
      setTimeRemaining(null);
      setTimerDuration(null);
      alert("Safety Check-in Timer expired! Alerting contacts...");
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
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleShareLocation = async () => {
    setIsLocationModalOpen(true);
    setIsFetchingLocation(true);
    setLocationLink(null);
    try {
      let permissions = await Geolocation.checkPermissions();
      if (permissions.location !== "granted") {
        permissions = await Geolocation.requestPermissions();
      }

      if (permissions.location !== "granted") {
        alert("Location permission is required to share your live location.");
        setIsLocationModalOpen(false);
        setIsFetchingLocation(false);
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const link = `https://www.google.com/maps?q=${lat},${lng}`;
      setLocationLink(link);
    } catch (e) {
      console.error("Error fetching location", e);
      alert(
        "Failed to fetch location. Please ensure location services are enabled.",
      );
      setIsLocationModalOpen(false);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleCopyLink = () => {
    if (locationLink) {
      navigator.clipboard.writeText(locationLink);
      alert("Link copied to clipboard");
    }
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
          <span className="text-error text-[10px] font-bold uppercase tracking-wider">
            Emergency Mode Active
          </span>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <ActionCard
            icon={
              timeRemaining !== null ? (
                <TimerIcon
                  className="fill-primary text-primary animate-pulse"
                  size={36}
                />
              ) : (
                <Megaphone className="fill-primary text-primary" size={36} />
              )
            }
            label={
              timeRemaining !== null
                ? `Timer: ${formatTime(timeRemaining)}`
                : "Alert Contacts"
            }
            onClick={
              timeRemaining !== null
                ? handleCancelTimer
                : () => setIsAlertModalOpen(true)
            }
          />
          <ActionCard
            icon={<MapPin className="fill-primary text-primary" size={36} />}
            label="Share Location"
            onClick={handleShareLocation}
          />
          <ActionCard
            icon={<Mic className="fill-error text-error" size={36} />}
            label="Record Audio"
          />
          <ActionCard
            icon={
              <ShieldAlert className="fill-primary text-primary" size={36} />
            }
            label="Call Services"
          />
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
          Activates all safety features and returns to calculator. Re-enter code
          to deactivate.
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

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-x-0 bottom-0 bg-[#1f1f21] rounded-t-3xl p-6 z-50 border-t border-zinc-800 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Live Location Link
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {isFetchingLocation ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-zinc-400 text-sm">
                  Getting exact location...
                </p>
              </div>
            ) : locationLink ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Your location link is ready. You can copy it or open it
                  directly. Currently, you can manually share this link. Later,
                  it will be automatically sent to your trusted contacts.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-primary text-[#131315] font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    <ExternalLink size={20} />
                    Open in Maps
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-4 bg-zinc-800 border border-zinc-700 text-white font-medium rounded-2xl flex justify-center items-center gap-2 hover:bg-zinc-700 active:scale-[0.98] transition-all"
                  >
                    <Copy size={20} />
                    Copy Link
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={() => {
                alert("Alerting contacts now!");
                setIsAlertModalOpen(false);
              }}
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
              Set a timer. If you don't cancel it before it expires, your
              emergency contacts will be alerted with your last known location
              automatically.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[5, 15, 30].map((mins) => (
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

const ActionCard = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-zinc-900/40 border-b border border-zinc-800 hover:bg-zinc-800/60 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 w-full"
  >
    {icon}
    <span className="text-[11px] font-semibold text-zinc-300">{label}</span>
  </button>
);

export default EmergencyConfirm;
