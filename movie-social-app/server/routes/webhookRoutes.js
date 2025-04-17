import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// This route needs raw body parsing for webhook signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Get the webhook payload and headers
    const payload = req.body.toString();
    const headers = req.headers;
    
    // Verify webhook signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);
    
    const eventType = evt.type;
    const { id, ...attributes } = evt.data;
    
    console.log('Webhook received:', eventType, id);
    
    if (eventType === 'user.created') {
      // A new user was created in Clerk, add them to our database
      const newUser = await User.create({
        clerkId: id,
        firstName: attributes.first_name,
        lastName: attributes.last_name,
        email: attributes.email_addresses[0]?.email_address,
        profilePicture: attributes.image_url
      });
      console.log('Created new user:', newUser.firstName);
    } 
    else if (eventType === 'user.updated') {
      // A user was updated in Clerk, update them in our database
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: attributes.first_name,
          lastName: attributes.last_name,
          email: attributes.email_addresses[0]?.email_address,
          profilePicture: attributes.image_url
        },
        { new: true }
      );
      console.log('Updated user:', updatedUser?.firstName || 'User not found');
    } 
    else if (eventType === 'user.deleted') {
      // A user was deleted in Clerk, delete them from our database
      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      console.log('Deleted user:', deletedUser?.firstName || 'User not found');
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;