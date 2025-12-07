import express from "express";
import { PostController } from "./post.controller";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.post("/", PostController.createPost);
router.get("/:id", PostController.getSinglePost);
router.patch("/:id", PostController.updatePost);

export const PostRouter = router;
