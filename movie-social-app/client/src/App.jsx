import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import LandingPage from './pages/LandingPage';
import MovieDetails from './pages/MovieDetails';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import PostsPage from './pages/PostsPage';
import WatchPartyPage from './pages/WatchPartyPage';
import ConnectionsPage from './pages/ConnectionsPage';
import MessagesPage from './pages/MessagesPage';
import './index.css'

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <>
                <SignedIn>
                  <HomePage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/movies"
            element={
              <>
                <SignedIn>
                  <MoviesPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <SignedIn>
                  <SearchResultsPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <>
                <SignedIn>
                  <MovieDetails />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <SignedIn>
                  <ProfilePage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <SignedIn>
                  <SettingsPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/messages"
            element={
              <>
                <SignedIn>
                  <MessagesPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/watch-party/:partyId"
            element={
              <>
                <SignedIn>
                  <WatchPartyPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/connections"
            element={
              <>
                <SignedIn>
                  <ConnectionsPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/posts/*"
            element={
              <>
                <SignedIn>
                  <PostsPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/messages"
            element={
              <>
                <SignedIn>
                  <MessagesPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
