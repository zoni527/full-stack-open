import { useState } from 'react'

const Button = (props) => {
  const {text, onClick} = props

  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistics = (props) => {
  const {g, b, n} = props

  const clicks = g + b + n

  return (
    <div>
      <StatisticLine text="good" value={g} />
      <StatisticLine text="neutral" value={n} />
      <StatisticLine text="bad" value={b} />
      <StatisticLine text="all" value={clicks} />
      <StatisticLine text="average" value={ (g - b) / clicks } />
      <StatisticLine text="positive" value={ ((100 * g) / clicks) + " %"} />
    </div>
  )
}

const StatisticLine = (props) => {
  const {text, value} = props

  return (
    <p>{text} {value}</p>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" onClick={() => setGood(good + 1)}/>
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)}/>
      <Button text="bad" onClick={() => setBad(bad + 1)}/>
      <h2>statistics</h2>
      <Statistics g={good} b={bad} n={neutral} />
    </div>
  )
}

export default App
