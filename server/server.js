const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const { mongoose } = require('mongoose')
const scrapeRouter = require('./routes/scrapeRouter')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const path = require('path')

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173',
}

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Database not connected', err))

const app = express()
const PORT = 8080

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.use('/api', scrapeRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
// app.use('/fb', fbRouter)

app.listen(PORT, () => {
    console.log(`RentNL - listening on port ${PORT}!`);
})