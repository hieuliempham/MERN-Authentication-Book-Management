var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var responseHandle = require('../helpers/responseHandle');
var { validationResult } = require('express-validator');
var check = require('../validators/auth');
var checkPass = require('../validators/password');
var checkEmail = require('../validators/mail');
var bcrypt = require('bcrypt');
var sendMail = require('../helpers/sendmail')
var authenticateToken = require('../middlewares/authenticateToken');
var checkChangePass =  require('../validators/changepassword');

var protect = require('../middlewares/protect');
const config = require('../configs/config');

router.get('/me', protect, async function (req, res, next) {
  let me = await userModel.findById(req.userId);
  responseHandle.renderResponse(res, true, me)
});


router.post('/register', check(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    responseHandle.renderResponse(res, false, result.errors)
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["USER"]
    })
    await newUser.save();
    responseHandle.renderResponse(res, true, newUser)
  } catch (error) {
    responseHandle.renderResponse(res, false, error)
  }
});
router.post('/login', async function (req, res, next) {
  // console.log(req.body.username);
  // console.log(req.body.password);
  if (!req.body.username || !req.body.password) {
    responseHandle.renderResponse(res, false, "nhap day du thong tin de dang nhap")
    return;
  }
  var user = await userModel.findOne({ username: req.body.username });
  if (!user) {
    responseHandle.renderResponse(res, false, "username hoac password khong dung");
    return;
  }
  var result = bcrypt.compareSync(req.body.password, user.password);
  let token = user.genJWT();
  if (result) {
    res.status(200).cookie(
      "token", token, {
      expires: new Date(Date.now() + config.COOKIE_EXP * 3600 * 1000),
      httpOnly: true
    }
    // ).send(user.genJWT())
  ).json({ success: true, message: "Đăng nhập thành công", token: token });
    // console.log(res);
    // responseHandle.renderResponse(res, true, "Đăng nhập thành công");
  } else {
    responseHandle.renderResponse(res, false, "username hoac password khong dung");
  }
});

router.post('/forgotpassword',checkEmail(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    responseHandle.renderResponse(res, false, result.errors)
    return;
  }
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    responseHandle.renderResponse(res, false, "email khong ton tai");
    return;
  }
  let token = user.genRestPasswordToken();
  await user.save()
  
  let url = `http://127.0.0.1:5500/tuan6/frontend/resetPassword.html?token=${token}`;
  
  try {
    await sendMail(user.email, url);
    responseHandle.renderResponse(res, true, "email thanh cong");
  } catch (error) {
    user.ResetPasswordTokenExp = undefined;
    user.ResetPasswordToken = undefined;
    await user.save();
    responseHandle.renderResponse(res, false, error);
  }

});

router.post('/resetpassword/:token',checkPass(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    responseHandle.renderResponse(res, false, result.errors)
    return;
  }

  let user = await userModel.findOne({ ResetPasswordToken: req.params.token });
  if (!user) {
    responseHandle.renderResponse(res, false, "URL khong hop le");
    return;
  }
  if (user.ResetPasswordTokenExp < Date.now()) {
    responseHandle.renderResponse(res, false, "URL qua han");
    return;
  }
  user.password = req.body.password;
  user.ResetPasswordTokenExp = undefined;
  user.ResetPasswordToken = undefined;
  await user.save()
  responseHandle.renderResponse(res, true, "doi pass thanh cong");
});


router.post('/changepassword',checkChangePass(), authenticateToken,  async function (req, res, next) {
  var result = validationResult(req);
    if(result.errors.length>0){
    responseHandle.renderResponse(res, false, result.errors)
    return;
  }

  
  const { oldPassword, newPassword } = req.body;


  const userId = req.user.id;
  
  
  try {
    let user = await userModel.findById(userId);
    if(!user) {
      return responseHandle.renderResponse(res,false,"Khong tim thay user nay");
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
      return responseHandle.renderResponse(res,false,"Mật khẩu cũ sai! hehe");
    }
    
   
    // Đổi mật khẩu
    user.password = newPassword;
    await user.save();
    return responseHandle.renderResponse(res, true, "Đổi mật khẩu thành công!");
  } catch (error) {
    return responseHandle.renderResponse(res, false, error);
  }

});










module.exports = router;