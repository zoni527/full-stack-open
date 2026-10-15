import { useState } from 'react'

const LoginForm = ({ notification, notificationIsError, handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>

      {notification && (
        <div
          className={ notificationIsError ? 'error' : 'notification' }
          display={ notification ? '' : 'none' }
        >
          {notification}
        </div>
      )}

      <form onSubmit={login}>
        <div>
          <label>username
            <input
              type="text"
              value={username}
              onChange={({target}) => setUsername(target.value)}
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

export default LoginForm
