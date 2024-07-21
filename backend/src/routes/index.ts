import express from "express";
import transactionRoutes from "./transaction";
import userRoutes from "./users";

const router = express.Router();

router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);

export default router;
