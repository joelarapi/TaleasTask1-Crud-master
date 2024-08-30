const User = require('../models/user.model');


module.exports.updateProfile = async (req, res) => {
  try { 
    const { bio, favoriteGenres } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        'profile.bio': bio, 
        'profile.favoriteGenres': favoriteGenres 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser.profile);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const user  = await User.findById(req.params.userId);
    if(!user || !user.profile){
      return res.status(404).json({message: 'Profile not found'})
    }
    res.json(user.profile)
  }catch (err){
    res.status(500).json({message: 'Something went wrong', error:err.message})
  }
}