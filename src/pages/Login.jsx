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
    <div className="flex items-center justify-center min-h-screen transition-colors px-4 bg-bg">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border relative transition-colors bg-surface border-border-theme">
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
        <h2 className="text-3xl font-bold mb-2 text-center transition-colors text-text-primary">Welcome Back</h2>
        <p className="text-center mb-8 transition-colors text-text-secondary">Sign in to your VibeTube account</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
            <div className="space-y-1">
                <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  placeholder='Enter your username' 
                  className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
                  onChange={handleChange}
                />
            </div>
            
            <div className='relative flex items-center py-2'>
                <div className="flex-grow border-t transition-colors border-border-theme"></div>
                <span className='flex-shrink mx-4 text-text-secondary text-xs uppercase tracking-widest'>OR</span>
                <div className="flex-grow border-t transition-colors border-border-theme"></div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Email Address</label>
                <input 
                  type="email" 
                  name='email' 
                  placeholder='Enter your email' 
                  className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
                  onChange={handleChange}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium ml-1 transition-colors text-text-primary">Password</label>
                <input 
                  type="password" 
                  name='password' 
                  placeholder='••••••••' 
                  className="w-full p-3 rounded-xl border outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all bg-input-bg text-text-primary border-border-theme" 
                  onChange={handleChange} 
                  required
                />
            </div>

            <button 
                type='submit' 
                className='w-full py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20 mt-4'
            >
                Sign In
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
            New to VibeTube?{' '}
            <Link to='/register' className="text-accent font-bold hover:underline transition-all">Create Account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
