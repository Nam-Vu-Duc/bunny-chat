const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors())

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")))

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("message", (data) => {
    console.log("Message received:", data)
    io.emit("message", data)
  });

  socket.on("disconnect", () => {
    console.log("User disconnected")
  });
});

// Serve an HTML file when accessing "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
});

const PORT = process.env.PORT || 3100
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))