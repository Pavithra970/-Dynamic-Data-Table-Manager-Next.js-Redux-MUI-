'use client'

/* ────────── MUI ────────── */
import {
  Paper,
  Stack,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination,
  IconButton,
} from '@mui/material'
import EditIcon    from '@mui/icons-material/Edit'
import DeleteIcon  from '@mui/icons-material/Delete'
import SaveIcon    from '@mui/icons-material/Check'
import CloseIcon   from '@mui/icons-material/Close'
import Brightness4 from '@mui/icons-material/Brightness4'
import Brightness7 from '@mui/icons-material/Brightness7'

/* ──────── DnD-kit (column drag) ──────── */
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/* ──────── React & Redux ──────── */
import { useState, useMemo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { toggleTheme }                 from '@/lib/slices/themeSlice'
import { updateRow, deleteRow, replaceAllRows } from '@/lib/slices/rowsSlice'
import { reorderColumns }              from '@/lib/slices/columnsSlice'

/* ──────── Auto-load hook ──────── */
import useAutoLoadRows from '@/lib/useAutoLoadRows'

/* ──────── Types ──────── */
import { Row, ColumnMeta } from '@/types/row'

/* ──────── Local components ──────── */
import ColumnManager from './ColumnManager'
import ImportCSV     from './ImportCSV'
import ExportCSV     from './ExportCSV'

type Order = 'asc' | 'desc'

/* ─────── Sortable header cell ─────── */
function SortableHeaderCell({
  col,
  activeOrderBy,
  activeOrder,
  onRequestSort,
}: {
  col: ColumnMeta
  activeOrderBy: string
  activeOrder: Order
  onRequestSort: (f: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: col.field })

  return (
    <TableCell
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        whiteSpace: 'nowrap',
      }}
    >
      <TableSortLabel
        active={activeOrderBy === col.field}
        direction={activeOrderBy === col.field ? activeOrder : 'asc'}
        onClick={() => onRequestSort(col.field)}
      >
        {col.headerName}
      </TableSortLabel>
    </TableCell>
  )
}

/* ────────── Main component ────────── */
export default function DataTable() {
  const dispatch    = useAppDispatch()
  const columns     = useAppSelector(s => s.columns).filter(c => c.visible)
  const rows        = useAppSelector<Row[]>(s => s.rows)
  const themeMode   = useAppSelector(s => s.theme)

  /* 💡 Auto-load rows once */
  useAutoLoadRows()

  /* Table state */
  const [orderBy, setOrderBy]   = useState('name')
  const [order, setOrder]       = useState<Order>('asc')
  const [page, setPage]         = useState(0)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  /* Per-row edit state */
  const [editId, setEditId]       = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Row | null>(null)

  /* ─────── Bulk-edit state ─────── */
  const [bulkEdit, setBulkEdit]  = useState(false)
  const [draftRows, setDraftRows] = useState<Row[]>(rows)
  useEffect(() => { setDraftRows(rows) }, [rows])

  /* Filtering / sorting */
  const filtered = useMemo(() => {
    const t = search.toLowerCase()
    return rows.filter(r => columns.some(c => String(r[c.field]).toLowerCase().includes(t)))
  }, [rows, columns, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const res = a[orderBy] < b[orderBy] ? -1 : 1
      return order === 'asc' ? res : -res
    })
  }, [filtered, orderBy, order])

  const paged = sorted.slice(page * 10, page * 10 + 10)

  const handleRequestSort = (f: string) =>
    orderBy === f ? setOrder(o => (o === 'asc' ? 'desc' : 'asc')) : (setOrderBy(f), setOrder('asc'))

  /* Per-row edit handlers */
  const startEdit  = (r: Row) => { setEditId(r.id); setEditDraft({ ...r }) }
  const cancelEdit = () => { setEditId(null); setEditDraft(null) }
  const saveEdit   = () => { if (editDraft) { dispatch(updateRow(editDraft)); cancelEdit() } }
  const removeRow  = (id: string) => confirm('Delete row?') && dispatch(deleteRow(id))

  /* Bulk-edit handlers */
  const startBulk   = () => setBulkEdit(true)
  const cancelBulk  = () => { setBulkEdit(false); setDraftRows(rows) }
  const saveBulk    = () => { dispatch(replaceAllRows(draftRows)); setBulkEdit(false) }
  const bulkChange  = (id: string, field: string, val: string | number) =>
    setDraftRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: val } : r)))

  /* Drag-and-drop */
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = (e: DragEndEvent) => {
    const fromId = e.active.id, toId = e.over?.id
    if (!toId || fromId === toId) return
    const from = columns.findIndex(c => c.field === fromId)
    const to   = columns.findIndex(c => c.field === toId)
    if (from !== -1 && to !== -1) dispatch(reorderColumns({ fromIndex: from, toIndex: to }))
  }

  /* MongoDB Save / Load (manual) */
  const handleSaveToDB = async () => {
    const res = await fetch('/api/rows', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(rows),
    })
    alert(res.ok ? '✅ Saved' : `❌ Save failed: ${res.status}`)
  }
  const handleLoadFromDB = async () => {
    const res = await fetch('/api/rows')
    if (!res.ok) return alert('❌ Load failed')
    dispatch(replaceAllRows(await res.json()))
  }

  /* ────────── Render ────────── */
  return (
    <Paper sx={{ p: 2 }}>
      {/* Toolbar */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          sx={{ flexGrow: 1 }}
        />

        <ImportCSV />
        <ExportCSV />

        {/* Bulk-edit buttons */}
        {!bulkEdit ? (
          <Button variant="outlined" onClick={startBulk}>
            Edit All
          </Button>
        ) : (
          <>
            <Button variant="contained" color="success" onClick={saveBulk}>
              Save All
            </Button>
            <Button variant="outlined" onClick={cancelBulk}>
              Cancel All
            </Button>
          </>
        )}

        {/* Manual DB buttons (optional) */}
        <Button variant="contained" color="success" onClick={handleSaveToDB}>
          Save to DB
        </Button>
        <Button variant="outlined" onClick={handleLoadFromDB}>
          Load from DB
        </Button>

        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          Manage Columns
        </Button>

        <IconButton onClick={() => dispatch(toggleTheme())}>
          {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Stack>

      <ColumnManager open={modalOpen} onClose={() => setModalOpen(false)} />

      <TableContainer>
        <Table>
          {/* Header */}
          <TableHead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={columns.map(c => c.field)} strategy={horizontalListSortingStrategy}>
                <TableRow>
                  {columns.map(col => (
                    <SortableHeaderCell
                      key={col.field}
                      col={col}
                      activeOrderBy={orderBy}
                      activeOrder={order}
                      onRequestSort={handleRequestSort}
                    />
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </SortableContext>
            </DndContext>
          </TableHead>

          {/* Body */}
          <TableBody>
            {paged.map(row => (
              <TableRow key={row.id}>
                {columns.map(col => (
                  <TableCell key={col.field}>
                    {bulkEdit ? (
                      <TextField
                        size="small"
                        value={
                          draftRows.find(r => r.id === row.id)?.[col.field] ?? ''
                        }
                        onChange={e =>
                          bulkChange(
                            row.id,
                            col.field,
                            col.field === 'age' ? +e.target.value : e.target.value,
                          )
                        }
                      />
                    ) : editId === row.id ? (
                      <TextField
                        size="small"
                        value={String(editDraft?.[col.field] ?? '')}
                        onChange={e =>
                          setEditDraft(prev =>
                            prev ? { ...prev, [col.field]: col.field === 'age' ? +e.target.value : e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      row[col.field]
                    )}
                  </TableCell>
                ))}

                {/* Row buttons */}
                <TableCell>
                  {bulkEdit ? null : editId === row.id ? (
                    <>
                      <IconButton color="primary" onClick={saveEdit}><SaveIcon /></IconButton>
                      <IconButton onClick={cancelEdit}><CloseIcon /></IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton color="primary" onClick={() => startEdit(row)}><EditIcon /></IconButton>
                      <IconButton color="error"  onClick={() => removeRow(row.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  )
}
