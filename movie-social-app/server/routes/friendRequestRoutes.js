import express from 'express';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

const router = express.Router();

// Send a friend request
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    
    // Check if users exist
    const senderExists = await User.findOne({ clerkId: senderId });
    const receiverExists = await User.findOne({ clerkId: receiverId });
    
    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if they are already friends
    if (senderExists.friends.includes(receiverId)) {
      return res.status(400).json({ message: 'Users are already friends' });
    }
    
    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        message: 'A friend request already exists between these users',
        request: existingRequest
      });
    }
    
    // Create a new friend request
    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    
    res.status(201).json({
      message: 'Friend request sent successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Failed to send friend request', error: error.message });
  }
});

// Accept a friend request
router.post('/accept', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Find and update the request
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    // Add each user to the other's friends list
    await User.findOneAndUpdate(
      { clerkId: request.sender },
      { $addToSet: { friends: request.receiver } }
    );
    
    await User.findOneAndUpdate(
      { clerkId: request.receiver },
      { $addToSet: { friends: request.sender } }
    );
    
    res.status(200).json({
      message: 'Friend request accepted',
      request
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Failed to accept friend request', error: error.message });
  }
});

// Decline a friend request
router.post('/decline', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Find and update the request
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.status(200).json({
      message: 'Friend request declined',
      request
    });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ message: 'Failed to decline friend request', error: error.message });
  }
});

// Cancel a friend request
router.post('/cancel', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // Find and delete the request
    const request = await FriendRequest.findByIdAndDelete(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }
    
    res.status(200).json({
      message: 'Friend request cancelled',
    });
  } catch (error) {
    console.error('Error cancelling friend request:', error);
    res.status(500).json({ message: 'Failed to cancel friend request', error: error.message });
  }
});

// Get pending friend requests for a user
router.get('/pending/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    });
    
    // Get sender details for each request
    const requestsWithSenderDetails = await Promise.all(
      requests.map(async (request) => {
        const sender = await User.findOne({ clerkId: request.sender });
        return {
          ...request.toObject(),
          sender: {
            clerkId: sender.clerkId,
            firstName: sender.firstName,
            lastName: sender.lastName,
            profilePicture: sender.profilePicture
          }
        };
      })
    );
    
    res.status(200).json(requestsWithSenderDetails);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Failed to fetch pending requests', error: error.message });
  }
});

// Get all friend requests sent by a user
router.get('/sent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await FriendRequest.find({
      sender: userId
    });
    
    // Get receiver details for each request
    const requestsWithReceiverDetails = await Promise.all(
      requests.map(async (request) => {
        const receiver = await User.findOne({ clerkId: request.receiver });
        return {
          ...request.toObject(),
          receiver: {
            clerkId: receiver.clerkId,
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            profilePicture: receiver.profilePicture
          }
        };
      })
    );
    
    res.status(200).json(requestsWithReceiverDetails);
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ message: 'Failed to fetch sent requests', error: error.message });
  }
});

export default router;