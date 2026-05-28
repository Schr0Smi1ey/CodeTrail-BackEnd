import express from "express";
import {
  createResource,
  deleteResource,
  getResource,
  getResources,
  updateResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.route("/").get(getResources).post(createResource);
router.route("/:id").get(getResource).put(updateResource).delete(deleteResource);

export default router;
