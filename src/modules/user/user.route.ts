import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/", UserController.getAllFromDB);
router.post("/", UserController.createUser);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUser);
router.patch("/:id", UserController.updateUser);
export const UserRouter = router;
