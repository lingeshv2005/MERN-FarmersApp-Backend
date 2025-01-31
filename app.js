const { 
    express, 
    mongoose, 
    uuidv4, 
    bcrypt, 
    jwt, 
    cors, 
    app, 
    port, 
    secretKey, 
    mongourl 
  } = require('./import');
const {upload} =require("./photo");

app.use(express.json());
app.use(cors());


const userSchema=new mongoose.Schema({
    userId: {type:String, unique:true, required:true},
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    lastLogin:{type:Date, default:Date.now},
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

    const newUser = new User({
        userId:uuidv4(),
        username,
        password:hashedPassword
    });

    await newUser.save();
    return res.status(201).json({message:"user registered successfully"})
});

app.get("/api/login",async (req,res)=>{
    const {username,password}=req.query;
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
    return res.status(201).json({message:"user login successfull","token":token,userId:user.userId});
});

const animalTypes=new mongoose.Schema({
    animalName:{type:String},
    total:{type:Number}
})

const userDetailsSchema=new mongoose.Schema({
    userId: {type:String, unique:true, required:true},
    email: {type: String, unique: true, required: true},
    username: {type: String, required: true },
    phone: {type: String, unique: true, required:true},
    name: {type: String, required:true, },
    userType: {type:String, default:"farmer", enum:["farmer","veterinarian"]},
    location: {type:String, required:true},
    animalTypes: [animalTypes],
    profilePicture:{type:String,default:"avatar.svg"},
    bio:{type:String,default:""},
    dateOfBirth:{type:String, default:Date.now()},
    gender:{type:String,enum:["male","female","other","prefernottosay"]},
    verificationStatus:{type:String, default:false},
    website:{type:String, default:""},
    facebook:{type:String,default:""},
    instagram:{type:String,default:""},
    twitter:{type:String,default:""},
    whatsapp:{type:String,default:""},
    totalPosts:{type:Number,default:0},
    totalLikes:{type:Number,default:0},
    totalReposts:{type:Number,default:0},
    isActive:{type:Boolean,default:true},
    lastLogin:{type:Date,default:Date.now()},
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()},
});


const UserDetails=new mongoose.model("userDetails",userDetailsSchema);


app.put("/api/updateuserdetails/:userId",async (req,res)=>{
    const {userId}=req.params;
    const userDetails=req.body;
    
    const user=await User.findOne({userId});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const updatedUserDetails =await UserDetails.findOneAndUpdate(
        {userId},
        {...userDetails,username:user.username},
        {new:true,upsert:true});

    return res.status(200).json({message:"user details updated successfully",userDetails:updatedUserDetails});
    
});

app.get("/api/getuserdetails/:userId",async(req,res)=>{
    const {userId}=req.params;

    try {
        const userDetails = await UserDetails.findOne({ userId });

        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(userDetails);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }

});

const postSchema=mongoose.Schema({
    postId:{ type:String, required:true, unique:true},
    userId:{ type:String, required:true },
    tags:{ type:[String], required:true},
    postType:{ type:String, enum:['farmUpdate',"diseaseQuestion"], default:"farmUpdate"},
    content:{ type:String, required:true},
    images:{ type:[String]},
    videos:{ type:[String]},
    isShortFormVideo:{type:Boolean, default:false},
    isRepostable:{ type:String, default:true},

    viewUsers:{ type:[String], default:[]},
    likeUsers:{ type:[String], default:[]},
    repostUsers:{ type:[String], default:[]},
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
    const {userId,postType,tags,content,images,videos,isShortFormVideo}=req.body;
    if(!userId || !postType || !content){
        return res.status(400).json({message:"User ID, post type, and content are required."})
    }
 
    let isRepostable=!isShortFormVideo;

    const newPost=new Post({
        userId,
        postId:uuidv4(),
        tags:tags || [],
        postType,
        content,
        images:images || [],
        videos:videos || [],
        isShortFormVideo:!!isShortFormVideo,
        isRepostable,
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
// get all post by userId
app.get("/api/getpost/user/:userId",async (req,res)=>{
    const {userId}=req.params;

    const posts= await Post.find({userId});

    return res.status(200).json({posts});
});
// get all posts
app.get("/api/getposts",async (req,res)=>{

    const posts= await Post.find();

    if(!posts){
        return res.status(404).json({message:"no post not found"})
    }

    return res.status(200).json({posts});
});


app.put("/api/updatepost/:postId",async (req,res)=>{
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

app.put("/api/addlike/:postId",async (req,res)=>{
    const {postId}=req.params;
    const {likeUserId}=req.body;

    const updatedPost = await Post.findOneAndUpdate(
        {postId,likeUsers:{$ne: likeUserId}},
        {
            $push: {likeUsers:likeUserId},
            $inc: {likeCount:1},
        },
        {new: true}
    );
    if(!updatedPost){
        return res.status(400).json({message:"user has already liked the post or post not found"})
    }

    return res.status(200).json({message: "Post liked successfully.", post: updatedPost})
});

app.put("/api/addrepost/:postId",async (req,res)=>{
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

app.put("/api/addview/:postId",async (req,res)=>{
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

app.get("/api/getcomment/:postId",async (req,res)=>{
    const {postId}=req.params;

    const comments =await Comment.find({postId});
    res.status(200).json({message:"retervied successfully",post:comments});

});


app.post("/api/reply/:postId/:commentId",async (req,res)=>{
    const {postId,commentId}=req.params;
    const {content,commentedUserId}=req.body;

    if (!commentedUserId || !content) {
        return res.status(400).json({ message: "missing required fields" });
    }

    const newChildComment={
        commentId:uuidv4(),
        commentedUserId,
        content,
        likeUsers:[],
        likeCount:0,
        createdAt:Date.now(),
        updatedAt:Date.now(),
    };

    const updatedChildComment =await Comment.findOneAndUpdate(
        {postId,"comments.commentId":commentId},
        {
            $push:{"comments.$.replies":newChildComment},
            $inc: {"comments.$.replyCount":1}
        },
        {new:true,upsert:true},
    );

    if (!updatedChildComment) {
        return res.status(404).json({ message: "Post or comment not found" });
    }

    res.status(200).json({message:"replied successfully",post:updatedChildComment});

});


app.get("/api/comment/:postId",async(req,res)=>{
    const {postId}=req.params;

    try {
        const comment = await Comment.findOne({ postId });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
// https://chatgpt.com/c/67970938-c5f8-8011-8490-0608c66fe94e




app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
  
    res.json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`,
    });
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

