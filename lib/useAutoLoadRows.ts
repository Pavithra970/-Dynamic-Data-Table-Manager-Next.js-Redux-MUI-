'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { replaceAllRows } from '@/lib/slices/rowsSlice'
import type { Row } from '@/types/row'

export default function useAutoLoadRows() {
  const dispatch  = useAppDispatch()
  const rowsCount = useAppSelector(s => s.rows.length)
  const doneRef   = useRef(false)          // ensure runs only once

  useEffect(() => {
    if (doneRef.current || rowsCount > 0) return      // already loaded / has data
    ;(async () => {
      try {
        const res  = await fetch('/api/rows')
        if (!res.ok) return
        const data: Row[] = await res.json()
        dispatch(replaceAllRows(data))
      } catch (err) {
        console.error('Auto-load DB rows failed:', err)
      } finally {
        doneRef.current = true
      }
    })()
  }, [rowsCount, dispatch])
}
