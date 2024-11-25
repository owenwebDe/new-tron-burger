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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const User_1 = require("./models/User"); // Import the User model
const index_1 = __importDefault(require("./routes/index"));
const referral_1 = __importDefault(require("./routes/referral"));
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware for session
app.use((0, express_session_1.default)({
    secret: "@Babatunde112",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
// Middleware to parse JSON
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/", index_1.default);
app.use("/referral", referral_1.default);
// MongoDB connection
mongoose_1.default.connect("mongodb://localhost:27017/turger-game", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Route to get user balance and transactions
app.get("/wallet/balance/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    // Validate user ID
    if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid or missing user ID" });
    }
    try {
        // Fetch user from the database
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Calculate total balance by adding gamePoints and referralPoints
        const totalBalance = (user.gamePoints || 0) + (user.referralPoints || 0);
        // Send total balance and transaction history
        res.json({ totalBalance, transactions: user.transactions || [] });
    }
    catch (error) {
        console.error("Error fetching user balance:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
}));
// Route to serve HTML pages
app.get("/game.html", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "game.html"));
});
app.get("/referral.html", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "referral.html"));
});
app.get("/wallet.html", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "wallet.html"));
});
// Route to update user balance based on score
app.post("/update-balance/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { score } = req.body;
    if (!score || !userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID or score" });
    }
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Update the gamePoints based on the score
        user.gamePoints += score;
        // Save the updated user data
        yield user.save();
        const totalBalance = (user.gamePoints || 0) + (user.referralPoints || 0);
        res.json({ totalBalance });
    }
    catch (error) {
        console.error("Error updating user balance:", error);
        res.status(500).json({ error: "Failed to update balance" });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
