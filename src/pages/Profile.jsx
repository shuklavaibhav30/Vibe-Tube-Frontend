import React,{useEffect,useState, useRef} from 'react';
import API from '../api/axios';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SettingsModal from '../components/SettingsModal';

const Profile = () => {
    const {username}=useParams();
    const { user: currentUser, setUser: setCurrentUser } = useAuth();
    const { isDarkMode } = useTheme();
    const [profile,setProfile]=useState(null);
    const[videos,setVideos]=useState([]);
    const[tweets,setTweets]=useState([]);
    const[subscribedTo,setSubscribedTo]=useState([]);
    const[loading,setLoading]=useState(true);
    const [activeTab, setActiveTab] = useState("videos");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const [updatingCover, setUpdatingCover] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const isOwner = currentUser?.username === username;

    const fetchProfileData = async () => {
        if (!username || username === 'undefined') {
            setLoading(false);
            return;
        }
        try {
            const { data: pData } = await API.get(`/users/c/${username}`);
            setProfile(pData.data);
            setIsSubscribed(pData.data.isSubscribed);
            setSubscribersCount(pData.data.subscribersCount);
            
            // Fetch videos
            const { data: vData } = await API.get(`/videos?userId=${pData.data._id}`);
            setVideos(vData.data.docs || []);
            
            // Fetch tweets
            const { data: tData } = await API.get(`/tweets/user/${pData.data._id}`);
            setTweets(tData.data || []);

            // Fetch subscriptions (channels this user is subscribed to)
            const { data: sData } = await API.get(`/subscriptions/u/${pData.data._id}`);
            setSubscribedTo(sData.data || []);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setLoading(false);
        }
    };

    const toggleSubscribe = async () => {
        try {
            const { data } = await API.post(`/subscriptions/c/${profile._id}`);
            setIsSubscribed(data.data.isSubscribed);
            setSubscribersCount(prev => data.data.isSubscribed ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Error toggling subscription:", error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [username]);

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setUpdatingAvatar(true);
        try {
            const { data } = await API.patch("/users/avatar", formData);
            setProfile(prev => ({ ...prev, avatar: data.data.avatar }));
            if (isOwner) {
                setCurrentUser(prev => ({ ...prev, avatar: data.data.avatar }));
            }
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("Failed to update avatar");
        } finally {
            setUpdatingAvatar(false);
        }
    };

    const handleCoverUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("coverImage", file);

        setUpdatingCover(true);
        try {
            const { data } = await API.patch("/users/cover-image", formData);
            setProfile(prev => ({ ...prev, coverImage: data.data.coverImage }));
            alert("Cover image updated successfully!");
        } catch (error) {
            console.error("Error updating cover image:", error);
            alert("Failed to update cover image");
        } finally {
            setUpdatingCover(false);
        }
    };

    if(loading) return <Layout>
        <div className={`p-10 transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading ...</div>
    </Layout>

  return (
    <Layout>
        {/* Cover Image Section */}
        <div className={`relative w-full h-48 md:h-64 rounded-xl overflow-hidden group transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
            {profile?.coverImage ? (
                <img src={profile.coverImage} className='w-full h-full object-cover'/>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Cover Image
                </div>
            )}
            
            {isOwner && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                        onClick={() => coverInputRef.current.click()}
                        disabled={updatingCover}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {updatingCover ? "Updating..." : "Update Cover"}
                    </button>
                    <input 
                        type="file" 
                        ref={coverInputRef} 
                        onChange={handleCoverUpdate} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
            )}
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-8 mt-[-40px] md:mt-[-60px] relative z-10 mb-12">
            <div className="relative group">
                <img 
                    src={profile?.avatar} 
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover shadow-xl transition-colors ${isDarkMode ? 'border-[#0F0F0F] bg-gray-800' : 'border-gray-50 bg-white'}`}
                />
                {isOwner && (
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            onClick={() => avatarInputRef.current.click()}
                            disabled={updatingAvatar}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm border border-white/30 text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <input 
                            type="file" 
                            ref={avatarInputRef} 
                            onChange={handleAvatarUpdate} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                )}
            </div>

            <div className="flex-1 text-center md:text-left pt-8 md:pt-14">
                <h1 className={`text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-4 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.fullName}
                    {isOwner && (
                        <button 
                            onClick={() => setShowSettings(true)}
                            className={`p-2 rounded-full transition-colors group ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                            title="Settings"
                        >
                            <svg className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-gray-500 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    )}
                </h1>
                <p className="text-gray-500 mt-1">
                    @{profile?.username} • {subscribersCount} subscribers
                </p>
            </div>
            
            {!isOwner && (
                <button 
                    onClick={toggleSubscribe}
                    className={`px-8 py-2 rounded-full font-bold mt-4 md:mt-14 transition-all active:scale-95 ${
                        isSubscribed 
                            ? (isDarkMode ? "bg-[#272727] text-white hover:bg-[#3F3F3F]" : "bg-gray-200 text-black hover:bg-gray-300")
                            : (isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800")
                    }`}
                >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
            )}
        </div>

        {/* Settings Modal */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

        {/* Content Tabs */}
        <div className="px-8 mb-8">
            <div className={`flex gap-8 border-b transition-colors ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <button 
                    onClick={() => setActiveTab("videos")}
                    className={`pb-4 font-bold transition-all ${activeTab === "videos" ? (isDarkMode ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-500 hover:text-gray-300"}`}
                >
                    Videos
                </button>
                <button 
                    onClick={() => setActiveTab("tweets")}
                    className={`pb-4 font-bold transition-all ${activeTab === "tweets" ? (isDarkMode ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-500 hover:text-gray-300"}`}
                >
                    Tweets
                </button>
                <button 
                    onClick={() => setActiveTab("subscriptions")}
                    className={`pb-4 font-bold transition-all ${activeTab === "subscriptions" ? (isDarkMode ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-500 hover:text-gray-300"}`}
                >
                    Subscriptions
                </button>
            </div>
        </div>

        {/* Tab Content Section */}
        <div className="px-8 pb-10">
            {activeTab === "videos" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.length > 0 ? (
                        videos.map(v => <VideoCard key={v._id} video={v} />)
                    ) : (
                        <div className={`col-span-full py-20 text-center text-gray-500 rounded-2xl border border-dashed transition-colors ${isDarkMode ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
                            <p className="text-xl">No videos found for this channel.</p>
                        </div>
                    )}
                </div>
            ) : activeTab === "tweets" ? (
                <div className="max-w-2xl mx-auto space-y-4">
                    {tweets.length > 0 ? (
                        tweets.map(t => (
                            <TweetCard 
                                key={t._id} 
                                tweet={t} 
                                onUpdate={async (id, content) => {
                                    await API.patch(`/tweets/tweet/${id}`, { newTweet: content });
                                    fetchProfileData();
                                }}
                                onDelete={async (id) => {
                                    await API.delete(`/tweets/tweet/${id}`);
                                    fetchProfileData();
                                }}
                            />
                        ))
                    ) : (
                        <div className={`py-20 text-center text-gray-500 rounded-2xl border border-dashed transition-colors ${isDarkMode ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
                            <p className="text-xl">No tweets posted yet.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subscribedTo.length > 0 ? (
                        subscribedTo.map((sub) => (
                            <Link 
                                key={sub._id} 
                                to={`/c/${sub.channel?.username}`}
                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center group ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
                            >
                                <img 
                                    src={sub.channel?.avatar} 
                                    alt={sub.channel?.username} 
                                    className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-transparent group-hover:border-blue-500 transition-all"
                                />
                                <h3 className={`font-bold text-lg truncate w-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {sub.channel?.fullName}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">@{sub.channel?.username}</p>
                                <div className={`mt-4 px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                    Subscribed
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className={`col-span-full py-20 text-center text-gray-500 rounded-2xl border border-dashed transition-colors ${isDarkMode ? 'bg-[#121212] border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
                            <p className="text-xl">Not subscribed to any channels yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </Layout>
  );
};

export default Profile;
