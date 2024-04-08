var responseHandle = require('../helpers/responseHandle');
var jwt = require('jsonwebtoken');
var config = require('../configs/config');




module.exports = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return responseHandle.renderResponse(res, false, "Unauthorized");
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return responseHandle.renderResponse(res, false, err)
        }
        req.user = decoded;
        
        next();
    });
}