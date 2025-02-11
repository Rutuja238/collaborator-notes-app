require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// io.on("connection", (socket) => {
//   console.log("User connected");
//   socket.on("noteUpdated", (note) => {
//     io.emit("noteUpdated", note);
//   });
// });
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("noteUpdated", (note) => {
      io.emit("noteUpdated", note);
  });

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });
});


server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
