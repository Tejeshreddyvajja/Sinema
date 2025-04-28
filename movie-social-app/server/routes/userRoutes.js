import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Endpoint to create or update a user in MongoDB when they log in with Clerk
router.post('/sync', async (req, res) => {
  try {
    console.log('📥 User sync endpoint hit with data:', JSON.stringify(req.body, null, 2));
    
    const { clerkId, firstName, lastName, email, profilePicture } = req.body;
    
    if (!clerkId) {
      console.error('❌ Missing clerkId in request');
      return res.status(400).json({ message: 'clerkId is required' });
    }

    // Find user by clerkId
    let user = await User.findOne({ clerkId });
    console.log('🔍 User lookup result:', user ? `Found user: ${user._id}` : 'User not found');

    if (user) {
      // Update existing user
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();
      
      console.log('✅ User updated successfully:', user._id);
      return res.status(200).json({ 
        message: 'User updated successfully', 
        user 
      });
    } else {
      // Create new user
      const newUser = await User.create({
        clerkId,
        firstName,
        lastName,
        email,
        profilePicture,
        friends: []
      });
      
      console.log('✨ New user created:', newUser._id);
      return res.status(201).json({ 
        message: 'User created successfully', 
        user: newUser 
      });
    }
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    
    // Check for MongoDB-specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: Check your data format',
        error: error.message 
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({ 
        message: 'Duplicate entry error',
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error syncing user with database',
      error: error.message 
    });
  }
});

// Get user by clerk ID
router.get('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error fetching user',
      error: error.message 
    });
  }
});

// NEW ENDPOINT: Get user's friends by clerk ID
router.get('/:clerkId/friends', async (req, res) => {
  try {
    console.log(`📋 Fetching friends for user with clerkId: ${req.params.clerkId}`);
    const { clerkId } = req.params;
    
    // Find the user first
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      console.log(`❌ User not found with clerkId: ${clerkId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Populate the friends array to get full user objects
    const populatedUser = await User.findById(user._id).populate('friends');
    
    // Return the array of friend objects
    console.log(`✅ Found ${populatedUser.friends.length} friends for user ${clerkId}`);
    return res.status(200).json({ friends: populatedUser.friends });
  } catch (error) {
    console.error('❌ Error fetching friends:', error);
    return res.status(500).json({ 
      message: 'Error fetching friends',
      error: error.message 
    });
  }
});

export default router;