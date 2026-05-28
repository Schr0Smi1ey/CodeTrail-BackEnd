import express from "express";
import { getHeatmap, getSummary } from "../controllers/statsController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/heatmap", getHeatmap);

export default router;
