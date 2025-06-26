import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

/** Keep it simple: initial state is a string union, not just the literal  */
const initialState: ThemeMode = 'light'

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /** Toggles the primitive state and returns the new value  */
    toggleTheme: (state): ThemeMode =>
      state === 'light' ? 'dark' : 'light',

    /** Explicitly set the mode (e.g. if you add a settings page) */
    setTheme: (_state, action: PayloadAction<ThemeMode>): ThemeMode =>
      action.payload,
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
