import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'

export default function ScoreSubmissionPage() {

  const navigate = useNavigate()

  // this guarnatees the page will load, first, before the redirect
  useEffect(() => {
    // built in javascript - do somethign after x milliseconds
    setTimeout(()=>{
      navigate('/highscores')
    }, 3000)
  },[])
  
  return (
    <div style={{width:'20rem', margin:'3rem auto'}}>Submitting your score...</div>
  )
}
