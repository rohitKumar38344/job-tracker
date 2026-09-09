import { Router } from "express";
import { createInterview } from "./interview.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post(
  "/applications/:applicationId/interviews",
  authMiddleware,
  createInterview,
);

export default router;
/*

GET    /api/applications/:applicationId/interviews
GET    /api/interviews/:interviewId
PATCH  /api/interviews/:interviewId
DELETE /api/interviews/:interviewId
*/
