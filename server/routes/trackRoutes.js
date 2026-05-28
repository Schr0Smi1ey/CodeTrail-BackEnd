import express from "express";
import {
  createTrack,
  deleteTrack,
  getTrack,
  getTracks,
  updateTrack,
} from "../controllers/trackController.js";

const router = express.Router();

router.route("/").get(getTracks).post(createTrack);
router.route("/:id").get(getTrack).put(updateTrack).delete(deleteTrack);

export default router;
