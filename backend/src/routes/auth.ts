import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import 'dotenv/config';
import { sendOtpEmail } from "../utils/sendEmail.js";
import OtpModel from "../models/Otp.js";
import bcrypt from 'bcrypt';
import { requireAuth, type AuthenticatedRequest } from "../middleware/requireAuth.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "Missing idToken" });

  try {
    const audience = process.env.VITE_GOOGLE_CLIENT_ID!;
    const ticket = await client.verifyIdToken({ idToken, audience });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ error: "Invalid token" });

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name ?? payload.email.split('@')[0], 
        provider: "google"
      });
    } else {
  if (typeof payload.name === "string") {
    user.name = payload.name;
  }
  await user.save();
}

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Must be true for cross-site cookies
      sameSite: 'none', // Allows the cookie to be sent from a different domain
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Google authentication failed" });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing email field" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // OTP hash
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await OtpModel.create({ email, otp: hashedOtp, expiresAt }); // save hashed OTP
    await sendOtpEmail(email, otp); // but send plain OTP to user via email

    res.json({ success: true });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Missing email or OTP" });
    }

    const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await OtpModel.deleteMany({ email });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Must be true for cross-site cookies
      sameSite: 'none', // Allows the cookie to be sent from a different domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error("Error in /auth/me:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;