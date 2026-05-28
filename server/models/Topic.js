import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    trackId: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

topicSchema.index({ trackId: 1, order: 1, name: 1 });

export default mongoose.model("Topic", topicSchema);
