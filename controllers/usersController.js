import User from '../models/User.js';

// ✅ Search users by partial username
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from request
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Find users whose username contains the search query (case-insensitive)
        const users = await User.find({ username: { $regex: query, $options: "i" } }).select("userId username profilePic");

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
