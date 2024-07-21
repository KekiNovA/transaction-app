import express from "express";
import transactionRoutes from "./transaction";

const router = express.Router();

router.use("/transactions", transactionRoutes);

export default router;
