import express from 'express';
import Watchlist from '../models/Watchlist.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Get user's watchlist
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching watchlist for user: ${userId}`);
    
    const watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      return res.status(200).json({ items: [] }); // Return empty watchlist if not found
    }
    
    res.status(200).json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
  }
});

// Add movie to watchlist
router.post('/add', async (req, res) => {
  try {
    const { userId, movieId, title, posterPath, releaseDate } = req.body;
    
    if (!userId || !movieId || !title) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find or create user's watchlist
    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      watchlist = new Watchlist({
        userId,
        items: []
      });
    }
    
    // Check if movie already exists in watchlist
    const movieExists = watchlist.items.some(item => item.movieId === movieId);
    
    if (movieExists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    
    // Add movie to watchlist
    watchlist.items.push({
      movieId,
      title,
      posterPath,
      releaseDate,
      addedAt: new Date()
    });
    
    await watchlist.save();
    
    // Create activity record
    await Activity.create({
      userId,
      type: 'watchlist',
      movieId,
      movieTitle: title,
      moviePosterPath: posterPath
    });
    
    res.status(201).json({
      message: 'Movie added to watchlist',
      watchlist
    });
  } catch (error) {
    console.error('Error adding movie to watchlist:', error);
    res.status(500).json({ message: 'Failed to add movie to watchlist', error: error.message });
  }
});

// Remove movie from watchlist
router.delete('/remove', async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find user's watchlist
    const watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Remove movie from watchlist
    watchlist.items = watchlist.items.filter(item => item.movieId !== movieId);
    
    await watchlist.save();
    
    res.status(200).json({
      message: 'Movie removed from watchlist',
      watchlist
    });
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    res.status(500).json({ message: 'Failed to remove movie from watchlist', error: error.message });
  }
});

export default router;