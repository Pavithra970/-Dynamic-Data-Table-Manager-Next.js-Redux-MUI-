import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ColumnMeta } from '@/types/row'          // alias version (@/*)

/* ──────────────── Initial default columns ──────────────── */
const initialState: ColumnMeta[] = [
  { field: 'name',  headerName: 'Name',  visible: true },
  { field: 'email', headerName: 'Email', visible: true },
  { field: 'age',   headerName: 'Age',   visible: true },
  { field: 'role',  headerName: 'Role',  visible: true },
]

/* ──────────────── Slice ──────────────── */
const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    /** Toggle an existing column’s visibility */
    toggleVisibility(state, action: PayloadAction<string>) {
      const col = state.find(c => c.field === action.payload)
      if (col) col.visible = !col.visible
    },

    /** Add a brand-new column from the Manage Columns modal */
    addColumn(
      state,
      action: PayloadAction<{ field: string; headerName: string }>
    ) {
      const { field, headerName } = action.payload
      if (!state.some(c => c.field === field)) {
        state.push({ field, headerName, visible: true })
      }
    },

    /** Re-order columns via drag-and-drop */
    reorderColumns(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload
      const [moved] = state.splice(fromIndex, 1)
      state.splice(toIndex, 0, moved)
    },
  },
})

/* ──────────────── Exports ──────────────── */
export const { toggleVisibility, addColumn, reorderColumns } =
  columnsSlice.actions
export default columnsSlice.reducer
