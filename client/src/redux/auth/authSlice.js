import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    checked: false,
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload
      state.checked = true
    },
    clearAdmin(state) {
      state.admin = null
      state.checked = true
    },
    setAuthChecked(state) {
      state.checked = true
    },
  },
})

export const { clearAdmin, setAdmin, setAuthChecked } = authSlice.actions
export default authSlice.reducer
