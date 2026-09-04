import { Router } from "express";
import { createCompany, getCompanies } from "./company.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompanies);

export default router;
