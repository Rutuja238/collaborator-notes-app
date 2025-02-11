const express = require("express");
const Note = require("../models/Note");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../routes/auth");

const router = express.Router();

router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("🛑 Received Token:", token);

  if (!token) {
    console.log("❌ No Token Received");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Decoded User ID:", decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("⚠️ JWT Verification Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content, owner: req.userId });
  await note.save();
  res.json(note);
});

router.get("/", async (req, res) => {
  const notes = await Note.find({ $or: [{ owner: req.userId }, { sharedWith: req.userId }] }).populate("sharedWith");
  res.json(notes);
});

router.put("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  
  if (note.owner.toString() !== req.userId && !note.sharedWith.includes(req.userId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(note, req.body);
  await note.save();
  res.json(note);
});

router.delete("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  if (note.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted successfully" });
});

router.post("/:id/share", async (req, res) => {
  console.log("📩 Share Request Received for Note:", req.params.id);

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!note.sharedWith.includes(user._id)) {
    note.sharedWith.push(user._id);
    await note.save();
  }

  console.log("✅ Note Shared Successfully!");
  res.json({ message: "Note shared successfully" });
});

router.post("/:id/unshare", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  if (note.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  note.sharedWith = note.sharedWith.filter((id) => id.toString() !== user._id.toString());
  await note.save();
  res.json({ message: "User removed from shared list" });
});

router.get("/:id/collaborators", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("sharedWith", "email");
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const collaborators = note.sharedWith.map((user) => user.email);
    res.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/remove-collaborator", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    note.sharedWith = note.sharedWith.filter((id) => id.toString() !== user._id.toString());
    await note.save();

    res.json({ message: "Collaborator removed successfully" });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
