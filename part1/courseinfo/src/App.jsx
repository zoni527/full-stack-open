const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = ({name, number}) => {
  return (
    <Part name={name} number={number} />
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.exercises}</p>
  )
}

const Part = ({name, number}) => {
  return (
    <p>{name} {number}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content name={part1} number={exercises1} />
      <Content name={part2} number={exercises2} />
      <Content name={part3} number={exercises3} />
      <Total exercises={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App
