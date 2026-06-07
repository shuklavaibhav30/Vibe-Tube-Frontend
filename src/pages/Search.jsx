import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import API from '../api/axios'
import VideoCard from '../components/VideoCard'

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // The backend likely expects 'query' as a search parameter
                const { data } = await API.get(`/videos?query=${query}`);
                setVideos(data.data.docs || []);
            } catch (err) {
                console.log("Error fetching search results", err);
            } finally {
                setLoading(false);
            }
        };
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    if (loading) return (
        <Layout>
            <div className='text-white p-4 text-center py-20'>
                <div className="animate-pulse text-xl">Searching for "{query}"...</div>
            </div>
        </Layout>
    )

    return (
        <Layout>
            <div className="mb-6 px-1">
                <h2 className='text-white text-xl font-bold'>
                    Search results for: <span className='text-gray-400 font-normal'>"{query}"</span>
                </h2>
                <p className='text-gray-500 text-sm mt-1'>{videos.length} videos found</p>
            </div>
            
            {videos.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className='text-lg'>No videos found matching your search.</p>
                    <p className='text-sm mt-2'>Try different keywords or check your spelling.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </Layout>
    )
}

export default Search
