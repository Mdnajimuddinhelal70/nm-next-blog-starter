import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.createPost(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message, error });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const result = await PostService.getAllPost({
      page,
      limit,
      search,
      isFeatured,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message, error });
  }
};
const getSinglePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log("ID FROM ROUTE =", id);
    const result = await PostService.getSinglePost(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message, error });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const result = await PostService.updatePost(id, data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message, error });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await PostService.deletePost(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message, error });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
};
