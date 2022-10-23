import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CanvasState {
  canvas: HTMLCanvasElement | null
  clear: boolean
}

const initialState: CanvasState = {
  canvas: null,
  clear: false
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvas: (state, action: PayloadAction<any>) => {
      state.canvas = action.payload
    },
    setClear: (state, action: PayloadAction<boolean>) => {
      state.clear = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCanvas, setClear } = canvasSlice.actions

export default canvasSlice.reducer
