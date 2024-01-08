import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)



  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event, id) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    const nameExists = persons.some((person) => person.name === newName)
    const person = persons.find(p => p.name === newName)
    console.log(person)

    if (nameExists) {
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      const updatedPerson = {...person, number: newNumber}
      personService
      .update(person.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
      setNotification({
        text: `Updated ${newName}`,
        type: 'message'
      })
      setTimeout(() => {
        setNotification(null)
        window.location.reload()
      }, 5000)
      setNewName('')
      setNewNumber('')
      })
      .catch(error=>{
      setNotification({
        text: `Information of ${newName} has already been removed from the server`,
        type: 'error'
      })
    })} else {

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({
          text: `Added ${newName}`,
          type: 'message'
        })
        setTimeout(() => {
          setNotification(null)
          window.location.reload()
        }, 5000)

      
      setNewName('')
      setNewNumber('')
      
    })
    }



  }

  const deletePersonTest = async (id)=>{
    const person = persons.find(p => p.id === id)
    const confirmed = window.confirm(`Delete ${person.name} ?`)
    console.log(person)
    if (confirmed) {
      await personService
      .deletePerson(person.id)
      setNotification({
        text: `Deleted ${person.name}`,
        type: 'message'
    })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      setPersons(persons.filter(person => person.id !== id))
      setNewName('')
      setNewNumber('')

      }
    }



  const handleNameChange =(event)=>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }


  const handleNumber=(event)=>{
    setNewNumber(event.target.value)
  }

  const handleFilter=(event)=>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const xhttp = new XMLHttpRequest()

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText)
    }
  }

  xhttp.open('GET', '/db.json', true)
  xhttp.send()


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <div>
        <Filter filter={filter} handleFilter={handleFilter}/>
      </div>
      <h3>add a new</h3>
        <PersonForm addPerson={addPerson} name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumber={handleNumber}/>
      <h3>Numbers</h3>
        <Numbers persons={persons} filter={filter} handleNumber={handleNumber} deletePerson={deletePersonTest}/>
    </div>
  )

}

export default App