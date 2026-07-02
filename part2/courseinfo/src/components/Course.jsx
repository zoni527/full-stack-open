const Course = ({ course }) => {
  const { name, parts } = course

  return (
    <div>
      <Header title={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

const Header = ({ title }) => {
  return (
    <h3>{title}</h3>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(({ id, name, exercises }) =>
        <Part key={id} name={name} exercises={exercises} />
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  return (
    <p><b>total of exercises {parts.reduce(
      (accumulator, currentValue) => accumulator + currentValue.exercises,
      0,
    )}</b></p>
  )
}

const Part = ({ name, exercises }) => {
  return (
    <p>{name} {exercises}</p>
  )
}

export default Course
