import {Routes,Route,Navigate, useLocation, Link} from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { useTheme } from "./context/ThemeContext"
import { useEffect } from "react"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import VideoDetail from "./pages/VideoDetail"
import Upload from "./pages/Upload"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import Playlist from "./pages/Playlist"
import Tweet from "./pages/Tweet"
import PlaylistDetail from "./pages/PlaylistDetail"
import Subscriptions from "./pages/Subscriptions"
import History from "./pages/History"
import AuthSuccess from "./pages/AuthSuccess"


//Protected Routes- If user not logged in, then show "Login to continue" screen

const ProtectedRoute=({children})=>{
  const {user, loading}=useAuth()
  const { isDarkMode } = useTheme()

  if(loading) return(
    <div className={`flex items-center justify-center h-screen transition-colors ${isDarkMode ? 'bg-[#0F0F0F] text-white' : 'bg-white text-black'}`}>
      <p className="text-xl">Loading...</p>
    </div>
  )

  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen transition-colors px-4 text-center ${isDarkMode ? 'bg-[#0F0F0F] text-white' : 'bg-white text-black'}`}>
        <div className="bg-blue-600/10 p-6 rounded-full mb-6">
          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Login to continue</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Please sign in to access your subscriptions, playlists, and more personalized features.
        </p>
        <div className="flex gap-4">
          <Link to="/" className={`px-6 py-2 rounded-full font-bold border transition-all ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}>
            Go Home
          </Link>
          <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return children
}

function App(){
  const location = useLocation();
  
  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location]);

  return(
    <Routes>
      {/*Public routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/video/:videoId" element={<VideoDetail />} />
      <Route path="/c/:username" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

      {/*Protected routes */}
      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      }/>

      <Route path="/playlists" element={
        <ProtectedRoute>
          <Playlist />
        </ProtectedRoute>
      }/>
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      }/>
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      }/>

      <Route path="/playlist/:playlistId" element={
        <ProtectedRoute>
          <PlaylistDetail />
        </ProtectedRoute>
      } />

      <Route path="/tweets" element={
        <ProtectedRoute>
          <Tweet />
        </ProtectedRoute>
      }
      />

      {/*Unknown url=> redirect to Home page */}

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>


  )
}

export default App;