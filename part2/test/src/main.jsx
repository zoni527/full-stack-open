import ReactDOM from 'react-dom/client'
import App from './App'

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browsers can only execute JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of the HTTP protocol',
    important: true
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
