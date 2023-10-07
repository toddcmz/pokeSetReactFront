import { useRef, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"


export default function RegisterPage(){

    const usernameField = useRef<HTMLInputElement>(null)
    const emailField = useRef<HTMLInputElement>(null)
    const passwordField = useRef<HTMLInputElement>(null)
    const {user, setUser} = useContext(AuthContext)

    const navigate = useNavigate()

    const base_api_url = import.meta.env.VITE_APP_BASE_API

    useEffect(()=>{
        if(user.token){
            localStorage.setItem('token', JSON.stringify(user.token))
            localStorage.setItem('username', JSON.stringify(user.username))
        }
    },[user])

    async function handleRegisterForm(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const res = await fetch(`${base_api_url}/newuser`,{
            method:"POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                username: usernameField.current?.value,
                email: emailField.current?.value,
                password: passwordField.current?.value
            })
        })

        if(res.ok){
            const data = await res.json()
            console.log('testing register',data)
            setUser({
                username:usernameField.current?.value || '',
                token:data[0]['token'],
                loggedIn:true
            })
            navigate('/')
        }
    }
    
  return (
    <>
        <div style={{width: '35rem', margin:'auto', paddingTop:'5rem'}}>
            Skip this for now. 
            <br/>
            <br />
            Just head to <strong>Play Pokeset</strong> in the nav bar. 
            <br />
            <br />
            This registration form connects to a free backend 
            hosting solution that is technically functional 
            but very slow, since I didn't want to upgrade to paid hosting tier. Check back later for full functionality.
            Submit button is deactivated for now to avoid spamming the auth table in SQL.
            </div>
        <form style={{width: '35rem', margin:'auto'}} onSubmit={handleRegisterForm}>
            <input type="text" placeholder="Username" ref={usernameField}/>
            <br /><br />
            <input type="email" placeholder="Email" ref={emailField}/>
            <br /><br />
            <input type="password" placeholder="Password" ref={passwordField}/>
            <br /><br />
            {/*<button style={{width:'12rem'}}className="allAppButtons">Register</button>*/}
        </form>
    </>
  )
}
