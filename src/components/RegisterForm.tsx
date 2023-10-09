import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"


export default function RegisterForm(){

  const {user, setUser} = useContext(AuthContext)
  const navigate = useNavigate()
  const base_api_url = import.meta.env.VITE_APP_BASE_API

  // form submission fields
  const [usernameField, setUsernameField] = useState("")
  const [emailField, setEmailField] = useState("")
  const [passwordField, setPasswordField] = useState("")
  const [confirmPasswordField, setConfirmPasswordField] = useState("")
  const [registerSubmitted, setRegisterSubmitted] = useState(false)
    
  // form error fields
  const[usernameError, setUsernameError] = useState('')
  const[emailError, setEmailError] = useState('')
  const[passwordError, setPasswordError] = useState('')

  useEffect(()=>{
    if(user.token){
      localStorage.setItem('token', JSON.stringify(user.token))
      localStorage.setItem('username', JSON.stringify(user.username))
    }
  },[user])

  async function handleRegisterForm(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setRegisterSubmitted(true)

    // reset error fields if needed
    setUsernameError('')
    setEmailError('')
    setPasswordError('')

    if(passwordField !== confirmPasswordField){
      setPasswordError("Passwords did not match.")
      setRegisterSubmitted(false)
      setPasswordField("")
      setConfirmPasswordField("")
      return
    }

    const res = await fetch(`${base_api_url}/newuser`,{
      method:"POST",
      headers:{
        'Content-Type' : 'application/json'
      },
        body: JSON.stringify({
          username: usernameField,
          email: emailField,
          password: passwordField
        })
    })

    if(res.ok){
      const data = await res.json()
      if(data[0].message === `${usernameField} registered`){
        setUser({
          username:usernameField,
          token:data[0].token,
          loggedIn:true
        })
        navigate('/')
      }else if(data[0].message === "An account with this username already exists, try again."){
        console.log('username error triggered')
        setUsernameError("This username is already taken.")
        setRegisterSubmitted(false)
        setUsernameField("")
        return
      }else if(data[0].message === "An account with this email already exists, try again."){
        setEmailError("An account with this email already exists.")
        setRegisterSubmitted(false)
        setEmailField("")
        return
      }
    }
  }
    
  return (
    <form className="registerForm" onSubmit={handleRegisterForm}>
      <h2 style={{textAlign:'center', margin:'2rem'}}>Register Here</h2>
      <label><p>Choose a username</p>
        <input
          className = "registerFormField" 
          required
          type="text" 
          placeholder="Username"
          onChange={(e) => setUsernameField(e.target.value)} 
          value={usernameField}
        />
        <div className="inputErrorContainer">
          <i>
            {usernameError === "" && ""}
            {usernameError !== "" && usernameError}
          </i>
        </div>
      </label>
      <label><p>Enter your email</p>
        <input
          className = "registerFormField"  
          required
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmailField(e.target.value)}
          value={emailField}
        />
      </label>
      <div className="inputErrorContainer">
        <i>
          {emailError === "" && ""}
          {emailError !== "" && emailError}
        </i>
      </div>
      <label><p>Choose a password</p>
        <input 
          className = "registerFormField" 
          required
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPasswordField(e.target.value)}
          value={passwordField}
        />
      </label>
      <div className="inputErrorContainer">
        <i>
          {passwordError === "" && ""}
          {passwordError !== "" && passwordError}
        </i>
      </div>
      <label><p>Confirm your password</p>
        <input 
          className = "registerFormField" 
          required
          type="password" 
          placeholder="Confirm Password" 
          onChange={(e) => setConfirmPasswordField(e.target.value)}
          value={confirmPasswordField}
        />
      </label>
      <button 
        className = "registerFormSubmitButton allAppButtons" 
        style={{width:'12rem'}} 
        disabled = {registerSubmitted}
      >
        {!registerSubmitted && <p>Register</p> }
        {registerSubmitted && <p>Submitting...</p>}
      </button>
    </form>
  )
}