import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC72k7ZhlWobsJ3zJcC2YkOhYfoQBQH89o",
  authDomain: "sossystem12.firebaseapp.com",
  projectId: "sossystem12",
  storageBucket: "sossystem12.firebasestorage.app",
  messagingSenderId: "304688779313",
  appId: "1:304688779313:web:159be4892c6ca852f44510",
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
