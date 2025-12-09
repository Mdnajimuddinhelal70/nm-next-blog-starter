import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.loginWithEmailAnPassword);
router.post("/google", AuthController.loginWithEmailAnPassword);

export const AuthRouter = router;
