import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 10,
}

test('renders title', () => {

  render(<Blog blog={blog} />)

  const element = screen.getByText('Test Blog')
  expect(element).toBeDefined()
})

test('clicking the button shows url and likes', async () => {

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
})

test('clicking the button twice, the event handler is called twice', async() => {

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} updateLikes={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)

  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})