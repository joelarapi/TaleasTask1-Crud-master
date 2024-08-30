const mongoose = require('mongoose')

const PublicFigureSchema  = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  industries: {
    type: [String],
    required: true
  },
  recommendedBooks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]

}, {timestamps: true})

mongoose.exports = mongoose.model('PublicFigure', PublicFigureSchema)