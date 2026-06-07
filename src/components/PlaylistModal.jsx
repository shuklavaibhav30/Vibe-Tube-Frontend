import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const PlaylistModal = ({ videoId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data: user } = await API.get('/users/current-user');
        const { data } = await API.get(`/playlists/user/${user.data._id}`);
        setPlaylists(data.data || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await API.patch(`/playlists/add/${videoId}/${playlistId}`);
      alert("Added to playlist!");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding to playlist");
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/playlists', { name: newPlaylistName, description: "My playlist" });
      setPlaylists([...playlists, data.data]);
      setNewPlaylistName('');
      setShowCreate(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl border p-6 transition-colors ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Save to playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2 custom-scrollbar">
          {loading ? (
            <p className="text-gray-500 text-center">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-gray-500 text-center text-sm">No playlists found</p>
          ) : (
            playlists.map(playlist => (
              <button 
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${isDarkMode ? 'hover:bg-[#272727] text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <div className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <span className="font-medium">{playlist.name}</span>
              </button>
            ))
          )}
        </div>

        {!showCreate ? (
          <button 
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 p-3 text-blue-600 font-bold hover:bg-blue-600/10 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create new playlist
          </button>
        ) : (
          <form onSubmit={handleCreatePlaylist} className="space-y-3">
            <input 
              autoFocus
              type="text" 
              placeholder="Enter playlist name" 
              className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 p-2 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
              <button type="submit" className="flex-1 p-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Create</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
