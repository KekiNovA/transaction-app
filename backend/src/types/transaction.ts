import { Document, Schema } from "mongoose";

export interface TransactionType extends Document {
  _id: Schema.Types.UUID;
  details: string;
  amount: number;
  senderId: Schema.Types.UUID;
  receiverId: Schema.Types.UUID;
}
