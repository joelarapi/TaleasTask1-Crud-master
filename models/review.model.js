const mongoose = require('mongoose')



const ReviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  upVotes: {
    type: Number,
    default: 0
  },
  downVotes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Review", ReviewSchema);