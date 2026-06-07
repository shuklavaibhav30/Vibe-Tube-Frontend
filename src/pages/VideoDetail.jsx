import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import PlaylistModal from '../components/PlaylistModal';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await API.get(`/videos/${videoId}`);
        const videoData = data.data;
        setVideo(videoData);
        
        // Fetch channel profile to get accurate subscription status and count
        // because the video API might not provide updated subscription info
        if (videoData.owner?.username) {
          try {
            const { data: channelData } = await API.get(`/users/c/${videoData.owner.username}`);
            setIsSubscribed(channelData.data.isSubscribed || false);
            setSubscribersCount(channelData.data.subscribersCount || 0);
          } catch (channelError) {
            console.error("Error fetching channel profile:", channelError);
            // Fallback to video data if channel fetch fails
            setIsSubscribed(videoData.isSubscribed || false);
            setSubscribersCount(videoData.owner?.subscribersCount || 0);
          }
        } else {
          setIsSubscribed(videoData.isSubscribed || false);
          setSubscribersCount(videoData.owner?.subscribersCount || 0);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId, user?._id]);

  const isOwner = user?._id === video?.owner?._id;

  const toggleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe!");
    if (isOwner) return alert("You cannot subscribe to your own channel!");
    try {
      const { data } = await API.post(`/subscriptions/c/${video.owner._id}`);
      setIsSubscribed(data.data.isSubscribed);
      setSubscribersCount(prev => data.data.isSubscribed ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  if (loading) return <Layout><div className={`flex justify-center items-center h-full ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading video...</div></Layout>;
  if (!video) return <Layout><div className={`text-center py-20 ${isDarkMode ? 'text-white' : 'text-black'}`}>Video not found.</div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto pb-10">
        <div className="flex-1">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video 
              src={video.videoFile} 
              controls 
              autoPlay
              className="w-full h-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold mt-5 px-1">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pb-6 border-b border-border-theme px-1">
            <div className="flex items-center gap-4">
              <Link to={`/c/${video.owner?.username}`}>
                <img 
                  src={video.owner?.avatar} 
                  alt={video.owner?.username} 
                  className="w-11 h-11 rounded-full object-cover bg-surface hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="flex flex-col">
                <Link to={`/c/${video.owner?.username}`} className="font-bold leading-tight hover:text-accent transition-colors">
                  {video.owner?.fullName || "Anonymous"}
                </Link>
                <p className="text-text-secondary text-xs">{subscribersCount} subscribers</p>
              </div>
              {!isOwner && (
                <button 
                  onClick={toggleSubscribe}
                  className={`ml-4 px-6 py-2 rounded-full font-bold transition-all active:scale-95 ${
                    isSubscribed 
                      ? "bg-surface text-text-primary hover:bg-surface-hover border border-border-theme"
                      : "bg-text-primary text-bg hover:opacity-90"
                  }`}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <LikeButton 
                videoId={video._id} 
                initialIsLiked={video.isLiked} 
                initialLikesCount={video.likesCount} 
              />
              
              <button 
                onClick={() => setShowPlaylistModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-full font-bold hover:bg-surface-hover transition-all border border-border-theme"
              >
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Save
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-full font-bold hover:bg-surface-hover transition-all border border-border-theme"
              >
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-surface rounded-2xl p-4 mt-4 text-text-primary text-sm hover:bg-surface-hover transition-colors cursor-pointer border border-border-theme/50">
            <div className="font-bold flex gap-3 mb-2">
              <span>{video.views} views</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed opacity-90 text-text-secondary">{video.description}</p>
          </div>

          {/* Comments Section (Placeholder) */}
          <div className="mt-8 px-1">
             <CommentSection videoId={video._id} />
          </div>
        </div>

        {/* Sidebar recommendations (Mock) */}
        <div className="w-full lg:w-[400px] shrink-0">
          <h2 className={`font-bold mb-4 px-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Up Next</h2>
          <div className="space-y-4">
            <p className={`italic text-center py-10 border border-dashed rounded-2xl ${isDarkMode ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-300'}`}>
              No recommendations available yet.
            </p>
          </div>
        </div>
      </div>

      {showPlaylistModal && (
        <PlaylistModal 
          videoId={video._id} 
          onClose={() => setShowPlaylistModal(false)} 
        />
      )}
    </Layout>
  );
};

export default VideoDetail;
