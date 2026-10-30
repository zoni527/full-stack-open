import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notificationIsError, setNotificationIsError] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => { setBlogs([...blogs].sort((a, b) => b.likes - a.likes)) })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (loginObject) => {
    try {
      const response = await axios.post('/api/login', loginObject)
      const user = response.data

      setUser(user)
      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(user)
      )

      setNotificationIsError(false)
      setNotification(`${user.username} logged in succesfully`)
    } catch (exception) {
      console.log(exception)
      setNotificationIsError(true)
      setNotification('wrong username or password')
    }
    setTimeout(() => setNotification(''), 5000)
  }

  const addBlog = async (blogObject) => {

    const token = `Bearer ${user.token}`
    const config = {
      headers: { Authorization: token }
    }

    console.log(user)
    console.log(blogObject)
    console.log("sending blog")

    try {
      const response = await axios.post("/api/blogs", blogObject, config)

      console.log(response.data)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat({ ...response.data, user: user }))
      setNotificationIsError(false)
      setNotification(`a new blog ${response.data.title} by ${response.data.author} added`)
      setTimeout(() => setNotification(''), 5000)

      return true
    } catch (exception) {
      console.log(exception)
      setNotificationIsError(true)
      setNotification("error creating new blog")
      setTimeout(() => setNotification(''), 5000)

      return false
    }
  }

  const handleLogout = () => {
    setNotificationIsError(false)
    setNotification(`${user.username} logged out succesfully`)
    setUser(null)
    window.localStorage.removeItem('loggedBloglistAppUser')
    setTimeout(() => setNotification(''), 5000)
  }

  if (!user) {
    return (
      <LoginForm
        notification={notification}
        notificationIsError={notificationIsError}
        handleLogin={handleLogin}
      />
    )
  }

  const handleLike = async (blogToLike) => {
    const updatedBlogObject = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user?.id || blogToLike.user
    }

    try {
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlogObject)
      setBlogs(blogs.map(b => b.id === blogToLike.id ? { ...blogToLike, likes: returnedBlog.likes } : b))
    } catch (exception) {
      console.error('Failed to update likes', exception)
    }
  }

  const handleDelete = async (blogToDelete) => {
    if (!window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`))
      return

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      await blogService.remove(blogToDelete.id, config)
      setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
    } catch (exception) {
      console.error('Failed to delete blog', exception)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && (
        <div
          className={notificationIsError ? 'error' : 'notification'}>{notification}
        </div>
      )}
      <p>{user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          notification={notification}
          notificationIsError={notificationIsError}
          createBlog={addBlog}
        />
      </Togglable>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App
