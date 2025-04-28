import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  profilePicture: { 
    type: String,
    default: ''
  },
  friends: [{ 
    type: String  // Array of clerk user IDs
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;