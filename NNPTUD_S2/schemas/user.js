var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var config = require('../configs/config')
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: [String]
    },
    status: {
        type: Boolean,
        default: true
    },
    email: String,
    ResetPasswordToken: String,
    ResetPasswordTokenExp: String
}, { timestamps: true })

userSchema.pre('save', function () {
    if(this.isModified("password")){
        this.password = bcrypt.hashSync(this.password, 10);
    }
})

userSchema.methods.comparePassword =  function(candidatePassword){
    try {
        return bcrypt.compareSync(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

userSchema.methods.genJWT = function () {
    return jwt.sign({
        id: this._id
    }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXP
    })
}

userSchema.methods.genRestPasswordToken = function () {
    this.ResetPasswordToken = crypto.randomBytes(30).toString('hex');
    this.ResetPasswordTokenExp = Date.now() + 10 * 60 * 1000;
    return this.ResetPasswordToken;
}

module.exports = new mongoose.model('user', userSchema);