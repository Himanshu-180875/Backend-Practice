const refreshTokenResponse  = require('../Responses/refreshTokenResponse');
const savingRequestLogs = require('../controllers/savingLogs');
const savingResponseLogs = require('../controllers/savingLogs');
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');
const VerifySession = (req, res,next)=> {
    var id = uuidv4()
    savingRequestLogs(id,req.session.userInfo?req.session.userInfo[1]:'' , req.url, req.method)
    savingResponseLogs(id,refreshTokenResponse.notAuthorizedCode, refreshTokenResponse.notAuthorizedMessage)

    if(!req.session.userInfo){
        return res.status(refreshTokenResponse.notAuthorizedCode).send({
            message: refreshTokenResponse.notAuthorizedMessage
        })

    }
    console.log(req.session.userInfo)
    req.id = req.session.userInfo[0]
    next()
}

module.exports = VerifySession;