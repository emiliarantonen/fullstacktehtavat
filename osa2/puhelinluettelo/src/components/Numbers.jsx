const Numbers =({persons, filter, deletePerson})=>{
    const filteredPersons =
    filter === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
    
    return(
        <ul>
        {filteredPersons.map((person) => (
            <li key={person.name}>{person.name} {person.number}
            <button onClick={()=>deletePerson(person.id)} type="submit">delete</button>
            </li>
        ))}
        </ul>
      
    )
  
  }

  export default Numbers