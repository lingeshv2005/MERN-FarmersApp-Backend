import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: "./config/config.env" });

const secretKey = process.env.secretkey;

export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            userId: uuidv4(),
            username,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: "1h" });
        return res.status(200).json({ message: "User login successful", token, userId: user.userId });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};




export const googleLogin = async (req, res) => {
    try {
        const { email,email_verified,sub,picture,username } = req.body;

        if(!username){
            username = email.split('@')[0];
        }
        if (!username || !email || email_verified) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = new User({
            userId: uuidv4(),
            username,
            email,
            googleId:sub,
            profilePic:picture,
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
