const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234353'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person)
    res.json(person)
  else
    res.status(404).end()
})

app.get('/info', (req, res) => {
  const page = `
<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>
`
  res.send(page)
})

const generateId = () => {
  const getRandomIntInclusive = (min, max) => {
    const minCeil = Math.ceil(min)
    const maxFloor = Math.floor(max)

    return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil)
  }

  return String(getRandomIntInclusive(1000000, 9999999))
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      error: 'body is missing'
    })
  }

  const p = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(p)

  res.json(p)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
