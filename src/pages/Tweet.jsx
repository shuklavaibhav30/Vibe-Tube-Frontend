import React ,{useState}from 'react'
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import API from '../api/axios'
import Layout from '../components/Layout'
import TweetCard from '../components/TweetCard'
import { useAuth } from '../context/AuthContext'


const Tweet = () => {
    const {user}=useAuth();
    const [newTweet,setNewTweet]=useState('');
    const queryClient=useQueryClient();

    //fetch all tweets from all users
    const {data:tweets,isLoading}=useQuery({queryKey:['tweets'],
        queryFn:async()=>{
            const {data}=await API.get('/tweets');
            return data.data;
        }
    });

    //create tweet Mutation
    const createMutation=useMutation({
        mutationFn:(content)=>API.post('/tweets',{content}),
        onSuccess:()=>{
            queryClient.invalidateQueries(['tweets']);
            setNewTweet('');
        }
    });

    //update tweet Mutation
    const updateMutation=useMutation({
        mutationFn:({id,content})=>API.patch(`/tweets/tweet/${id}`,{newTweet:content}),
        onSuccess:()=>{
            queryClient.invalidateQueries(['tweets']);
        }
    });

    //Delete tweet Mutation
    const deleteMutation=useMutation({
        mutationFn:(id)=>API.delete(`/tweets/tweet/${id}`),
        onSuccess:()=>queryClient.invalidateQueries(['tweets'])
    });

    const handlePost=(e)=>{
        e.preventDefault();
        if(!newTweet.trim())    return;
        createMutation.mutate(newTweet);
    }


  return (
    <Layout>
        <div className="max-w-2xl mx-auto py-4 md:py-8">
            <h1 className="text-3xl font-bold mb-8">
                Community
            </h1>
            {/*Create Tweet Box*/}
            <form onSubmit={handlePost} className="bg-transparent p-5 rounded-2xl border border-border-theme mb-8 shadow-sm">
                <textarea 
                    placeholder="What's on your mind?" 
                    className="w-full bg-transparent text-text-primary text-lg outline-none resize-none min-h-[100px] placeholder:text-text-secondary" 
                    value={newTweet} 
                    onChange={(e)=>setNewTweet(e.target.value)}
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-theme">
                    <span className="text-text-secondary text-sm">{newTweet.length}/500</span>
                    <button 
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20" 
                        disabled={!newTweet.trim() || createMutation.isPending}
                    >
                        {createMutation.isPending?"Posting...":"Post"}
                    </button>
                </div>
            </form>
            {/*Tweet Feed*/}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-text-secondary text-center py-10">Loading tweets...</div>
                ) :(
                    tweets.length===0 ? (
                        <div className="text-text-secondary text-center py-10 italic bg-surface rounded-2xl border border-dashed border-border-theme">
                            No Tweets found. Share your first thought!
                        </div>
                    ):(
                        tweets.map((tweet)=>(
                            <TweetCard key={tweet._id}
                            tweet={tweet} onUpdate={(id,content)=>updateMutation.mutate({id,content})} onDelete={(id)=>deleteMutation.mutate(id)} />
                        ))
                    )
                )}
            </div>
        </div>
    </Layout>
  );
};

export default Tweet
