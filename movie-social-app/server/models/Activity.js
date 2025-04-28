import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: String, // Using clerkId
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['watched', 'review', 'watchlist', 'friend', 'post', 'comment', 'like']
  },
  movieId: {
    type: String
  },
  movieTitle: {
    type: String
  },
  moviePosterPath: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  content: {
    type: String
  },
  friendId: {
    type: String
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;