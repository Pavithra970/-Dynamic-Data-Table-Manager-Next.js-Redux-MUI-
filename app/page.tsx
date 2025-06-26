'use client'
import DataTable from '@/components/DataTable'

export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Dynamic Data Table</h1>
      <DataTable />
    </main>
  )
}
