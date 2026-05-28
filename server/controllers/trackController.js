import DailyCheckin from "../models/DailyCheckin.js";
import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";
import Track from "../models/Track.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function enrichTrack(track) {
  const [topicCount, resourceCount, lastCheckin] = await Promise.all([
    Topic.countDocuments({ trackId: track._id }),
    Resource.countDocuments({ trackId: track._id }),
    DailyCheckin.findOne({ checkedTrackIds: track._id }).sort({ date: -1 }).select("date"),
  ]);
  return {
    ...track.toObject(),
    topicCount,
    resourceCount,
    lastCheckedDate: lastCheckin?.date || null,
  };
}

export const getTracks = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.type) query.type = req.query.type;
  const tracks = await Track.find(query).sort({ order: 1, createdAt: -1 });
  res.json(await Promise.all(tracks.map(enrichTrack)));
});

export const getTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);
  if (!track) return res.status(404).json({ message: "Track not found" });
  res.json(await enrichTrack(track));
});

export const createTrack = asyncHandler(async (req, res) => {
  const track = await Track.create(req.body);
  res.status(201).json(await enrichTrack(track));
});

export const updateTrack = asyncHandler(async (req, res) => {
  const track = await Track.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!track) return res.status(404).json({ message: "Track not found" });
  res.json(await enrichTrack(track));
});

export const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findByIdAndDelete(req.params.id);
  if (!track) return res.status(404).json({ message: "Track not found" });
  await Promise.all([
    Topic.deleteMany({ trackId: req.params.id }),
    Resource.deleteMany({ trackId: req.params.id }),
    DailyCheckin.updateMany({}, { $pull: { checkedTrackIds: req.params.id } }),
  ]);
  res.json({ message: "Track deleted" });
});
