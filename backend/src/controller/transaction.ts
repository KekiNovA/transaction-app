import { NextFunction, Request, Response } from "express";
import Transaction from "../models/transaction";
import redisClient from "../utils/connectRedis";

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
        await redisClient.del("all-transactions");
      }
      const currentTransaction = await redisClient.get(`${transaction?._id}`);
      if (currentTransaction) {
        await redisClient.del(`${transaction?._id}`);
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

export const GetAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cached_data = await redisClient.get("all_transaction");
    if (cached_data) {
      return res.status(200).json(JSON.parse(cached_data));
    } else {
      const transactions = await Transaction.find({})
        .populate("sender receiver")
        .select("_id details amount")
        .populate({ path: "sender", select: "name _id" })
        .populate({ path: "receiver", select: "name _id" })
        .lean()
        .exec();
      redisClient.set("all_transaction", JSON.stringify(transactions));
      return res.status(200).json(transactions);
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};
