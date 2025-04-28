import { users } from '@clerk/clerk-sdk-node';
import User from './models/User.js';
import dotenv from 'dotenv';



const importClerkUsers = async () => {
  try {
    const clerkUsers = await users.getUserList();

    for (const clerkUser of clerkUsers) {
      const existingUser = await User.findOne({ clerkId: clerkUser.id });

      if (!existingUser) {
        await User.create({
          clerkId: clerkUser.id,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          profilePicture: clerkUser.profilePicture,
        });
        console.log(`Imported user: ${clerkUser.firstName} ${clerkUser.lastName}`);
      }
    }

    console.log('All Clerk users have been imported into MongoDB.');
  } catch (error) {
    console.error('Error importing Clerk users:', error);
  }
};

export default importClerkUsers;