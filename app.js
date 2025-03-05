import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import  cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userDetailsRoutes from './routes/userDetailsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import routesInfo from './routes/routesInfo.js'; 

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/userdetails", userDetailsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/photos", photoRoutes);
app.use("/api/v1/message", messageRoutes);
app.use(routesInfo);

export default app;





// https://chatgpt.com/c/67970938-c5f8-8011-8490-0608c66fe94e

function authenticationToken(req,res,next){

    const token =req.header("Authorization")?.split(" ")[1];
    if(!token)return res.sendStatus(401).json({message:"null token"});

    jwt.verify(token,secretKey,(err,user)=>{
        if(err) return res.status(403).json({message:"invalid token"});
        
        req.user=user;
        next();
    })
}

