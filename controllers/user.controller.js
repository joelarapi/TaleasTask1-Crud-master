const User = require("../models/user.model");
const Purchase = require("../models/purchase.model");

module.exports.createUser = async (req, res) => {
  const { userName, email } = req.body; // marrim username dhe email nga body

  try {
    const existingUser = await User.findOne({ email }); //kontrollojme nese ekziston nje user me kte email 
    if (existingUser) { 
      return res.status(400).json({ error: "Email already in use" });
    }
      //krijojme user te ri dhe e ruajme ne databaze
    const newUser = new User({ userName, email });
    const savedUser = await newUser.save();

    let savedProfile;
    try {
      //krijojme  nje new Profile qe eshte e lidhur me id e userit 
      const newProfile = new Profile({ user: savedUser._id });
      savedProfile = await newProfile.save();
      //bejme update userin me referencen e Profile 
      savedUser.profile = savedProfile._id;
      await savedUser.save();
    } catch (profileErr) {
      console.error("Failed to create profile:", profileErr);
    }

    res.status(201).json({ 
      user: savedUser, 
      profile: savedProfile || null, // e kam lene qe mund te jete edhe bosh qe mund te update me vone nga useri  vete
      message: savedProfile ? "User and profile created successfully" : "User created, but profile creation failed. Please set up your profile later."
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error while creating user",
      details: err.message,
    });
  }
};


module.exports.findOneSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate('profile');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: "Server error while fetching users",
      details: err.message,
    });
  }
};

module.exports.updateExistingUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

module.exports.deleteExistingUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await Profile.findOneAndDelete({ user: deletedUser._id });

    res.json({ message: "User and associated profile deleted successfully", result: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};



module.exports.purchaseBook = async (req, res) => {
  try {
    const { id: userId } = req.params; 
    const { bookId } = req.body;      
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { purchasedBooks: bookId } }, // $addToSet prevents duplication , if a book is already in the array it wont add it 
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Book purchased successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
