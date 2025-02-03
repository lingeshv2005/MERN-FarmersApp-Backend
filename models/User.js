import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now},
});

export default mongoose.model("User", userSchema);
