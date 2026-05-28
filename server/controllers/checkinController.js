import DailyCheckin from "../models/DailyCheckin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { normalizeLocalDate, toDateRange } from "../utils/date.js";

function checkinQuery(queryParams) {
  const query = {};
  const range = toDateRange(queryParams);
  if (range) query.date = range;
  if (queryParams.trackId) query.checkedTrackIds = queryParams.trackId;
  return query;
}

export const getCheckins = asyncHandler(async (req, res) => {
  const checkins = await DailyCheckin.find(checkinQuery(req.query))
    .populate("checkedTrackIds", "name color type status")
    .populate("trackMessages.trackId", "name color type status")
    .sort({ date: -1 });
  res.json(checkins);
});

export const getCheckinByDate = asyncHandler(async (req, res) => {
  const date = normalizeLocalDate(req.params.date);
  const checkin = await DailyCheckin.findOne({ date }).populate(
    "checkedTrackIds",
    "name color type status",
  ).populate("trackMessages.trackId", "name color type status");
  if (!checkin) return res.status(404).json({ message: "Check-in not found" });
  res.json(checkin);
});

export const upsertCheckin = asyncHandler(async (req, res) => {
  const date = normalizeLocalDate(req.body.date);
  const checkin = await DailyCheckin.findOneAndUpdate(
    { date },
    {
      date,
      checkedTrackIds: req.body.checkedTrackIds || [],
      message: req.body.message || "",
      trackMessages: req.body.trackMessages || [],
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  ).populate("checkedTrackIds", "name color type status").populate("trackMessages.trackId", "name color type status");
  res.status(201).json(checkin);
});

export const updateCheckin = asyncHandler(async (req, res) => {
  const date = normalizeLocalDate(req.params.date);
  const checkin = await DailyCheckin.findOneAndUpdate(
    { date },
    {
      checkedTrackIds: req.body.checkedTrackIds || [],
      message: req.body.message || "",
      trackMessages: req.body.trackMessages || [],
    },
    { new: true, runValidators: true },
  ).populate("checkedTrackIds", "name color type status").populate("trackMessages.trackId", "name color type status");
  if (!checkin) return res.status(404).json({ message: "Check-in not found" });
  res.json(checkin);
});

export const deleteCheckin = asyncHandler(async (req, res) => {
  const date = normalizeLocalDate(req.params.date);
  const checkin = await DailyCheckin.findOneAndDelete({ date });
  if (!checkin) return res.status(404).json({ message: "Check-in not found" });
  res.json({ message: "Check-in deleted" });
});
