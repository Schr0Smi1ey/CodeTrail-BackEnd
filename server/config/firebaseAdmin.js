import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function normalizePrivateKey(privateKey = "") {
  return privateKey.replace(/\\n/g, "\n");
}

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return {
      projectId: serviceAccount.project_id || serviceAccount.projectId,
      clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
      privateKey: normalizePrivateKey(serviceAccount.private_key || serviceAccount.privateKey),
    };
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    };
  }

  return null;
}

export function getFirebaseAuth() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is required");
  }

  if (!getApps().length) {
    const serviceAccount = getServiceAccount();
    const appOptions = { projectId: process.env.FIREBASE_PROJECT_ID };

    if (serviceAccount) {
      appOptions.credential = cert(serviceAccount);
    }

    initializeApp(appOptions);
  }

  return getAuth();
}
