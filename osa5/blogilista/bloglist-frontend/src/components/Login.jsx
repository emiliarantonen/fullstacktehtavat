import Notification from '../components/Notification'

const Login = ({handleLogin, username, password, message, handleUsername, handlePassword} ) => {
    return (
        <div>
        <Notification notification={message} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
        username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={handleUsername}
        />
        </div>
        <div>
        password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={handlePassword}
        />
        </div>
        <button type="submit">login</button>
        </form>

        </div>
    )

}

export default Login