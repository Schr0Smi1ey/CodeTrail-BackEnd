import DailyCheckin from "../models/DailyCheckin.js";
import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";
import Track from "../models/Track.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getTodayLocalDate, getWeekRangeLocal, toDateRange } from "../utils/date.js";

export const getSummary = asyncHandler(async (req, res) => {
  const today = getTodayLocalDate();
  const week = getWeekRangeLocal();
  const [
    totalTracks,
    activeTracks,
    totalTopics,
    totalResources,
    resourcesAddedToday,
    needRevisionCount,
    checkinsThisWeek,
  ] = await Promise.all([
    Track.countDocuments(),
    Track.countDocuments({ status: "Active" }),
    Topic.countDocuments(),
    Resource.countDocuments(),
    Resource.countDocuments({ addedDate: today }),
    Resource.countDocuments({ status: "Need Revision" }),
    DailyCheckin.countDocuments({
      date: { $gte: week.startDate, $lte: week.endDate },
      checkedTrackIds: { $exists: true, $ne: [] },
    }),
  ]);
  res.json({
    totalTracks,
    activeTracks,
    totalTopics,
    totalResources,
    resourcesAddedToday,
    needRevisionCount,
    checkinsThisWeek,
  });
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const query = {};
  const range = toDateRange(req.query);
  if (range) query.date = range;
  if (req.query.trackId) query.checkedTrackIds = req.query.trackId;
  const checkins = await DailyCheckin.find(query)
    .populate("checkedTrackIds", "name color type status")
    .populate("trackMessages.trackId", "name color type status")
    .sort({ date: 1 });
  res.json(
    checkins.map((checkin) => {
      const selectedMessage = req.query.trackId
        ? checkin.trackMessages.find((item) => String(item.trackId?._id || item.trackId) === String(req.query.trackId))?.message || ""
        : "";
      return {
        date: checkin.date,
        count: req.query.trackId
          ? checkin.checkedTrackIds.some((track) => String(track._id || track) === String(req.query.trackId))
            ? 1
            : 0
          : checkin.checkedTrackIds.length,
        hasMessage: Boolean(selectedMessage),
        checkedTrackIds: checkin.checkedTrackIds,
        message: selectedMessage,
        trackMessages: req.query.trackId ? checkin.trackMessages : [],
      };
    }),
  );
});
