const ApiError = require('../exceptions/api_error')
const tokenService = require('../service/token_serviec')

module.exports = function (req, res, next) {
    try{
         const authorisationHeader = req.headers.authorization;
        //console.log(authorisationHeader)
        if(!authorisationHeader){
            next(ApiError.UnauthorizedError())
        }
        const accessToken = authorisationHeader.split(' ')[1]
        //console.log(accessToken)
        if(!accessToken){
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccsessToken(accessToken)
        console.log(userData)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData;
        next();
    }
    catch(e){
       console.log('first')
    }
}