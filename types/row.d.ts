export type Row = {
  id: string
  name: string
  email: string
  age: number
  role: string
  [key: string]: string | number
}

export type ColumnMeta = {
  field: string
  headerName: string
  visible: boolean
}
