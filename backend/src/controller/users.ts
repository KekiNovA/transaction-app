import { NextFunction, Request, Response } from "express";
import User from "../models/user";

export const GetAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({}).select("name _id").lean().exec();
    if (users) {
      res.status(200).json(users);
    } else {
      throw new Error("No Users found");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};
