const Book = require("../models/book.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");
const mongoose = require("mongoose");

module.exports.addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, content, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this book" });
    }

    const review = new Review({
      bookId,
      userId,
      rating,
      content,
    });

    await review.save();

    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review._id);

    if (!book.averageRating) {
      book.averageRating = rating;
    } else {
      book.averageRating =
        (book.averageRating * (book.reviews.length - 1) + rating) /
        book.reviews.length;
    }

    await book.save();

    await User.findByIdAndUpdate(userId, {
      $push: { "profile.reviews": review._id },
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error("Error in addReview:", err);
    res
      .status(500)
      .json({ message: "Error adding review", error: err.message });
  }
};

module.exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, content } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, content },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating review", error: err.message });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId, bookId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Book.findByIdAndUpdate(bookId, { $pull: { reviews: reviewId } });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { reviews: reviewId },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
};

module.exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ bookId })
      .populate('userId', 'userName')
      .lean()
      .exec();

    console.log('Populated reviews:', reviews);

    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

module.exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: "profile.reviews",
        populate: { path: "bookId", select: "title author" },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.profile.reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching user reviews", error: error.message });
  }
};
