import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
// import your Note model here
const router = express.Router();
router.get("/", requireAuth, async (req, res) => {
    // Fetch notes for req.user.userId
});
router.post("/", requireAuth, async (req, res) => {
    // Create note for req.user.userId
});
router.delete("/:id", requireAuth, async (req, res) => {
    // Delete note if it belongs to req.user.userId
});
export default router;
//# sourceMappingURL=notes.js.map