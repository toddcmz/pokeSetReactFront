

export default function RulesPage() {
  return (
    <div style={{width: '35rem', margin:'auto', paddingTop:'5rem'}}>
      Full explanation with styling and images coming soon.
      <br /> 
      In the mean time: 
      <br />
      Rules are the same as the class Set card game.
      <br />
      <br />
      Each card has 4 characteristics: 
      <ol>
        <li>Background Color</li>
        <li>Border Style</li>
        <li>Pokemon Type</li>
        <li>Number of Pokemon</li>
      </ol>
      <br />
      Your task is to find a group of three cards (a set)
      where each characteristic is either all the same or all 
      different across the set. For example, your three cards
      must have either all the same background color (e.g., green, green, green),
      or all different colors (e.g., green, yellow, purple). If your three
      cards had background colors of, say, green, green, purple, this 
      would not be a set: two cards were the same and one was different.
      <br />
      <br />
      A set does not require that *all four* characteristics follow
      the same pattern (e.g., if the background colors are all the same, it
      would not then be required that the remaining 3 characteristics also
      be all the same.) Each characteristic must either be all the same or all 
      different independently of the other three characteristics. For example, 
      your set could have three cards where the backgrounds are all the same,
      the borders are all the same, the pokemon type is all different,
      and the number of pokemon on the card is all different.
      <br />
      <br />
      Image examples of sets coming soon.
      </div>

  )
}
