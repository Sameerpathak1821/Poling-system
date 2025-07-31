// Update CORS configuration and port
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Environment-based CORS setup
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-app-name.onrender.com"]
        : ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-app-name.onrender.com"]
        : ["http://localhost:3000"],
  })
);

app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

// ... rest of your socket.io code remains the same ...

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
