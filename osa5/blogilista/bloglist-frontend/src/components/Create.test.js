import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Create from './Create'
import userEvent from '@testing-library/user-event'

test('<Create /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<Create addBlog={createBlog} />)

  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing Title',
    author: 'Test Author',
    url: 'http://example.com'
  })
})