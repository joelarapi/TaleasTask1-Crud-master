const User = require("../models/user.model");


module.exports.addRatingToUser = async (userId, bookId, rating) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const ratedBook = user.ratedBooks.find(rateBook => rateBook.bookId.toString() === bookId);

  if (ratedBook) {
    ratedBook.rating = rating; 
  } else {
    user.ratedBooks.push({ bookId, rating }); 
  }

  await user.save();
};

