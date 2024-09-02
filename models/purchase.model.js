const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  price:{
    type: Number,
  }
});



module.exports = mongoose.model('Purchase', PurchaseSchema);
