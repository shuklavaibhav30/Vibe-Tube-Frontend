import React,{useState,useEffect} from 'react'
import Layout from '../components/Layout'
import API from '../api/axios'
import VideoCard from '../components/VideoCard'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const { isDarkMode } = useTheme()
  //state for storing list of videos
  const [videos,setVideos]=useState([])
  const [loading,setLoading]=useState(true)

  //Fetching videos from Backend
  useEffect(()=>{
    const fetchVideos=async()=>{
      try{
        const {data}=await API.get("/videos")
        //backend uses aggregate paginate so data is inside data.data.docs
        setVideos(data.data.docs||[])
      }
      catch(err){
        console.log("Error while fetching videos",err)
      }
      finally{
        setLoading(false)
      }
    };
    fetchVideos();
  },[]);

  if (loading) return(
    <Layout>
      <div className={isDarkMode ? 'text-white' : 'text-black'}>Loading ...</div>
    </Layout>
  )

  return (
    <Layout>
      {/*Video Grid*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video)=>(
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </Layout>
  )
}

export default Home
