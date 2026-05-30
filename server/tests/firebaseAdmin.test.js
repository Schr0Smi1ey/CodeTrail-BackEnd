import { beforeEach, describe, expect, it, vi } from "vitest";

const cert = vi.fn((value) => ({ credential: value }));
const getApps = vi.fn(() => []);
const initializeApp = vi.fn();

vi.mock("firebase-admin/app", () => ({
  cert,
  getApps,
  initializeApp,
}));

vi.mock("firebase-admin/auth", () => ({
  getAuth: vi.fn(() => ({ verifyIdToken: vi.fn() })),
}));

describe("Firebase Admin config", () => {
  beforeEach(() => {
    vi.resetModules();
    cert.mockClear();
    getApps.mockClear();
    initializeApp.mockClear();
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
  });

  it("uses service account JSON when configured for hosted environments", async () => {
    process.env.FIREBASE_PROJECT_ID = "codetrail-karim";
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      project_id: "codetrail-karim",
      client_email: "firebase-adminsdk@example.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
    });
    const { getFirebaseAuth } = await import("../config/firebaseAdmin.js");

    getFirebaseAuth();

    expect(cert).toHaveBeenCalledWith({
      projectId: "codetrail-karim",
      clientEmail: "firebase-adminsdk@example.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n",
    });
    expect(initializeApp).toHaveBeenCalledWith({
      credential: { credential: expect.any(Object) },
      projectId: "codetrail-karim",
    });
  });
});
