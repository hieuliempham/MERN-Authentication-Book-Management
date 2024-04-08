const e = require('express');
var express = require('express');
var router = express.Router();
var authorModel = require('../schemas/author')
var responseHandle = require('../helpers/responseHandle');


router.get('/', async function (req, res, next) {
  try {
    // let excludes = ["sort", "limit", "page"];
    // let numberArray = ["year"];
    // let stringArray = ["author", "name"];
    // let queries = JSON.parse(JSON.stringify(req.query));
    // for (const [key, value] of Object.entries(queries)) {
    //   if (excludes.includes(key)) {
    //     delete queries[key]
    //   } else {
    //     if (stringArray.includes(key)) {
    //       queries[key] = new RegExp(value.replace(',', '|'), 'i')
    //     } else {
    //       if (numberArray.includes(key)) {
    //         var string = JSON.stringify(value);
    //         var index = string.search(new RegExp('lte"|gte"|lt"|gt"', 'i'));
    //         if (index > -1) {
    //           string = string.slice(0, index) + "$" + string.slice(index, string.length);
    //           queries[key] = JSON.parse(string);
    //         }
    //         else {
    //           queries[key] = value;
    //         }
    //       }
    //     }
    //   }
    // }
    // queries.isDeleted = false;
    // console.log(queries);
    // let limit = req.query.limit ? req.query.limit : 5;
    // let page = req.query.page ? req.query.page : 1;
    // let objSort = {};
    // if (req.query.sort) {
    //   if (req.query.sort.startsWith('-')) {
    //     let field = req.query.sort.substring(1, req.query.sort.length);
    //     objSort[field] = -1;
    //   } else {
    //     let field = req.query.sort;
    //     objSort[field] = 1;
    //   }
    // }
    var authors = await authorModel.find({}).populate("published")
    .exec();
    res.send(authors);
  } catch (error) {
    responseHandle.renderResponse(res, false, error);
  }
});

// router.get('/:id', async function (req, res, next) {
//   try {
//     var book = await bookModel.find({ _id: req.params.id });
//     responseHandle.renderResponse(res, true, book);
//   } catch (error) {
//     responseHandle.renderResponse(res, false, error);
//   }
// });
router.post('/', async function (req, res, next) {
  try {
    let newAuthor = new authorModel({
      name: req.body.name
    })
    await newAuthor.save();
    responseHandle.renderResponse(res, true, newAuthor);
  } catch (error) {
    responseHandle.renderResponse(res, false, error);
  }
});
// router.put('/:id', async function (req, res, next) {
//   try {
//     var book = await bookModel.findByIdAndUpdate
//       (req.params.id, req.body, {
//         new: true
//       })
//     responseHandle.renderResponse(res, true, book);
//   } catch (error) {
//     responseHandle.renderResponse(res, false, error);
//   }
// });

// router.delete('/:id', async function (req, res, next) {
//   try {
//     var book = await bookModel.findByIdAndUpdate
//       (req.params.id, {
//         isDeleted: true
//       }, {
//         new: true
//       })
//     responseHandle.renderResponse(res, true, book);
//   } catch (error) {
//     responseHandle.renderResponse(res, false, error);
//   }
// });
module.exports = router;
