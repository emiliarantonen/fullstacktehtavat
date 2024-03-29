import { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin } ) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleUsername = (event) => {
    setUsername(event.target.value)
  }
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }


  const handleSubmit=async(event) => {
    event.preventDefault()
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }


  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
        username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={handleUsername}
          />
        </div>
        <div>
        password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={handlePassword}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>

    </div>
  )

}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default Login