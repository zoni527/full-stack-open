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

const Persons = ({ list }) => {
  return (
    <table>
      <tbody>
        {list.map(person =>
            <tr key={person.name}>
              <td>{person.name || ' --- '}</td>
              <td>{person.number || ' --- '}</td>
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
