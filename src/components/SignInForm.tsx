import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"


export default function SignInForm(){

  const {user, setUser} = useContext(AuthContext)
  const navigate = useNavigate()
  const base_api_url = import.meta.env.VITE_APP_BASE_API

  // form submission fields
  const [usernameField, setUsernameField] = useState("")
  const [passwordField, setPasswordField] = useState("")
  const [signInClicked, setSignInClicked] = useState(false)
    
  // form error fields
  const[credentialsError, setCredentialsError] = useState('')

  useEffect(()=>{
    if(user.token){
      localStorage.setItem('token', JSON.stringify(user.token))
      localStorage.setItem('username', JSON.stringify(user.username))
    }
  },[user])

  async function handleRegisterForm(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setSignInClicked(true)

    // reset error fields if needed
    setCredentialsError('')

    const res = await fetch(`${base_api_url}/verifyuser`,{
      method:"POST",
      headers:{
        'Content-Type' : 'application/json'
      },
        body: JSON.stringify({
          username: usernameField,
          password: passwordField
        })
    })

    const data = await res.json()

    if(res.ok){
      setUser({
        username:usernameField,
        token:data.userToken,
        loggedIn:true
      })
      console.log("signed in ok", data)
      navigate('/')
    }else{
      setCredentialsError("Invalid credentials, try again.")
      setSignInClicked(false)
      return
    }
    
  }
    
  return (
    <form className="registerForm" onSubmit={handleRegisterForm}>
      <h2 style={{textAlign:'center', margin:'2rem'}}>Sign In Here</h2>
      <label><p>Enter your username</p>
        <input
          className = "signInFormField" 
          required
          type="text" 
          placeholder="Username"
          onChange={(e) => setUsernameField(e.target.value)} 
          value={usernameField}
        />
      </label>
      <label><p>Enter your password</p>
        <input 
          className = "signInFormField" 
          required
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPasswordField(e.target.value)}
          value={passwordField}
        />
      </label>
      <button 
        className = "signInFormSubmitButton allAppButtons" 
        style={{width:'12rem'}} 
        disabled = {signInClicked}
      >
        {!signInClicked && <p>Sign In</p> }
        {signInClicked && <p>Signing In...</p>}
      </button>
      <div className="signInErrorContainer">
        <i>
          {credentialsError === "" && ""}
          {credentialsError !== "" && credentialsError}
        </i>
      </div>
    </form>
  )
}