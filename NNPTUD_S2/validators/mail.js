var { check } = require('express-validator');
var util = require('util')


let Noties = {
    NOTI_EMAIL: 'email phai dung dinh dang',
}

module.exports = function () {
    return [
        check('email', Noties.NOTI_EMAIL).isEmail(),
    ]
}