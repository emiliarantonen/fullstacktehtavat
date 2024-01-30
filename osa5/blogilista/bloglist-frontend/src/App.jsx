import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setNotification]=useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    console.log(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }, [message])
  
  const handleUsername = (event) => {
    setUsername(event.target.value)
  }
  
  const handlePassword = (event) =>{
    setPassword(event.target.value)
  }
  

  const handleLogin=async(event)=> {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setNotification({
        text: `Welcome ${user.name}`,
        type: 'message',
      });
    } catch (exception) {
      setNotification({
        text: 'wrong username or password',
        type: 'error',
      })
    }
  }
  


if (user === null) {
  return (
    <Login handleLogin={handleLogin} username={username} password={password} message={message} handleUsername={handleUsername} handlePassword={handlePassword}/>
  )
}


const handleLogout = (event) => {
  event.preventDefault()
  window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user))
  setUser(null)
}

const addBlog= async (event)=>{
  event.preventDefault()
  const newBlog = {title: title, author: author, url: url}
  await blogService.create(newBlog);
  setBlogs((prevBlogs) => [...prevBlogs, newBlog])
  setNotification({
    text: `a new blog ${title} by ${author} added`,
    type: 'message',
  })
  setTitle('')
  setAuthor('')
  setURL('')
  
}

const handleTitle=(event)=>{
  setTitle(event.target.value)
}

const handleAuthor=(event)=>{
  setAuthor(event.target.value)
}

const handleURL=(event)=>{
  setURL(event.target.value)
}

return (
  <div>
    <h2>blogs</h2>
    <Notification notification={message} />
    {user.name} logged in <button onClick={handleLogout} type="submit">logout</button>
    <h3>create new</h3>
      <Create addBlog={addBlog} newTitle={title} newAuthor={author} newURL={url} handleTitle={handleTitle} handleAuthor={handleAuthor} handleURL={handleURL}/>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)
}

export default App