const Book = require("../models/book.model");
const User = require('../models/user.model')
const { addRatingToUser } = require("../helpers/user.helpers")

module.exports.findAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching books",
      error: err.message,
    });
  }
};

module.exports.findOneSingleBook = async (req, res) => {
  try {
    const oneSingleBook = await Book.findOne({ _id: req.params.id });
    if (!oneSingleBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(oneSingleBook);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.createNewBook = async (req, res) => {
  try {
    const newlyCreatedBook = await Book.create(req.body);
    res.status(201).json(newlyCreatedBook);
  } catch (err) {
    res.status(500).json({
      message: "Server error while creating book",
      error: err.message,
    });
  }
};

module.exports.updateExistingBook = async (req, res) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.deleteExistingBook = async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ _id: req.params.id });
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully", result: deletedBook });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.addRating= async (req, res) =>{
  try{
    const {bookId, userId, rating } = req.body;
    const book = await Book.findById(bookId);
    if(!book){
      return res.status(404).json({message: 'Book not found'})
    }
    const existingRating = book.rating.find(r =>r.userId.toString() ===userId);
    if(existingRating){
      existingRating.rating = rating;
    }else {
      book.ratings.push({userId, rating})
    }

    const sum = book.ratings.reduce((acc, r) => acc + r.rating , 0);
    book.averageRating = sum / book.ratings.length;
    await book.save()
    await addRatingToUser(userId, bookId, rating);

    res.status(200).json({message : 'Rating added successfully', book})
  }catch(err){
    res.status(500).json({message: 'Something went wrong', error: err.message})
  }
}