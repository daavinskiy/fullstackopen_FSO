const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

const PORT = 3001

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

start()