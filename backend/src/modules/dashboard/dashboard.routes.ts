import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, getDashboardStats);

export default router;
