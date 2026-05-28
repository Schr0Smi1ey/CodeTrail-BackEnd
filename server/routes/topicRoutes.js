import express from "express";
import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopics,
  updateTopic,
} from "../controllers/topicController.js";

const router = express.Router();

router.route("/").get(getTopics).post(createTopic);
router.route("/:id").get(getTopic).put(updateTopic).delete(deleteTopic);

export default router;
