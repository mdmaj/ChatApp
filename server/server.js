import express from 'express'
import 'dotenv/config'
import cors from "cors";
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from "socket.io";

// Create App using http server
const app = express();
const server = http.createServer(app);


// Initialize SOcket.io Server
export const io= new Server(server,{
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap ={}; // {userId:, socketId }

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    

    if(userId) userSocketMap[userId]= socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle client disconnects properly
    socket.on("disconnect", (reason) => {
        
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes Setup
app.use("/api/status", (req, res) => {
    res.send("Server is Live");
});

// All API used here
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)


// Connect to Mongo DB
await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
    console.log("Server is Running on:", PORT);
    });
}


// Export Server for vercel 
export default server;
