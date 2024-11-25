import { Router } from "express";
import { User } from "../models/User";

const router = Router();

router.post("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.referralCount += 1;
    user.points += 100; // Referral reward
    await user.save();
    res.json({
      success: true,
      points: user.points,
      referralCount: user.referralCount,
    });
  } else {
    res.json({ success: false });
  }
});

export default router;
