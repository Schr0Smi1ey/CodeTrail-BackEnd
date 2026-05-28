import mongoose from "mongoose";
import { getTodayLocalDate, isLocalDateString } from "../utils/date.js";

const dailyCheckinSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      default: getTodayLocalDate,
      validate: {
        validator: isLocalDateString,
        message: "date must be YYYY-MM-DD",
      },
    },
    checkedTrackIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
    message: { type: String, trim: true, default: "" },
    trackMessages: [
      {
        trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
        message: { type: String, trim: true, default: "" },
      },
    ],
  },
  { timestamps: true },
);

dailyCheckinSchema.index({ date: -1 });
dailyCheckinSchema.index({ checkedTrackIds: 1 });

export default mongoose.model("DailyCheckin", dailyCheckinSchema);
