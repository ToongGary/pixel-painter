import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CanvasState {
  canvas: HTMLCanvasElement | null
}

const initialState: CanvasState = {
  canvas: null
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvas: (state, action: PayloadAction<any>) => {
      state.canvas = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCanvas } = canvasSlice.actions

export default canvasSlice.reducer
