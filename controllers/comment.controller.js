const Comment = require("../models/comment.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const Purchase = require("../models/purchase.model"); 

module.exports.createNewComment = async (req, res) => {
  const { text, user, book, parentComment } = req.body;

  if (!text || !user || !book) {
    return res.status(400).json({ message: "Text, user, and book fields are required" });
  }

  try {
    const hasPurchased = await Purchase.findOne({ user, book });
    if (!hasPurchased) {
      return res.status(403).json({ message: "You must purchase the book to leave a comment." });
    }

    const newComment = new Comment({
      text,
      user,
      book,
      parentComment
    });

    const savedComment = await newComment.save();

    const updatePromises = [
      Book.findByIdAndUpdate(book, { $push: { comments: savedComment._id } }, { new: true }),
      User.findByIdAndUpdate(user, { $push: { userComments: savedComment._id } }, { new: true })
    ];

    if (parentComment) {
      updatePromises.push(Comment.findByIdAndUpdate(parentComment, { $push: { replies: savedComment._id } }, { new: true }));
    }

    const [updatedBook, updatedUser, updatedParentComment] = await Promise.all(updatePromises);

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      comment: savedComment,
      book: updatedBook,
      user: updatedUser,
      parentComment: updatedParentComment
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while creating comment",
      error: err.message,
    });
  }
};



module.exports.findAllCommentsInABook = (req, res) => {
  const bookId = req.params.bookId;

  Comment.find({ book: bookId }) // kalojme book id si identifier sepse do na duhet te kerkojme per id ne routing
    .populate({
      //per gjithe komentet e vetem nje libri specifik
      path: "replies", //replies merr gjithe replies qe kemi ne koment
      populate: { path: "replies" }, // e shtojme per replies te replies (deeply nested replies)
    })
    .exec((err, comments) => {
      //exec , ben execute queryn
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(comments);
    });
};

module.exports.findOneSingleComment = (req, res) => {
  Comment.findOne({ _id: req.params.id })
    .then((oneSingleComment) => {
      if (!oneSingleComment) {
        return restart.status(404).json({ message: "Comment not found" });
      }
      res.json(oneSingleComment);
    })
    .catch((err) => {
      res.json({ message: "Something went wrong", error: err });
    });
};

module.exports.updateExistingComment = (req, res) => {
  Comment.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((updatedComment) => {
      res.json(updatedComment);
    })
    .catch((err) => {
      res.json({ message: "Something went wrong", error: err });
    });
};

module.exports.deleteExistingComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Book.findByIdAndUpdate(comment.book, {//remove the comments ref from the book
      $pull: { comments: commentId }
    });


    await User.findByIdAndUpdate(comment.user, {//remove the comments ref from the user
      $pull: { userComments: commentId }
    });


    if (comment.parentComment) {    // if the comment is a reply,we remove it from the parent comments replies
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId }
      });
    }
    await Comment.findByIdAndDelete(commentId); //delete the comment by id 


    res.status(200).json({ message: "Comment deleted successfully and all references removed" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};