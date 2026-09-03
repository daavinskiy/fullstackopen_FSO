const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
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
      <h1>{course}</h1>

      <Part name={part1} exercises={exercises1} />
      <Part name={part2} exercises={exercises2} />
      <Part name={part3} exercises={exercises3} />

      <p>
        Number of exercises {exercises1 + exercises2 + exercises3}
      </p>
    </div>
  )
}

export default App