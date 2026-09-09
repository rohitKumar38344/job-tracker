import { Router } from "express";
import { createApplication, deleteApplication, getApplicationById, getApplications, updateApplicationById } from "./application.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
router.post("/", authMiddleware, createApplication);
router.get('/', authMiddleware, getApplications);
router.get('/:applicationId', authMiddleware, getApplicationById)
router.patch('/:applicationId', authMiddleware, updateApplicationById)
router.delete('/:applicationId', authMiddleware, deleteApplication)

export default router;
