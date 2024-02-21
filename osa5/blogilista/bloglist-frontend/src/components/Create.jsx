import { useState } from 'react'

const Create = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleAdd= (event) => {
    event.preventDefault()
    const blog = ({ title:title, author:author, url:url })
    addBlog(blog)
    setTitle('')
    setAuthor('')
    setURL('')
  }

  const handleTitle=(event) => {
    setTitle(event.target.value)
  }

  const handleAuthor=(event) => {
    setAuthor(event.target.value)
  }

  const handleURL=(event) => {
    setURL(event.target.value)
  }

  return(
    <div>
      <h3>create new</h3>
      <form onSubmit={handleAdd}>
        <div>
          title: <input id="title" type="text" value={title} onChange={handleTitle} data-testid='title'/>
        </div>
        <div>
          author: <input id="author" type="text"value={author} onChange={handleAuthor} data-testid='author'/>
        </div>
        <div>
          url: <input id="url" type="text" value={url} onChange={handleURL} data-testid='url'/>
        </div>
        <div>
          <button id="submitBlog" type="submit">create</button>
        </div>
      </form>
    </div>
  )}

export default Create