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
        <h3 className="text-xl font-bold mb-6 transition-colors text-text-primary">
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
                            className="px-4 py-2 rounded-full font-bold transition-colors text-text-primary hover:bg-surface-hover"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={!content.trim()}
                            className={`px-4 py-2 rounded-full font-bold transition-colors ${
                                content.trim() ? 'bg-accent text-white hover:opacity-90' : 'bg-surface-hover text-text-secondary'
                            }`}
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>
        ) : (
            <div className="p-4 rounded-xl text-center mb-10 transition-colors bg-surface">
                <p className="text-text-secondary">Please login to add a comment.</p>
            </div>
        )}

        {/* List */}
        <div className="space-y-8">
            {comments.map(comment=>(
                <div key={comment._id} className='flex gap-4 group'>
                    <img src={comment.owner?.avatar} className="w-10 h-10 rounded-full object-cover transition-colors bg-surface" />
                    <div className="flex-1">
                        <div className="flex gap-2 text-sm items-center">
                            <span className="font-bold text-text-primary">{comment.owner?.fullName}</span>
                            <span className="text-text-secondary">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                        </div>
                        <p className="mt-1 text-text-primary">{comment.content}</p>
                        
                        {user?._id === comment.owner?._id && (
                            <button 
                                onClick={()=>handleDeleteComment(comment._id)}
                                className="mt-2 text-xs text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CommentSection;
