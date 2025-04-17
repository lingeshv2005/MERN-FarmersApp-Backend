import UserDetails from '../models/UserDetails.js';
import User from '../models/User.js';

// Controller to update user details
export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const userDetails = req.body;

  try {
    const user = await User.findOne({ userId });
    console.log("User Found:", user);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      { ...userDetails, updatedAt: Date.now(), username: user.username },
      { new: true, upsert: true }
    );
  
    console.log("Updated User Details:", updatedUser);
  
    if (!updatedUser) {
      return res.status(404).json({ message: "Not Updated" });
    }
  
    return res.status(200).json({ message: "User details updated successfully", userDetails: updatedUser });
  
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};  



// Controller to get user details
export const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserDetails.findOne({ userId });

    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addFollower =async (req,res)=>{
  const { userId } = req.params;
  const {followerId} =req.body;

  try{
    const updateUserDetails=await UserDetails.findOneAndUpdate(
      { userId, followersId: { $ne: followerId } }, // Prevent duplicate followers
      { $push: { followersId: followerId }, $inc:{followersCount:1}},
      { new: true }
    );

    if(!updateUserDetails){
      return res.status(200).json({ message: 'Already following' });
    }

    return res.status(200).json({ message: 'Follower added successfully', userDetails: updateUserDetails });    
  }catch(error){
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const addHistory =async (req,res)=>{
  const { userId } = req.params;
  const {postId} =req.body;

  try{
    const updateUserDetails=await UserDetails.findOneAndUpdate(
      {userId, viewedPostsId:{$ne:postId}},
      { $push: { viewedPostsId: postId }, $inc:{totalViews:1}},
      { new: true }
    );

    if(!updateUserDetails){
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'History added successfully', userDetails: updatedUser });
    
  }catch(error){
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const addCommunicationId = async (req, res) => {
  const { userId } = req.params;
  const { communicationId } = req.body;

  try {
    console.log("hyfbnhuf");
    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      { $push: { communicationIds: communicationId } }, // ✅ Prevents duplicates
      { new: true, upsert: true } // ✅ Ensures document is created if not found
    );

    console.log("Updated User:", updatedUser); // ✅ Log user data to debug

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "CommunicationId added successfully", userDetails: updatedUser });
  } catch (error) {
    console.error("Error in addCommunicationId:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getCommunicationIds = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await UserDetails.findOne({ userId }, 'communicationIds'); // Fetch only communicationIds
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ communicationIds: user.communicationIds || [] });
    } catch (error) {
      console.error("Error in getCommunicationIds:", error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }  
};

export const addGroupCommunicationId = async (req, res) => {
  const { userId } = req.params;
  const { communicationId } = req.body;

  try {
    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      { $push: { groupCommunicationIds: communicationId } }, // ✅ Prevents duplicates
      { new: true, upsert: true } // ✅ Ensures document is created if not found
    );

    console.log("Updated User:", updatedUser); // ✅ Log user data to debug

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "CommunicationId added successfully", userDetails: updatedUser });
  } catch (error) {
    console.error("Error in addCommunicationId:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getGroupCommunicationIds = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserDetails.findOne({ userId }, 'groupCommunicationIds'); // Fetch only communicationIds
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user);
    return res.status(200).json({ groupCommunicationIds: user.groupCommunicationIds || [] });
  } catch (error) {
    console.error("Error in getCommunicationIds:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }  
};


// Add Channel Communication ID
export const addChannelCommunicationId = async (req, res) => {
  const { userId } = req.params;
  const { communicationId } = req.body;

  try {
    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      { $push: { channelCommunicationIds: communicationId } }, // Prevent duplicates
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Channel communication ID added successfully", userDetails: updatedUser });
  } catch (error) {
    console.error("Error in addChannelCommunicationId:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Channel Communication IDs
export const getChannelCommunicationIds = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserDetails.findOne({ userId }, 'channelCommunicationIds');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ channelCommunicationIds: user.channelCommunicationIds || [] });
  } catch (error) {
    console.error("Error in getChannelCommunicationIds:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
