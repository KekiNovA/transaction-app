import { TransactionType } from "../types/transaction";
import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

/**
 * Schema for Transaction model.
 * This schema defines the structure of the transaction collection in MongoDB.
 */
const transactionSchema: Schema = new Schema<TransactionType>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(), // Generates a random UUID for each document
    },
    details: {
      type: String,
      required: true, // Details of the transaction, required field
    },
    amount: {
      type: Number,
      required: true, // Amount of the transaction, required field
    },
    sender: {
      type: Schema.Types.UUID,
      ref: "user", // References the 'user' collection
      required: true, // required field
    },
    receiver: {
      type: Schema.Types.UUID,
      ref: "user", // References the 'user' collection
      required: true, // required field
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Transaction model.
 * This model represents the transaction collection in MongoDB.
 */
const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;
