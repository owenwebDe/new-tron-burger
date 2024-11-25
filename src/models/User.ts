import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  gamePoints: { type: Number, default: 0 },
  referralPoints: { type: Number, default: 0 },
  transactions: [{ type: String }], // Store transaction IDs or details as needed
});

// Create the model for the User
export const User = mongoose.model("User", userSchema);
