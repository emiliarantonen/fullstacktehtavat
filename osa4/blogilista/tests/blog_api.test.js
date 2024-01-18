const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/list_helper')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// test('there are two blogs', async () => {
//   const response = await api.get('/api/blogs')
  
//   expect(response.body).toHaveLength(2)
// })

test('id is defined', async ()=>{
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('blog can be added', async () =>{
  const newBlog = {
    title: 'testi',
    author: 'test',
    url: '22222',
    likes: 5
  }

  const initialResponse = await api.get('/api/blogs')
  const initialLength = initialResponse.body.length

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialLength +1)

  const addedBlog = response.body.find(blog => blog.title === 'testi')
  expect(addedBlog).toBeDefined()

})

test('likes set to 0 if not provided', async() => {
  const newBlog = {
    title: 'likes test',
    author: 'test',
    url: '22222'
  }

  const response = 
  await api
    .post('/api/blogs')
    .send(newBlog)
  
  const addedBlog = await api.get(`/api/blogs/${response.body.id}`)
  console.log(addedBlog.body)
  expect(addedBlog.body.likes).toBe(0)

})

test('title missing', async()=>{
  const newBlog = {
    author: 'test',
    url: '22222'
  }
 
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('url missing', async()=>{
  const newBlog = {
    title: 'url',
    author: 'test'
  }
 
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('blog can be deleted', async()=>{
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const initialResponse = await api.get('/api/blogs')
  const initialLength = initialResponse.body.length

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    initialLength-1
  )
})

test('blog can be updated', async()=>{
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedLikes = blogToUpdate.likes + 1
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes })
    .expect(200)
  
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)

  expect(updatedBlog.likes).toBe(updatedLikes)

})

afterAll(async () => {
  await mongoose.connection.close()
})