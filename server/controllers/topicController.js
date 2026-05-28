import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function enrichTopic(topic) {
  const resourceCount = await Resource.countDocuments({ topicId: topic._id });
  return { ...topic.toObject(), resourceCount };
}

export const getTopics = asyncHandler(async (req, res) => {
  const query = req.query.trackId ? { trackId: req.query.trackId } : {};
  const topics = await Topic.find(query).populate("trackId", "name color type status").sort({
    order: 1,
    createdAt: -1,
  });
  res.json(await Promise.all(topics.map(enrichTopic)));
});

export const getTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id).populate("trackId", "name color type status");
  if (!topic) return res.status(404).json({ message: "Topic not found" });
  res.json(await enrichTopic(topic));
});

export const createTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.create(req.body);
  res.status(201).json(await enrichTopic(await topic.populate("trackId", "name color type status")));
});

export const updateTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("trackId", "name color type status");
  if (!topic) return res.status(404).json({ message: "Topic not found" });
  res.json(await enrichTopic(topic));
});

export const deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findByIdAndDelete(req.params.id);
  if (!topic) return res.status(404).json({ message: "Topic not found" });
  await Resource.updateMany({ topicId: req.params.id }, { $unset: { topicId: "" } });
  res.json({ message: "Topic deleted" });
});
