const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true }, // ✅ Correct
  content: { type: String, required: true }, // ✅ Correct
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Correct
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
