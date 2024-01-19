const Blog = require('../models/blog')
const User = require('../models/user')

const dummy = () => {
  return 1
}
  
const totalLikes = (blogs) => {
  const reducer = ((sum, blog) => sum + blog.likes)
  return blogs.reduce(reducer, 0)
    
}

const favoriteBlog = (blogs) => {
  const blogWithMaxLikes = blogs.reduce((maxBlog, currentBlog) => {
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog
  }, blogs[0])
  return blogWithMaxLikes
}

const mostBlogs = (blogs) => {
  const theAuthor = {
    author: '',
    blogs: 0
  }

  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const [author, blogCount] = Object.entries(authors).reduce((max, entry) => (entry[1] > max[1] ? entry : max), ['', 0])

  theAuthor.author = author
  theAuthor.blogs = blogCount

  return theAuthor
}

const mostLikes = (blogs) => {
  const theAuthor = {
    author: '',
    likes: 0
  }

  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const [author, totalLikes] = Object.entries(authors).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ['', 0]
  )

  theAuthor.author = author
  theAuthor.likes = totalLikes

  return theAuthor
}

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
}