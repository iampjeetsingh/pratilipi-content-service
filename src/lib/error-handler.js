const AppError = require("./app-error");
const HttpStatus = require("./http-status-codes");

module.exports = (req, res, err)=>{
    if(err instanceof AppError){
        return res.status(err.code)
            .json({
                httpStatus: err.code,
                message: err.message
            })
    }else {
        console.log(err.stack)
        return res
            .status(HttpStatus.INTERNAL_SERVER)
            .json({
                httpStatus: HttpStatus.INTERNAL_SERVER,
                message: err.message
            });
    }
}