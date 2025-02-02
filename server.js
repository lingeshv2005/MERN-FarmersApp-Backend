import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: "./config/config.env" });

const port = process.env.port || 3000;
const mongoUrl = process.env.mongourl;

mongoose.connect(mongoUrl)
    .then(() => {
        console.log("MongoDB Connected...");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
