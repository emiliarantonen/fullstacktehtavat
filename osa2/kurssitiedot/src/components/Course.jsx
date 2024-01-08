const Course=({course})=>{
    return(
      <div>
        <Header course={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/> 
      </div>
    )
  }
  
  const Header = (props) => {
    console.log(props)
    return <h2>{props.course}</h2>
  };
  
  const Content = ({parts}) => {
  
    return (
      <div>
        {parts.map(part => (
          <Part part={part} />
        ))}
      </div>
    );
  };
  
  const Total = ({parts}) => {
    const total = parts.reduce((acc, part)=> acc + part.exercises, 0)
    return (
      <div>
        <b>total of {total} exercises</b>
      </div>
    );
  }
  
  const Part = ({part}) => {
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }

  export default Course