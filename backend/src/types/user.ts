import { Document, Schema } from "mongoose";

export interface UserType extends Document {
  _id: Schema.Types.UUID;
  name: string;
  password: string;
  balance: number;
}
