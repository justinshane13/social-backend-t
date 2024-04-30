require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        const PORT = process.env.PORT || 3000;
        app.listen(process.env.PORT, () => {
            console.log(`connected to MongoDB and listening on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })