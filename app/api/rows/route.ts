import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { RowModel } from '@/models/Row'

export async function GET() {
  await connectDB()
  const rows = await RowModel.find().lean()
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await connectDB()

    // Overwrite all existing rows
    await RowModel.deleteMany({})
    await RowModel.insertMany(body)

    return NextResponse.json({ status: 'ok' })
  } catch (err: any) {
    console.error('  API POST /api/rows failed:', err.message)
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 })
  }
}
