"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(req.params.id);
    if (user) {
        user.referralCount += 1;
        user.points += 100; // Referral reward
        yield user.save();
        res.json({
            success: true,
            points: user.points,
            referralCount: user.referralCount,
        });
    }
    else {
        res.json({ success: false });
    }
}));
exports.default = router;
