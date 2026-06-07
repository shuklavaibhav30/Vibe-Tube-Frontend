import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

const Upload = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.name === 'videoFile') setVideoFile(e.target.files[0]);
    if (e.target.name === 'thumbnail') setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      setError("Both video and Thumbnail are required!");
      return;
    }
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('videoFile', videoFile);
    data.append('thumbnail', thumbnail);

    try {
      await API.post("/videos", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (er) {
      setError(er.response?.data?.message || "UPLOAD FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className='max-w-3xl mx-auto py-8 px-4'>
        <div className={`rounded-2xl p-8 shadow-2xl border transition-colors ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800' : 'bg-white border-gray-200'}`}>
          <h1 className={`text-3xl font-bold mb-8 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upload Video</h1>
          {error && <div className='bg-red-500/10 text-red-500 p-4 rounded-xl mb-6'>{error}</div>}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className={`block p-8 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all ${isDarkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}>
                  <span className={`block mb-2 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select Video File</span>
                  <span className="text-xs text-blue-500 font-bold">{videoFile?.name || "No File chosen"}</span>
                  <input type="file" name='videoFile' accept='video/*' className='hidden' onChange={handleFileChange} required />
                </label>
                <label className={`block p-8 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all ${isDarkMode ? 'border-gray-700 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500 bg-gray-50'}`}>
                  <span className={`block mb-2 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select Thumbnail File</span>
                  <span className="text-xs text-blue-500 font-bold">{thumbnail?.name || "No File chosen"}</span>
                  <input type="file" name='thumbnail' accept='image/*' className='hidden' onChange={handleFileChange} required />
                </label>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder='Title' className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <textarea placeholder='Description' className={`w-full p-3 rounded-xl border outline-none h-40 resize-none transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
              </div>
            </div>
            <button disabled={loading} className="w-full p-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all">
              {loading ? 'Publishing...' : 'Publish Video'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
