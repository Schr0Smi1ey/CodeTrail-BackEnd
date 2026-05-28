import dotenv from "dotenv";
import mongoose from "mongoose";
import DailyCheckin from "../models/DailyCheckin.js";
import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";
import Track from "../models/Track.js";
import { getTodayLocalDate } from "../utils/date.js";

dotenv.config();

const colors = ["#2563eb", "#16a34a", "#f97316", "#9333ea"];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    Track.deleteMany(),
    Topic.deleteMany(),
    Resource.deleteMany(),
    DailyCheckin.deleteMany(),
  ]);

  const tracks = await Track.insertMany([
    { name: "InterviewBit Programming", type: "Course", color: colors[0], order: 1 },
    { name: "Boot.dev Python", type: "Course", color: colors[1], order: 2 },
    { name: "SQL", type: "Skill", color: colors[2], order: 3 },
    { name: "Online Contest", type: "Activity", color: colors[3], order: 4 },
  ]);

  const topics = await Topic.insertMany([
    { trackId: tracks[0]._id, name: "Arrays", order: 1 },
    { trackId: tracks[0]._id, name: "Binary Search", order: 2 },
    { trackId: tracks[2]._id, name: "JOIN", order: 1 },
  ]);

  await Resource.insertMany([
    {
      trackId: tracks[0]._id,
      topicId: topics[0]._id,
      title: "Prefix Sum Practice",
      type: "Problem",
      platform: "InterviewBit",
      pattern: "Prefix Sum",
      status: "Need Revision",
      thoughts: "Revisit range sum transformation.",
      addedDate: getTodayLocalDate(),
    },
    {
      trackId: tracks[2]._id,
      topicId: topics[2]._id,
      title: "SQL JOIN notes",
      type: "Note",
      platform: "Documentation",
      status: "Done",
      addedDate: getTodayLocalDate(),
    },
  ]);

  await DailyCheckin.create({
    date: getTodayLocalDate(),
    checkedTrackIds: [tracks[0]._id, tracks[2]._id],
    message: "Seed check-in for local testing.",
    trackMessages: [
      { trackId: tracks[0]._id, message: "Solved array problems and marked prefix sum for revision." },
      { trackId: tracks[2]._id, message: "Reviewed JOIN notes." },
    ],
  });

  await mongoose.disconnect();
  console.log("Seed complete");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
