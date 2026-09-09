import { Router } from "express";
import { createApplication, getApplicationById, getApplications, updateApplicationById } from "./application.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post("/", authMiddleware, createApplication);
router.get('/', authMiddleware, getApplications);
router.get('/:applicationId', authMiddleware, getApplicationById)
router.patch('/:applicationId', authMiddleware, updateApplicationById)

export default router;
