import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import LandingPage from "./pages/LandingPage"
import RegisterPage from "./pages/RegisterPage"
import SignInPage from "./pages/SignInPage"
import PlayGamePage from "./pages/PlayGamePage"
import RulesPage from "./pages/RulesPage"
import HighScoresPage from "./pages/HighScoresPage"
import RegisterSuccessPage from "./pages/RegisterSuccessPage"
import ScoreSubmissionPage from "./pages/ScoreSubmissionPage"


function App() {


  return (
    <>
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path='/' element = { <LandingPage /> } />
            <Route path='/register' element = { <RegisterPage /> } />
            <Route path='/registerSuccessPage' element = { <RegisterSuccessPage /> } />
            <Route path='/signin' element = { <SignInPage /> } />
            <Route path='/play' element = { <PlayGamePage /> } />
            <Route path='/rules' element = { <RulesPage /> } />
            <Route path='/highscores' element = { <HighScoresPage /> } />
            <Route path='/scoreSubmissionPage' element = { <ScoreSubmissionPage /> } />
            <Route path='*' element = { <Navigate to='/' />} />
          </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
