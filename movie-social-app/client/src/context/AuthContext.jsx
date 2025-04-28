import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const user = useMemo(() => {
    if (!clerkUser) return null;
    
    return {
      clerkId: clerkUser.id, // Map Clerk's id to your clerkId property
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      // Add any other properties you need
      email: clerkUser.primaryEmailAddress?.emailAddress,
      profilePicture: clerkUser.imageUrl, // Changed from profilePicture to imageUrl
    };
  }, [clerkUser]);

  // Update to use relative URL that will work with Vite's proxy
  useEffect(() => {
    if (clerkUser && isLoaded) {
      // Create or update user in database with relative URL
      axios.post('/api/users/sync', {
        clerkId: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        profilePicture: clerkUser.imageUrl
      })
      .then(response => console.log('User synced with database:', response.data))
      .catch(err => console.error('Error syncing user with database:', err));
    }
  }, [clerkUser, isLoaded]);

  const login = async () => {
    console.warn('Login functionality is handled by Clerk.');
  };

  const logout = () => {
    signOut();
  };

  const value = {
    user,
    loading: !isLoaded,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!value.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;