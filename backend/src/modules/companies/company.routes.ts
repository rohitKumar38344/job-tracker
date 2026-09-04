import { Router } from "express";
import { createCompany, getCompanies, getCompany, updateCompany } from "./company.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompanies);
router.get('/:companyId', authMiddleware, getCompany)
router.patch('/:companyId', authMiddleware, updateCompany)

export default router;
