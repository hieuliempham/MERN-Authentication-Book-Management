var userModel = require('../schemas/user')

module.exports = function (...roles) {
    return async function (req, res, next) {
        let user = await userModel.findById(req.userId);
        let requiredRole = roles.map(e => e.toLowerCase());
        let userRole = user.role.map(e => e.toLowerCase());//[ 'USER', 'modifier' ]
        let result = requiredRole.filter(e => userRole.includes(e));
        if (result.length > 0) {
            next();
        } else {
            res.status(403).send("ban khong co quyen")
        }
    }
}
