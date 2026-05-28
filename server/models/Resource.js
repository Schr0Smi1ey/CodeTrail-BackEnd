import mongoose from "mongoose";
import { getTodayLocalDate, isLocalDateString } from "../utils/date.js";

const resourceSchema = new mongoose.Schema(
  {
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    title: { type: String, required: true, trim: true },
    url: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["Problem", "Article", "Video", "Note", "Documentation", "Contest Problem", "Other"],
      required: true,
    },
    platform: { type: String, trim: true, default: "" },
    pattern: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["To Do", "Done", "Need Revision", "Important"],
      default: "To Do",
    },
    thoughts: { type: String, trim: true, default: "" },
    addedDate: {
      type: String,
      required: true,
      default: getTodayLocalDate,
      validate: {
        validator: isLocalDateString,
        message: "addedDate must be YYYY-MM-DD",
      },
    },
  },
  { timestamps: true },
);

resourceSchema.index({ addedDate: -1, type: 1, status: 1 });
resourceSchema.index({ title: "text", thoughts: "text" });

export default mongoose.model("Resource", resourceSchema);
