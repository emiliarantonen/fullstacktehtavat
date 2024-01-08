import Course from './components/Course'

const App = ({courses}) => {
 
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => (<Course course={course}/>))}
    </div>
  )
}

export default App