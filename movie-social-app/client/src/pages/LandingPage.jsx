import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';

const LandingPage = () => {
  const { isSignedIn, user } = useUser();

  // Main landing content when neither login nor register is active
  const MainContent = () => (
    <div className="min-h-screen">
      <header className="container mx-auto px-4 pt-4 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-white">Sinema</div>
          <div className="space-x-4">
            <a 
              href="https://striking-elf-37.accounts.dev/sign-in"
              className="px-4 py-2 text-white hover:text-gray-300"
            >
              Login
            </a>
            <a 
              href="https://striking-elf-37.accounts.dev/sign-up"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Sign Up
            </a>
          </div>
        </div>
        
        <LandingNavbar />
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="w-full max-w-8xl mx-auto relative">
          {/* Image positioned relative to this container */}
          <img 
            src="/images/mov1.png" 
            alt="Decorative Movie Element"
            className="absolute top-0 right-0 w-80 h-auto z-20 drop-shadow-lg -mt-41"
          />

          <div className="bg-black bg-opacity-50 backdrop-blur-sm p-12 rounded-xl shadow-2xl relative overflow-hidden">
            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover -z-10"
            >
              <source src="/videos/trapped.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight text-center">
                Connect with movie fans around the world
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Share your thoughts, find recommendations, and join watch parties with friends. Sinema brings together movie enthusiasts in one immersive platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="https://striking-elf-37.accounts.dev/sign-up"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-md text-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </a>
                <button
                  className="px-8 py-4 bg-transparent border border-white text-white rounded-md text-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Join Sinema?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">🍿</div>
            <h3 className="text-xl font-bold text-white mb-2">Watch Together</h3>
            <p className="text-gray-300">Schedule and join watch parties with friends, no matter where they are.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">Discuss &amp; Connect</h3>
            <p className="text-gray-300">Share your thoughts on the latest releases and connect with like-minded fans.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Discover New Films</h3>
            <p className="text-gray-300">Get personalized recommendations based on your taste and friends' activities.</p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 mt-24 text-center text-gray-500">
        <p>© 2025 Sinema. All rights reserved.</p>
      </footer>
    </div>
  );

  // Signed-in user experience
  const SignedInContent = () => (
    <div className="min-h-screen">
      <header className="container mx-auto px-4 pt-4 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-white">Sinema</div>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              {user?.firstName ? `Hi, ${user.firstName}!` : 'Welcome back!'}
            </div>
          </div>
        </div>
        
        <LandingNavbar />
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="w-full max-w-8xl mx-auto relative">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm p-12 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-900/30 z-0"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-center">
                Welcome back to Sinema!
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Your personalized movie experience awaits. Continue to your dashboard to explore the latest releases, join discussions, and connect with other movie fans.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/home" 
                  className="px-8 py-4 bg-indigo-600 text-white rounded-md text-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/movies"
                  className="px-8 py-4 bg-transparent border border-white text-white rounded-md text-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Explore Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Your Sinema Experience</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">Continue Watching</h3>
            <p className="text-gray-300">Pick up where you left off with your movie discussions and reviews.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-white mb-2">New Notifications</h3>
            <p className="text-gray-300">Check your latest updates and friend activities in the dashboard.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">Recommended For You</h3>
            <p className="text-gray-300">Discover new films tailored to your taste in your personalized feed.</p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 mt-24 text-center text-gray-500">
        <p>© 2025 Sinema. All rights reserved.</p>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white">
      {isSignedIn ? <SignedInContent /> : <MainContent />}
    </div>
  );
};

export default LandingPage; 