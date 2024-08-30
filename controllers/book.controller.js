const Book = require("../models/book.model");
const User = require('../models/user.model')
const { addRatingToUser } = require("../helpers/user.helpers")


module.exports.findAllBooks = (req, res) => {
  Book.find()
    .then((allBooks) => {
      res.json(allBooks);
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          message: "Server error while fetching books",
          error: err.message,
        });
    });
};

module.exports.findOneSingleBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((oneSingleBook) => {
      if (!oneSingleBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(oneSingleBook);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

module.exports.createNewBook = (req, res) => {
  Book.create(req.body)
    .then((newlyCreatedBook) => {
      res.status(201).json(newlyCreatedBook);
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          message: "Server error while creating book",
          error: err.message,
        });
    });
};

module.exports.updateExistingBook = (req, res) => {
  Book.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(updatedBook);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

module.exports.deleteExistingBook = (req, res) => {
  Book.findOneAndDelete({ _id: req.params.id })
    .then((deletedBook) => {
      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json({ message: "Book deleted successfully", result: deletedBook });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
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