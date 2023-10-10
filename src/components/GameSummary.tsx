
// for sending to game summary
type Props = {
  setGameStatus: (str: string) => void
  penaltyChecksUsed: number
  addRowPenalty: number
  setsFound: number
}

export default function GameSummary({setGameStatus, penaltyChecksUsed, addRowPenalty, setsFound}:Props) {
  
  async function handleSubmitScore(){
    
  }

  function handleStartOver(){
    setGameStatus("choosing")
  }

  return (
    <div className="gameSummaryContainer">
      <h3>Final Score: {setsFound - penaltyChecksUsed - (addRowPenalty*0.5)}</h3>
      <h3>Total Sets Found: {setsFound}</h3>
      <h3>Minus penalty checks used: {penaltyChecksUsed}</h3>
      <h3>Minus 0.5 times the number of sets already present when dealing extra rows: {addRowPenalty} x 0.5 = {addRowPenalty * 0.5}</h3>
      <button className="allAppButtons" onClick={handleSubmitScore}>Submit Score</button>
      <button className="allAppButtons" onClick={handleStartOver}>Start Over</button>
    </div>
  )
}
