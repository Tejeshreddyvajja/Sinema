import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String
  },
  releaseDate: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String, // Using clerkId
    required: true,
    index: true
  },
  items: [watchlistItemSchema]
}, { timestamps: true });

// Ensure each user can only have one movie once in their watchlist
watchlistSchema.index({ userId: 1, 'items.movieId': 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;