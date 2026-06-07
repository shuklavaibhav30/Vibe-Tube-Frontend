import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Login = () => {
    const { isDarkMode } = useTheme();
    const [formData,setFormData]=useState({
        email:'',
        username:'',
        password:'',

    })

    const [error,SetError]=useState('')
    const {login}=useAuth();
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        SetError('');
        try{
            await login(formData);
            navigate('/')

        }
        catch(err){
            SetError(err.message||'Login failed')
        }
    }
  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors px-4 ${isDarkMode ? 'bg-[#0F0F0F]' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border relative transition-colors ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800' : 'bg-white border-gray-200'}`}>
        <Link to="/" className={`absolute top-4 right-4 transition-colors p-2 rounded-full ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-2 rounded-lg">
            <span className="text-2xl font-bold text-white">VT</span>
          </div>
        </div>
        <h2 className={`text-3xl font-bold mb-2 text-center transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
        <p className={`text-center mb-8 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your VideoTube account</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
            <div className="space-y-1">
                <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  placeholder='Enter your username' 
                  className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
                  onChange={handleChange}
                />
            </div>
            
            <div className='relative flex items-center py-2'>
                <div className={`flex-grow border-t transition-colors ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
                <span className='flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-widest'>OR</span>
                <div className={`flex-grow border-t transition-colors ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
            </div>

            <div className="space-y-1">
                <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <input 
                  type="email" 
                  name='email' 
                  placeholder='Enter your email' 
                  className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
                  onChange={handleChange}
                />
            </div>

            <div className="space-y-1">
                <label className={`text-sm font-medium ml-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <input 
                  type="password" 
                  name='password' 
                  placeholder='••••••••' 
                  className={`w-full p-3 rounded-xl border outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-[#0F0F0F] text-white border-gray-700' : 'bg-gray-50 text-black border-gray-300'}`} 
                  onChange={handleChange} 
                  required
                />
            </div>

            <button 
              type='submit' 
              className='w-full p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 mt-4'
            >
              Sign In
            </button>
        </form>
        
        <p className={`mt-8 text-center text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          New to VideoTube? {' '}
          <Link to="/register" className='text-blue-500 font-semibold hover:text-blue-400 transition-colors'>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
