import React, { useState } from 'react';
import PropTypes from 'prop-types';

const WatchPartyPlayer = ({ videoUrl, isHost }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Video player controls - only accessible to host
  const handlePlay = () => {
    if (isHost) {
      setIsPlaying(true);
      // TODO: Sync play state with other users
    }
  };

  const handlePause = () => {
    if (isHost) {
      setIsPlaying(false);
      // TODO: Sync pause state with other users
    }
  };

  const handleSeek = (time) => {
    if (isHost) {
      // TODO: Sync seek time with other users
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <video
          className="w-full h-full"
          src={videoUrl}
          controls={isHost}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={(e) => handleSeek(e.target.currentTime)}
        />
      </div>
      {!isHost && (
        <div className="p-4 text-center text-gray-400">
          Only the host can control the video playback
        </div>
      )}
    </div>
  );
};

WatchPartyPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  isHost: PropTypes.bool.isRequired,
};

export default WatchPartyPlayer;
