const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
  },
  favoriteGenres: [{
    type: String
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  dateJoined: {
    type: Date,
    default: Date.now,
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be 8 characters or longer"]
    },
    profile: ProfileSchema,
    purchasedBooks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }],
    isAdmin: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
