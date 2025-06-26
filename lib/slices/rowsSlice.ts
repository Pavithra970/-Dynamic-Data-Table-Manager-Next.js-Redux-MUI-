import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Row } from '@/types/row'

const initialState: Row[] = [
  { id: '1', name: 'Ada Lovelace',   email: 'ada@demo.io',   age: 36, role: 'Engineer' },
  { id: '2', name: 'Grace Hopper',   email: 'grace@demo.io', age: 85, role: 'Admiral' },
  { id: '3', name: 'Alan Turing',    email: 'alan@demo.io',  age: 41, role: 'Scientist' },
  { id: '4', name: 'Katherine J.',   email: 'kj@demo.io',    age: 101,role: 'Analyst' },
]

const rowsSlice = createSlice({
  name: 'rows',
  initialState,
  reducers: {
    replaceAllRows: (_state, action: PayloadAction<Row[]>) => action.payload,
    updateRow: (state, action: PayloadAction<Row>) => {
      const index = state.findIndex(r => r.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },

    deleteRow: (state, action: PayloadAction<string>) => {
      return state.filter(row => row.id !== action.payload)
    },
  },
})

export const { replaceAllRows, updateRow, deleteRow } = rowsSlice.actions
export default rowsSlice.reducer
