import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { checkTokenValidity, getProfile, login, logout, signUp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

router.get("/profile", isLoggedIn, getProfile);
router.get("/checkTokenValidity", isLoggedIn, checkTokenValidity);

export default router;
