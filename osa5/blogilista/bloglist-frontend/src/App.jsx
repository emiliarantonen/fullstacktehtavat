import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setNotification]=useState(null)
  const [user, setUser] = useState(null)
  const blogRef = useRef()

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
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }, [message])



const handleLogout = (event) => {
  event.preventDefault()
  window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user))
  setUser(null)
}

const addBlog = async(blogObject) => {
  blogRef.current.toggleVisibility()
  const newBlog = await blogService.create(blogObject);
  setBlogs((prevBlogs) => [...prevBlogs, newBlog])
  setNotification({
    text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
    type: 'message',
  })
}

const updateLikes = async(id, updatedBlog) => {
  const newBlog = await blogService.update(id, updatedBlog)
  console.log(updatedBlog)
  const newBlogs = blogs.map((blog) => 
    blog.id === id ? newBlog : blog
  )
  newBlogs.sort((a, b) => {
    return b.likes - a.likes
  })
  console.log(newBlogs)
  setBlogs(newBlogs)
}

const removeBlog = async(blog) => {
  await blogService.remove(blog.id)
  const newBlogs = blogs.filter((currentBlog) => currentBlog.id !== blog.id)
  setBlogs(newBlogs)
}

const handleLogin = async (username, password) => {
  try {
    const user = await loginService.login({
      username,
      password,
    })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
    setNotification({
      text: `Welcome ${user.name}`,
      type: 'message',
    })
  } catch (error) {
    setNotification({
      text: 'wrong username or password',
      type: 'error',
    })
  }
}

return (
  <div>
    <h2>blogs</h2>

    <Notification notification={message} />
    {user === null ? (
    <Login handleLogin={handleLogin}/>
    ) : (
      <>
      <div>
        {user.name} logged in <button onClick={handleLogout} type="submit">Logout</button>
      </div>
    

    <Togglable buttonLabel="new blog" ref={blogRef}>
      <Create addBlog={addBlog} />
    </Togglable>
    <div>
    {blogs
      .map(blog =>
      <Blog key={blog.id} blog={blog} user={user} updateLikes={updateLikes} removeBlog={removeBlog}/>
      
    )}
    </div>
    </>
    )}
  </div>
)
}

export default App