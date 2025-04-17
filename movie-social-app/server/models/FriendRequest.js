import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    required: true 
  }, // Clerk ID of the sender
  receiver: { 
    type: String, 
    required: true 
  }, // Clerk ID of the receiver
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Compound index to ensure a user can only send one request to another user
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest;