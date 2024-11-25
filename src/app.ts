import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import path from "path";
import { User } from "./models/User"; // Import the User model
import indexRoutes from "./routes/index";
import referralRoutes from "./routes/referral";
import setWebhook from "./setWebhook";

// Call the function to set the webhook when the app starts
setWebhook();

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/turger-game";
const SESSION_SECRET = process.env.SESSION_SECRET || "@Babatunde112";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Middleware for session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Enable secure cookies in production
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", indexRoutes);
app.use("/referral", referralRoutes);

// Route to get user balance and transactions
app.get("/wallet/balance/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalBalance = (user.gamePoints || 0) + (user.referralPoints || 0);
    res.json({ totalBalance, transactions: user.transactions || [] });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Route to update user balance based on score
app.post("/update-balance/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { score } = req.body;

  if (!score || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID or score" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.gamePoints += score;
    await user.save();

    const totalBalance = (user.gamePoints || 0) + (user.referralPoints || 0);
    res.json({ totalBalance });
  } catch (error) {
    console.error("Error updating user balance:", error);
    res.status(500).json({ error: "Failed to update balance" });
  }
});

// Define the users object with an index signature to allow any string key with a specific structure
const users: { [key: string]: { referralCount: number } } = {};

// Handle referral link generation and increment referral count
app.post("/referral/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });
  }

  if (!users[userId]) {
    users[userId] = { referralCount: 0 };
  }

  users[userId].referralCount += 1;

  res.json({ success: true, referralCount: users[userId].referralCount });
});

// Retrieve referral count
app.get("/referral/count/:userId", (req, res) => {
  const userId = req.params.userId;
  const referralCount = users[userId] ? users[userId].referralCount : 0;
  res.json({ success: true, referralCount });
});

// Serve HTML pages
app.get("/game.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "game.html"));
});
app.get("/referral.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "referral.html"));
});
app.get("/wallet.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "wallet.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
