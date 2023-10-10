import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from 'react'

export default function Logout() {

  const navigate = useNavigate()
  const {user, setUser} = useContext(AuthContext)

  function handleLogout(){
    // reset auth context info
    if(user){
      setUser({
        username:"anonymous",
        token:"",
        loggedIn: false
      })
      // reset cookie info
      localStorage.clear()
      navigate('/')
    }
  }

  return (
    <div onClick={handleLogout}>Logout</div>
  )
}
