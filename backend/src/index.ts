import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notesRouter from "./routes/notes.js";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import 'dotenv/config';
import Test from "./models/Test.js";
import { requireAuth, type AuthenticatedRequest } from "./middleware/requireAuth.js";

const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:8080";

app.use(cors({ 
  origin: frontendURL, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_URL!, {
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.get("/", (req: express.Request, res: express.Response) => res.send("API running"));
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB test failed" });
  }
});

app.get("/auth/me", requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token"); 
  res.json({ success: true });
});

app.listen(4000, () => console.log("Server running on port 4000"));

