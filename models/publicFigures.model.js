const mongoose = require('mongoose')

const PublicFigureSchema  = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  industries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Industry",
  }],
  recommendedBooks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  imageUrl: { 
    type: String,
    required:false,
  }

}, {timestamps: true})

module.exports = mongoose.model('PublicFigure', PublicFigureSchema)
