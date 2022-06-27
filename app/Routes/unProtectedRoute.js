const express = require('express')
const router = express.Router()

router.get('/api', (req,res)=>{
    res.status(200).send({
        message:'Hi, Welcome to Server'
    })
})

module.exports= router