import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

// for sending to game summary
type Props = {
  setGameStatus: (str: string) => void
  penaltyChecksUsed: number
  setPenaltyChecksUsed: (num: number) => void
  addRowPenalty: number
  setAddRowPenalty: (num: number) => void
  setsFound: number
  setSetsFound: (num: number) => void
}

export default function GameSummary({setGameStatus, 
                                     penaltyChecksUsed, setPenaltyChecksUsed,
                                     addRowPenalty, setAddRowPenalty,
                                     setsFound ,setSetsFound}:Props) {
  
  const {user} = useContext(AuthContext)
  const base_api_url = import.meta.env.VITE_APP_BASE_API
  const navigate = useNavigate()
  const lastGameScore = setsFound - penaltyChecksUsed - (addRowPenalty * 0.5)
  let sessionToken = "anonymous"
  // otherwise value will be "anonymous"
  // backend checks if token is "anonymous" explicitly
  if(user.loggedIn){
    sessionToken = user.token
  }

  async function handleSubmitScore(){
    
    // post to correct api endpoint
    const res = await fetch(`${base_api_url}/newScore`, {
      method:"POST",
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        token: sessionToken,
        game_score: lastGameScore
      })
    })

    const data = await res.json()

    if(res.ok){
      console.log(data)
      navigate("/highScoreSubmissionPage")
    }else{
      console.log("error in res from within font end game summary")
    }
  }

  function handleStartOver(){
    // since these are initiated in chooseAndPlay, must reset them
    // otherwise they retain their values from the end of last game
    setPenaltyChecksUsed(0)
    setAddRowPenalty(0)
    setSetsFound(0)
    setGameStatus("choosing")
  }

  return (
    <div className="gameSummaryContainer">
      <h3>Final Score: {lastGameScore}</h3>
      <h3>Total Sets Found: {setsFound}</h3>
      <h3>Minus penalty checks used: {penaltyChecksUsed}</h3>
      <h3>Minus 0.5 times the number of sets already present when dealing extra rows: {addRowPenalty} x 0.5 = {addRowPenalty * 0.5}</h3>
      <button className="allAppButtons" onClick={handleSubmitScore}>Submit Score</button>
      <button className="allAppButtons" onClick={handleStartOver}>Start Over</button>
    </div>
  )
}
