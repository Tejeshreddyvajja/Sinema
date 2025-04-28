import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Endpoint to create or update a user in MongoDB when they log in with Clerk
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, firstName, lastName, email, profilePicture } = req.body;
    
    if (!clerkId) {
      return res.status(400).json({ message: 'clerkId is required' });
    }

    // Find user by clerkId
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.profilePicture = profilePicture || user.profilePicture;
      await user.save();
      
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
      
      return res.status(201).json({ 
        message: 'User created successfully', 
        user: newUser 
      });
    }
  } catch (error) {
    console.error('Error syncing user:', error);
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

export default router;