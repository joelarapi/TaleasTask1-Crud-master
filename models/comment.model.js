const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema(
  {
    text:{
      type: String,
       required : [true, " A comment must have text inside it !"], 
       minlength : [1 , "A comment must include at least one character"]
    }, 
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "A comment must belong to a user"]
    }, 
    book:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true , "A comment must be associated with a book"]
    }, 
    date:{
      type: Date,
      default : Date.now,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    replies:[
      {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  }
);

module.exports = mongoose.model("Comment", CommentSchema)

