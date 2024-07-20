import User from "../models/user";
import { UserType } from "../types/user";
import connectDb from "./connectDB";
import fs from "fs";

export const loadUsers = async () => {
  try {
    const data = fs.readFileSync(__dirname + "/users.json", "utf-8");
    const users: Partial<UserType>[] = JSON.parse(data);
    for (const user of users) {
      const existingUser = await User.findOne({ name: user.name });
      if (existingUser) {
        continue;
      } else {
        await User.create({
          ...user,
          password: process.env.DEFAULT_PASSWORD,
        });
      }
    }
  } catch (error) {
    console.log("Error in loadUsers", error);
  }
  return;
};

const initUsers = async () => {
  await connectDb();
  await loadUsers();
  process.exit();
};

initUsers();
