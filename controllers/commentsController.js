import PostComment from '../models/Comments.js';
import { v4 as uuidv4 } from 'uuid';

// Add a comment to a post
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commentedUserId, content } = req.body;

  if (!commentedUserId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newComment = {
    commentId: uuidv4(),
    commentedUserId,
    content,
    likeUsers: [],
    likeCount: 0,
    replyCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    replies: [],
  };

  try {
    const updatedPost = await PostComment.findOneAndUpdate(
      { postId },
      { $push: { comments: newComment } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Commented successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const postComments = await PostComment.findOne({ postId });

    if (!postComments) {
      return res.status(404).json({ message: "Comments not found" });
    }

    res.status(200).json({ message: "Comments retrieved successfully", comments: postComments.comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a reply to a comment
export const addReply = async (req, res) => {
  const { postId, commentId } = req.params;
  const { commentedUserId, content } = req.body;

  if (!commentedUserId || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newReply = {
    commentId: uuidv4(),
    commentedUserId,
    content,
    likeUsers: [],
    likeCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    const updatedPost = await PostComment.findOneAndUpdate(
      { postId, "comments.commentId": commentId },
      {
        $push: { "comments.$.replies": newReply },
        $inc: { "comments.$.replyCount": 1 },
      },
      { new: true, upsert: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post or comment not found" });
    }

    res.status(200).json({ message: "Replied successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
