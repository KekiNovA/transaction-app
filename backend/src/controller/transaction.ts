import { NextFunction, Request, Response } from "express";
import Transaction from "../models/transaction";
import redisClient from "../utils/connectRedis";
import User from "../models/user";
import { UserType } from "../types/user";

/**
 * CreateTransaction - Creates a new transaction.
 *
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @throws {Error} Throws an error if the user already exists or if invalid user data is provided.
 */

export const CreateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body["senderId"] != req.body["receiverId"]) {
    try {
      // Update Sender amount
      const sender = res.locals.sender;
      sender.balance = sender?.balance - req.body.amount;
      await sender.save();

      // Update Receiver amoutn
      const receiver = res.locals.receiver;
      receiver.balance = receiver?.balance + parseFloat(req.body.amount);
      await receiver.save();

      // Create Trnsaction
      const transaction = await Transaction.create({
        sender: req.body["senderId"],
        receiver: req.body["receiverId"],
        amount: req.body["amount"],
        details: req.body["details"],
      });
      // Update redis cache
      const allTrnsactions = await redisClient.get("all_transactions");
      if (allTrnsactions) {
        await redisClient.del("all_transactions");
        const transactions = await Transaction.find({})
          .select("_id details amount createdAt updatedAt")
          .populate({ path: "sender", select: "name _id" })
          .populate({ path: "receiver", select: "name _id" })
          .lean()
          .exec();
        await redisClient.set("all_transaction", JSON.stringify(transactions));
      }

      // Return Response
      return res.status(201).json({
        _id: transaction._id,
        senderId: transaction.sender,
        receiverId: transaction.receiver,
        details: transaction.details,
        amount: transaction.amount,
        sender: sender?.name,
        sender_balance: sender?.balance,
        receiver: receiver?.name,
        receiver_balance: receiver?.balance,
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  } else {
    next(new Error("Sender and Receiver cannot be same."));
  }
};

/**
 * GetAllTransactions - Retrieves all transactions.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the HTTP response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @throws {Error} Throws an error if unable to retrieve transactions.
 */
export const GetAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check Redis cache for all transactions
    const cached_data = await redisClient.get("all_transaction");
    if (cached_data) {
      return res.status(200).json(JSON.parse(cached_data));
    } else {
      const transactions = await Transaction.find({})
        .select("_id details amount createdAt updatedAt")
        .populate({ path: "sender", select: "name _id" })
        .populate({ path: "receiver", select: "name _id" })
        .lean()
        .exec();
      await redisClient.set("all_transaction", JSON.stringify(transactions));
      return res.status(200).json(transactions);
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * GetTransaction - Retrieves a specific transaction by ID.
 *
 * @param {Request} req - The request object containing the transaction ID.
 * @param {Response} res - The response object to send the HTTP response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @throws {Error} Throws an error if unable to retrieve the transaction.
 */
export const GetTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check Redis cache for the specific transaction
    const cached_data = await redisClient.get(req.params["transactionId"]);
    if (cached_data) {
      return res.status(200).json(JSON.parse(cached_data));
    } else {
      const transaction = await Transaction.findById(
        req.params["transactionId"]
      )
        .select("_id details amount createdAt updatedAt")
        .populate({ path: "sender", select: "name _id" })
        .populate({ path: "receiver", select: "name _id" })
        .lean()
        .exec();
      if (transaction) {
        redisClient.set(
          req.params["transactionId"],
          JSON.stringify(transaction)
        );
        return res.status(200).json(transaction);
      } else {
        throw new Error("Transaction does not exists.");
      }
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * DeleteTransaction - Deletes a specific transaction by ID.
 *
 * @param {Request} req - The request object containing the transaction ID.
 * @param {Response} res - The response object to send the HTTP response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @throws {Error} Throws an error if unable to delete the transaction.
 */
export const DeleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findById(req.params["transactionId"])
      .select("_id details amount sender receiver")
      .lean()
      .exec();
    if (transaction) {
      const receiver: UserType | null = await User.findById(
        transaction.receiver
      );
      const sender: UserType | null = await User.findById(transaction.sender);
      if (sender && receiver) {
        // Adjust balances of sender and receiver
        sender.balance += parseFloat(transaction.amount.toString());
        receiver.balance -= parseFloat(transaction.amount.toString());
        sender.save();
        receiver.save();
      }

      // Remove transaction from Redis cache
      const cache = await redisClient.get(`${transaction._id}`);
      if (cache) {
        await redisClient.del(`${transaction._id}`);
      }

      await Transaction.findByIdAndDelete(req.params["transactionId"]);

      // Update Redis cache for all transactions
      const allTrnsactions = await redisClient.get("all_transactions");
      if (allTrnsactions) {
        await redisClient.del("all_transactions");
        const transactions = await Transaction.find({})
          .select("_id details amount createdAt updatedAt")
          .populate({ path: "sender", select: "name _id" })
          .populate({ path: "receiver", select: "name _id" })
          .lean()
          .exec();
        await redisClient.set("all_transaction", JSON.stringify(transactions));
      }
      res.status(204);
    } else {
      throw new Error("Transaction does not exists");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};
