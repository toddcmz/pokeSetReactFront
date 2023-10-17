import { NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import Logout from './Logout'

export default function Header(){
    
    const {user} = useContext(AuthContext)
    console.log('tlc custom log from header component: user.username is now:',user.username)
    return(
        <header className="headerContainer flexMeRow">
            <div className="pageTitle"> 
                <NavLink to='/'>Pokeset</NavLink>
            </div>
            <div className="playingAsContainer">
                <h3>Currently Playing As:</h3>
                <h3>{user.username}</h3>
            </div>
            <div className="navButtonContainer flexMeRow">
                {!user.loggedIn &&
                    <>
                        <div className="navButton">
                            <NavLink to='/register'>Register</NavLink>
                        </div>
                        <div className="navButton">
                            <NavLink to='/signin'>Sign In</NavLink>
                        </div>
                    </>
                }
                <div className="navButton">
                    <NavLink to='/play'>Play Pokeset</NavLink>
                </div>
                <div className="navButton">
                    <NavLink to='/rules'>Rules of Set</NavLink>
                </div>
                <div className="navButton">
                    <NavLink to='/highscores'>High Scores</NavLink>
                </div>
                {user.loggedIn &&
                    <div className="navButton logoutButton">
                        <Logout />
                    </div>
                }
            </div>
        </header>
    )
}