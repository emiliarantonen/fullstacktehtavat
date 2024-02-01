import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  const [blogVisible, setVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    console.log(blog)
    const updatedBlog =  ({ ...blog, likes: blog.likes + 1 })
    console.log(blog.id, updatedBlog)
    updateLikes(blog.id, updatedBlog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
    removeBlog(blog)
  }


  return(
  <div style={blogStyle}>
    <div style={hideWhenVisible}>
          {blog.title}
          <button onClick={() => setVisible(true)}>view</button>
      </div>
    <div style={showWhenVisible}>
    <div>{blog.title} <button onClick={() => setVisible(false)}>hide</button></div>
    <div>{blog.url}</div>
    <div>likes {blog.likes} <button onClick={handleLike}> like</button></div>
    <div>{blog.author}</div>
    {user && blog.user && (
        <button onClick={handleRemove}>remove</button>
      )}
    
    </div>
  </div>  
)}

export default Blog