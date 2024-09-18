const mongoose = require("mongoose");

const IndustrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Industry", IndustrySchema);
