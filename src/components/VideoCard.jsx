import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const VideoCard = ({video}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className='flex flex-col gap-2 group'>
        <Link to={`/video/${video._id}`} className="relative aspect-video rounded-xl overflow-hidden transition-colors bg-surface">
            <img src={video.thumbnail} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'/>
        </Link>
        
        <div className='flex gap-3 mt-2'>
            <Link to={`/c/${video.owner?.username}`} className="shrink-0">
                <img src={video.owner?.avatar} className='w-9 h-9 rounded-full object-cover hover:opacity-80 transition-opacity bg-surface' />
            </Link>
            <div className='flex flex-col min-w-0'>
                <Link to={`/video/${video._id}`}>
                    <h3 className="font-bold line-clamp-2 hover:text-accent transition-colors leading-snug text-text-primary">{video.title}</h3>
                </Link>
                <Link to={`/c/${video.owner?.username}`} className='text-text-secondary text-sm mt-1 hover:text-accent transition-colors flex items-center'>
                    {video.owner?.fullName}
                </Link>
                <p className='text-text-secondary text-xs mt-0.5'>{video.views} views</p>
            </div>
        </div>
    </div>
  )
}

export default VideoCard;
