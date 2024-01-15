const blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    const reducer = ((sum, blog) => sum + blog.likes)
    return blogs.reduce(reducer, 0)
    
}

const favoriteBlog = (blogs) => {
    const blogWithMaxLikes = blogs.reduce((maxBlog, currentBlog) => {
        return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
      }, blogs[0])
      
      return blogWithMaxLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}