import UserDetails from '../models/UserDetails.js';
import User from '../models/User.js';

// Controller to update user details
export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const userDetails = req.body;

  try {

    const user =await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
      }

    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      { ...userDetails, updatedAt: Date.now() , userId, username:user.username},
      { new: true ,upsert:true}
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Not Updated' });
    }

    return res.status(200).json({ message: 'User details updated successfully', userDetails: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get user details
export const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserDetails.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
