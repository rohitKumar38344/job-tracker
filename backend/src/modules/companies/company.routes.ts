import { Router } from "express";
import { createCompany, getCompanies } from "./company.controller";

const router = Router();

router.post("/", createCompany);
router.get("/", getCompanies);

export default router;