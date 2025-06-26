import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local')

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  cached.promise = mongoose.connect(MONGODB_URI, {
    dbName: 'table-data',
    bufferCommands: false,
  })
  cached.conn = await cached.promise
  return cached.conn
}
