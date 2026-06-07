import React , { useEffect,useState }from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';



const PlayList = () => {
    const {user}=useAuth();
    const [playlists,setPlaylists]=useState([]);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const fetchPlaylists=async()=>{
            try{
                if(!user?._id) return;
                const {data}=await API.get(`/playlists/user/${user._id}`);
                setPlaylists(data.data || []);
            }catch(e){
                console.error("Error fetching playlists:",e)
            }finally{
                setLoading(false);
            }
        };
        fetchPlaylists();
    },[user]);
  return (
    <Layout>
        <div className="py-4 md:py-8">
            <h1 className="text-3xl font-bold mb-8">My Playlists</h1>
            {loading ? (
                <div className='text-text-secondary text-center py-20'>Loading Playlists ...</div>
            ): playlists.length === 0 ? (
                <div className='text-text-secondary text-center py-20 bg-surface rounded-2xl border border-dashed border-border-theme'>
                    <p className='text-xl'>You haven't created any playlists yet.</p>
                    <Link to ="/" className="text-blue-500 mt-4 inline-block hover:underline font-bold">Go Explore Videos</Link>
                </div>
            ):(
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {playlists.map(playlist => (
                        <Link key={playlist._id} to={`/playlist/${playlist._id}`} className='bg-card-bg rounded-2xl overflow-hidden border border-border-theme hover:border-accent/50 transition-all group shadow-sm hover:shadow-md'>
                            {/*Playlist Thumbnail(uses first video thumbnail or placeholder) */}
                            <div className="aspect-video bg-surface relative">
                                {playlist.videos?.length > 0 ? (
                                    <img src={playlist.videos[0].thumbnail} className='w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity' alt={playlist.name} />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-text-secondary/20'>
                                        <svg className='w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </div>

                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/40 transition-colors">
                                    <div className="text-center text-white">
                                        <p className="text-3xl font-bold">
                                            {playlist.videos?.length || 0}
                                        </p>
                                        <p className="text-sm uppercase tracking-widest font-semibold">Videos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-text-primary font-bold text-xl truncate">{playlist.name}</h3>
                                <p className="text-text-secondary text-sm mt-2 line-clamp-2">
                                    {playlist.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </Layout>
  );
};

export default PlayList;
