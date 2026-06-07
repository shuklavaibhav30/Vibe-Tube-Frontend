import React ,{ useEffect,useState } from 'react';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CommentSection = ({videoId}) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [comments,setComments]=useState([]);
    const [content,setContent]=useState('');

    //Load Comments
    const fetchComments=async()=>{
        try{
            const {data}=await API.get(`/comments/${videoId}`);
            setComments(data.data.docs);//backend using pagination
        }catch(e){
            console.error(e);
        }
    };

    useEffect(()=>{fetchComments();},[videoId]);

    //add comment
    const handleAddComment=async(e)=>{
        e.preventDefault();
        if(!content.trim()) return;
        try{
            const {data}=await API.post(`/comments/${videoId}`,
            {content});
            // Fetch comments again to get full owner details for the new comment
            fetchComments();
            setContent('');
        }catch(e){
            alert("Failed to add Comment");
        }
    };

    //Delete comment
    const handleDeleteComment=async(commentId)=>{
        try{
            await API.delete(`/comments/c/${commentId}`);
            setComments(comments.filter(c=>c._id!==commentId))
            //remove from UI
        }catch(e){
            console.error(e);
        }
    };

  return (
    <div className='mt-10'>
        <h3 className={`text-xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {comments.length} Comments
        </h3>
        
        {/*Input box*/}
        {user ? (
            <div className='flex gap-4 mb-10'>
                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover bg-surface" />
                <form onSubmit={handleAddComment} className='flex-1 flex flex-col gap-2'>
                    <input 
                        type="text" 
                        className="w-full bg-transparent border-b border-border-theme outline-none py-2 transition-colors text-text-primary placeholder:text-text-secondary focus:border-accent" 
                        placeholder='Add a comment...' 
                        value={content} 
                        onChange={(e)=>setContent(e.target.value)}
                    />
                    <div className='flex justify-end gap-3'>
                        <button 
                            type="button" 
                            onClick={() => setContent('')}
                            className={`px-4 py-2 rounded-full font-bold transition-colors ${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={!content.trim()}
                            className={`px-4 py-2 rounded-full font-bold transition-colors ${
                                content.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400')
                            }`}
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>
        ) : (
            <div className={`p-4 rounded-xl text-center mb-10 transition-colors ${isDarkMode ? 'bg-[#272727]' : 'bg-gray-100'}`}>
                <p className="text-gray-500">Please login to add a comment.</p>
            </div>
        )}

        {/* List */}
        <div className="space-y-8">
            {comments.map(comment=>(
                <div key={comment._id} className='flex gap-4 group'>
                    <img src={comment.owner?.avatar} className={`w-10 h-10 rounded-full object-cover transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    <div className="flex-1">
                        <div className="flex gap-2 text-sm items-center">
                            <span className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>@{comment.owner?.username}</span>
                            <span className="text-gray-500 text-xs">
                                {formatDistanceToNow(new Date(comment.createdAt))} ago
                            </span>
                        </div>
                        <p className={`mt-1 leading-relaxed transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{comment.content}</p>
                        
                        <div className="mt-2 flex items-center gap-3">
                            <button 
                                onClick={async () => {
                                    if (!user) return alert("Please login to like!");
                                    try {
                                        const { data } = await API.patch(`/likes/c/${comment._id}`);
                                        // Refresh comments to update like state/count
                                        fetchComments();
                                    } catch (error) {
                                        console.error("Error toggling comment like:", error);
                                    }
                                }}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
                                     comment.isLiked ? "text-red-500 bg-red-500/10" : `text-gray-500 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                                 }`}
                             >
                                 <svg 
                                     className={`w-4 h-4 ${comment.isLiked ? "fill-red-500" : "fill-none"}`} 
                                     stroke="currentColor" 
                                     viewBox="0 0 24 24"
                                 >
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                 </svg>
                                 <span className="font-bold">{comment.likesCount || 0}</span>
                            </button>
                        </div>
                    </div>
                    {/*Delete button only show if you are owner*/}
                    {user?._id === comment.owner?._id && (
                        <button onClick={()=>handleDeleteComment(comment._id)} className='opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default CommentSection;
