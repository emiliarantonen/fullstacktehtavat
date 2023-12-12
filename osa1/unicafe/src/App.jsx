import { useState } from 'react'

const Button = (props) => {
  return(
    <button onClick={props.handleClick}>
    {props.text}
  </button> 
  )
}

const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )
}

const Statistics = (props) => {
  const sum = props.good+props.neutral+props.bad
  const average= (props.good*1+props.neutral*0+props.bad*(-1))/sum
  const positive= (props.good/sum)*100

  if (sum===0){
    return(
      
      <div>
        <h1>statistics</h1>
      No feedback given</div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='good' value={props.good}/>
          <StatisticLine text='neutral' value={props.neutral}/>
          <StatisticLine text='bad' value={props.bad}/>
          <StatisticLine text='average' value={average}/>
          <StatisticLine text='positive' value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    return (
        setGood(good+1)
      )
    }

  const handleNeutral = () => {
    return (
        setNeutral(neutral+1)
      )
    }

    const handleBad = () => {
      return (
          setBad(bad+1)
        )
      }
  

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good' value={good}/>
      <Button handleClick={handleNeutral} text='neutral' value={neutral}/>
      <Button handleClick={handleBad} text='bad' value={bad}/>

      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App