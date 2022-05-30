

const nestedMiddleware = (req,res,next) => {
    console.log('nested called')
    next()
}

module.exports = nestedMiddleware