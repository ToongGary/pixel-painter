import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ColorState {
  color: string
}

const initialState: ColorState = {
  color: '#000000'
}

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload
    }
  }
})

export const { setColor } = colorSlice.actions

export default colorSlice.reducer
