const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
  },
  favoriteGenres: [{
    type: String
  }],
  dateJoined: {
    type: Date,
    default: Date.now,
  }
});

const RatedBookSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "A user must have a username!"]
    },
    email: {
      type: String,
      required: [true, "A user must have an email!"],
      unique: true
    },
    userComments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    profile: ProfileSchema,
    ratedBooks: [RatedBookSchema],
    referredUsers: [{
      type: String,
      unique: true
    }],
  },

  { timestamps: true }
);




module.exports = mongoose.model("User", UserSchema);