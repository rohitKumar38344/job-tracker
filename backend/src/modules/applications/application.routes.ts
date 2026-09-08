import { Router } from "express";
import { createApplication, getApplicationById, getApplications } from "./application.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post("/", authMiddleware, createApplication);
router.get('/', authMiddleware, getApplications);
router.get('/:applicationId', authMiddleware, getApplicationById)

export default router;
