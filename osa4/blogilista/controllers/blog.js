const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.setHeader('Content-Type', 'application/json')
      response.json(blogs)
    })
})

blogRouter.get('/:id', async (request, response)=>{
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})
  
blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)


  if (!(request.body.title) || !(request.body.url)) {
    return response.status(400).json({ error: 'Title and url are required' })
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogRouter.delete('/:id', async(request, response)=>{
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response)=>{
  const updatedBlog=await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true})
  response.json(updatedBlog)
})

module.exports=blogRouter