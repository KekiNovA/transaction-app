import { Document } from "mongoose";

export interface UserType extends Document {
  _id: any;
  name: string;
  password: string;
  balance: number;
}
