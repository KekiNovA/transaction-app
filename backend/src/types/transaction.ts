import { Document, Schema } from "mongoose";

export interface TransactionType extends Document {
  _id: any;
  details: string;
  amount: number;
  sender: any;
  receiver: any;
}
