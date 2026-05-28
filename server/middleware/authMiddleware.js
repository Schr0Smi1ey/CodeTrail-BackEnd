import { getFirebaseAuth } from "../config/firebaseAdmin.js";

function getAllowedEmails() {
  return (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = await getFirebaseAuth().verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    const allowedEmails = getAllowedEmails();

    if (!email || !allowedEmails.includes(email)) {
      return res.status(403).json({ message: "This account is not allowed" });
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
    res.status(401).json({ message: "Invalid or expired session" });
  }
}
