const User = require("../models/user.model");
const Purchase = require("../models/purchase.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



// const createProfile = async (userId) => {
//   try {
//     const newProfile = new Profile({ user: userId });
//     const savedProfile = await newProfile.save();
//     return savedProfile;
//   } catch (profileErr) {
//     console.error("Failed to create profile:", profileErr);
//     return null;
//   }
// };
module.exports.createUser = async (req, res) => {
  const { userName, email, password, isAdmin } = req.body; // marrim username dhe email nga body
  console.log("Password:", password);
  try {
    const existingUser = await User.findOne({ email }); //kontrollojme nese ekziston nje user me kte email 
    if (existingUser) { 
      return res.status(400).json({ error: "Email already in use" });
    }
    //hashimi i passwordid  
    const hashedPassword = await bcrypt.hash(password, 10);

          //krijojme user te ri dhe e ruajme ne databaze
          const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            isAdmin,
            profile: {
              bio: '',
            }
          });
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
    console.error("Error details:", err); 
    res.status(500).json({
      error: "Server error while creating user",
      details: err.message,
    });
  }
};


module.exports.findOneSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
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
      res.status(500).json({ message: "Something went wrong", error: err.message });
    });
};


module.exports.deleteExistingUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User and profile deleted successfully", result: deletedUser });
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


module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' } 
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: '1d' } 
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true, 
      secure: true, 
      sameSite: 'Strict', 
      maxAge: 24 * 60 * 60 * 1000, 
    }); 

    res.json({
      accessToken: accessToken,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'error', error: err.message });
  }
};

module.exports.logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //successful status , no content

  const refreshToken = cookies.jwt;

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); 

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(204);

  user.refreshToken = "";
  await user.save();

  res.json({ message: "Logged out" });
};




module.exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin : user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );

    res.json({ accessToken });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};
