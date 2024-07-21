import expres from "express";
import {
  CreateTransaction,
  GetAllTransactions,
} from "../controller/transaction";
import { TransactionValidator } from "../middleware";

const router = expres.Router();

router.post("/", TransactionValidator, CreateTransaction);
router.get("/", GetAllTransactions);

export default router;
