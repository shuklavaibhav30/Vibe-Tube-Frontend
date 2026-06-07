import React,{useState,useEffect} from 'react'
import API from '../api/axios';

const ServerStatus = () => {
    const [status,setStatus]=useState('checking');
    useEffect(()=>{
        API.get('/healthcheck').then(()=>setStatus('online'))
        .catch(()=>setStatus('offline'));
    },[]);
  return (
    <div className='flex items-center gap-2 p-4 text-xs text-gray-500'>
        <div className={`w-2 h-2 rounded-full ${status === 'online'? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>{status === 'online' ? 'System Operational' : 'Connection Error'}</span>
      
    </div>
  )
}

export default ServerStatus;
