// src/import.js
const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const fs=require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());


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
  crypto,
  path,
  fs
};

