var jwt = require('jsonwebtoken')
var config = require('../configs/config');
var responseHandle = require('../helpers/responseHandle');

module.exports = function (req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }else{
        if(req.cookies.token){
            token = req.cookies.token;
        }
    }
    if(!token){
        responseHandle.renderResponse(res, false, "yeu cau dang nhap");
        return;
    }
    try {
        var result = jwt.verify(token, config.JWT_SECRET);
        if (result.exp * 1000 > Date.now()) {
            req.userId = result.id;
            next();
        } else {
            responseHandle.renderResponse(res, false, "yeu cau dang nhap");
        }
    } catch (error) {
        responseHandle.renderResponse(res, false, "yeu cau dang nhap");
    }
}