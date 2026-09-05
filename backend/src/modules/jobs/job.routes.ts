import { Router } from "express";
import { createJob, filterJobs, getJobs } from "./job.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, filterJobs);

export default router;