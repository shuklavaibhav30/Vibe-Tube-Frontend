import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LikeButton = ({ type = "video", id, initialIsLiked, initialLikesCount, variant = "default" }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
  const [likesCount, setLikesCount] = useState(initialLikesCount ?? 0);
  const [isToggling, setIsToggling] = useState(false);

  // Sync state with props when they change (e.g., after parent fetches data)
  useEffect(() => {
    setIsLiked(initialIsLiked ?? false);
    setLikesCount(initialLikesCount ?? 0);
  }, [initialIsLiked, initialLikesCount]);

  const handleToggleLike = async () => {
    if (!user) return alert("Please login to like!");
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      let endpoint = "";
      if (type === "video") endpoint = `/likes/v/${id}`;
      else if (type === "comment") endpoint = `/likes/c/${id}`;
      else if (type === "tweet") endpoint = `/likes/t/${id}`;
      
      const { data } = await API.patch(endpoint);
      
      // Update both isLiked and likesCount
      const newIsLiked = data.data.isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (variant === "compact") {
    return (
      <button 
        onClick={handleToggleLike}
        className={`flex items-center gap-1.5 transition-all active:scale-95 group ${
          isLiked ? "text-red-500" : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <svg 
          className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`} 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="text-xs font-bold">{likesCount}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all active:scale-95 ${
        isLiked 
          ? (isDarkMode ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-200") 
          : (isDarkMode ? "bg-surface text-text-primary hover:bg-surface-hover border border-border-theme" : "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200")
      }`}
    >
      <svg className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`} strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="text-sm font-bold">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
