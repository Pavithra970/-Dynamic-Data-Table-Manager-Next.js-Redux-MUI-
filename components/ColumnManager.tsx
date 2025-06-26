'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
} from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { toggleVisibility, addColumn } from '@/lib/slices/columnsSlice'

type Props = {
  open: boolean
  onClose: () => void
}

export default function ColumnManager({ open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const columns = useAppSelector(state => state.columns)

  // 🔹 Local state for new column form
  const [field, setField] = useState('')
  const [headerName, setHeaderName] = useState('')

  // 🔹 Toggle existing column visibility
  const handleToggle = (field: string) => {
    dispatch(toggleVisibility(field))
  }

  // 🔹 Add new custom column
  const handleAddColumn = () => {
    if (!field.trim() || !headerName.trim()) return
    dispatch(addColumn({ field: field.trim(), headerName: headerName.trim() }))
    setField('')
    setHeaderName('')
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        {/* Existing column checkboxes */}
        <FormGroup sx={{ mb: 3 }}>
          {columns.map(col => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={col.visible}
                  onChange={() => handleToggle(col.field)}
                />
              }
              label={col.headerName}
            />
          ))}
        </FormGroup>

        {/* New column form */}
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Field (e.g. department)"
            size="small"
            fullWidth
            value={field}
            onChange={e => setField(e.target.value)}
          />
          <TextField
            label="Header (e.g. Department)"
            size="small"
            fullWidth
            value={headerName}
            onChange={e => setHeaderName(e.target.value)}
          />
        </Stack>
        <Button variant="contained" onClick={handleAddColumn}>
          Add New Column
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  )
}
