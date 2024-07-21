import express from "express";
import { GetAllUsers } from "../controller/users";

const router = express.Router();

router.get("/", GetAllUsers);

export default router;
