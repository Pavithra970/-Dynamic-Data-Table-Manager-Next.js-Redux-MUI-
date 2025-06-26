import mongoose, { Schema } from 'mongoose'

const RowSchema = new Schema(
  {
    id   : String,
    name : String,
    email: String,
    age  : Number,
    role : String,
    department: String,  // Add this
    location: String     // Add this

  },
  { strict: false }        // Accept unknown keys (department, location, etc.)
)

export const RowModel =
  mongoose.models.Row || mongoose.model('Row', RowSchema)
