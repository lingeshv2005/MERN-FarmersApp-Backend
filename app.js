const express=require("express");
const mongoose=require("mongoose");
const { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const app=express();
app.use(express.json());
const port=3000;
const secretKey="+8]'/[;.pl,12qaz`wsx345e[p;dcy\"gvrft7.;[8uhujio?nmkl7890-=";
const mongourl="mongodb://localhost:27017/farmers-social-media";

mongoose.connect(mongourl).then(() => {
        console.log("MongoDB Connected...");
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    });

const userSchema=new mongoose.Schema({
    userId: {type:String, unique:true, required:true},
    email: {type: String, unique: true ,default:""},
    username: {type: String, required: true, unique: true },
    phone: {type: String, unique: true ,default:""},
    password: {type: String, required: true }
});
const User=new mongoose.model("login",userSchema);

app.post("/api/signup",async (req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({message:"username and password are required"});
    }

    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({message:"username already exists"});
    }

    const hashedPassword=await bcrypt.hash(password,12);

    const newUser =new User({
        userId:uuidv4(),
        username,
        password:hashedPassword
    });

    await newUser.save();
    return res.status(201).json({message:"user registered successfully"})
});

app.get("/api/login",async (req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({message:"username and password required"});
    }

    const user=await User.findOne({username});
    if(!user){
        return res.status(404).json({message:"user not found"});
    }

    const isValid =await bcrypt.compare(password,user.password);
    if(!isValid){
        return res.status(401).json({message:"Invalid cridentials"});
    }

    const token=jwt.sign({username},secretKey,{expiresIn:"1h"});
    return res.status(201).json({message:"user login successfull","token":token});
});



function authenticationToken(req,res,next){

    const token =req.header("Authorization")?.split(" ")[1];
    if(!token)return res.sendStatus(401).json({message:"null token"});

    jwt.verify(token,secretKey,(err,user)=>{
        if(err) return res.status(403).json({message:"invalid token"});
        
        req.user=user;
        next();
    })
}



const postSchema=mongoose.Schema({
    postId:{ type:String, required:true, unique:true},
    userId:{ type:String, required:true },
    tags:{ type:[String], required:true},
    postType:{ type:String, enum:['farmUpdate',"diseaseQuestion"], default:"farmUpdate"},
    content:{ type:String, required:true},
    images:{ type:[String]},
    videos:{ type:[String]},
    isRepostable:{ type:String, default:true},

    viewUsers:{ type:[String], default:{}},
    likeUsers:{ type:[String], default:{}},
    repostUsers:{ type:[String], default:{}},
    viewCount:{ type:Number,default:0},
    likeCount:{ type:Number, default:0},
    repostCount:{ type:Number, default:0},
    commentCount:{ type:Number, default:0},
    reportCount:{ type:Number, default:0},

    createdAt:{type:Date, default:Date.now },
    updatedAt:{type:Date, default:Date.now },
});
const Post=new mongoose.model("post",postSchema);

app.post("/api/createpost",async (req,res)=>{
    const {userId,postType,tags,content,images,videos,isRepostable}=req.body;
    if(!userId || !postType || !content){
        return res.status(400).json({message:"User ID, post type, and content are required."})
    }

    const newPost=new Post({
        userId,
        postId:uuidv4(),
        tags:tags || [],
        postType,
        content,
        images:images || [],
        videos:videos || [],
        isRepostable:isRepostable !== undefined? isRepostable:true,
    });

    await newPost.save();
    return res.status(200).json({message:"post created successfully",post:newPost});
});

app.get("/api/getpost/:postId",async (req,res)=>{
    const {postId}=req.params;

    const post= await Post.findOne({postId});

    if(!post){
        return res.status(404).json({message:"post not found"})
    }

    return res.status(200).json({post});
});

app.put("/api/updatepost/:postId",async (res,req)=>{
    const {postId}=req.params;
    const updatedata=req.body;

    const updatedPost = await Post.findOneAndUpdate(
        {postId},
        {...updatedata, updatedAt:Date.now()},
        {new: true, runValidators:true }
    );

    if(!updatedPost){
        return res.status(404).json({message:"post not found"});
    }

    return res.status(200).json({message: "post updated successfully",post:updatedPost});
});

app.put("/api/addlike/:postId",async (res,req)=>{
    const {postId}=req.params;
    const {likedUserId}=req.body;

    const updatedPost = await Post.findOneAndUpdate(
        {postId,likeUsers:{$ne: likedUserId}},
        {
            $push: {likeUsers:likedUserId},
            $inc: {likeCount:1},
        },
        {new: true}
    );
    if(!updatedPost){
        return res.status(400).json({message:"user has already liked the post or post not found"})
    }

    return res.status(200).json({message: "Post liked successfully.", post: updatedPost})
});

app.put("/api/addrepost/:postId",async (res,req)=>{
    const {postId}=req.params;
    const {repostUserId}=req.body;

    const updatedPost = await Post.findOneAndUpdate(
        {postId,repostUsers:{$ne: repostUserId}},
        {
            $push: {repostUsers:repostUserId},
            $inc: {repostCount:1},
        },
        {new: true}
    );
    if(!updatedPost){
        return res.status(400).json({message:"user has already liked the post or post not found"})
    }

    return res.status(200).json({message: "Post liked successfully.", post: updatedPost})
});

app.put("/api/addview/:postId",async (res,req)=>{
    const {postId}=req.params;
    const {viewUserId}=req.body;

    const updatedPost = await Post.findOneAndUpdate(
        {postId,viewUsers:{$ne: viewUserId}},
        {
            $push: {viewUsers:viewUserId},
            $inc: {viewCount:1},
        },
        {new: true}
    );
    if(!updatedPost){
        return res.status(400).json({message:"user has already liked the post or post not found"})
    }

    return res.status(200).json({message: "Post liked successfully.", post: updatedPost})
});


const childCommentSchema=mongoose.Schema({
    commentId: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    likeUsers: { type: [String], default: [] },
    likeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const commentSchema=mongoose.Schema({
    commentId: { type: String, required: true, unique: true },
    commentedUserId: { type: String, required: true },
    content: { type: String, required: true },
    likeUsers: { type: [String], default: [] },
    likeCount: { type: Number, default: 0 }, 
    replyCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
    replies: [childCommentSchema]
});
const postCommentSchema=mongoose.Schema({
    postId:{type: String,required:true},
    comments:[commentSchema]
});

const Comment=new mongoose.model("comments",postCommentSchema);

app.post("/api/comment/:postId",async (req,res)=>{
    const {postId}=req.params;
    const {commentedUserId,content}=req.body;

    if ( !commentedUserId || !content) {
        return res.status(400).json({ message: "missing required fields" });
    }

    const newComment={
        commentId:uuidv4(),
        commentedUserId,
        content,
        likeUsers:[],
        likeCount:0,
        replyCount:0,
        createdAt:Date.now(),
        updatedAt:Date.now(),
        replies:[]
    };

    const updatedComment =await Comment.findOneAndUpdate(
        {postId},
        {$push:{comments:newComment}},
        {new:true,upsert:true},
    );
    res.status(200).json({message:"commented successfully",post:updatedComment});

});


app.post("/api/reply/:postId/:commentId",async (req,res)=>{
    const {postId,commentId}=req.params;
    const {content,commentedUserId}=req.body;

    if (!commentedUserId || !content) {
        return res.status(400).json({ message: "missing required fields" });
    }

    const newChildComment={
        commentId:uuidv4,
        commentedUserId,
        content,
        likeUsers:[],
        likeCount:0,
        createdAt:Date.now(),
        updatedAt:Date.now(),
    };

    const updatedChildComment =await Comment.findOneAndUpdate(
        {postId,commentId},
        {$push:{replies:newChildComment}},
        {new:true,upsert:true},
    );
    res.status(200).json({message:"replied successfully",post:updatedChildComment});

});