import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={async (event) => {
          event.preventDefault()
          console.log('submit')

          try {
            const response = await axios.post('api/login', { username, password })
            const user = response.data

            console.log(user)
            setUser(user)
          } catch (exception) {
            console.log(exception)
          }
        }
        }>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({target}) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({target}) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
