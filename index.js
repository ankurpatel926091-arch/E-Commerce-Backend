const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

const app = express()

dotenv.config()
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000

const defaultMongoURI = 'mongodb://127.0.0.1:27017/e-com'
const mongoURI = process.env.Mongo_URI || process.env.MONGO_URI || process.env.mongo_URI || defaultMongoURI

const connectToDatabase = async (uri, label) => {
  try {
    await mongoose.connect(uri)
    console.log(`Database connected to ${label}`)
  } catch (error) {
    console.error(`Failed to connect to ${label}:`, error)
    throw error
  }
}

const startDatabase = async () => {
  try {
    await connectToDatabase(mongoURI, mongoURI.startsWith('mongodb+srv') ? 'Atlas cluster' : 'local MongoDB')
  } catch (primaryError) {
    if (mongoURI !== defaultMongoURI) {
      console.warn('Primary MongoDB connection failed, trying local fallback...')
      try {
        await connectToDatabase(defaultMongoURI, 'local MongoDB fallback')
      } catch (fallbackError) {
        console.error('Local fallback also failed. Fix MongoDB connection before starting the server.')
      }
    }
  }
}

startDatabase()

app.get('/', (req, res) => {
  return res.json({ message: "I am Coming from Backend 😊" })
})

const userRoute = require('./routes/userRoute')
const categoryRouter = require('./routes/categoryRoute')
const seedRoute = require('./routes/seedRoute')

app.use('/api/user', userRoute)
app.use('/api/category', categoryRouter)
app.use('/api/seed', seedRoute)

const productRouter = require('./routes/productRoute')
app.use('/api/product', productRouter)
// Order routes
const orderRouter = require('./routes/orderRoute')
app.use('/api/order', orderRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`))
