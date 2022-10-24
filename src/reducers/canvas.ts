import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CanvasState {
  clear: boolean
}

const initialState: CanvasState = {
  clear: false
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setClear: (state, action: PayloadAction<boolean>) => {
      state.clear = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setClear } = canvasSlice.actions

export default canvasSlice.reducer
