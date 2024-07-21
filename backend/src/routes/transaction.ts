import expres from "express";
import {
  CreateTransaction,
  DeleteTransaction,
  GetAllTransactions,
  GetTransaction,
} from "../controller/transaction";
import { TransactionValidator } from "../middleware";

const router = expres.Router();
/**
 * @description Route to create a new transaction
 * @method POST
 * @route /api/transactions
 * @middleware TransactionValidator - Validates the transaction data before creating
 * @controller CreateTransaction - Controller to handle creating a new transaction
 */
router.post("/", TransactionValidator, CreateTransaction);

/**
 * @description Route to get all transactions
 * @method GET
 * @route /api/transactions
 * @controller GetAllTransactions - Controller to handle fetching all transactions
 */
router.get("/", GetAllTransactions);

/**
 * @description Route to get transaction
 * @method GET
 * @route /api/transactions/:transactionId
 * @controller GetAllTransactions - Controller to handle fetching one transaction
 */
router.get("/:transactionId", GetTransaction);

/**
 * @description Route to delete transaction
 * @method DELETE
 * @route /api/transactions/:transactionId
 * @controller DeleteTransaction - Controller to handle delete a transaction
 */
router.delete("/:transactionId", DeleteTransaction);

export default router;
