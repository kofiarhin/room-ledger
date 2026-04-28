import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    banner: null,
  },
  reducers: {
    setBanner(state, action) {
      state.banner = action.payload
    },
    clearBanner(state) {
      state.banner = null
    },
  },
})

export const { clearBanner, setBanner } = uiSlice.actions
export default uiSlice.reducer
