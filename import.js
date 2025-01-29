// src/import.js
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const path = require("path");
const app = express();
const port = 3000;
const secretKey = "+8]'/[;.pl,12qaz`wsx345e[p;dcy\"gvrft7.;[8uhujio?nmkl7890-=";
const mongourl = "mongodb://localhost:27017/farmers-social-media";  // MongoDB URL
// const mongourl="mongodb+srv://lingeshv520:lingeshv2005@cluster0.yzegp.mongodb.net/farmers-social-media";

app.use(express.json());
app.use(cors());

mongoose.connect(mongourl).then(() => {
        console.log("MongoDB Connected...");
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    });

module.exports = {
  express,
  mongoose,
  uuidv4,
  bcrypt,
  jwt,
  cors,
  app,
  port,
  secretKey,
  mongourl,
  multer,
  GridFsStorage,
  Grid,
  crypto,
  path
};

