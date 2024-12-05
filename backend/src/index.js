import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./db/index.js";
import { app } from "./app.js"; // Assuming your Express app is exported from app.js
import { isConnection, sendMessage } from "./sockerUtilsfile.js";

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "https://letsconnect-ui.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware to attach socket.io to the request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Map to store user MongoDB IDs and their corresponding socket IDs
const socketMap = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  // Store user's MongoDB ID and socket ID
  socket.on("register", (userId) => {
    socketMap.set(userId, socket.id);
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    // Remove user's MongoDB ID and socket ID from the map
    for (const [userId, socketId] of socketMap.entries()) {
      if (socketId === socket.id) {
        socketMap.delete(userId);
        console.log(
          `User disconnected: ${userId} with socket ID: ${socket.id}`
        );
        break;
      }
    }
  });

  
  socket.on("chat message", (msg, recipientId) => {
    console.log("Message: " + msg);
    io.emit("chat message", msg);
  });

  
  socket.on("new notification", (notification) => {
    console.log("New notification: " + notification);
    io.emit("new notification", notification);
  });

  
  socket.on(
    "private message",
    async ({ senderId, recipientId, message, name, fileUrl }) => {
      // Check if the sender and recipient are connected
      if (!isConnection(senderId, recipientId)) {
        return;
      }

      // Store the message in the database
      const storedMessage = await sendMessage(
        senderId,
        recipientId,
        message,
        fileUrl
      );
      if (!storedMessage) {
        return;
      }

      // Check if the recipient is online
      const recipientSocketId = socketMap.get(recipientId);
      if (recipientSocketId) {
        // If the recipient is online, send the message via socket
        io.to(recipientSocketId).emit("private message",{senderId, recipientId, message, name, fileUrl });
        console.log(`Private message sent to ${name}: ${senderId, recipientId, message, name, fileUrl }`);
      } else {
        // If the recipient is not online, just log that the message is stored
        console.log(
          `User with ID ${recipientId} is not online. Message stored in database.`
        );
      }
    }
  );


  socket.on("make-vc" , ({senderId,targetId , roomId})=>{
    const socketid = socketMap.get(targetId)
    io.to(socketid).emit("make-vc" , {roomId , senderId})
  })

  socket.on("accept-vc" , ({senderId, targetId , roomId})=>{
    const socketid = socketMap.get(targetId)
    io.to(socketid).emit("accept-vc" , {senderId,targetId,roomId})
  })

  socket.on("reject-vc" , ({senderId,targetId })=>{
    const socketid = socketMap.get(targetId)
    io.to(socketid).emit("reject-vc" , {senderId  , targetId})
  })

  socket.on("end-vc" , ({senderId , targetId , roomId})=>{
    const socketid = socketMap.get(targetId)
    io.to(socketid).emit("end-vc" , {senderId , roomId , targetId})
  })

  
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed :: ", err);
  });
