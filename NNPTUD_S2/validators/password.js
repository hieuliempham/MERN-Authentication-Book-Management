var { check } = require('express-validator');
var util = require('util')

var options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    }
}

let Noties = {
   
    NOTI_PASSWORD: 'password phai co it nhat %d ky tu trong do co it nhat %d ky tu thuong, %d ky tu hoa, %d ky tu , %d ky tu la so'
}

module.exports = function () {
    return [
       
        check('password', util.format(Noties.NOTI_PASSWORD,options.password.minLength,options.password.minLowercase,options.password.minUppercase,options.password.minSymbols,options.password.minNumbers)).isStrongPassword(options.password),
        
    ]
}