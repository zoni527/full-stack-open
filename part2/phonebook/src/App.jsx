import { useState, useEffect } from 'react'
import { Filter, PersonForm, Persons } from './components/Components'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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

    const alreadyExistingPerson = persons.find(p => p.name === newName)
    if (alreadyExistingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const modifiedPerson = {
          ...alreadyExistingPerson,
          number: newNumber
        }
        personService
          .update(modifiedPerson.id, modifiedPerson)
          .then(() => {
            setPersons(
              persons
                .filter(p => p.id !== modifiedPerson.id)
                .concat(modifiedPerson)
            )
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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
      <Persons
        list={filteredPersons}
        persons={persons}
        setPersons={setPersons}
      />
    </div>
  )
}

export default App
