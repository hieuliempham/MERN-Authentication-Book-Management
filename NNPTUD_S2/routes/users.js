var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var responseHandle = require('../helpers/responseHandle');
var { validationResult } = require('express-validator');
var check = require('../validators/user')
var protect = require('../middlewares/protect')
var protectRole = require('../middlewares/protectRole');


router.get('/', protect,protectRole("ADMIN","modifier"), async function (req, res, next) {
  console.log(req.headers.authorization);
  let users = await userModel.find({}).exec();
  responseHandle.renderResponse(res, true, users)
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    responseHandle.renderResponse(res, true, user)
  } catch (error) {
    responseHandle.renderResponse(res, false, error)
  }
});

router.post('/', check(),protectRole("ADMIN"), async function (req, res, next) {
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
      role: req.body.role
    })
    await newUser.save();
    responseHandle.renderResponse(res, true, newUser)
  } catch (error) {
    responseHandle.renderResponse(res, false, error)
  }
});
router.put('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, req.body, {
        new: true
      })
    responseHandle.renderResponse(res, true, user);
  } catch (error) {
    responseHandle.renderResponse(res, false, error)
  }
});


router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, {
        status: false
      }, {
        new: true
      }).exec()
    responseHandle.renderResponse(res, true, user);
  } catch (error) {
    responseHandle.renderResponse(res, false, error)
  }
});

module.exports = router;