import { useState, useEffect } from 'react'
import axios from 'axios'
import { Filter, PersonForm, Persons } from './components/Components'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (newName === '') {
      alert("name can't be empty")
      return
    }

    if (newNumber === '') {
      alert("number can't be empty")
      return
    }

    if (persons.find((element) => element.name === newName)) {
      console.log('name already in phonebook')
      alert(`${newName} is already added to the phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterStringChange = (event) => {
    setFilterString(event.target.value)
  }

  const filteredPersons = filterString === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterString))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterString} onChange={handleFilterStringChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        val1={newName}
        handler1={handleNameChange}
        val2={newNumber}
        handler2={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons list={filteredPersons} />
    </div>
  )
}

export default App
