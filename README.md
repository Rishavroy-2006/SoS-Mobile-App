# 🧮 Stealth Calculator (Emergency SOS)

Hey everyone! 👋 Thanks for checking out this project. 

At first glance, this is just a simple, nicely designed Calculator app. But under the hood, it's actually a **stealth personal safety and emergency alert system**. 

I built this for individuals in potentially dangerous, coercive, or abusive situations who might need a way to access help, record audio, or share their location *without* alerting an attacker. If someone glances at the phone or demands to look at it, it just looks and functions like a harmless, everyday calculator.

## ✨ Features

- **The Disguise (Fully Functional Calculator):** Does exactly what you'd expect. Adds, subtracts, multiplies, and divides. No suspicious UI elements.
- **Stealth Activation:** Two ways to secretly trigger the hidden emergency dashboard:
  - Enter a secret **PIN Code** (defaults to `9119`) and tap `=`.
  - **Long-press** the `=` button.
- **Emergency Dashboard:** Once unlocked, you get access to:
  - 🚨 **One-tap SOS:** Instantly ping pre-set emergency contacts.
  - 📍 **Location Sharing:** Fetch and share your exact whereabouts.
  - 🎙️ **Secret Audio Recording:** Capture evidence discreetly.
  - ⏱️ **Safety Check-in Timer:** A dead-man's switch. Set a timer (e.g., 15 mins for a walk home). If you don't safely cancel it before time's up, it automatically triggers an alert with your location to your contacts.
- **Ghost Mode:** If an emergency alert is actively running in the background, the app strips away even the subtlest hints of its true nature and locks firmly into calculator mode so it can't be tampered with.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Framer Motion (for fluid, non-suspicious transitions), Lucide React (icons)
- **Mobile Packaging:** Capacitor (for compiling the React app into a native mobile app and securely accessing device hardware like background location/SMS).

## 🚀 Running it Locally

If you want to poke around the web version, it's super easy to spin up:

```bash
# Clone the repo
git clone <your-repo-url>
cd stealth-calculator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## 📱 Building the Android App

Because standard websites (PWAs) have strict browser security limitations (you can't reliably track location in the background or send invisible SMS messages from a regular website), this project uses **Capacitor** to bridge the web code to native Android APIs. 

To get the actual `.apk` for your phone:

1. Make sure you have [Android Studio](https://developer.android.com/studio) installed on your computer.
2. Build the web version of the project first:
   ```bash
   npm run build
   ```
3. Sync the web assets to the Android Capacitor project:
   ```bash
   npx cap sync android
   ```
4. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
5. From Android Studio, connect your phone via USB and hit the **"Play"** button to install it directly to your device! Alternatively, you can go to `Build > Build Bundle(s) / APK(s) > Build APK(s)` in the top menu to generate an APK file that you can send to yourself.

## 🤝 Contributing

If you have ideas on how to make the stealth features better, improve the Capacitor native bridges (especially for iOS features!), or optimize the background tasks, PRs are incredibly welcome. Let's build something that can actually help people.

---
*Disclaimer: This is an open-source project provided "as-is". While built with safety in mind, please thoroughly test it on your own device before relying on it in a high-stress or life-threatening situation.*
