import { createContext,useContext,useState,useEffect } from "react"
import API from "../api/axios.js"

const AuthContext = createContext()


export const AuthProvider=({ children })=>{

    //User-data
    const [user,setUser]=useState(null)
    
    //Loading state- data coming or not?
    const [loading,setLoading]=useState(true)

    //On opening the app, fetch the current-user

    useEffect(()=>{
        API.get("/users/current-user")
        .then(res=>setUser(res.data.data)) //user found-store it
        .catch(()=>setUser(null))   //if not then set it null
        .finally(()=>setLoading(false)) //set loading false
    },[])

    const login=async(data)=>{
        const res=await API.post("/users/login",data)
        setUser(res.data.data.user)
        return res.data
    }

    const logout=async()=>{
        await API.post("/users/logout")
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{user,setUser,login,logout,loading}}>
            {children}
        </AuthContext.Provider>

    )

}


export const useAuth=()=>useContext(AuthContext)
