import { Router } from "express";
import { User } from "../models/User";

const router = Router();

router.get("/", (req, res) => {
  res.sendFile("home.html", { root: "./views" });
});

router.post("/register", async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
});

router.get("/wallet/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ totalPoints: user?.points || 0 });
});
// Add this to `src/routes/index.ts`

router.post("/wallet/update/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.points += req.body.points; // Add game points to user total
    await user.save();
    res.json({ success: true, totalPoints: user.points });
  } else {
    res.json({ success: false });
  }
});

export default router;
