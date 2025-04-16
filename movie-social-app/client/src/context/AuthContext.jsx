import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

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