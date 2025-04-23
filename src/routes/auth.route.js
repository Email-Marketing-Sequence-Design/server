import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware";
import { checkTokenValidity, getProfile, login, logout, signUp } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

router.get("/profile", isLoggedIn, getProfile);
router.get("/checkTokenValidity", isLoggedIn, checkTokenValidity);

export default router;
