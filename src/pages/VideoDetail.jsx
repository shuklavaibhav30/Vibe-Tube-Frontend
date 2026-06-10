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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await API.get(`/videos/${videoId}`);
        const videoData = data.data;
        setVideo(videoData);
        setEditForm({ title: videoData.title, description: videoData.description });
        
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

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const { data } = await API.patch(`/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setVideo(data.data);
      setIsEditing(false);
      alert("Video updated successfully!");
    } catch (error) {
      alert("Error updating video: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center items-center h-full text-text-primary">Loading video...</div></Layout>;
  if (!video) return <Layout><div className="text-center py-20 text-text-primary">Video not found.</div></Layout>;

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
          
          {isEditing ? (
            <form onSubmit={handleUpdateVideo} className="mt-5 space-y-4 bg-surface p-6 rounded-2xl border border-border-theme">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Title</label>
                <input 
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-input-bg border border-border-theme rounded-xl p-3 text-text-primary outline-none focus:border-accent"
                  placeholder="Video Title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Description</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-input-bg border border-border-theme rounded-xl p-3 text-text-primary outline-none focus:border-accent h-32"
                  placeholder="Video Description"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Thumbnail (Optional)</label>
                <input 
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:opacity-90"
                  accept="image/*"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={updating}
                  className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 py-3 bg-surface-hover text-text-primary rounded-xl font-bold border border-border-theme"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-start justify-between mt-5 px-1">
                <h1 className="text-2xl font-bold text-text-primary">{video.title}</h1>
                {isOwner && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-full font-bold hover:bg-surface-hover transition-all border border-border-theme"
                  >
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            </>
          )}
          
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
          <h2 className="font-bold mb-4 px-1 text-text-primary">Up Next</h2>
          <div className="space-y-4">
            <p className="italic text-center py-10 border border-dashed rounded-2xl text-text-secondary border-border-theme">
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
