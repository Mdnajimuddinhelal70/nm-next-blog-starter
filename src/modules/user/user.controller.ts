import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllFromDB();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUserById(Number(req.params.id));
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.deleteUser(Number(req.params.id));
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const result = await UserService.updateUser(id, data);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const UserController = {
  createUser,
  getAllFromDB,
  getUserById,
  deleteUser,
  updateUser,
};
