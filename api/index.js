import app from "../server/app.js";
import { connectDB } from "../server/config/db.js";

let connectionPromise;

export default async function handler(req, res) {
  connectionPromise ||= connectDB();
  await connectionPromise;
  return app(req, res);
}
