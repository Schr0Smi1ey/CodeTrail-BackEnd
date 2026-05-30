import { getFirebaseAuth } from "../config/firebaseAdmin.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = await getFirebaseAuth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase();

    if (!email) {
      return res.status(403).json({ message: "Email address required" });
    }

    if (!decoded.email_verified) {
      return res.status(403).json({ message: "Email verification required" });
    }

    req.user = {
      uid: decoded.uid,
      email,
      name: decoded.name || "",
    };
    next();
  } catch (error) {
    console.error("Firebase auth verification failed", {
      code: error.code,
      message: error.message,
    });
    res.status(401).json({
      message: "Invalid or expired session",
      ...(process.env.NODE_ENV === "production" ? {} : { detail: error.message, code: error.code }),
    });
  }
}
