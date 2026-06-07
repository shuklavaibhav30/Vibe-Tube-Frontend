import React ,{useEffect,useState}from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';


const PlaylistDetail = () => {

    const {playlistId}=useParams();
    const [playlist,setPlaylist]=useState(null);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    const fetchPlaylist=async()=>{
        try{
            const {data}=await API.get(`/playlists/${playlistId}`);
            setPlaylist(data.data);
        }catch(er){
            console.error("Error in Fetching the Playlist:",er);
        }finally{
            setLoading(false);
        }
    };
    useEffect(()=>{fetchPlaylist()},[playlistId]);

    const handleRemoveVideo=async(videoId)=>{
        if(!window.confirm("Are you sure to remove this video from Playlist?"))
            return;
        try{
            await API.patch(`/playlists/remove/${videoId}/${playlistId}`);
            //REFRESH THE PLAYLIST
            fetchPlaylist();
        }catch(er){
            alert("Error in removing the video");
        }
    };
    const handleDeletePlaylist=async()=>{
        if(!window.confirm("Are you sure to delete this Playlist?"))
            return;
        try{
            await API.delete(`/playlists/${playlistId}`);
            navigate("/playlists");
        }catch(er){
            alert("Error in deleting the Playlist");
        }
    };

    if (loading) return (
        <Layout>
            <div className='text-white text-center py-20'>Loading Playlist...</div>
        </Layout>
    );

    if (!playlist) return (
        <Layout>
            <div className="text-white text-center py-20">Playlist Not Found!</div>
        </Layout>
    );

  return (
    <Layout>
        <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
            {/*Left SIDEBAR :playlist Info*/}
            <div className="w-full md:w-80 shrink-0">
                <div className="bg-gradient-to-b from-[#272727] to-[#1F1F1F] rounded-3xl p-6 border border-gray-800 sticky top-8">
                    <div className="aspect-video bg-gray-900 rounded-2xl mb-6 overflow-hidden">
                        {playlist.videos?.[0]? (
                            <img src={playlist.videos[0].thumbnail} className='w-full h-full object-cover' />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">Empty</div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
                    <p className='text-gray-400 mt-4 text-sm leading-relaxed'>{playlist.description}</p>
                    <p className="text-gray-500 text-xs mt-6">{playlist.videos?.length || 0} videos • Updated today</p>
                    <button className="w-full mt-8 py-3 bg-red-600/10 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all" onClick={handleDeletePlaylist}>Delete Playlist</button>
                </div>
            </div>
            {/*Right Section :Playlist videos*/}
            <div className="flex-1 space-y-4">
                {playlist.videos?.length===0?(
                    <div className="text-gray-500 text-center py-20 italic">No videos in this Playlist</div>
                ):(
                    playlist.videos.map((video,index)=>(
                        <div className="flex items-center gap-4 group">
                            <span className="text-gray-500 font-mono w-4">{index+1}</span>
                            <div className="flex-1">
                                <VideoCard video={video}/>
                            </div>
                            <button onClick={()=>handleRemoveVideo(video._id)} className='p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100' title='Remove from Playlist'>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    </Layout>
  );
};

export default PlaylistDetail;
