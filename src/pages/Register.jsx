import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import API from '../api/axios'
import { useTheme } from '../context/ThemeContext'

const Register = () => {
    const { isDarkMode } = useTheme();
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
    <div className="flex items-center justify-center min-h-screen transition-colors py-12 px-4 bg-bg">
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl border relative transition-colors bg-surface border-border-theme">
        <Link to="/" className="absolute top-4 right-4 transition-colors p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-2 rounded-lg">
            <span className="text-2xl font-bold text-white">VT</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center transition-colors text-text-primary">Create Account</h2>
        <p className="text-center mb-8 transition-colors text-text-secondary">Join our community and start sharing</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Full Name</label>
              <input 
                type='text'
                name='fullName' 
                placeholder='Raj Sharma' 
                className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Username</label>
              <input 
                type='text'
                name='username' 
                placeholder='Rajsharma@123' 
                className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Email Address</label>
            <input 
              type='email'
              name='email' 
              placeholder='example@vibetube.com' 
              className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Password</label>
            <input 
              type='password'
              name='password' 
              placeholder='••••••••' 
              className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider ml-1 text-text-secondary">Avatar</label>
              <div className="relative group">
                <input 
                  type='file'
                  name='avatar' 
                  className="hidden" 
                  id="avatar-upload"
                  onChange={handleFileChange} 
                  required
                />
                <label 
                  htmlFor="avatar-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-input-bg border-border-theme hover:border-accent group-hover:bg-surface-hover"
                >
                  <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs mt-1 text-text-secondary group-hover:text-accent">Upload Avatar</span>
                </label>
                {avatar && <p className="text-[10px] mt-1 text-accent font-medium truncate">{avatar.name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider ml-1 text-text-secondary">Cover Image</label>
              <div className="relative group">
                <input 
                  type='file'
                  name='coverImage' 
                  className="hidden" 
                  id="cover-upload"
                  onChange={handleFileChange} 
                />
                <label 
                  htmlFor="cover-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-input-bg border-border-theme hover:border-accent group-hover:bg-surface-hover"
                >
                  <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs mt-1 text-text-secondary group-hover:text-accent">Upload Cover</span>
                </label>
                {coverImage && <p className="text-[10px] mt-1 text-accent font-medium truncate">{coverImage.name}</p>}
              </div>
            </div>
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Register"}
          </button>
        </form>

        <div className='relative flex items-center py-6'>
            <div className="flex-grow border-t transition-colors border-border-theme"></div>
            <span className='flex-shrink mx-4 text-text-secondary text-xs uppercase tracking-widest'>OR</span>
            <div className="flex-grow border-t transition-colors border-border-theme"></div>
        </div>

        <button 
            onClick={() => window.location.href = `https://video-tube-backend-zeqq.onrender.com/api/v1/users/auth/google`}
            className="w-full py-4 rounded-xl border border-border-theme flex items-center justify-center gap-3 font-bold text-text-primary hover:bg-surface-hover transition-all"
        >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Continue with Google
        </button>

        <p className="mt-8 text-center text-text-secondary">
          Already have an account?{' '}
          <Link to='/login' className="text-accent font-bold hover:underline transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
