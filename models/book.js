var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({ // chema 정의(document 구조 정의)
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('book', bookSchema);