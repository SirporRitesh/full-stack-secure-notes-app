import express from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/requireAuth.js";
import Note from '../models/Note.js';

const router = express.Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const notes = await Note.find({ userId: req.user?.userId });
    res.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token." });
    }
    const note = await Note.create({
      userId: userId,
      title: req.body.title || "Untitled Note",
      content: req.body.content || "",
    });
    res.status(201).json({ note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ note });
  } catch (error) {
    console.error("Error fetching single note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id, userId: req.user?.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;