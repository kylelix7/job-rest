var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KeywordSchema = new Schema({keyword: String, count: String});
var JobSchema = new Schema({
  id: String,
  company: String,
  title: String,
  post_date: String,
  city: String,
  province: String,
  content: String,
  link: String,
  stats: [KeywordSchema]
});

module.exports = mongoose.model('Job', JobSchema);
