import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaHeart, FaBookmark, FaUsers, FaBell } from 'react-icons/fa';

const DesktopHeader = ({ 
  showNotifications, 
  setShowNotifications, 
  setShowCreatePost 
}) => {
  const location = useLocation();
  
  // Not rendering the desktop header as per requirements
  return null;
  
  // Original code removed as desktop mode should never have a header
};

export default DesktopHeader;
