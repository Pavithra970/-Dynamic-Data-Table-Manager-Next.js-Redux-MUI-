'use client'

import { useRef } from 'react'
import { Button } from '@mui/material'
import Papa from 'papaparse'
import { useAppDispatch } from '@/lib/store'
import { replaceAllRows } from '@/lib/slices/rowsSlice'
import { Row } from '@/types/row'

export default function ImportCSV() {
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          alert('Error parsing CSV: ' + results.errors[0].message)
        } else {
          const parsedRows: Row[] = results.data.map((row, index) => ({
            id: row.id ?? (index + 1).toString(),
            name: row.name ?? '',
            email: row.email ?? '',
            age: Number(row.age) || 0,
            role: row.role ?? '',
          }))

          dispatch(replaceAllRows(parsedRows))
        }
      },
      error: (err) => {
        alert('CSV parse failed: ' + err.message)
      },
    })

    e.target.value = ''
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleImport}
      />
      <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
        Import CSV
      </Button>
    </>
  )
}
