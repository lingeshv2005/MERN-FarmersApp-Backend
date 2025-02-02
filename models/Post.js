import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    postId:{ type:String, required:true, unique:true},
    userId:{ type:String, required:true },
    tags:{ type:[String], default:[] },
    postType:{ type:String, enum:['farmUpdate',"diseaseQuestion"], default:"farmUpdate"},
    content:{ type:String, required:true},
    images:{ type:[String]},
    videos:{ type:[String]},
    isShortFormVideo:{type:Boolean, default:false},
    isRepostable:{ type:Boolean, default:true},

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

const Post = mongoose.model("Post", postSchema);

export default Post;