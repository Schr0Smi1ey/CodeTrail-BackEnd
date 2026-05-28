import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export function getFirebaseAuth() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is required");
  }

  if (!getApps().length) {
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  return getAuth();
}
