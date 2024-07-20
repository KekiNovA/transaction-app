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
    password: {
      type: String,
      required: true, // Password of the user, required field
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
 * Pre-save hook to hash the password before saving the user document.
 * If the password field is modified, it hashes the password using bcrypt.
 */
userSchema.pre<UserType>("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next(); // If password is not modified, skip hashing
    }
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error: any) {
    console.log("error", error);
    next(error); // Pass the error to the next middleware
  }
});

/**
 * User model.
 * This model represents the user collection in MongoDB.
 */
const User = mongoose.model("user", userSchema);

export default User;
