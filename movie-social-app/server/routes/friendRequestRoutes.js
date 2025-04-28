import express from 'express';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

const router = express.Router();

// Send a friend request
router.post('/send', async (req, res) => {
  try {
    console.log('Request headers:', req.headers);
    console.log('Raw request body:', req.body);
    
    // If req.body is undefined or null, return 400
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Request body is missing or empty');
      return res.status(400).json({ message: 'Request body is missing or empty' });
    }
    
    // Extract data from request body with default empty values to prevent destructuring errors
    const senderId = req.body.senderId || '';
    const receiverId = req.body.receiverId || '';
    
    console.log('Extracted sender ID:', senderId);
    console.log('Extracted receiver ID:', receiverId);
    
    // Validate required fields
    if (!senderId) {
      return res.status(400).json({ message: 'Sender ID is required' });
    }
    
    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }
    
    // Check if sender and receiver are the same
    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }
    
    // Check if users exist
    const sender = await User.findOne({ clerkId: senderId });
    const receiver = await User.findOne({ clerkId: receiverId });
    
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found', senderId });
    }
    
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found', receiverId });
    }
    
    // Check if they are already friends
    if (sender.friends && sender.friends.includes(receiverId)) {
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
        status: existingRequest.status
      });
    }
    
    // Create a new friend request
    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    
    console.log('Friend request created:', newRequest);
    
    res.status(201).json({
      message: 'Friend request sent successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error processing friend request:', error);
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

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude sensitive fields like password
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Test endpoint to verify route is working
router.get('/test', async (req, res) => {
  console.log('Test endpoint hit');
  res.status(200).json({ message: 'Friend requests API is working' });
});

// Get friends of a user
router.get('/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching friends for user: ${userId}`);
    
    // Find the user by their clerkId
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      console.log(`User not found with clerkId: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`Found user: ${user.firstName} ${user.lastName}, friends array:`, user.friends);
    
    // Check if the user has friends
    if (!user.friends || user.friends.length === 0) {
      console.log('No friends found for this user');
      return res.status(200).json([]); // Return empty array if no friends
    }
    
    // Fetch full details of all friends
    const friends = await User.find(
      { clerkId: { $in: user.friends } },
      { password: 0 } // Exclude sensitive fields like password
    );
    
    console.log(`Found ${friends.length} friends for user ${userId}:`, 
      friends.map(f => `${f.firstName} ${f.lastName} (${f.clerkId})`));
    
    res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Failed to fetch friends', error: error.message });
  }
});
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`Fetching user details for: ${userId}`);

    // Find the user by their clerkId
    const user = await User.findOne({ clerkId: userId }, { password: 0 }); // Exclude sensitive fields like password

    if (!user) {
      console.log(`User not found with clerkId: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.clerkId})`);
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user details for ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
});



export default router;