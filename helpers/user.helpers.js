const User = require("../models/user.model");
const Purchase = require("../models/purchase.model");
const Book = require("../models/book.model");

module.exports.addRatingToBook = async (userId, bookId, rating) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    const purchase = await Purchase.findOne({ user: userId, book: bookId });
    if (!purchase) {
      throw new Error("User must purchase the book before rating it");
    }

    const existingRating = book.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; 
    } else {
      book.ratings.push({ userId, rating }); 
    }

    const sum = book.ratings.reduce((acc, r) => acc + r.rating, 0);
    book.averageRating = sum / book.ratings.length;

    await book.save();
    await module.exports.addRatingToUser(userId, bookId, rating);//e shtojme sepse duam qe te ruajme rating e user

  } catch (err) {
    throw new Error(err.message);
  }
};

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
}
