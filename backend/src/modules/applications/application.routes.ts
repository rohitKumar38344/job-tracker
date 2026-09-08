import { Router } from "express";
import { createApplication, getApplications } from "./application.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post("/", authMiddleware, createApplication);
router.get('/', authMiddleware, getApplications)

export default router;
