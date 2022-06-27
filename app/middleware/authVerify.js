const jwt = require('jsonwebtoken')
const {savingRequestLogs,savingResponseLogs} = require('../controllers/savingLogs');
// const savingResponseLogs = require('../controllers/savingLogs');
const refreshTokenResponse = require('../Responses/refreshTokenResponse');
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');
//For verifying the token
const verifyToken = (req,res,next) => {
    // console.log('verify token middleware called')
    //As token is in headers array of request
    var id = uuidv4()
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        
        //as authorization header is in the format Bearer token
        const bearer = bearerHeader.split(' ');

        //Split return array and our token is at 1st position
        const bearerToken = bearer[1]

        // setting the token in request
        req.token= bearerToken

        //Verifying the token with the secret key 
        jwt.verify(req.token, process.env.SECRET_KEY, (err,payload)=>{
            if(err){
                savingRequestLogs(id,payload?payload.email:'', req.url, req.method)
                savingResponseLogs(id,refreshTokenResponse.notAuthorizedCode, refreshTokenResponse.notAuthorizedMessage)
                res.status(refreshTokenResponse.notAuthorizedCode).send({
                    message:refreshTokenResponse.notAuthorizedMessage
                })
            }
            // console.log(payload)
            req.email = payload.email
            req.id =payload.id
        })
        next()
    }
    else{
        savingRequestLogs(id,payload?payload.email:'', req.url, req.method)
        savingResponseLogs(id,refreshTokenResponse.notAuthorizedCode, refreshTokenResponse.notAuthorizedMessage)
        res.status(refreshTokenResponse.notAuthorizedCode).send({
            message:refreshTokenResponse.notAuthorizedMessage
        })

    }
}

module.exports = verifyToken