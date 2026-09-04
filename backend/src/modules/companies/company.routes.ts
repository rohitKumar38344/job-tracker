import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "./company.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/", authMiddleware, createCompany);
router.get("/", authMiddleware, getCompanies);
router.get("/:companyId", authMiddleware, getCompany);
router.patch("/:companyId", authMiddleware, updateCompany);
router.delete("/:companyId", authMiddleware, deleteCompany);

export default router;
