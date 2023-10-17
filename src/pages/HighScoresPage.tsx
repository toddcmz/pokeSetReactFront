import { AuthContext } from "../contexts/AuthContext"
import { useContext, useState, useEffect } from 'react'

type GameRecord = {
  game_id: number
  game_score: number
  username: string
}

export default function HighScoresPage() {

  const {user} = useContext(AuthContext)
  const base_api_url = import.meta.env.VITE_APP_BASE_API

  const [allScoresList, setAllScoresList] = useState<GameRecord[]>([])
  const [userScoresList, setUserScoresList] = useState<GameRecord[]>([])

  // note, I found a resource that got this wrong, and made
  // that first anon function in useEffect async.
  // this is the correct way, with an async function
  // within the useEffect outer func as its own inner func.
  // I also tried to do this without actively calling and naming
  // the inner async function, which didn't work. 
  useEffect(() => {
    const fetchData = async() => {
      const res = await fetch(`${base_api_url}/scores`)
      const data = await res.json()
      setAllScoresList(data)
    }
    fetchData()
  },[])

  // for fetching user scores if logged in
  useEffect(() => {
    if(user.loggedIn){
      const fetchData = async() => {
        const res = await fetch(`${base_api_url}/scores/${user.username}`,{
          method:"POST",
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            username: user.username,
          })
        })
        const data = await res.json()
        setUserScoresList(data)
      } // end fetchData
    fetchData()
    } // end if logged in
  },[])

  return (
    <>
      <h2 style={{textAlign:'center', marginTop:'2rem', marginBottom:'2rem'}}>High Scores</h2>
      <div className="scoresContainer">
        <div className="allScoresContainer">
          <h3 style={{textAlign:'center'}}>Global Top 50</h3>
            {allScoresList &&
              <table>
                <tbody>
                  {allScoresList.map(entry =>(
                    <tr key = {entry.game_id}>
                      <td>{entry.username}</td> 
                      <td className="tableScore">{entry.game_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
            {allScoresList.length === 0 &&
              <h3>Loading scores...</h3> 
            }
        </div>
        <div className="userScoresContainer">
          <h3 style={{textAlign:'center'}}>User High Scores</h3>
          {user.loggedIn && userScoresList &&
            <table>
              <tbody>
                {userScoresList.map(entry =>(
                  <tr key = {entry.game_id}>
                    <td>{entry.username}</td> 
                    <td className="tableScore">{entry.game_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {!user.loggedIn &&
            <h3 style={{textAlign:'center', marginTop:'1.5rem'}}>Log in to see your high scores!</h3>
          }
        </div>
      </div>
    </>
  )
}
