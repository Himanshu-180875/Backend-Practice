const express = require('express')
const router = express.Router()
const authRoutes = require('./authRoutes')
const crud = require('./crud')
const unProtectedRoutes = require('./unProtectedRoute');


router.use('/users', authRoutes)
router.use(unProtectedRoutes)
router.use('/posts',crud)

module.exports = router;