import { Router } from "express";
import { createJob } from "./job.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post('/',authMiddleware, createJob)

export default router;