import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginWithEmailAnPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginWithEmailAnPassword(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.authWithGoogle(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const AuthController = {
  loginWithEmailAnPassword,
  authWithGoogle,
};
