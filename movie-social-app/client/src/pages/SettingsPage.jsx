import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, useUser } from '@clerk/clerk-react';

const SettingsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('preferences');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    watchPartyInvites: true,
    newReleaseAlerts: true,
    friendActivity: true,
    autoplayTrailers: false,
    showSpoilers: false,
    subtitlesEnabled: true,
    language: 'english',
    darkMode: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showWatchlist: true,
    showActivity: true,
    shareRatings: true,
    allowTagging: true,
    showRecentlyWatched: true,
  });

  const handleTogglePreference = (key) => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  const handleTogglePrivacy = (key) => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08369a] to-[#000000] text-white">
      {/* Top Navigation */}
      <header className="py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-bold text-white">Sinema</Link>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
              Back to Profile
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            <Link to="/home" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="text-sm transition-opacity duration-300 ${isSaving || saveSuccess ? 'opacity-100' : 'opacity-0'}">
            {isSaving && (
              <span className="text-gray-400 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            )}
            {saveSuccess && (
              <span className="text-green-400 flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Saved!
              </span>
            )}
          </div>
        </div>
        
        {showAdvancedSettings ? (
          <>
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Advanced Account Settings</h2>
                <button 
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Sinema Settings
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                Manage your account security, email, password, and connected accounts.
              </p>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden">
              <UserProfile 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-0',
                    navbar: 'hidden',
                    pageScrollBox: 'p-0',
                  }
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-950 bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-6 py-4 text-center flex-1 md:flex-initial ${
                    activeTab === 'preferences' 
                      ? 'text-white border-b-2 border-indigo-500 font-medium' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Preferences
                </button>
                <button 
                  onClick={() => setActiveTab('privacy')}
                  className={`px-6 py-4 text-center flex-1 md:flex-initial ${
                    activeTab === 'privacy' 
                      ? 'text-white border-b-2 border-indigo-500 font-medium' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Privacy
                </button>
                <button 
                  onClick={() => setActiveTab('appearance')}
                  className={`px-6 py-4 text-center flex-1 md:flex-initial ${
                    activeTab === 'appearance' 
                      ? 'text-white border-b-2 border-indigo-500 font-medium' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Appearance
                </button>
              </div>

              <div className="p-6">
                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-400">Receive email updates about activity related to you</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={preferences.emailNotifications}
                            onChange={() => handleTogglePreference('emailNotifications')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.pushNotifications}
                            onChange={() => handleTogglePreference('pushNotifications')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Watch Party Invites</h3>
                          <p className="text-sm text-gray-400">Get notified when friends invite you to watch parties</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.watchPartyInvites}
                            onChange={() => handleTogglePreference('watchPartyInvites')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">New Release Alerts</h3>
                          <p className="text-sm text-gray-400">Get notified about new movie releases based on your taste</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.newReleaseAlerts}
                            onChange={() => handleTogglePreference('newReleaseAlerts')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Friend Activity</h3>
                          <p className="text-sm text-gray-400">Get updates when friends post reviews or ratings</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.friendActivity}
                            onChange={() => handleTogglePreference('friendActivity')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mt-8 mb-6">Viewing Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Autoplay Trailers</h3>
                          <p className="text-sm text-gray-400">Automatically play trailers when viewing movie details</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.autoplayTrailers}
                            onChange={() => handleTogglePreference('autoplayTrailers')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Show Spoilers</h3>
                          <p className="text-sm text-gray-400">Display user reviews that may contain spoilers</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.showSpoilers}
                            onChange={() => handleTogglePreference('showSpoilers')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Subtitles</h3>
                          <p className="text-sm text-gray-400">Enable subtitles by default for trailers and clips</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.subtitlesEnabled}
                            onChange={() => handleTogglePreference('subtitlesEnabled')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Language</h3>
                          <p className="text-sm text-gray-400">Select your preferred language for the app</p>
                        </div>
                        <select 
                          className={`bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          value={preferences.language}
                          onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                          disabled={isSaving}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="japanese">Japanese</option>
                          <option value="korean">Korean</option>
                          <option value="hindi">Hindi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Public Profile</h3>
                          <p className="text-sm text-gray-400">Allow others to view your profile</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.publicProfile}
                            onChange={() => handleTogglePrivacy('publicProfile')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Show Watchlist</h3>
                          <p className="text-sm text-gray-400">Allow others to see movies in your watchlist</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.showWatchlist}
                            onChange={() => handleTogglePrivacy('showWatchlist')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Show Activity</h3>
                          <p className="text-sm text-gray-400">Allow others to see your activity feed</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.showActivity}
                            onChange={() => handleTogglePrivacy('showActivity')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Share Ratings</h3>
                          <p className="text-sm text-gray-400">Allow others to see your movie ratings</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.shareRatings}
                            onChange={() => handleTogglePrivacy('shareRatings')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Allow Tagging</h3>
                          <p className="text-sm text-gray-400">Allow others to tag you in comments and posts</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.allowTagging}
                            onChange={() => handleTogglePrivacy('allowTagging')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Show Recently Watched</h3>
                          <p className="text-sm text-gray-400">Allow others to see your recently watched movies</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={privacy.showRecentlyWatched}
                            onChange={() => handleTogglePrivacy('showRecentlyWatched')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-400">Use dark theme across the app</p>
                        </div>
                        <label className={`relative inline-flex items-center cursor-pointer ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.darkMode}
                            onChange={() => handleTogglePreference('darkMode')}
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="py-3 border-b border-gray-700">
                        <h3 className="font-medium mb-2">Theme Color</h3>
                        <p className="text-sm text-gray-400 mb-4">Choose your preferred theme color</p>
                        
                        <div className="flex space-x-4">
                          <button className="w-8 h-8 rounded-full bg-indigo-600 ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-600 focus:outline-none"></button>
                          <button className="w-8 h-8 rounded-full bg-purple-600 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-purple-600 focus:outline-none"></button>
                          <button className="w-8 h-8 rounded-full bg-blue-600 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-blue-600 focus:outline-none"></button>
                          <button className="w-8 h-8 rounded-full bg-green-600 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-green-600 focus:outline-none"></button>
                          <button className="w-8 h-8 rounded-full bg-red-600 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-red-600 focus:outline-none"></button>
                          <button className="w-8 h-8 rounded-full bg-yellow-500 hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-yellow-500 focus:outline-none"></button>
                        </div>
                      </div>

                      <div className="py-3 border-b border-gray-700">
                        <h3 className="font-medium mb-2">Text Size</h3>
                        <p className="text-sm text-gray-400 mb-4">Adjust the text size throughout the app</p>
                        
                        <div className="w-full">
                          <input 
                            type="range" 
                            min="1" 
                            max="5" 
                            value="3" 
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Small</span>
                            <span>Default</span>
                            <span>Large</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Account Management</h2>
              <p className="text-gray-300 mb-6">
                For advanced account settings such as security, email, password, and linked accounts, visit the Account Management section.
              </p>
              <button 
                onClick={() => setShowAdvancedSettings(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Advanced Account Settings
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SettingsPage; 