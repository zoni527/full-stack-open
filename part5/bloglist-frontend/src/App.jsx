import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationIsError, setNotificationIsError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
    setNotification('abc')
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }, [])

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        {notification && (
          <div
            className={notificationIsError ? 'error' : 'notification'}>{notification}
          </div>
        )}
        <form onSubmit={async (event) => {
          event.preventDefault()
          console.log('submit')

          try {
            const response = await axios.post('/api/login', { username, password })
            const user = response.data

            console.log(user)
            setUser(user)
            window.localStorage.setItem('loggedBloglistAppUser', JSON.stringify(user))
          } catch (exception) {
            console.log(exception)
            setNotificationIsError(true)
            setNotification('wrong username or password')
            setTimeout(() => {
              setNotification('')
              setNotificationIsError(false)
            }, 5000)
          }
        }}>
          <div>
            <label>username
              <input
                type="text"
                value={username}
                onChange={({target}) => {setUsername(target.value)}}
              />
            </label>
          </div>
          <div>
            <label>password
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
      <p>{user.name} logged in
        <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedBloglistAppUser')
        }}>
          logout
        </button>
      </p>
      <h2>create new</h2>
      <form onSubmit={async (event) => {
        event.preventDefault()

        const newBlog = {
          title,
          author,
          url,
        }
        const token = `Bearer ${user.token}`
        const config = {
          headers: { Authorization: token }
        }

        console.log(user)
        console.log(newBlog)
        console.log("sending blog")

        try {
          const response = await axios.post("/api/blogs", newBlog, config)

          console.log(response.data)
          setTitle('')
          setAuthor('')
          setUrl('')
          setBlogs(blogs.concat(response.data))
        } catch (exception) {
          console.log(exception)
        }
      }}>
        <div>
          <label>title:
            <input
              type="text"
              value={title}
              onChange={({target}) => setTitle(target.value)}/>
          </label>
        </div>
        <div>
          <label>author:
            <input
              type="text"
              value={author}
              onChange={({target}) => setAuthor(target.value)}/>
          </label>
        </div>
        <div>
          <label>url:
            <input
              type="text"
              value={url}
              onChange={({target}) => setUrl(target.value)}/>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
