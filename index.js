const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "https://bunny-store.vercel.app", 
      "https://cosmetic-garden.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors())

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")))

// Socket.IO Connection
io.on('connection', (socket) => {
  socket.on('joinRoom', ({id, room}) => {
    socket.join(room)
  })

  socket.on('privateMessage', ({ room, message }) => {
    const id = message.split(':')[0]
    const msg = message.split(':')[1]
    io.to(room).to('admin-room').emit('chat-message', id, msg, room)
  })

  socket.on('heartbeat', () => {

  })

  socket.on('order', ({ id }) => {
    io.emit('order', id)
  })

  socket.on('account', () => {
    io.emit('account')
  })
})

// Serve an HTML file when accessing "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
});

const PORT = process.env.PORT || 3100
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))