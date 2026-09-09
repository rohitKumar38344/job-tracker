import { Router } from "express";
import { createInterview, getInterviews } from "./interview.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post(
  "/applications/:applicationId/interviews",
  authMiddleware,
  createInterview,
);
router.get(
  "/applications/:applicationId/interviews",
  authMiddleware,
  getInterviews,
);
