import express from 'express';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's activity feed
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching activities for user: ${userId}`);
    
    // Get user's activities
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 activities
    
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    res.status(500).json({ message: 'Failed to fetch activity feed', error: error.message });
  }
});

// Get activity feed for user and friends
router.get('/feed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching social activity feed for user: ${userId}`);
    
    // Get the user to find their friends
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's friends
    const friendIds = user.friends || [];
    
    // Get activities from user and their friends
    const activities = await Activity.find({
      $or: [
        { userId },
        { userId: { $in: friendIds } }
      ]
    })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 activities
    
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching social activity feed:', error);
    res.status(500).json({ message: 'Failed to fetch social activity feed', error: error.message });
  }
});

// Create a new activity
router.post('/create', async (req, res) => {
  try {
    const { userId, type, movieId, movieTitle, moviePosterPath, rating, content, friendId } = req.body;
    
    if (!userId || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create new activity
    const activity = await Activity.create({
      userId,
      type,
      movieId,
      movieTitle,
      moviePosterPath,
      rating,
      content,
      friendId,
      createdAt: new Date()
    });
    
    res.status(201).json({
      message: 'Activity created',
      activity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Failed to create activity', error: error.message });
  }
});

export default router;