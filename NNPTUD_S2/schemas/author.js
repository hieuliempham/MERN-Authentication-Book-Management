var mongoose = require("mongoose");

var authorShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true })
authorShema.virtual('published', {
    ref: 'book',
    localField: '_id',
    foreignField: 'author'
})
authorShema.set('toJSON', { virtuals: true })
authorShema.set('toObject', { virtuals: true })
module.exports = new mongoose.model('author', authorShema);