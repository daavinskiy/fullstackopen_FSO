import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0)

  const maxVotes = Math.max(...votes)
  const maxIndex = votes.indexOf(maxVotes)

  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>

      <p>{anecdotes[selected]}</p>

      <p>has {votes[selected]} votes</p>

      <button onClick={vote}>vote</button>

      <button onClick={nextAnecdote}>next anecdote</button>

      {totalVotes > 0 && (
        <div>
          <h2>Anecdote with most votes</h2>

          <p>{anecdotes[maxIndex]}</p>

          <p>has {maxVotes} votes</p>
        </div>
      )}
    </div>
  )
}

export default App