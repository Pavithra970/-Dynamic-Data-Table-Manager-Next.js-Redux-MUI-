'use client'

import { Button } from '@mui/material'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { useAppSelector } from '@/lib/store'
import { Row } from '@/types/row'

export default function ExportCSV() {
  // Redux selectors
  const rows     = useAppSelector<Row[]>(s => s.rows)
  const columns  = useAppSelector(s => s.columns).filter(c => c.visible)

  const handleExport = () => {
    if (rows.length === 0) {
      alert('Nothing to export.')
      return
    }

    // 1️⃣ Build an array of objects that contain only visible fields
    const rowsForExport = rows.map(r =>
      Object.fromEntries(
        columns.map(c => [c.field, r[c.field] as string | number])
      )
    )

    // 2️⃣ Convert to CSV
    const csv = Papa.unparse(rowsForExport)

    // 3️⃣ Create Blob & trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'table-export.csv')
  }

  return (
    <Button variant="contained" color="secondary" onClick={handleExport}>
      Export CSV
    </Button>
  )
}
