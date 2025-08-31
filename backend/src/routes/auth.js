import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import 'dotenv/config';
import { sendOtpEmail } from "../utils/sendEmail.js";
import OtpModel from "../models/Otp.js";
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/google", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken)
        return res.status(400).json({ error: "Missing idToken" });
    try {
        const audience = process.env.GOOGLE_CLIENT_ID;
        const ticket = await client.verifyIdToken({ idToken, audience });
        const payload = ticket.getPayload();
        if (!payload?.email)
            return res.status(400).json({ error: "Invalid token" });
        const user = await User.findOneAndUpdate({ email: payload.email }, {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            provider: "google"
        }, { upsert: true, new: true });
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            user: {
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        });
    }
    catch (err) {
        console.error("Google auth error:", err);
        res.status(401).json({ error: "Google authentication failed" });
    }
});
router.post("/send-otp", async (req, res) => {
    try {
        const { email, fullName, dateOfBirth } = req.body;
        if (!email || !fullName || !dateOfBirth) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await OtpModel.create({ email, otp, expiresAt });
        await sendOtpEmail(email, otp);
        res.json({ success: true });
    }
    catch (err) {
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
        const record = await OtpModel.findOne({ email, otp });
        if (!record || record.expiresAt < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }
        await OtpModel.deleteMany({ email });
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ success: true, token });
    }
    catch (err) {
        console.error("Error in /verify-otp:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=auth.js.map