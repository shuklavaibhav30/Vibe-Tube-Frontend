import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LikeButton = ({ videoId, initialIsLiked, initialLikesCount }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);

  // Sync state with props when they change (e.g., after parent fetches data)
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount || 0);
  }, [initialIsLiked, initialLikesCount]);

  const handleToggleLike = async () => {
    if (!user) return alert("Please login to like!");
    try {
      const { data } = await API.patch(`/likes/v/${videoId}`);
      // Use the exact state returned by the backend
      setIsLiked(data.data.isLiked);
      
      // Update count based on the new state
      setLikesCount(prev => data.data.isLiked ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <button 
      onClick={handleToggleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 ${
        isLiked 
          ? (isDarkMode ? "bg-white text-black" : "bg-black text-white") 
          : (isDarkMode ? "bg-[#272727] text-white hover:bg-[#3F3F3F]" : "bg-gray-200 text-black hover:bg-gray-300")
      }`}
    >
      <svg className={`w-5 h-5 ${isLiked ? (isDarkMode ? "fill-black" : "fill-white") : "fill-none"}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
      <span className="text-sm font-bold">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
