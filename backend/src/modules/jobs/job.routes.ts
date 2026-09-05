import { Router } from "express";
import { createJob, filterJobs, getJob } from "./job.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, filterJobs);
router.get('/:jobId', authMiddleware, getJob)

export default router;