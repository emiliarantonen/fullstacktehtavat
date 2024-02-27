import { useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const create = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(newAnecdote(content))
    dispatch(setNotification(`New anecdote created: ${content}`, 5))

  }
  
  return (
    <div>
    <h2>create new</h2>
    <form onSubmit={create}>
      <div><input name='content'/></div>
      <button type='submit'>create</button>
    </form>
  </div>

)}

export default AnecdoteForm
