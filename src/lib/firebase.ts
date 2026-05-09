import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

function requireEnv(key: string) {
  const value = import.meta.env[key as keyof ImportMetaEnv] as
    | string
    | undefined;
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv("VITE_FIREBASE_API_KEY"),
  authDomain: requireEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("VITE_FIREBASE_APP_ID"),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface SOSAlertPayload {
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  status: "active" | "responding" | "resolved";
  transcript?: string;
  address?: string;
  evidenceImages?: string[];
  lastImageCapturedAt?: any;
  batteryLevel?: number;
  isCharging?: boolean;
  networkType?: string;
}

export async function sendSOSAlert(alert: SOSAlertPayload) {
  const docRef = await addDoc(collection(db, "alerts"), {
    ...alert,
    transcript: alert.transcript ?? "",
    evidenceImages: alert.evidenceImages ?? [],
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateSOSLocation(
  alertId: string,
  latitude: number,
  longitude: number,
) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, { latitude, longitude });
}

export async function updateSOSTranscript(alertId: string, transcript: string) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, { transcript });
}

export async function updateSOSAddress(alertId: string, address: string) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, { address });
}

export async function updateSOSEvidenceImages(
  alertId: string,
  evidenceImages: string[],
) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, {
    evidenceImages,
    lastImageCapturedAt: Timestamp.now(),
  });
}

export async function updateSOSTelemetry(
  alertId: string,
  batteryLevel: number,
  isCharging: boolean,
  networkType: string,
) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, { batteryLevel, isCharging, networkType });
}

export async function updateSOSStatus(
  alertId: string,
  status: "active" | "responding" | "resolved",
) {
  const alertRef = doc(db, "alerts", alertId);
  await updateDoc(alertRef, { status });
}
