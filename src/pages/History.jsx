import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import VideoCard from '../components/VideoCard';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await API.get('/users/history');
                // Backend returns user[0].watchHistory directly or the array
                setHistory(data.data || []);
            } catch (error) {
                console.error("Error fetching watch history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        <Layout>
            <div className='text-white p-10 text-center'>Loading watch history...</div>
        </Layout>
    );

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <h1 className="text-3xl font-bold text-white mb-8">Watch History</h1>
                
                {history.length === 0 ? (
                    <div className="text-gray-400 text-center py-20 bg-[#1F1F1F] rounded-2xl border border-dashed border-gray-800">
                        <p className="text-xl">Your watch history is empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...history].reverse().map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;
