import Post from '../models/Post.js';
import { v4 as uuidv4 } from 'uuid';

export const createPost = async (req, res) => {
    try {
        const { userId, postType, tags, content, images, videos, isShortFormVideo } = req.body;
        if (!userId || !postType || !content) {
            return res.status(400).json({ message: "User ID, post type, and content are required." });
        }

        const newPost = new Post({
            userId,
            postId: uuidv4(),
            tags: Array.isArray(tags) ? tags : [],
            postType,
            content,
            images: Array.isArray(images) ? images : [],
            videos: Array.isArray(videos) ? videos : [],
            isShortFormVideo: !!isShortFormVideo,
            isRepostable: !isShortFormVideo,
        });
        console.log(newPost);
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPost = async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
};

export const getPostsByUser = async (req, res) => {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    return res.status(200).json({ posts });
};

export const getAllPosts = async (req, res) => {
    const posts = await Post.find();
    if (!posts) {
        return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ posts });
};

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const updateData = req.body;

    const updatedPost = await Post.findOneAndUpdate(
        { postId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
    );

    if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
};

export const addLike = async (req, res) => {
    const { postId } = req.params;
    const { likeUserId } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
        { postId, likeUsers: { $ne: likeUserId } },
        { $push: { likeUsers: likeUserId }, $inc: { likeCount: 1 } },
        { new: true }
    );

    if (!updatedPost) {
        return res.status(400).json({ message: "User has already liked the post or post not found" });
    }

    return res.status(200).json({ message: "Post liked successfully.", post: updatedPost });
};

export const addRepost = async (req, res) => {
    const { postId } = req.params;
    const { repostUserId } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
        { postId, repostUsers: { $ne: repostUserId } },
        { $push: { repostUsers: repostUserId }, $inc: { repostCount: 1 } },
        { new: true }
    );

    if (!updatedPost) {
        return res.status(400).json({ message: "User has already reposted the post or post not found" });
    }

    return res.status(200).json({ message: "Post reposted successfully.", post: updatedPost });
};

export const addView = async (req, res) => {
    const { postId } = req.params;
    const { viewUserId } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
        { postId, viewUsers: { $ne: viewUserId } },
        { $push: { viewUsers: viewUserId }, $inc: { viewCount: 1 } },
        { new: true }
    );

    if (!updatedPost) {
        return res.status(400).json({ message: "User has already viewed the post or post not found" });
    }

    return res.status(200).json({ message: "Post viewed successfully.", post: updatedPost });
};
