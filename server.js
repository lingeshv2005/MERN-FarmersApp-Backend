import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import "./controllers/authController.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./config/config.env" });

const port = process.env.port || 3000;
const mongoUrl = process.env.mongourl;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

mongoose.connect(mongoUrl, {
        family: 4,
    })
    .then(() => {
        console.log("MongoDB Connected...");
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

    export { io };