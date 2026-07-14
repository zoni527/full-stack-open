const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan((tokens, req,res) => {
  let printable = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (tokens.method(req, res) === "POST")
    printable = printable.concat(JSON.stringify(req.body))
  return printable.join(' ')
}))

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

  return String(getRandomIntInclusive(100000000, 999999999))
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body)
    return res.status(400).json({ error: 'body is missing' })
  if (!body.name)
    return res.status(400).json({ error: 'name is missing' })
  if (!body.number)
    return res.status(400).json({ error: 'number is missing' })
  if (persons.filter(p => p.name === body.name).length)
    return res.status(409).json({ error: 'name must be unique' })

  const p = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(p)

  res.json(p)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.put('/api/persons/:id', (req, res) => {
  res.status(501).send({ error: 'not implemented' })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'uknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
