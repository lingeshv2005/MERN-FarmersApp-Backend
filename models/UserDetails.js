import mongoose from 'mongoose';

const animalTypes = new mongoose.Schema({
    animalName: { type: String },
    total: { type: Number },
});

const userDetailsSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    userType: { type: String, default: "farmer", enum: ["farmer", "veterinarian"] },
    location: { type: String, required: true },
    animalTypes: [animalTypes],
    profilePicture: { type: String, default: "avatar.svg" },
    bio: { type: String, default: "" },
    dateOfBirth: { type: String, default: Date.now() },
    gender: { type: String, enum: ["male", "female", "other", "prefernottosay"] },
    verificationStatus: { type: String, default: false },
    website: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    totalPosts: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalReposts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

export default UserDetails;
