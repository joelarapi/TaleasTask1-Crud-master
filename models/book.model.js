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
      type: Date,
      required: [true, "A publish date must be included"]
    }, 
    averageRating:{
      type: Number 
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }],
    recommendedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicFigure'
    }],
    imageUrl: { 
      type: String,
      required:false,
    }  
  }
)

module.exports = mongoose.model("Book" ,BookSchema);

