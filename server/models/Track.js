import mongoose from "mongoose";

const trackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    type: {
      type: String,
      enum: ["Course", "Activity", "Skill", "Routine", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Completed"],
      default: "Active",
    },
    color: { type: String, trim: true, default: "#2563eb" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

trackSchema.index({ status: 1, order: 1, name: 1 });

export default mongoose.model("Track", trackSchema);
