import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import API from '../api/axios'

const Register = () => {
    const [formData,setFormData]=useState({
      fullName:'',
      username:'',
      email:'',
      password:'',
    })

    const [avatar,setAvatar]=useState(null)
    const [coverImage,setCoverImage]=useState(null)
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate();

    const handleChange=(e)=>{
      setFormData({
        ...formData,[e.target.name]:e.target.value
      })
    }

    const handleFileChange=(e)=>{
      if(e.target.name==='avatar')setAvatar(e.target.files[0]);
      if(e.target.name==='coverImage') setCoverImage(e.target.files[0]);
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true);
      setError('');

      const data=new FormData();
      data.append('fullName',formData.fullName)
      data.append('username',formData.username)
      data.append('email',formData.email)
      data.append('password',formData.password)
      if (avatar) data.append('avatar',avatar);
      if (coverImage) data.append('coverImage',coverImage);

      try{
        await API.post('/users/register',data,{
          headers:{
            'Content-Type':'multipart/form-data'
          },
        });
        navigate('/login');
      }
      catch(err){
        setError(err.response?.data.message||'Registration failed')
      }
      finally{
        setLoading(false);
      }
      
    }
  
  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors py-12 px-4 ${isDarkMode ? 'bg-[#0F0F0F]' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-lg p-8 rounded-2xl shadow-2xl border relative transition-colors ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-2 rounded-lg">
            <span className="text-2xl font-bold text-white">VT</span>
          </div>
        </div>
        <h2 className={`text-3xl font-bold mb-2 text-center transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
        <p className={`text-center mb-8 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Join our community and start sharing</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input 
                type='text'
                name='fullName' 
                placeholder='Raj Sharma' 
                className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
              <input 
                type='text'
                name='username' 
                placeholder='Rajsharma@123' 
                className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <input 
              type='email'
              name='email' 
              placeholder='rajsharma@example.com' 
              className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="space-y-1">
            <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input 
              type='password'
              name='password' 
              placeholder='••••••••' 
              className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2'>
            <div className='space-y-2'>
              <label className={`text-sm font-medium ml-1 block transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avatar <span className="text-red-500">*</span></label>
              <div className="relative group">
                <input 
                  type="file" 
                  name="avatar" 
                  accept='image/*' 
                  className='hidden' 
                  id="avatar-upload"
                  onChange={handleFileChange} 
                  required
                />
                <label 
                  htmlFor="avatar-upload"
                  className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                >
                  <span className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {avatar ? avatar.name : "Select Avatar"}
                  </span>
                </label>
              </div>
            </div>

            <div className='space-y-2'>
              <label className={`text-sm font-medium ml-1 block transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cover Image</label>
              <div className="relative group">
                <input 
                  type="file" 
                  name="coverImage" 
                  accept='image/*' 
                  className='hidden' 
                  id="cover-upload"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="cover-upload"
                  className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700' : 'bg-gray-50 border-gray-300'}`}
                >
                  <span className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {coverImage ? coverImage.name : "Select Cover"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button 
            type='submit' 
            disabled={loading} 
            className='w-full p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4'
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Create Account'}
          </button>
        </form>
        
        <p className={`mt-8 text-center text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Already having an account? {' '}
          <Link to="/login" className='text-blue-500 font-semibold hover:text-blue-400 transition-colors'>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
