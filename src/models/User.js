"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.default.Schema({
    name: String,
    points: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
});
exports.User = mongoose_1.default.model("User", userSchema);
