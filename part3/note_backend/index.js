const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === id)

  if (note)
    res.json(note)
  else
    res.status(404).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0

  return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body || !body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)

  res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const existingNote = notes.find(note => note.id === id)
  if (!existingNote)
    return res.status(404).end()

  const body = req.body
  if (!body || !body.content)
    return res.status(400).json({ error: 'content missing' })

  // console.log("request body:", body)

  notes = notes.filter(n => n.id !== id).concat(body)

  // console.log("notes:", notes)

  res.json(body)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
