const jwt = require('jsonwebtoken')

//For verifying the token
const verifyToken = (req,res,next) => {
    console.log('verify token middleware called')
    //As token is in headers array of request
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
                res.status(403).send('Forbidden')
            }
            req.id =payload.id
        })
        next()
    }
    else{
        res.status(403).send('Forbidden')
    }
}

module.exports=verifyToken