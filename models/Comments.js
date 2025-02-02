import mongoose from 'mongoose';

const childCommentSchema = mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  likeUsers: { type: [String], default: [] },
  likeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const commentSchema = mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  commentedUserId: { type: String, required: true },
  content: { type: String, required: true },
  likeUsers: { type: [String], default: [] },
  likeCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [childCommentSchema],
});

const postCommentSchema = mongoose.Schema({
  postId: { type: String, required: true },
  comments: [commentSchema],
});

const PostComment = mongoose.model("PostComment", postCommentSchema);

export default PostComment;
