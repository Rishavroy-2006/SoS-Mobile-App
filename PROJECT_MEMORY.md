# Project Memory: Disguised Emergency App

## Core Concept
This application is a **stealth personal safety and emergency alert system** disguised entirely as an everyday Calculator app. The goal is to provide users in potentially dangerous or coercive situations a way to access help, record audio, and share their location without alerting their attacker or abuser.

If anyone glances at the phone or forces the user to hand it over, it looks and functions safely as a standard, harmless calculator.

## Activation Mechanisms (Stealth -> Emergency Mode)
Accessing the hidden emergency features is currently triggered from the `CalculatorScreen` via the `=` button:
1. **Secret PIN Code:** Entering a preset pin code (e.g., `9119`) and then hitting `=`.
2. **Long Press:** Doing a long press holding action on the `=` button.

When activated, the app transitions to `EmergencyConfirm` screen.
When stealth mode is active (during an active background emergency), the visual markers of the hidden app (such as the settings menu icon in the calculator screen) disappear, ensuring it functions strictly as a regular calculator to any observer.

## Tech Stack & Architecture
- **Frontend:** React 18, TypeScript, Vite.
- **Styling & UI:** Tailwind CSS, Framer Motion (`motion/react`) for fluid screen transition. Icons from `lucide-react`.
- **Interactions:** Custom `Key.tsx` component is used to manage `onTap` and `onTapStart` to facilitate quick interaction and long-press detections reliably on mobile touch screens.
- **Target Platform (Mobile):** The application is designed mobile-first. Because standard PWAs have strict limitations around background tasks (like background location or timers) and direct hardware intervention (sending SMS invisibly), the long-term target is to wrap this React application using **Capacitor**. Capacitor will provide access to native Android/iOS APIs.

## Feature Breakdown
* **CalculatorScreen (`src/screens/CalculatorScreen.tsx`):** The disguised UI. Intercepts key presses to calculate results, but secretly watches for the PIN code or long press. Hides the "Settings" route button if in an active emergency.
* **EmergencyConfirm (`src/screens/EmergencyConfirm.tsx`):** The real app dashboard. Includes quick actions for triggering alerts, fetching location, and recording audio.
  * **Safety Check-in Timer:** Users can set a countdown (e.g. 5, 15, or 30 minutes). If the user doesn't cancel the timer and it reaches 0, the app automatically triggers an emergency ping/alert.
* **SettingsScreen (`src/screens/SettingsScreen.tsx`):** Configures app parameters (PIN, Long Press toggle, etc.).
* **ContactsScreen (`src/screens/ContactsScreen.tsx`):** Manages emergency contacts that the app will ping when an alert is fired.

## Next Steps / Roadmap
- **Capacitor Integration:** To convert this generic web app into a robust mobile app, it will be packaged via Capacitor. This is needed to enable background location tracking constantly during an active emergency, background timers for the check-in feature, and silent SMS dispatch capabilities.
- **Real-Time Database (Firebase/Supabase):** Implement cloud syncing to silently post location vectors or audio blobs immediately off-device in case the physical device is destroyed.
