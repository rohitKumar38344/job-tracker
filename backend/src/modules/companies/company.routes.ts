import { Router } from "express";
import { createCompany, getCompanies, getCompany } from "./company.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompanies);
router.get('/:companyId', authMiddleware, getCompany)

export default router;
