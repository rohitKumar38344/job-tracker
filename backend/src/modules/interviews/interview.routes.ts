import { Router } from "express";
import {
  createInterview,
  deleteInterview,
  getInterview,
  getInterviews,
  updateInterview,
} from "./interview.controller";
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
router.get("/interviews/:interviewId", authMiddleware, getInterview);
router.patch("/interviews/:interviewId", authMiddleware, updateInterview);
router.delete("/interviews/:interviewId", authMiddleware, deleteInterview);

export default router;
