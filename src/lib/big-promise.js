const handleError = require("./error-handler")

const BigPromise = func => async (req, res, next) => {
    try {
        await Promise.resolve(func(req, res, next));
        next();
    } catch (err) {
        handleError(req, res, err);
    }
}

exports.attachBigPromise = (controller)=>{
    for(const key of Object.keys(controller)){
        controller[key] = BigPromise(controller[key])
    }
    return controller
}
