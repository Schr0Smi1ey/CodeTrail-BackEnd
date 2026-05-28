import Resource from "../models/Resource.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { normalizeLocalDate, toDateRange } from "../utils/date.js";

function regex(value) {
  return { $regex: String(value).trim(), $options: "i" };
}

function buildResourceQuery(queryParams) {
  const {
    trackId,
    topicId,
    type,
    status,
    platform,
    pattern,
    date,
    startDate,
    endDate,
    search,
  } = queryParams;
  const query = {};
  if (trackId) query.trackId = trackId;
  if (topicId) query.topicId = topicId;
  if (type) query.type = type;
  if (status) query.status = status;
  if (platform) query.platform = regex(platform);
  if (pattern) query.pattern = regex(pattern);
  const range = toDateRange({ date, startDate, endDate });
  if (range) query.addedDate = range;
  if (search) {
    query.$or = [{ title: regex(search) }, { thoughts: regex(search) }];
  }
  return query;
}

function getSort(sort = "newest") {
  const sorts = {
    newest: { addedDate: -1, createdAt: -1 },
    oldest: { addedDate: 1, createdAt: 1 },
    title: { title: 1 },
    status: { status: 1, addedDate: -1 },
    type: { type: 1, addedDate: -1 },
  };
  return sorts[sort] || sorts.newest;
}

export const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find(buildResourceQuery(req.query))
    .populate("trackId", "name color type status")
    .populate("topicId", "name")
    .sort(getSort(req.query.sort));
  res.json(resources);
});

export const getResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate("trackId", "name color type status")
    .populate("topicId", "name");
  if (!resource) return res.status(404).json({ message: "Resource not found" });
  res.json(resource);
});

export const createResource = asyncHandler(async (req, res) => {
  const body = { ...req.body, addedDate: normalizeLocalDate(req.body.addedDate) };
  const resource = await Resource.create(body);
  res.status(201).json(
    await resource.populate([
      { path: "trackId", select: "name color type status" },
      { path: "topicId", select: "name" },
    ]),
  );
});

export const updateResource = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.addedDate) body.addedDate = normalizeLocalDate(body.addedDate);
  const resource = await Resource.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  })
    .populate("trackId", "name color type status")
    .populate("topicId", "name");
  if (!resource) return res.status(404).json({ message: "Resource not found" });
  res.json(resource);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ message: "Resource not found" });
  res.json({ message: "Resource deleted" });
});
