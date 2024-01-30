const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name:1, id: 1})
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
  const user = request.user
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    ...body,
    user: user._id
    
  })

  if (!(request.body.title) || !(request.body.url)) {
    return response.status(400).json({ error: 'Title and url are required' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response)=>{
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Unauthorized' })
  }  
})

blogRouter.put('/:id', async(request, response)=>{
  const updatedBlog=await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true})
  response.json(updatedBlog)
})

module.exports=blogRouter