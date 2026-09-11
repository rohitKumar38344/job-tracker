import { Router } from "express";
import { register, login, refreshTokenController, logoutController, getMe } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenController)
router.post("/logout", logoutController);
router.get("/me", authMiddleware, getMe)

export default router;
