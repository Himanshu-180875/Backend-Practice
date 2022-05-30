const express = require('express')
const router = express.Router()
const authVerify = require('../middleware/authVerify');
const nestedMiddleware = require('../middleware/NestedMiddleware');
const crudOperations = require('../controllers/crudOperations');
const passwordValidator = require('../middleware/passwordValidator');
router.use(authVerify)


// WE can also pass middleware as second argument of the function
//First these routes will check the authenticity, then the length of the password and then 
//it will perform the operation

router.post('/create',  crudOperations.encrypt)
router.get('/all', crudOperations.getAllData)
router.get('/view/:message', crudOperations.decrypt)
router.get('/view/user/:id', crudOperations.getDataOfUserById)

module.exports= router;