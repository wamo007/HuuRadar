const express = require('express')
const indexRouter = require('./routes/indexRouter')

const cors = require('cors')
const corsOptions = {
    origin: ['http://localhost:5173'],
}

const app = express()
const PORT = 8080

app.use(express.urlencoded({ extended: true }))

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api', indexRouter)
// app.use('/fb', fbRouter)

app.listen(PORT, () => {
    console.log(`RentNL - listening on port ${PORT}!`);
})