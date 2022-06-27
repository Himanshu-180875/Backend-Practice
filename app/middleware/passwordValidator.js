//for checking the password length or secret password

const validatePassword = (req,res,next) => {
    const {password} = req.body;
    if(password.length>32){
        return res.status(400).send({
            message:'password length is greater than 32 characters'
        })
    }
    else if(password.length<32){
        return res.status(400).send({
            message:'password Length is less than 32 characters'
        })
    }
    //Required for calling the next function in the middleware
    next()
}

module.exports= validatePassword