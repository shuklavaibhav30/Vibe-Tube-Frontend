import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Header = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b transition-colors bg-bg text-text-primary border-border-theme">
            <div className='flex items-center gap-4'>
                <Link to="/" className='text-xl font-bold flex items-center gap-2'>
                    <span className='bg-red-600 p-1 rounded text-white'>VT</span>VideoTube
                </Link>
            </div>
            <div className='flex-1 max-w-2xl px-4'>
                <form onSubmit={handleSearch} className="flex items-center border rounded-full px-4 py-1 transition-colors bg-transparent border-border-theme focus-within:border-accent">
                    <input
                        type="text"
                        placeholder='Search🔎'
                        className='w-full bg-transparent outline-none py-1 placeholder:text-text-secondary text-text-primary'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="pl-4 border-l border-border-theme transition-colors">
                        <svg className='w-5 h-5 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth='2' d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>
            <div className='flex items-center gap-2 md:gap-4'>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full transition-colors hover:bg-surface-hover"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? (
                        <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
                <Link to='/upload' className="p-2 rounded-full transition-colors hover:bg-surface-hover text-text-primary">
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </Link>
                {user ? (
                    <div className='flex items-center gap-3'>
                        <Link to={`/c/${user.username}`}>
                            <img src={user.avatar} alt="avatar" className='w-8 h-8 rounded-full border border-border-theme hover:opacity-80 transition-opacity' />
                        </Link>
                        <button onClick={handleLogout} className="text-sm px-3 py-1 rounded transition-colors bg-surface-hover hover:opacity-80 text-text-primary">Logout</button>
                    </div>
                ) : (
                    <Link to="/login" className='bg-blue-600 px-4 py-1 rounded-full font-medium text-white hover:bg-blue-700'>Sign In</Link>
                )}
            </div>
        </header>
    
  )
}

export default Header;
