const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/list_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)
let token


beforeEach(async () => {

  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'root', passwordHash })
  const savedUser = await user.save()
  const userToken = { username: savedUser.username, id: savedUser._id }

  token = jwt.sign(userToken, process.env.SECRET)

  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id,
  }))
  await Blog.insertMany(blogsWithUser)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
    
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id is defined', async ()=>{
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})



test('a blog can be added', async () =>{
  const newBlog = {
    title: 'testi',
    author: 'test',
    url: '22222',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsInDb = await helper.blogsInDb()

  expect(blogsInDb).toHaveLength(helper.initialBlogs.length +1)

  const addedBlog = blogsInDb.find(blog => blog.title === 'testi')
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const addedBlog = await api.get(`/api/blogs/${response.body.id}`)
  expect(addedBlog.body.likes).toBe(0)

})

test('title missing', async()=>{
  const newBlog = {
    author: 'test',
    url: '22222'
  }
 
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

})

test('token missing', async()=>{
  const newBlog = {
    title: 'testi',
    author: 'test',
    url: '22222',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsInDb = await helper.blogsInDb()
  expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
})

test('blog can be deleted', async()=>{
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)
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

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

test('username and password length', async()=>{
  const invalidUser = {
    username: 'username123',
    password: 'pw',
  }

  const response = await api.post('/api/users').send(invalidUser).expect(400)

  expect(response.body.error).toContain('Username and password must be at least 3 characters long')
})

test('non-unique username', async () => {
  const duplicateUser = {
    username: 'root',
    password: 'anotherpassword',
  }

  const response = await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)


  expect(response.body.error).toContain('Username must be unique')

})


afterAll(async () => {
  await mongoose.connection.close()
})