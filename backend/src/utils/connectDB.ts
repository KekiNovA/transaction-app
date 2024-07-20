import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI ||
  "mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:27017/transaction-db?authSource=admin";

const connectDb = async () => {
  try {
    await mongoose.connect(uri); // Connect to MongoDB
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
