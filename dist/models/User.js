"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the user schema
const userSchema = new mongoose_1.default.Schema({
    gamePoints: { type: Number, default: 0 },
    referralPoints: { type: Number, default: 0 },
    transactions: [{ type: String }], // Store transaction IDs or details as needed
});
// Create the model for the User
exports.User = mongoose_1.default.model("User", userSchema);
