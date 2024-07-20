import { UserType } from "../types/user";
import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

/**
 * Schema for User model.
 * This schema defines the structure of the user collection in MongoDB.
 */
const userSchema: Schema = new Schema<UserType>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(), // Generates a random UUID for each document
    },
    name: {
      type: String,
      required: true, // Name of the user, required field
      unique: true, // Name must be unique
    },
    balance: {
      type: Number,
      default: 0,
      required: true, // Balance of the user, required field
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * User model.
 * This model represents the user collection in MongoDB.
 */
const User = mongoose.model("user", userSchema);

export default User;
