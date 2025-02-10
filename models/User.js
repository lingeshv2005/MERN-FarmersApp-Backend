import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required:true },
    password: { type: String },
    email: {type:String, unique:true, sparse:true},
    googleId: {type:String, unique:true, sparse:true},
    profilePic: { type:String, },
    lastLogin: { type: Date, default: Date.now },
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now},
});

export default mongoose.model("User", userSchema);
