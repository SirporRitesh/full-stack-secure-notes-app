import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import 'dotenv/config';
import Test from "./models/Test.js";
console.log("DB URL (early check):", process.env.DATABASE_URL);
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
app.get("/", (req, res) => res.send("API running"));
app.get('/route', (_req, res) => {
    res.send('Hello');
});
app.use("/notes", notesRouter);
app.use("/auth", authRouter);
app.get("/test-db", async (req, res) => {
    try {
        const doc = await Test.create({ message: "Hello MongoDB Atlas!" });
        const docs = await Test.find();
        res.json({ inserted: doc, allDocs: docs });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB test failed" });
    }
});
app.listen(4000, () => console.log("Server running on port 4000"));
// console.log("DB URL:", process.env.DATABASE_URL); // temporary check
//# sourceMappingURL=index.js.map