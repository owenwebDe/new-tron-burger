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
router.get("/", (req, res) => {
    res.sendFile("home.html", { root: "./views" });
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const user = new User_1.User({ name });
    yield user.save();
    res.json(user);
}));
router.get("/wallet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(req.params.id);
    res.json({ totalPoints: (user === null || user === void 0 ? void 0 : user.points) || 0 });
}));
// Add this to `src/routes/index.ts`
router.post("/wallet/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findById(req.params.id);
    if (user) {
        user.points += req.body.points; // Add game points to user total
        yield user.save();
        res.json({ success: true, totalPoints: user.points });
    }
    else {
        res.json({ success: false });
    }
}));
exports.default = router;
