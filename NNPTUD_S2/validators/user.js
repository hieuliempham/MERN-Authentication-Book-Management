var { check } = require('express-validator');
var util = require('util')

var options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    },
    username: {
        min: 8,
        max: 40
    },
    role: [
        'ADMIN', 'USER', 'MOD'
    ]
}

let Noties = {
    NOTI_EMAIL: 'email phai dung dinh dang',
    NOTI_PASSWORD: 'password phai co it nhat %d ky tu trong do co it nhat %d ky tu thuong, %d ky tu hoa, %d ky tu , %d ky tu la so'
}

module.exports = function () {
    return [
        check('email', Noties.NOTI_EMAIL).isEmail(),
        check('password', util.format(Noties.NOTI_PASSWORD,options.password.minLength,options.password.minLowercase,options.password.minUppercase,options.password.minSymbols,options.password.minNumbers)).isStrongPassword(options.password),
        check('username', 'username phai dai tu 8 den 40 ky tu').isLength(options.usernames),
        check('role', 'role khong hop le').isIn(options.role)
    ]
}