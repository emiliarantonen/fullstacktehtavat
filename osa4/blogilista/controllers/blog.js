const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name:1})
  response.json(blogs)

})

blogRouter.get('/:id', async (request, response)=>{
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async(request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!(request.body.title) || !(request.body.url)) {
    return response.status(400).json({ error: 'Title and url are required' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

blogRouter.delete('/:id', async(request, response)=>{

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const userid = decodedToken.id
  const blog = await Blog.findById(request.params.id)

  console.log(blog)

  if ( blog.user.toString() === userid.toString() ){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {return response.status(401).json({ error: 'Unauthorized' })}
})

blogRouter.put('/:id', async(request, response)=>{
  const updatedBlog=await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true})
  response.json(updatedBlog)
})

module.exports=blogRouter