import { useEffect, useState } from "react"
import CardSlot from "./CardSlot"
import MakeDeck from './TheDeck'
//import { useNavigate } from "react-router-dom"
import { checkForSets } from "../utils/generalFunctions"

export type Card = {
  cardId: number
  cardBack: number
  cardBorder: number
  cardPmonCount: number
  cardPmonImgUrl: number
}

// for sending to gameboard
type Props = {
  imgUrls: string[]
  setGameStatus: (str: string) => void
  pmonNameList: string[]
  penaltyChecksUsed: number
  setPenaltyChecksUsed: (num: number) => void
  addRowPenalty: number
  setAddRowPenalty: (num: number) => void
  setsFound: number
  setSetsFound: (num: number) => void
}

const standardBoardSize = 12

export default function GameBoard({ 
  imgUrls, setGameStatus, pmonNameList,
  penaltyChecksUsed, setPenaltyChecksUsed,
  addRowPenalty, setAddRowPenalty,
  setsFound, setSetsFound }: Props) {

  // these are for handling game submission - commented out for 
  // interim vite post
  //const navigate = useNavigate()
  //const base_api_url = import.meta.env.VITE_APP_BASE_API

  // use state to show status of selections
  const [foundSetStatus, setFoundSetStatus] = useState<string>('Awaiting game start')

  // this will hold the cards the user clicks on while playing
  const [userSelections, setUserSelections] = useState<Card[]>([])

  // make the original game deck, this is constructed in TheDeck component
  const [deckCards, setDeckCards] = useState<Card[]>(MakeDeck())

  //this controls how many extra rows can be added
  const [extraRow, setExtraRow] = useState(0)

  // make the initial game board, first 12 cards of the game deck.
  // gets updated with deck pointer as game progresses
  const [boardCards, setBoardCards] = useState<Card[]>(deckCards.slice(0, standardBoardSize))

  // keeps track of where in the deck to deal cards from.
  // starts at value of 12, standard board size
  const [deckPointer, setDeckPointer] = useState(standardBoardSize)

  // for tracking how many sets were found, and penalties for checking
  // for sets too often or adding rows when sets are available.
  const [setsPresent, setSetsPresent] = useState<string>("unclicked")
  const [freebiesUsed, setFreebiesUsed] = useState(0)

  //useEffect to trigger updates to several state objects when
  // the userSelections state array has 0, 1, 2, or 3 cards.
  useEffect(() => {
    // this is the "check if a set case"
    if (userSelections.length === 3) {
      let borderSet = [...new Set([userSelections[0].cardBorder, userSelections[1].cardBorder, userSelections[2].cardBorder])]
      let backgroundSet = [...new Set([userSelections[0].cardBack, userSelections[1].cardBack, userSelections[2].cardBack])]
      let pokeNumSet = [...new Set([userSelections[0].cardPmonCount, userSelections[1].cardPmonCount, userSelections[2].cardPmonCount])]
      let spriteSet = [...new Set([userSelections[0].cardPmonImgUrl, userSelections[1].cardPmonImgUrl, userSelections[2].cardPmonImgUrl])]
      // do the comparisons to determine valid set based on above 4 objects lengths, just none of them can be of length 2.
      if (borderSet.length !== 2 && backgroundSet.length !== 2 && pokeNumSet.length !== 2 && spriteSet.length !== 2) {
        setFoundSetStatus("Yay! That's a valid set!")
        setSetsFound(setsFound + 1)
        setUserSelections([])
        // if user checked whether sets were present previously, finding any set resets state for this
        // element so the accompanying HTML does not continue to display.
        setSetsPresent("unclicked")

        // if we have standard size board, replace found cards with new cards from deck
        if (boardCards.length === standardBoardSize) {
          setBoardCards((boardCards) => boardCards.map(
            (card) => {
              if (card.cardId === userSelections[0].cardId) {
                return deckCards[deckPointer]
              } else if (card.cardId === userSelections[1].cardId) {
                return deckCards[deckPointer + 1]
              } else if (card.cardId === userSelections[2].cardId) {
                return deckCards[deckPointer + 2]
              } else {
                return card
              }
            }
          ))
          // if we've dealt new cards, update the deck pointer so next deal starts in correct place
          setDeckPointer(deckPointer + 3)
        }
        // if board is larger than standard (extra rows have been added)
        // then don't deal new cards, just collapse down - this can use original
        // "new board" code.
        if (boardCards.length > standardBoardSize) {
          setBoardCards((boardCards) => boardCards.filter(
            (card) => card.cardId !== userSelections[0].cardId
              &&
              card.cardId !== userSelections[1].cardId
              &&
              card.cardId !== userSelections[2].cardId
          ))
        }
        // otherwise not a valid set
      } else {
        setFoundSetStatus("Sorry, that's not a set.")
        setUserSelections([])
      }
      // update message states if there's 2 cards in the array
    } else if (userSelections.length === 2 || userSelections.length === 1) {
      setFoundSetStatus('Player is choosing cards')
    }
    // otherwise the array is empty and we do nothing.
  }, [userSelections])

  // this will handle the extra row request. !==0 handles game start, where
  // there should not be an extra row. 21 is max number of cards incl
  // extra rows (technically max 3 extra rows)
  useEffect(() => {
    if (extraRow !== 0 && boardCards.length < 21) {
      setBoardCards([...boardCards,
      deckCards[deckPointer],
      deckCards[deckPointer + 1],
      deckCards[deckPointer + 2]])
      //then update the deck pointer
      setDeckPointer(deckPointer + 3)
      // if there are sets present, also dock points equal to number of sets present when adding row
      let availableSetsCount = checkForSets(boardCards)
      setAddRowPenalty(addRowPenalty + availableSetsCount)
    } else if (extraRow !== 0) {
      console.log("extra row not allowed")
    }
  }, [extraRow])

  // When we get near the end of the deck, reshuffle and deal a new board.
  // 76 was chosen arbitrarily - near end but will trigger before trying to
  // deal cards beyond the size of the deck. 
  // In timed games, this should almost never need to trigger.
  useEffect(() => {
    if (deckPointer > 76) {
      setDeckCards(MakeDeck())
      setBoardCards(deckCards.slice(0, standardBoardSize))
      setDeckPointer(standardBoardSize)
      setUserSelections([])
      setExtraRow(0)
      setFoundSetStatus("Reshuffled empty deck!")
    }
  }, [deckPointer])

  function selectingCards(selectedCard: Card): void {
    // clicking a card multiple times would remove it from selections
    if (!userSelections.includes(selectedCard)) {
      setUserSelections(userSelections => [...userSelections, selectedCard])
    } else {
      setUserSelections(userSelections.filter(selection => selection.cardId !== selectedCard.cardId))
    }
  }

  function handleCheckSetsClick() {
    // only do stuff if you haven't just clicked this button
    if (setsPresent === 'unclicked') {
      const theseSets = `Total sets on board: ${checkForSets(boardCards)}`
      setSetsPresent(theseSets)
      // keep track of how many times user has checked for sets.
      // idea is you get three free checks per game.
      if (freebiesUsed < 3) {
        setFreebiesUsed(freebiesUsed + 1)
      } else {
        setPenaltyChecksUsed(penaltyChecksUsed + 1)
      }
    }
  }

  // this just forces the state of extra row to change every time 
  // the button is clicked and handles associated logic.
  function handleExtraRow(): void {
    setExtraRow(extraRow + 1)
    // stop displaying extra sets count if another row is added
    setSetsPresent("unclicked")
  }

  // handles clicking end early button. sends to game summary
  // also gets called when the game timer runs out
  async function handleEndGame(){
    setGameStatus("summary")
  }

  // this re-renders gameboard by altering the state
  function handleStartOver() {
    // since these are initiated in chooseAndPlay, must reset them
    // otherwise they retain their values from the end of last game
    setPenaltyChecksUsed(0)
    setAddRowPenalty(0)
    setSetsFound(0)
    setGameStatus("choosing")
  }

  return (
    <>
      <div className="gameAreaContainer">
        <div className="gameDetailsContainer flexMeColumn">
          <button className="allAppButtons duringPlayButtons" onClick={handleStartOver}>Start Over</button>
          <h3><strong>{foundSetStatus}</strong></h3>
          <h3>You're playing with:
            <span className="thisGamePmonInfo">
              <img className="pmonSpriteTiny" src={`${imgUrls[0]}`} alt="" />
              {pmonNameList[0].charAt(0).toUpperCase() + pmonNameList[0].slice(1)}
            </span>
            <span className="thisGamePmonInfo">
              <img className="pmonSpriteTiny" src={`${imgUrls[1]}`} alt="" />
              {pmonNameList[1].charAt(0).toUpperCase() + pmonNameList[1].slice(1)}
            </span>
            <span className="thisGamePmonInfo">
              <img className="pmonSpriteTiny" src={`${imgUrls[2]}`} alt="" />
              {pmonNameList[2].charAt(0).toUpperCase() + pmonNameList[2].slice(1)}
            </span>
          </h3>
          <button className="allAppButtons duringPlayButtons" onClick={handleCheckSetsClick}>Check for Sets</button>
          {setsPresent !== "unclicked" &&
            <h3>{setsPresent}</h3>
          }
          {setsPresent === "unclicked" &&
            <h3>{`Free checks left: ${3 - freebiesUsed}`}</h3>
          }
          <h3>{`Penalty set checks: ${penaltyChecksUsed}`}</h3>
          <button className="allAppButtons duringPlayButtons" onClick={handleExtraRow}>Deal Extra Row</button>
          <h3>{`Extra row penalties: ${addRowPenalty}`}</h3>
          {/* <button className="allAppButtons duringPlayButtons" onClick={handleSubmitGame}>Submit Game</button> */}

          <h3><strong>Sets Found: {setsFound}</strong></h3>
          <h3><strong>{`Total Score: ${setsFound - penaltyChecksUsed - (addRowPenalty * 0.5)}`}</strong></h3>
          <button className="allAppButtons duringPlayButtons" onClick={handleEndGame}>End Game Now</button>
        </div>
        <div className="gameBoardContainer">
          {boardCards.map(eachCard => (
            <CardSlot key={eachCard.cardId} eachCard={eachCard} imgUrls={imgUrls} handleClick={selectingCards} userSelections={userSelections} />
          ))}
        </div>
      </div>
    </>
  )
}
