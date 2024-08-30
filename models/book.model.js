const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  { 
    title: {
      type: String,
      required: [true, "Book name is required"]
    }, 
    author: {
      type: String, 
      required: [true, "A book must have an author"]
    }, 
    description:{
      type:String,
    },
    publish_date: {
      type: String,
      required: [true, "A publish date must be included"]
    }, 
    averageRating:{
      type: Number 
    },
    ratings: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }],
    comments:[{
      type: mongoose.Schema.Types.ObjectId , 
      ref: "Comment"
    }],
    recommendedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicFigure'
    }]
  }
)

module.exports = mongoose.model("Book" ,BookSchema);

