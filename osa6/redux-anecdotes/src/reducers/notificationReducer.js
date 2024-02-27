import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    setMessage: (state, action) => {
      const currentNotification = action.payload
      return currentNotification
    }, 
    removeNotification: () => {
      return null
    }
  }
})

export const { setMessage, removeNotification } = notificationSlice.actions

export const setNotification = (text, second) => {
  return (dispatch) => {
    dispatch(setMessage(text))
    setTimeout(()=> {
      dispatch(removeNotification())
    }, second * 1000)
  }
}
export default notificationSlice.reducer