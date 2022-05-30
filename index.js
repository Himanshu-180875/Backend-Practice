const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const express = require('express')
const app = express()
const authRoutes = require('./Routes/authRoutes');
const crud = require('./Routes/crud');
const unProtectedRoutes = require('./Routes/unProtectedRoute');

//used for parsing the incoming requests with JSON,built in middleware
app.use(express.json())


app.use('/users',authRoutes)
app.use(unProtectedRoutes)
app.use('/posts',crud)

//For starting the server on port
app.listen(process.env.APP_PORT, ()=> console.log('Sever started', process.env.APP_PORT))