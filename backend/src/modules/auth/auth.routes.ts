import { Router } from "express";
import { register, login, refreshTokenController, logoutController } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenController)
router.post("/logout", logoutController);

export default router;
