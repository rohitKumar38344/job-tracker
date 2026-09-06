import { Router } from "express";
import { createJob, filterJobs, getJob, updateJob } from "./job.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, filterJobs);
router.get('/:jobId', authMiddleware, getJob);
router.patch('/:jobId',authMiddleware, updateJob);

export default router;