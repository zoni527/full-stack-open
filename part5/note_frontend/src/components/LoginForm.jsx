import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await onLogin(username, password)

    if (result.success) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          username&nbsp;
          <input
            type="text"
            value={username}
            onChange={({target}) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password&nbsp;
          <input
            type="password"
            value={password}
            onChange={({target}) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
