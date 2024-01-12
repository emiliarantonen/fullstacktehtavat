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

  const addPerson = (event) => {
    event.preventDefault();
  
    const existingPerson = persons.find((person) => person.name === newName);
  
    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
  
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons((persons) =>
              persons.map((p) => (p.id !== existingPerson.id ? p : returnedPerson))
            )
            setNotification({
              text: `Updated ${newName}`,
              type: 'message',
            })
            setTimeout(() => {
              setNotification(null)
              window.location.reload()
            }, 5000);
          })
          .catch((error) => {
            setNotification({
              text: `Information of ${newName} has already been removed from the server`,
              type: 'error',
            });
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber }
  
      personService
      .create(personObject)
      .then(returnedPerson => {
        console.log('moi')
        setPersons(persons.concat(returnedPerson))
        setNotification({
          text: `Added ${personObject.name} to phonebook`,
          type: 'message'
        })
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setNotification(null)
          window.location.reload()
        }, 5000)
      })
      .catch(error => {
        setNotification({
          text: error.response.data.error,
          type: 'error'
        })
        console.log(error.response.data);
        
        setTimeout(() => {
          setNotification(null)
          window.location.reload()
        },5000)
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