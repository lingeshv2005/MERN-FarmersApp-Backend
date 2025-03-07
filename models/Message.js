// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//     messagedUserId: {type:String, required:true},
//     isDeletedSoft: {type:Boolean ,default:false},
//     isDeletedHard: {type:Boolean ,default:false},
//     content: {type: String, required: true},
//     reaction: {type: String, default: "" },
//     messageType: {type: String, enum: ["video", "text", "image", "document"], required: true},
//     status: {type: String, enum: ["sent", "delivered", "read"], default: "sent"},
//     seenAt: {type: Date, default: null },
//     isEdited: { type: Boolean, default: false},    
//     createdAt: {type:Date, default: Date.now},
//     updatedAt: {type:Date, default: Date.now},
// });

// const individualMessageSchema = new mongoose.Schema({
//     communicationId: {type:String, required:true, },
//     userId1: {type:String, required:true},
//     userId2: {type:String ,required:true},
//     messages: [messageSchema],    
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
// });

// const IndividualMessage =mongoose.model("IndividualChat", individualMessageSchema);
// export default IndividualMessage;


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    messagedUserId: { type: String, required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["video", "text", "image", "document"], required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    reaction: { type: String, default: "" },
    seenAt: { type: Date, default: null },
    isEdited: { type: Boolean, default: false },
    isDeletedSoft: { type: Boolean, default: false },
    isDeletedHard: { type: Boolean, default: false },
}, { timestamps: true });

const individualMessageSchema = new mongoose.Schema({
    communicationId: { type: String, required: true },
    userId1: { type: String, required: true },
    userId2: { type: String, required: true },
    messages: [messageSchema],
}, { timestamps: true });

const IndividualMessage = mongoose.model("IndividualMessage", individualMessageSchema);
export default IndividualMessage;
