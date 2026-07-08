import personService from '../services/persons'

const PersonForm = ({ onSubmit, val1, handler1, val2, handler2 }) => {
  return (
    <form onSubmit={onSubmit}>
      <Input text="name" value={val1} onChange={handler1} />
      <Input text="number" value={val2} onChange={handler2} />
      <button type="submit">add</button>
    </form>
  )
}

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text}: <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const Persons = ({ list, persons, setPersons, setNotification, setErrorState }) => {
  const deleteHandler = id => {
    const name = persons.find(p => p.id === id).name
    if (!window.confirm(`Delete ${name}?`))
      return

    personService
      .deleteId(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))

        setNotification(`Deleted ${name}`)

        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        console.error("Error deleting person:", error)
        setErrorState(true)
        setNotification(`Information of ${name} has already been removed from server`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  return (
    <table>
      <tbody>
        {list.map(person =>
            <tr key={person.name}>
              <td>{person.name || ' --- '}</td>
              <td>{person.number || ' --- '}</td>
              <td>
                <button onClick={() => {
                deleteHandler(person.id)
              }}>
                  delete
                </button>
              </td>
            </tr>
        )}
      </tbody>
    </table>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

export {
  Persons,
  Filter,
  PersonForm,
}
