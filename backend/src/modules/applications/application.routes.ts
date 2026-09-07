import { Router } from "express";
import { createApplication } from "./application.controller";
import { authMiddleware } from "../../middlewares/auth";
// POST /api/applications

const router = Router();
router.post("/", authMiddleware, createApplication);

export default router;
