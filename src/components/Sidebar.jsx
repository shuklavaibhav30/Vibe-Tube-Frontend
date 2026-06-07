import React from 'react'
import ServerStatus from './ServerStatus'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 h-[calc(100vh-56px)] sticky top-[56px] overflow-y-auto hidden md:block border-r border-border-theme bg-bg transition-colors">
            <div className='p-4 space-y-2'>
                <Link to="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    Home
                </Link>

                {user && (
                    <Link to={`/c/${user.username}`} className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                    </Link>
                )}

                <Link to="/subscriptions" className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                <svg className='w-6 h-6'fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Subscriptions
            </Link>
            <hr className="my-4 border-border-theme"/>
            <Link to="/history" className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
            </Link>
            <Link to="/playlists" className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Playlists
            </Link>

            <Link to="/tweets" className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-primary">
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Community
            </Link>
        </div>
        {/*Server Status*/}
        <div className="p-4 border-t border-border-theme">
            <ServerStatus />
        </div>
    </aside>
    
  )
}

export default Sidebar;
