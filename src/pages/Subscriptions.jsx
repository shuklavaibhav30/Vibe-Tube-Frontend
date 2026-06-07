import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Subscriptions = () => {
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!user?._id) return;
            try {
                const { data } = await API.get(`/subscriptions/u/${user._id}`);
                setChannels(data.data || []);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, [user]);

    if (loading) return (
        <Layout>
            <div className='text-white p-10'>Loading subscriptions...</div>
        </Layout>
    );

    return (
        <Layout>
            <div className="p-4 md:p-8">
                <h1 className="text-2xl font-bold text-white mb-8">Subscriptions</h1>
                
                {channels.length === 0 ? (
                    <div className="text-gray-400 text-center py-20 bg-[#1F1F1F] rounded-2xl border border-dashed border-gray-800">
                        <p className="text-xl">You haven't subscribed to any channels yet.</p>
                        <Link to="/" className="text-blue-500 mt-4 inline-block hover:underline">Discover creators</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {channels.map((sub) => (
                            <Link 
                                key={sub._id} 
                                to={`/c/${sub.channel?.username}`}
                                className="bg-[#1F1F1F] p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all flex flex-col items-center text-center group"
                            >
                                <img 
                                    src={sub.channel?.avatar} 
                                    alt={sub.channel?.username} 
                                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-transparent group-hover:border-blue-500 transition-all"
                                />
                                <h3 className="text-white font-bold text-lg truncate w-full">
                                    {sub.channel?.fullName}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">@{sub.channel?.username}</p>
                                <div className="mt-4 px-4 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-full font-bold">
                                    Subscribed
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Subscriptions;
