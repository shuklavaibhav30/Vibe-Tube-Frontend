import React ,{ useState, useEffect } from 'react';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const TweetCard = ({ tweet, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(tweet.content);
    const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
    const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);

    useEffect(() => {
        setIsLiked(tweet.isLiked || false);
        setLikesCount(tweet.likesCount || 0);
    }, [tweet.isLiked, tweet.likesCount]);

    const isOwner = user?._id === tweet.owner?._id;

    const handleUpdate = () => {
        onUpdate(tweet._id, content);
        setIsEditing(false);
    };

    const handleToggleLike = async () => {
        try {
            const { data } = await API.patch(`/likes/t/${tweet._id}`);
            setIsLiked(data.data.isLiked);
            setLikesCount(prev => data.data.isLiked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Error toggling tweet like:", error);
        }
    };
    return (
        <div className="p-5 rounded-2xl border border-border-theme bg-card-bg hover:border-accent/30 transition-all shadow-sm">
            <div className="flex gap-4">
                <img src={tweet.owner?.avatar} className="w-12 h-12 rounded-full object-cover bg-surface" />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary">{tweet.owner?.fullName}</span>
                            <span className="text-text-secondary text-sm">@{tweet.owner?.username}</span>
                            <span className="text-text-secondary text-xs">• {formatDistanceToNow(new Date(tweet.createdAt))} ago</span>
                        </div>
                        {isOwner && (
                            <div className="flex gap-2">
                                <button className="text-text-secondary hover:text-accent transition-colors" onClick={() => setIsEditing(!isEditing)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button className="text-text-secondary hover:text-red-500 transition-colors" onClick={() => onDelete(tweet._id)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-3">
                            <textarea className="w-full border border-border-theme rounded-xl p-3 outline-none focus:border-accent transition-colors bg-surface text-text-primary" value={content} onChange={(e) => setContent(e.target.value)} />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-1 text-text-secondary hover:text-text-primary">Cancel</button>
                                <button onClick={handleUpdate} className="px-4 py-1 bg-accent text-white rounded-lg hover:opacity-90">Save</button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-2 leading-relaxed whitespace-pre-wrap text-text-primary">{tweet.content}</p>
                    )}

                    <div className="mt-4 flex items-center gap-4">
                        <button 
                            onClick={handleToggleLike}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                                isLiked ? "text-red-500 bg-red-500/10" : "text-text-secondary hover:bg-surface-hover"
                            }`}
                        >
                            <svg 
                                className={`w-5 h-5 ${isLiked ? "fill-red-500" : "fill-none"}`} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm font-bold">{likesCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard
