require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

/* --------------------------------------------------------------- middleware */

const requestLogger = (tokens, req, res) => {
  let printable = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (tokens.method(req, res) === 'POST')
    printable = printable.concat(JSON.stringify(req.body))
  return printable.join(' ')
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'uknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' })

  next(error)
}

/* -------------------------------------------------------------------------- */

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(requestLogger))

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person)
        res.json(person)
      else
        res.status(404).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    const page = `
<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>
`
    res.send(page)
  })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body)
    return res.status(400).json({ error: 'body is missing' })
  if (!body.name)
    return res.status(400).json({ error: 'name is missing' })
  if (!body.number)
    return res.status(400).json({ error: 'number is missing' })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person)
        return res.status(404).end()

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
