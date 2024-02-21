describe('Blog app', function() {
  const user = {
    name: 'Test User',
    username: 'testuser',
    password: 'secret'
  }

  const blog = {
    title: 'Test blog',
    author: 'Blog Author name',
    url: 'https://testBlog.com',
  }
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.get('#newBlog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#submitBlog').click()

      cy.request('GET', 'http://localhost:3003/api/blogs').then((response) => {
        const data = response.body
        expect(data).to.have.length(1)
        expect(data[0].title).contains(blog.title)
        expect(data[0].author).contains(blog.author)
        expect(data[0].url).contains(blog.url)
      })
    })

    it('A blog can be liked', function() {
      cy.get('#newBlog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#submitBlog').click()

      cy.get('#viewButton').click()
      cy.get('#likeButton').click()
    })


    it('A blog can be removed', function() {
      cy.get('#newBlog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#submitBlog').click()

      cy.get('#viewButton').click()
      cy.get('#removeButton').should('exist')
      cy.get('#removeButton').click()

      cy.request('GET', 'http://localhost:3003/api/blogs').then((response) => {
        const data = response.body
        expect(data).to.have.length(0)
      })
    })


  })
})