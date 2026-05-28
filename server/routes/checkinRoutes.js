import express from "express";
import {
  deleteCheckin,
  getCheckinByDate,
  getCheckins,
  updateCheckin,
  upsertCheckin,
} from "../controllers/checkinController.js";

const router = express.Router();

router.route("/").get(getCheckins).post(upsertCheckin);
router.route("/:date").get(getCheckinByDate).put(updateCheckin).delete(deleteCheckin);

export default router;
