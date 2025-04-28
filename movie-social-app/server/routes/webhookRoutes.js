import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// This route needs raw body parsing for webhook signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    console.log('Webhook received - processing...');
    
    // Get the webhook payload and headers
    const payload = req.body.toString();
    const headers = req.headers;
    
    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];
    
    // Log headers to help debug webhook issues
    console.log('Webhook headers:', {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature ? 'present' : 'missing'
    });
    
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET is not set in environment variables');
      return res.status(500).json({ success: false, error: 'Webhook secret not configured' });
    }
    
    // Verify webhook signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let evt;
    
    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ success: false, error: 'Webhook verification failed' });
    }
    
    const eventType = evt.type;
    const { id, ...attributes } = evt.data;
    
    console.log('Webhook successfully verified:', eventType, id);
    console.log('Webhook payload data:', JSON.stringify(attributes, null, 2));
    
    if (eventType === 'user.created') {
      try {
        // A new user was created in Clerk, add them to our database
        const emailAddress = attributes.email_addresses && attributes.email_addresses.length > 0
          ? attributes.email_addresses[0].email_address
          : '';
          
        const newUser = await User.create({
          clerkId: id,
          firstName: attributes.first_name || '',
          lastName: attributes.last_name || '',
          email: emailAddress,
          profilePicture: attributes.image_url || ''
        });
        
        console.log('Created new user in MongoDB:', newUser._id, newUser.firstName);
      } catch (userError) {
        console.error('Error creating user from webhook:', userError);
      }
    } 
    else if (eventType === 'user.updated') {
      try {
        // A user was updated in Clerk, update them in our database
        const emailAddress = attributes.email_addresses && attributes.email_addresses.length > 0
          ? attributes.email_addresses[0].email_address
          : '';
          
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: id },
          {
            firstName: attributes.first_name,
            lastName: attributes.last_name,
            email: emailAddress,
            profilePicture: attributes.image_url
          },
          { new: true }
        );
        
        if (updatedUser) {
          console.log('Updated user in MongoDB:', updatedUser._id, updatedUser.firstName);
        } else {
          console.log('User not found in MongoDB, creating new user from update event');
          // Create user if they don't exist (handles case where webhook missed the creation event)
          const newUser = await User.create({
            clerkId: id,
            firstName: attributes.first_name || '',
            lastName: attributes.last_name || '',
            email: emailAddress,
            profilePicture: attributes.image_url || ''
          });
          console.log('Created user from update event:', newUser._id);
        }
      } catch (userError) {
        console.error('Error updating user from webhook:', userError);
      }
    } 
    else if (eventType === 'user.deleted') {
      try {
        // A user was deleted in Clerk, delete them from our database
        const deletedUser = await User.findOneAndDelete({ clerkId: id });
        console.log('Deleted user from MongoDB:', deletedUser?._id || 'User not found');
      } catch (userError) {
        console.error('Error deleting user from webhook:', userError);
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Test endpoint to verify webhook URL is accessible
router.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Webhook endpoint is accessible',
    env: {
      webhookSecretConfigured: !!process.env.CLERK_WEBHOOK_SECRET
    }
  });
});

export default router;