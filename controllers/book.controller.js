const Book = require("../models/book.model");
const User = require('../models/user.model')
const mongoose = require('mongoose');
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
    console.log("Request Body:", req.body);

    if (req.body.publish_date) {
      req.body.publish_date = new Date(req.body.publish_date);
    }

    const newlyCreatedBook = await Book.create(req.body);
    res.status(201).json(newlyCreatedBook);
  } catch (err) {
    console.error("Error creating book:", err); 
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

module.exports.findBooksByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids || typeof ids !== 'string') {
      return res.status(400).json({ message: "Invalid or missing 'ids' query parameter" });
    }

    const idArray = ids.split(',').map(id => id.trim()).filter(id => id);
    console.log('Fetching books with IDs:', idArray);  

    if (idArray.length === 0) {
      return res.status(400).json({ message: "No valid IDs provided" });
    }

    if (!idArray.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const books = await Book.find({ '_id': { $in: idArray } });
    console.log('Books found:', books);  

    const foundBookIds = books.map(book => book._id.toString());
    console.log('Found book IDs:', foundBookIds);


    const missingBookIds = idArray.filter(id => !foundBookIds.includes(id));
    if (missingBookIds.length > 0) {
      console.log('Missing book IDs:', missingBookIds);
    }


    res.json({
      books,
      missingBookIds,
      message: missingBookIds.length > 0 ? `Some books were not found: ${missingBookIds.join(', ')}` : 'All books found'
    });
  } catch (err) {
    console.error('Error fetching books by IDs:', err);
    res.status(500).json({ message: "Error fetching books by IDs", error: err.message });
  }
};




module.exports.findAllCommentsInABook = (req, res) => {
  const bookId = req.params.bookId;

  Comment.find({ book: bookId })
    .populate({
      path: 'user', 
      select: 'username' 
    })
    .populate({
      path: 'replies',
      populate: { path: 'user', select: 'username' } 
    })
    .exec((err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(comments);
    });
};

