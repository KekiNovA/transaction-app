import { body, check, validationResult } from "express-validator";
import User from "../models/user";
import { NextFunction, Request, Response } from "express";
import { UserType } from "../types/user";

export const TransactionValidator = [
  // Validate 'senderId' field
  body("senderId")
    .trim()
    .notEmpty()
    .withMessage("Sender cannot be empty") // Check if sender is not empty
    .bail()
    .isString()
    .withMessage("Sender should be of type string") // Check if sender is a string
    .bail()
    .isUUID()
    .withMessage("Sender is an invalid UUID") // Check if sender is a valid UUID
    .bail()
    .custom(async (sender) => {
      await User.findById(sender).orFail(new Error("Sender does not exist."));
      return true;
    }), // Check if sender exists in the database
  // Validate 'sender' field
  body("receiverId")
    .trim()
    .notEmpty()
    .withMessage("Receiver cannot be empty") // Check if sender is not empty
    .bail()
    .isString()
    .withMessage("Receiver should be of type string") // Check if sender is a string
    .bail()
    .isUUID()
    .withMessage("Receiver is an invalid UUID") // Check if sender is a valid UUID
    .bail()
    .custom(async (receiver) => {
      await User.findById(receiver).orFail(
        new Error("Receiver does not exist.")
      );
      return true;
    }), // Check if receiver exists in the database
  body("details")
    .trim()
    .notEmpty()
    .withMessage("Details cannot be empty") // Check if Details is not empty
    .bail()
    .isString()
    .withMessage("Details should be of type string"), // Check if details is a string
  body("amount")
    .trim()
    .notEmpty()
    .withMessage("Amount cannot be empty") // Check if Details is not empty
    .bail()
    .isFloat({
      gt: 0,
    })
    .withMessage("Amount should be of type float and greater than 0."), // Check if amount is greater than 0.
  body()
    .custom(async (values) => {
      if (values["senderId"]) {
        const sender = await User.findById(values["senderId"]);
        if (sender && (sender?.balance || 0) <= values.amount) {
          throw new Error("Insufficient Balance.");
        }
      }
      return true;
    })
    .bail(),
  /**
   * Middleware to check validation results.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function in the stack.
   *
   * @returns {Object} The response object containing validation errors, if any.
   */
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    else {
      // Preset sender and receiver if no validation error
      const sender = (await User.findById(req.body.senderId)) as UserType;
      const receiver = (await User.findById(req.body.receiverId)) as UserType;
      res.locals.sender = sender;
      res.locals.receiver = receiver;
    }
    next();
  },
];
